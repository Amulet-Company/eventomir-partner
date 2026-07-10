import { getSiteSettings } from "@/services/settings";
import { Metadata } from "next";

export async function getPageSEO(path: string): Promise<Metadata> {
  const settings = await getSiteSettings();
  const pageSeo = settings?.pageSpecificSEO?.find((s) => s.path === path);

  if (pageSeo) {
    return {
      title: pageSeo.title,
      description: pageSeo.description,
      keywords: pageSeo.keywords ? pageSeo.keywords.split(",") : undefined,
    };
  }

  return {};
}
