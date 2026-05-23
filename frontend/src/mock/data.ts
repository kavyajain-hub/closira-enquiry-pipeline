export interface Lead {
  id: string;
  customerName: string;
  channel: 'whatsapp' | 'email' | 'call';
  status: 'new' | 'qualified' | 'escalated';
  message: string;
  receivedAt: string;
  summary?: string;
  matchedSop?: string;
  suggestedResponse?: string;
  urgency?: 'high' | 'medium';
  escalationReason?: string;
  timeline: {
    event: string;
    timestamp: string;
    notes: string;
  }[];
}

export interface FollowUp {
  id: string;
  leadId: string;
  customerName: string;
  channel: 'whatsapp' | 'email' | 'call';
  dueTime: string;
  messagePreview: string;
  completed: boolean;
}

export interface DashboardStats {
  totalLeadsToday: number;
  missedEnquiries: number;
  openEscalations: number;
  followupsDue: number;
}

export const mockStats: DashboardStats = {
  totalLeadsToday: 24,
  missedEnquiries: 3,
  openEscalations: 5,
  followupsDue: 8,
};

export const mockLeads: Lead[] = [
  {
    id: "enq_001",
    customerName: "Sarah Jenkins",
    channel: "whatsapp",
    status: "escalated",
    receivedAt: "2026-05-23T09:14:00Z",
    message: "I want to request a refund. The quotation you provided is 50% higher than last year. Why did the price double without any notice?",
    summary: "Customer unhappy with recent price quotes, requesting refund details and immediate explanation.",
    matchedSop: "SOP-003: High Priority Complaint",
    suggestedResponse: "Hi Sarah, we are deeply sorry for the trouble. I have escalated your complaint directly to our manager who will call you shortly.",
    urgency: "high",
    escalationReason: "Pricing complaint & refund request",
    timeline: [
      { event: "Enquiry Created", timestamp: "2026-05-23T09:14:00Z", notes: "Enquiry successfully received via WhatsApp." },
      { event: "Auto-Escalation Triggered", timestamp: "2026-05-23T09:14:05Z", notes: "Complaint keywords matched. Status updated to 'escalated'." }
    ]
  },
  {
    id: "enq_002",
    customerName: "David Miller",
    channel: "email",
    status: "qualified",
    receivedAt: "2026-05-23T08:30:00Z",
    message: "Hi, I would like to schedule a product demo session for next Monday at 10 AM if possible. Let me know your available slots.",
    summary: "Lead seeking to book a product demo session next Monday morning.",
    matchedSop: "SOP-001: Lead Qualification & Booking",
    suggestedResponse: "Hi David, thanks for reaching out! We would be delighted to schedule a session. Please let us know your preferred date and time, and we'll book your slot immediately.",
    timeline: [
      { event: "Enquiry Created", timestamp: "2026-05-23T08:30:00Z", notes: "Enquiry received via Email." },
      { event: "SOP Matched", timestamp: "2026-05-23T08:30:04Z", notes: "Matched Booking SOP. Suggested response drafted. Status set to 'qualified'." },
      { event: "Follow-up Scheduled", timestamp: "2026-05-23T08:32:00Z", notes: "Scheduled 15 min follow-up call due on Monday." }
    ]
  },
  {
    id: "enq_003",
    customerName: "Elena Rostova",
    channel: "call",
    status: "new",
    receivedAt: "2026-05-23T10:45:00Z",
    message: "Missed Call - 3 minutes duration.",
    summary: "Customer called after-hours, hung up without leaving a voice note.",
    timeline: [
      { event: "Missed Call Logged", timestamp: "2026-05-23T10:45:00Z", notes: "Inbound call missed. Flagged as 'new'." }
    ]
  },
  {
    id: "enq_004",
    customerName: "Marcus Thorne",
    channel: "whatsapp",
    status: "escalated",
    receivedAt: "2026-05-23T07:15:00Z",
    message: "Can I speak to a supervisor? The billing department charged my card twice for this month's service.",
    summary: "Double charge billing error. Client requests direct supervisor attention.",
    matchedSop: "SOP-003: High Priority Complaint",
    suggestedResponse: "Hi Marcus, I'm very sorry to hear this. I've flagged this directly to our billing director who is checking your transactions now.",
    urgency: "high",
    escalationReason: "Billing discrepancy & double charge",
    timeline: [
      { event: "Enquiry Created", timestamp: "2026-05-23T07:15:00Z", notes: "Enquiry received via WhatsApp." },
      { event: "Auto-Escalated", timestamp: "2026-05-23T07:15:06Z", notes: "High priority billing issue. Status updated to 'escalated'." }
    ]
  },
  {
    id: "enq_005",
    customerName: "Clara Zhang",
    channel: "email",
    status: "qualified",
    receivedAt: "2026-05-22T18:00:00Z",
    message: "What are your pricing options for a small team of 5? Do you offer volume discounts?",
    summary: "Pricing enquiry for a small team size. Asking about discounts.",
    matchedSop: "SOP-002: Service Pricing & Cataloging",
    suggestedResponse: "Hi Clara, thank you for your enquiry. Our custom platform packages start at just $99/month. We have sent our detailed price catalog to your email. Let us know if you'd like a call!",
    timeline: [
      { event: "Enquiry Created", timestamp: "2026-05-22T18:00:00Z", notes: "Enquiry received via Email." },
      { event: "SOP Matched", timestamp: "2026-05-22T18:00:05Z", notes: "Matched Pricing SOP. Catalog sent via auto-email." }
    ]
  }
];

export const mockFollowups: FollowUp[] = [
  {
    id: "fup_001",
    leadId: "enq_002",
    customerName: "David Miller",
    channel: "email",
    dueTime: "2026-05-24T10:00:00Z",
    messagePreview: "Hi David, just checking in to confirm if Monday at 10 AM works for our demo...",
    completed: false
  },
  {
    id: "fup_002",
    leadId: "enq_005",
    customerName: "Clara Zhang",
    channel: "email",
    dueTime: "2026-05-23T15:30:00Z",
    messagePreview: "Hi Clara, following up to see if you had a chance to review our pricing catalog...",
    completed: false
  }
];
