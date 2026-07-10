"use client";
import { apiRequest } from "@/utils/api-client";

// --- Type Definitions ---
export type SubscriptionTier = "FREE" | "STANDARD" | "PREMIUM";
export type BillingInterval = "month" | "half_year" | "year";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;

  // Updated Price Fields
  priceMonthly: number;
  priceHalfYearly?: number | null;
  priceYearly?: number | null;

  features: string[];
  isActive: boolean;
}

export interface PaymentResponse {
  checkoutUrl: string;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string; // Convenient to have from backend
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  startDate: string;
  endDate: string | null;
  pricePaid: number;
}

// --- API Functions ---
/**
 * Fetches all active subscription plans from the backend.
 * Endpoint: GET /api/payments/plans
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  return await apiRequest<SubscriptionPlan[]>({
    method: "get",
    url: "/api/payments/plans",
  });
};

/**
 * Fetches the current active subscription for the logged-in user.
 * Endpoint: GET /api/users/me/subscription
 */
export const getCurrentSubscription =
  async (): Promise<UserSubscription | null> => {
    try {
      return await apiRequest<UserSubscription>({
        method: "get",
        url: "/api/users/me/subscription",
      });
    } catch (error) {
      // Return null if 404 or no subscription
      return null;
    }
  };

/**
 * Initiates a checkout session for a specific plan.
 * Endpoint: POST /api/payments/checkout
 * * @param planId - The ID of the subscription plan to purchase.
 * @returns An object containing the checkoutUrl (e.g., to Stripe/Yookassa or Mock Gateway).
 param interval - The billing interval for the subscription (e.g., "month", "half_year", "year").
 */
export const initiateCheckout = async (
  planId: string,
  interval: BillingInterval = "month",
): Promise<PaymentResponse> => {
  return await apiRequest<PaymentResponse>({
    method: "post",
    url: "/api/payments/checkout",
    data: { planId, interval }, // Send interval to backend
  });
};

export interface PaymentResponse {
  checkoutUrl: string;
}

export const getPaidRequestPrice = async (): Promise<number> => {
  // Robust: Fetch the current price setting from the server
  const response = await apiRequest<{ price: number }>({
    method: "get",
    url: "/api/payments/request-price",
  });
  return response.price;
};
