// File: services/referrals.ts
import { apiRequest } from "@/utils/api-client";

export interface ReferralUser {
  id: string;
  name: string;
  email: string;
  companyName: string;
  registrationDate: string;
  status: string;
  hasActiveTariff: boolean;
  tariffName: string;
  pricePaid: number;
  commissionAmount: number;
}

/**
 * Fetches the list of performers registered via the partner's referral link,
 * including their active tariff and calculated commission.
 */
export const fetchPartnerReferrals = async (): Promise<ReferralUser[]> => {
  // Ensure the base path matches how your backend mounts the partner routes

  return await apiRequest<ReferralUser[]>({
    method: "get",
    url: "/api/partners/referrals/list",
  });
};
