export interface AppNotification {
  id: string;
  /** "admin" or a shopper's user id */
  audience: string;
  text: string;
  link: string;
  createdAt: string;
  read: boolean;
}