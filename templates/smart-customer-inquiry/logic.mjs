export const CONFIG = Object.freeze({
  businessName: 'Your business', notificationEmail: 'replace-with-internal-email@example.com',
  defaultOwner: 'Unassigned', duplicateWindowHours: 24, maxReminders: 3,
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
  return { inquiry_id:id, full_name, email, phone:str(raw.phone,50), company:str(raw.company,160), category, subject, message, preferred_contact_method:str(raw.preferred_contact_method,30), consent: raw.consent === true || raw.consent === 'true', priority, status:'New', assigned_owner:CONFIG.defaultOwner, source:'n8n-form', submitted_at, last_activity_at:submitted_at, follow_up_due_at:new Date(now.getTime()+CONFIG.reminders[priority]*3600000).toISOString(), reminder_count:0, last_reminder_at:null, notification_state:'pending', processing_state:'stored', error_state:'', duplicate_of:'', dedupe_key };
}
export function isDuplicate(candidate, records, now = new Date()) { const cutoff = now.getTime()-CONFIG.duplicateWindowHours*3600000; return records.find(r => r.dedupe_key === candidate.dedupe_key && Date.parse(r.submitted_at) >= cutoff) || null; }
export function reminderEligible(record, now = new Date()) { return !['Resolved','Closed'].includes(record.status) && record.processing_state === 'stored' && Number(record.reminder_count || 0) < CONFIG.maxReminders && Date.parse(record.follow_up_due_at) <= now.getTime(); }
export function evaluateReminder(record, now = new Date()) {
  const reasons = []; const due = record.next_reminder_due_at ?? record.follow_up_due_at;
  if (!['New', 'Acknowledged', 'In progress'].includes(record.status)) reasons.push(`status ${record.status} is paused or complete`);
  if (record.processing_state !== 'stored') reasons.push('processing_state is not stored');
  if (Number(record.reminder_count || 0) >= CONFIG.maxReminders) reasons.push('maximum reminder count reached');
  if (!due || Number.isNaN(Date.parse(due))) reasons.push('next_reminder_due_at is missing or invalid');
  else if (Date.parse(due) > now.getTime()) reasons.push('next reminder is not due yet');
  return { eligible: reasons.length === 0, reason: reasons.join('; ') || 'eligible now', action: Number(record.reminder_stage || 0) >= 2 ? 'escalation' : 'reminder' };
}
export const transitions = { New:['Acknowledged','In progress','Closed'], Acknowledged:['In progress','Waiting for customer','Resolved','Closed'], 'In progress':['Waiting for customer','Resolved','Closed'], 'Waiting for customer':['In progress','Resolved','Closed'], Resolved:['Closed'], Closed:[] };
