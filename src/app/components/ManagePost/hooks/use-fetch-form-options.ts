import { useEffect } from "react";
import { ProductEditData } from "../types/index";
import useFetchFormOptions from "../../Forms/Books/hooks/useFetchFormOptions";
import useFetchEditProductById from "./use-fetch-product";

const useFetchEditFormOptions = (
  id: string,
  category?: string,
  subCategory?: string,
  group?: string
) => {
  // Fetch product data
  const { newProductData, isLoadingProduct } =
    useFetchEditProductById<ProductEditData>(id);

  console.log(id);
  console.log(newProductData?.categoryGroup);
  console.log(newProductData?.category);
  console.log(newProductData);

  // Fetch form options
  const { data, isLoading, refresh } = useFetchFormOptions(
    group ?? (newProductData?.categoryGroup as string),
    category ?? newProductData?.category,
    subCategory ?? newProductData?.subCategory
  );
  console.log(data);

  useEffect(() => {
    if (newProductData && category && subCategory && group) {
      refresh();
    }
  }, [newProductData, refresh]);

  return { data, isLoadingProduct };
};

export default useFetchEditFormOptions;
