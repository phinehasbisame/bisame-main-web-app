import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import {
  buildProfileUrl,
  httpClient,
  LISTINGS_ENDPOINTS,
  tokenManager,
} from "@/lib";
import { Group } from "./utils/use-edit-post-category";
import { AxiosResponse } from "axios";

export interface UpdatePostRequest {
  title: string;
  description: string;
  price: number;
  city: string;
  region: string;
  category: string;
  subCategory: string;
  categoryGroup: Group;
  contactNumber: string;
  images: Array<{ imageUrl: string; id: string }> | string[];
  negotiable: boolean;
  [key: string]: unknown;
}

export interface UpdatePostResponse {
  success: boolean;
  message: string;
  [key: string]: unknown;
}

/**
 * SWR mutation fetcher
 * ID is taken ONLY from arg
 */
const updatePostFetcher = async (
  _key: string,
  {
    arg,
  }: {
    arg: { body: UpdatePostRequest; id: string };
  }
): Promise<UpdatePostResponse> => {
  const apiUrl = buildProfileUrl(LISTINGS_ENDPOINTS.details).replace(
    "{id}",
    arg.id
  );

  const token = tokenManager.getToken();

  const res = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(arg.body),
  });

  const response: AxiosResponse = await httpClient.patch(apiUrl, arg.body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json()

  if (!data) {
    throw new Error(data?.message || "Failed to update post");
  }

  return data;
};

export function usePostUpdatePost() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    "edit-post",
    updatePostFetcher
  );

  return {
    updatePost: (args: { body: UpdatePostRequest; id: string }) =>
      trigger(args),
    result: data,
    error,
    loading: isMutating,
  };
}
