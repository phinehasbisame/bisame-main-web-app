import { buildProfileUrl, httpClient, LISTINGS_ENDPOINTS } from "@/lib";
import { AxiosResponse } from "axios";
import { useCallback, useEffect } from "react";
import useSWR from "swr";

type ListingDetailsResponse<T = unknown> = {
  data: T;
  message?: string;
  success?: boolean;
};

interface UseFetchProductByIdReturn<T> {
  newProductData: T | undefined;
  isLoadingProduct: boolean;
  errorProduct: Error | undefined;
  refetch: () => void;
}

const useFetchEditProductById = <T = unknown>(
  productId: string,
  enabled: boolean = true
): UseFetchProductByIdReturn<T> => {
  // Create the API URL - use null to disable SWR fetching when needed
  const newApiUrl =
    enabled && productId
      ? `${buildProfileUrl(LISTINGS_ENDPOINTS.list)}/${productId}`
      : null;

  // Memoized fetcher function
  const fetcher = useCallback(
    async (url: string): Promise<ListingDetailsResponse<T>> => {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      try {
        const res: AxiosResponse<ListingDetailsResponse<T>> =
          await httpClient.get(url);

        if (!res.data) {
          throw new Error("No response data from server");
        }

        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        console.log(res.data);
        return res.data;
      } catch (error: any) {
        // Re-throw with more context
        throw new Error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch product"
        );
      }
    },
    [productId]
  );

  const {
    data: productData,
    error,
    isLoading: isLoadingProduct,
    mutate: refresh,
  } = useSWR<ListingDetailsResponse<T> | T>(
    newApiUrl, // Will be null when disabled or no productId
    fetcher,
    {
      // SWR configuration options
      revalidateOnFocus: false, // Don't refetch on window focus
      revalidateOnReconnect: true, // Refetch on reconnect
      shouldRetryOnError: true, // Retry on error
      errorRetryCount: 3, // Retry 3 times
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
    }
  );

  // Manual refetch function
  const refetch = useCallback(() => {
    if (enabled && newApiUrl) {
      void refresh();
    }
  }, [enabled, newApiUrl, refresh]);

  // Auto-refetch when dependencies change
  // Remove this useEffect if you don't want automatic refetching
  useEffect(() => {
    if (productId && enabled) {
      refetch();
    }
  }, [productId, enabled, refetch]);

  return {
    newProductData: productData as T,
    isLoadingProduct,
    errorProduct: error,
    refetch,
  };
};

export default useFetchEditProductById;
