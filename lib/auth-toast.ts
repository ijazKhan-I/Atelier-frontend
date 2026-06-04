import { toast } from "sonner";

/** Shared toast messages for auth flows. */
export const authToast = {
  loginSuccess(username?: string) {
    toast.success(
      username ? `Welcome back, ${username}.` : "Signed in successfully."
    );
  },

  loginError() {
    toast.error("Login failed. Check your email and password.");
  },

  signupSuccess() {
    toast.success("Account created successfully. Welcome to Atelier.");
  },

  signupError() {
    toast.error("Sign up failed. Please try again.");
  },

  logoutSuccess() {
    toast.success("Logged out successfully.");
  },

  passwordMismatch() {
    toast.error("Passwords do not match.");
  },
};
