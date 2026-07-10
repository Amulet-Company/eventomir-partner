"use client";

import { getSession } from "next-auth/react";
import { apiRequest } from "@/utils/api-client";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface AuthActionResult {
  success: boolean;
  message: string;
}

export interface PartnerRegistrationData {
  accountType: string;
  email: string;
  name: string;
  companyName?: string;
  phone: string;
  inn?: string;
  city: string;
}

export interface CompleteRegistrationData {
  role?: string;
  phone?: string;
  city?: string;
  accountType?: string;
  companyName?: string;
  inn?: string;
}

export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  image?: string | null;
  accessToken?: string;
}

// ==========================================
// 2. REGISTRATION FUNCTIONS (Public)
// ==========================================

export const registerPartnerWithVerification = async (
  partnerData: PartnerRegistrationData,
  password: string,
  referralId: string | null,
): Promise<AuthActionResult> => {
  try {
    // 🚨 REFACTORED: Using apiRequest for consistent Base URL and Error Handling
    const result = await apiRequest<{ message?: string }>({
      method: "POST",
      url: "/api/auth/register-partner",
      data: {
        partnerData,
        password,
        referralId,
      },
    });

    return {
      success: true,
      message: result?.message || "Регистрация прошла успешно!",
    };
  } catch (error: any) {
    console.error("Partner registration error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Произошла ошибка при регистрации.",
    };
  }
};

export const completeOAuthRegistration = async (
  data: CompleteRegistrationData,
): Promise<AuthActionResult> => {
  try {
    const result = await apiRequest<{ message?: string; user?: any }>({
      method: "PATCH",
      url: "/api/auth/complete-registration/partner",
      data,
    });

    return {
      success: true,
      message: result?.message || "Регистрация успешно завершена",
    };
  } catch (error: any) {
    console.error("Complete registration error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Не удалось завершить регистрацию.",
    };
  }
};

// ==========================================
// 3. SESSION FUNCTIONS
// ==========================================

/**
 * Retrieves the current user's session from the client-side using NextAuth.
 * @returns A promise that resolves to the CurrentUser object or null if not authenticated.
 */
export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role as string,
      image: session.user.image,
      accessToken: (session.user as any).accessToken,
    };
  } catch (error) {
    console.error("Error fetching current user session:", error);
    return null;
  }
};

// ==========================================
// 4. ACCOUNT MANAGEMENT FUNCTIONS
// ==========================================

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<AuthActionResult> => {
  try {
    const result = await apiRequest<{ message?: string }>({
      method: "POST",
      url: "/api/auth/change-password",
      data: {
        userId,
        currentPassword,
        newPassword,
      },
    });

    return {
      success: true,
      message: result?.message || "Пароль успешно изменен.",
    };
  } catch (error: any) {
    console.error("Change password error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Не удалось сменить пароль.",
    };
  }
};

export const deleteUserAccount = async (
  userId: string,
): Promise<AuthActionResult> => {
  try {
    const result = await apiRequest<{ message?: string }>({
      method: "DELETE",
      url: `/api/auth/account/${userId}`,
    });

    return {
      success: true,
      message: result?.message || "Аккаунт успешно удален.",
    };
  } catch (error: any) {
    console.error("Delete account error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Не удалось удалить аккаунт.",
    };
  }
};
