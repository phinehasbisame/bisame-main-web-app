import { useMemo } from "react";
import { ProductEditData } from "../types/index";
import useFetchEditProductById from "./use-fetch-product";
import useFetchFormOptions from "../../Forms/Books/hooks/useFetchFormOptions";
import useFetchServiceOptions from "../../Forms/Books/hooks/useFetchServiceOptions";
import useEditFormOptions from "./use-edit-form-options";
import useEditServiceFormOptions from "./use-edit-service-form-options";


export interface UseFetchEditFormOptionsResult<T = unknown> {
  data?: { data: T };
  isLoadingProduct: boolean;
  isLoadingForm: boolean;
  error?: unknown;
}

const useFetchEditFormOptions = <T = unknown>(
  id: string,
  category?: string,
  subCategory?: string,
  group?: string
): UseFetchEditFormOptionsResult<T> => {
  const { newProductData, isLoadingProduct } =
    useFetchEditProductById<ProductEditData>(id);

  const resolved = useMemo(() => {
    if (!newProductData && !group) return null;

    const resolvedGroup = group ?? newProductData?.categoryGroup;
    const resolvedCategory = category ?? newProductData?.category;
    const resolvedSubCategory = subCategory ?? newProductData?.subCategory;

    return {
      group: resolvedGroup,
      category: resolvedCategory,
      subCategory: resolvedSubCategory,
      isServices: resolvedGroup === "Services",
    };
  }, [newProductData, group, category, subCategory]);

  const generalForm = useEditFormOptions(
    resolved?.group,
    resolved?.category,
    resolved?.subCategory,
    Boolean(
      resolved && !resolved.isServices && resolved.group && resolved.category
    )
  );

  const serviceForm = useEditServiceFormOptions(
    {
      category: resolved?.category,
      subCategory: resolved?.subCategory,
    },
    Boolean(
      resolved &&
        resolved.isServices &&
        resolved.category &&
        resolved.subCategory
    )
  );

  const data = (resolved?.isServices ? serviceForm.data : generalForm.data) as
    | { data: T }
    | undefined;

  const isLoadingForm = resolved?.isServices
    ? serviceForm.isLoading
    : generalForm.isLoading;

  return {
    data,
    isLoadingProduct,
    isLoadingForm,
    error: resolved?.isServices ? serviceForm.error : undefined,
  };
};

export default useFetchEditFormOptions;
