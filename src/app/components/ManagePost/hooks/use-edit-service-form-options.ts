
import useSWR from "swr";
import { httpClient, buildListingsUrl, FORM_ENDPOINTS } from "@/lib";
import { useMemo } from "react";
import { AxiosResponse } from "axios";

interface ServicesArgs {
  category?: string;
  subCategory?: string;
}

const useEditServiceFormOptions = (args: ServicesArgs, enabled = true) => {
  const apiUrl = useMemo(() => {
    if (!enabled || !args.category || !args.subCategory) return null;

    const baseUrl = buildListingsUrl(FORM_ENDPOINTS.serviceOptions);
    const params = new URLSearchParams({
      category: args.category,
      subCategory: args.subCategory,
    });

    return `${baseUrl}?${params.toString()}`;
  }, [enabled, args.category, args.subCategory]);

  const fetcher = async (url: string): Promise<string[]> => {
    const response: AxiosResponse = await httpClient.get(url);
    return response.data?.map((item: any) => item.group) ?? [];
  };

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
  });

  return { data, error, isLoading };
};

export default useEditServiceFormOptions;
