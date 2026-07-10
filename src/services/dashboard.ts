"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, ApiError } from "@/utils/api-client";

// --- TYPES ---

export interface ReferralEvent {
  id: string;
  createdAt: string | Date;
  eventType: string;
  referredUserId: string;
  commissionAmount?: number | null;
  status: "pending" | "paid" | "rejected" | string;
}

export interface MonthlyRevenue {
  name: string;
  total: number;
}

export interface PartnerDashboardData {
  partnerId: string;
  referralId: string;
  balance: number;
  totalEarned: number;
  totalRegistrations: number;
  totalPaidConversions: number;
  clicks: number;
  monthlyRevenue: MonthlyRevenue[];
  referralEvents: ReferralEvent[];
  minPayout: number;
  paymentDetails: string | null;
}

export interface PartnershipFormValues {
  name: string;
  email: string;
  phone: string;
  city: string;
  website?: string;
}

// --- RAW API FUNCTIONS ---

export const getPartnerDashboardData = async (
  userId: string,
): Promise<PartnerDashboardData> => {
  const rawData = await apiRequest<any>({
    method: "get",
    url: `/api/partners/${userId}/dashboard`,
  });

  // FIXED: Prisma returned them as camelCase, not snake_case!
  const mappedEvents: ReferralEvent[] = (rawData.referralEvents || []).map(
    (event: any) => ({
      id: event.id,
      createdAt: event.createdAt,
      eventType: event.eventType,
      referredUserId: event.referredUserId || "Неизвестно",
      commissionAmount: event.commissionAmount,
      status: event.status,
    }),
  );

  return {
    ...rawData,
    referralEvents: mappedEvents,
  };
};

export const updatePartnerPaymentDetails = async (
  userId: string,
  paymentDetails: string,
) => {
  return apiRequest<{ message: string }>({
    method: "patch",
    url: `/api/partners/${userId}/payment-details`,
    data: { paymentDetails },
  });
};

export const requestPayout = async (userId: string) => {
  return apiRequest<{ message: string; data: any }>({
    method: "post",
    url: `/api/partners/${userId}/payouts`,
  });
};

// --- REACT QUERY HOOKS ---

export const usePartnerDashboard = (userId?: string) => {
  return useQuery({
    queryKey: ["partnerDashboard", userId],
    queryFn: () => getPartnerDashboardData(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdatePaymentDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      partnerId,
      paymentDetails,
    }: {
      partnerId: string;
      paymentDetails: string;
    }) => updatePartnerPaymentDetails(partnerId, paymentDetails),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["partnerDashboard", variables.partnerId],
      });
    },
  });
};

export const useRequestPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => requestPayout(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["partnerDashboard", userId] });
    },
  });
};
