import { buildListingsUrl, FORM_ENDPOINTS, httpClient } from "@/lib";
import { useMemo } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

const useEditFormOptions = (
  group?: string,
  category?: string,
  subCategory?: string,
  enabled = true
) => {
  const apiUrl = useMemo(() => {
    if (!enabled || !group) return null;

    const checkGroup = group === "jobseek" ? "Job Seekers" : group;
    const baseUrl = buildListingsUrl(FORM_ENDPOINTS.adRequest);
    const params = new URLSearchParams({ group: checkGroup });

    if (
      checkGroup === "Health" ||
      checkGroup === "health" ||
      checkGroup === "Job Seekers"
    ) {
      if (category) params.append("category", category);
    }

    if (checkGroup === "Buy and Sell") {
      if (category) params.append("category", category);
      if (subCategory) params.append("subCategory", subCategory);
    }

    return `${baseUrl}?${params.toString()}`;
  }, [enabled, group, category, subCategory]);

  const fetcher = async (url: string) => {
    try {
      return await httpClient.get(url);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch form options");
      throw error;
    }
  };

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
  });

  return { data, error, isLoading };
};

export default useEditFormOptions;
