export type Role = 'shopper' | 'admin';
export type AccountStatus = 'active' | 'blocked';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  status: AccountStatus;
  createdAt: string;
}

/** Local-only record. A real backend must hash passwords and never ship them to the browser. */
export interface StoredUser extends User {
  password: string;
}
