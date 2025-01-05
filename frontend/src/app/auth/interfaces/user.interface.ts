enum Role {
  user = 'user',
  admin = 'admin',
}

enum Duration {
  monthly = 'monthly',
  yearly = 'yearly',
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: Duration;
  customLinks: number;
  advancedStats: boolean;
}

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  plan: string;
  role: Role;
  sign_in_provider: string;
  subscription: string | Subscription;
}
