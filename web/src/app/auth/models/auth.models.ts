export interface User {
  isSubscriptionPaid: boolean;
  isStripeCustomer: boolean;
  paymentFailedOn: string;
  subscriptionCancelAt: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
}

export interface ChangePassword {
  newPassword: string;
  currentPassword: string;
}

export interface CurrentPassword {
  currentPassword: string;
}

export interface ResetPassword {
  email: string;
  newPassword: string;
  resetPasswordId: string;
}
