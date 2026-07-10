"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/utils/api-client";

// --- INTERFACES ---

export interface SocialLinks {
  vk?: string;
  telegram?: string;
  youtube?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  website?: string;
}

export interface BankDetail {
  kpp?: string;
  bik?: string;
  bankName?: string;
  accountNumber?: string;
  corrAccount?: string;
}

export interface PartnerProfileData {
  name: string;
  email: string;
  phone: string;
  image: string | null;
  companyName: string | null;
  inn: string | null;
  description: string | null;
  city: string | null;
  address: string | null;
  accountType: string | null;
  referralId: string;
  socialLinks: SocialLinks;
  bankDetails: BankDetail[];
}

// DTO (Data Transfer Object) for updating the profile.
// Omits read-only fields (like email and referralId) and adds file upload support.
export type UpdatePartnerProfileParams = Partial<
  Omit<PartnerProfileData, "email" | "referralId" | "accountType" | "image">
> & {
  profilePictureFile?: File | null;
};

// --- API FUNCTIONS (Internal/Private) ---

/**
 * Fetches the complete profile data for a partner.
 */
const fetchPartnerProfileFn = async (
  userId: string,
): Promise<PartnerProfileData> => {
  return await apiRequest<PartnerProfileData>({
    method: "get",
    url: `/api/partners/${userId}`,
  });
};

/**
 * Updates the partner profile.
 * Automatically handles converting standard data, nested JSON objects,
 * and physical files into a multipart/form-data payload.
 */
const updatePartnerProfileFn = async ({
  userId,
  data,
}: {
  userId: string;
  data: UpdatePartnerProfileParams;
}): Promise<{ message: string; profile: any }> => {
  const formData = new FormData();

  // 1. Append standard text fields (handling undefined gracefully)
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.phone !== undefined) formData.append("phone", data.phone);
  if (data.companyName !== undefined)
    formData.append("companyName", data.companyName || "");
  if (data.description !== undefined)
    formData.append("description", data.description || "");
  if (data.city !== undefined) formData.append("city", data.city || "");
  if (data.address !== undefined)
    formData.append("address", data.address || "");
  if (data.inn !== undefined) formData.append("inn", data.inn || "");

  // 2. Append nested objects by stringifying them so the backend can parse them safely
  if (data.socialLinks) {
    formData.append("socialLinks", JSON.stringify(data.socialLinks));
  }

  if (data.bankDetails) {
    formData.append("bankDetails", JSON.stringify(data.bankDetails));
  }

  // 3. Append physical files if the user selected a new one
  if (data.profilePictureFile) {
    // "profilePicture" MUST match the field name in your backend multer.fields() configuration
    formData.append("profilePicture", data.profilePictureFile);
  }

  return await apiRequest<{ message: string; profile: any }>({
    method: "patch",
    url: `/api/partners/${userId}`,
    data: formData,
    // Setting Content-Type to undefined forces the browser to automatically set the
    // multipart/form-data header along with the required unique boundary string.
    headers: { "Content-Type": undefined },
  });
};

// --- REACT QUERY HOOKS (Public) ---

/**
 * Hook to fetch and cache the partner's profile.
 */
export const usePartnerProfile = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ["partnerProfile", userId],
    queryFn: () => fetchPartnerProfileFn(userId!),
    enabled: !!userId, // Only run the query if a valid userId is provided
    staleTime: 1000 * 60 * 5, // Cache the data for 5 minutes
  });
};

/**
 * Hook to update the partner's profile with automatic query invalidation.
 */
export const useUpdatePartnerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePartnerProfileFn,
    onSuccess: (response, variables) => {
      // Invalidate the query so the UI fetches the fresh data immediately
      queryClient.invalidateQueries({
        queryKey: ["partnerProfile", variables.userId],
      });
    },
  });
};
