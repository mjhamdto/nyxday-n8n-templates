export const CONFIG = Object.freeze({
  businessName: 'Your business', notificationEmail: 'replace-with-internal-email@example.com',
  defaultOwner: 'Unassigned', duplicateWindowHours: 24, maxReminders: 3,
  maxInitialNotificationAttempts: 3, initialNotificationRetryMinutes: 15,
  reminders: { Critical: 1, High: 4, Normal: 24, Low: 48 },
  followUpStages: { Critical: [1, 2, 4], High: [4, 8, 24], Normal: [24, 24, 48], Low: [48, 48, 72] },
});
export function normalize(raw, now = new Date()) {
  const str = (v, max) => typeof v === 'string' ? v.trim().replace(/\s+/g, ' ').slice(0, max) : '';
  const full_name = str(raw.full_name, 120); const email = str(raw.email, 254).toLowerCase();
  const subject = str(raw.subject, 200); const message = str(raw.message, 5000);
  if (!full_name || !email || !subject || !message) throw new Error('Full name, email, subject, and message are required.');
  if (!(raw.consent === true || raw.consent === 'true')) throw new Error('Please acknowledge the privacy notice before submitting.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)) throw new Error('Enter a valid email address.');
  const category = ['General inquiry','Sales / quotation','Technical support','Existing customer','Partnership','Complaint','Other'].includes(raw.category) ? raw.category : 'Other';
  const text = `${subject} ${message}`.toLowerCase();
  const urgent = /\b(urgent|outage|security incident|data loss|legal escalation)\b/u.test(text);
  let priority = ['Complaint','Technical support'].includes(category) && urgent ? 'High' : 'Normal';
  if (category === 'Complaint' && /\b(data loss|legal escalation)\b/u.test(text)) priority = 'Critical';
  if (category === 'Sales / quotation' && /\b(urgent|asap)\b/u.test(text)) priority = 'High';
  if (category === 'Partnership') priority = 'Low';
  const submitted_at = now.toISOString(); const id = `INQ-${now.toISOString().replace(/\D/g,'').slice(0,14)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  const dedupe_key = `${email}|${subject.toLowerCase()}|${message.toLowerCase()}`;
  return { inquiry_id:id, full_name, email, phone:str(raw.phone,50), company:str(raw.company,160), category, subject, message, preferred_contact_method:str(raw.preferred_contact_method,30), consent: raw.consent === true || raw.consent === 'true', priority, status:'New', assigned_owner:CONFIG.defaultOwner, source:'n8n-form', submitted_at, last_activity_at:submitted_at, follow_up_due_at:new Date(now.getTime()+CONFIG.reminders[priority]*3600000).toISOString(), reminder_count:0, last_reminder_at:null, notification_state:'pending', initial_notification_state:'pending', initial_notification_attempts:0, initial_notification_next_retry_at:null, initial_notification_last_error:'', initial_notification_last_attempt_at:null, processing_state:'stored', error_state:'', duplicate_of:'', dedupe_key };
}
export function isDuplicate(candidate, records, now = new Date()) { const cutoff = now.getTime()-CONFIG.duplicateWindowHours*3600000; return records.find(r => r.dedupe_key === candidate.dedupe_key && Date.parse(r.submitted_at) >= cutoff) || null; }
export function reminderEligible(record, now = new Date()) { return !['Resolved','Closed'].includes(record.status) && record.processing_state === 'stored' && Number(record.reminder_count || 0) < CONFIG.maxReminders && Date.parse(record.follow_up_due_at) <= now.getTime(); }
export function evaluateReminder(record, now = new Date()) {
  const reasons = []; const due = record.next_reminder_due_at ?? record.follow_up_due_at;
  if (!['New', 'Acknowledged', 'In progress'].includes(record.status)) reasons.push(`status ${record.status} is paused or complete`);
  if (record.processing_state !== 'stored') reasons.push('processing_state is not stored');
  if (record.initial_notification_state === 'retry_pending') reasons.push('initial notification retry is pending');
  if (record.delivery_failure_state === 'delivery_failed') reasons.push('terminal delivery retry limit reached');
  if (Number(record.reminder_count || 0) >= CONFIG.maxReminders) reasons.push('maximum reminder count reached');
  if (!due || Number.isNaN(Date.parse(due))) reasons.push('next_reminder_due_at is missing or invalid');
  else if (Date.parse(due) > now.getTime()) reasons.push('next reminder is not due yet');
  const retryAt = record.initial_notification_next_retry_at;
  const initialRetryEligible = record.processing_state === 'stored' && record.initial_notification_state === 'retry_pending' && Number(record.initial_notification_attempts || 0) < CONFIG.maxInitialNotificationAttempts && retryAt && !Number.isNaN(Date.parse(retryAt)) && Date.parse(retryAt) <= now.getTime();
  return { eligible: reasons.length === 0, reason: reasons.join('; ') || 'eligible now', action: Number(record.reminder_stage || 0) >= 2 ? 'escalation' : 'reminder', initialRetryEligible: Boolean(initialRetryEligible) };
}
export function applyInitialNotificationResult(record, { accepted, now = new Date(), error = '' } = {}) {
  const initial_notification_attempts = Number(record.initial_notification_attempts || 0) + 1;
  const timestamp = now.toISOString();
  if (accepted) return { ...record, initial_notification_state: 'provider_accepted', initial_notification_attempts, initial_notification_next_retry_at: null, initial_notification_last_error: '', initial_notification_last_attempt_at: timestamp, notification_state: 'provider_accepted', last_notification_outcome: 'provider_accepted' };
  const terminal = initial_notification_attempts >= CONFIG.maxInitialNotificationAttempts;
  return { ...record, initial_notification_state: terminal ? 'initial_notification_failed' : 'retry_pending', initial_notification_attempts, initial_notification_next_retry_at: terminal ? null : new Date(now.getTime() + CONFIG.initialNotificationRetryMinutes * 60000).toISOString(), initial_notification_last_error: String(error || 'SMTP provider did not accept initial notification').slice(0, 500), initial_notification_last_attempt_at: timestamp, notification_state: terminal ? 'initial_notification_failed' : 'retry_pending', last_notification_outcome: 'failed', error_state: 'initial_notification_email_failed' };
}
export function applyReminderDeliveryResult(record, { accepted, now = new Date(), error = '' } = {}) {
  const timestamp = now.toISOString();
  if (accepted) {
    const reminder_stage = Number(record.reminder_stage || 0) + 1;
    const hours = CONFIG.followUpStages[record.priority]?.[reminder_stage];
    return {
      ...record,
      reminder_count: Number(record.reminder_count || 0) + 1,
      reminder_stage,
      last_reminder_at: timestamp,
      last_activity_at: timestamp,
      reminder_retry_count: 0,
      last_retry_at: null,
      last_retry_error: '',
      delivery_failure_state: 'none',
      notification_state: 'reminder_provider_accepted',
      last_notification_outcome: 'provider_accepted',
      next_reminder_due_at: hours ? new Date(now.getTime() + hours * 3600000).toISOString() : null,
      escalation_state: record.reminder_action === 'escalation' ? 'escalated' : 'not_escalated',
    };
  }
  const reminder_retry_count = Number(record.reminder_retry_count || 0) + 1;
  const terminal = reminder_retry_count >= 3;
  return {
    ...record,
    reminder_retry_count,
    last_retry_at: timestamp,
    last_retry_error: String(error || 'SMTP provider did not accept reminder').slice(0, 500),
    delivery_failure_state: terminal ? 'delivery_failed' : 'retry_pending',
    notification_state: terminal ? 'delivery_failed' : 'retry_pending',
    last_notification_outcome: 'failed',
    error_state: 'reminder_email_failed',
    next_reminder_due_at: terminal ? null : new Date(now.getTime() + 60 * 60000).toISOString(),
    last_activity_at: timestamp,
  };
}
export const transitions = { New:['Acknowledged','In progress','Closed'], Acknowledged:['In progress','Waiting for customer','Resolved','Closed'], 'In progress':['Waiting for customer','Resolved','Closed'], 'Waiting for customer':['In progress','Resolved','Closed'], Resolved:['Closed'], Closed:[] };
