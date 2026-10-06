export type MessageStatus = 'New' | 'Read' | 'Replied';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}
