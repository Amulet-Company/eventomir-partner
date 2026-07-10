"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

const DEFAULT_FREE_FEATURES = {
  maxPhotoUpload: 3,
  emailSupport: true,
  chatSupport: false,
  telephonicSupport: false,
  prioritySupport: false,
  profileSeo: false,
  profileMarketing: false,
  portfolioPromotion: false,
};

export function useTariff() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";

  // 🚨 MEMOIZED JIT EVALUATION
  const features = useMemo(() => {
    if (!session?.user) return DEFAULT_FREE_FEATURES;

    const userFeatures =
      (session.user as any).features || DEFAULT_FREE_FEATURES;
    const endDateStr = (session.user as any).subscriptionEndDate;

    // If they have an end date, check if it has passed RIGHT NOW
    if (endDateStr) {
      const endDate = new Date(endDateStr);
      if (endDate < new Date()) {
        // Time's up! Force downgrade the UI immediately
        return DEFAULT_FREE_FEATURES;
      }
    }

    return userFeatures;
  }, [session]);

  const hasAccess = (featureKey: string): boolean => {
    return !!features[featureKey];
  };

  const canPerformAction = (
    featureKey: string,
    currentUsage: number,
  ): boolean => {
    const limit = features[featureKey];
    if (typeof limit !== "number") return false;
    return currentUsage < limit;
  };

  const getLimit = (featureKey: string): number => {
    const limit = features[featureKey];
    return typeof limit === "number" ? limit : 0;
  };

  return {
    features,
    hasAccess,
    canPerformAction,
    getLimit,
    isLoading,
  };
}
