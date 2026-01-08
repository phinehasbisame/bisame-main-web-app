import { useState, useEffect, useCallback, useMemo } from "react";
import { Product } from "../types";

interface UseProductFormProps {
  product?: Product | null;
  productData?: any;
}

export interface FormData {
  name: string;
  title?: string;
  description: string;
  location: string;
  price: string | number;
  category?: string;
  subCategory?: string;
  childCategory?: string | null;
  categoryGroup?: string;
  contactNumber?: string;
  negotiable?: boolean | string;
  attributes?: Record<string, any>;
  serviceKeywords?: string[];
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Record<string, any>
    | string[];
}

export const useProductForm = ({
  product,
  productData,
}: UseProductFormProps) => {
  const [formData, setFormData] = useState<FormData | null>(null);

  // Initialize form data from product or productData
  useEffect(() => {
    const dataSource = productData || product;

    if (dataSource) {
      const initialData: FormData = {
        name: dataSource.name || dataSource.title || "",
        title: dataSource.title || dataSource.name || "",
        description: dataSource.description || "",
        location: dataSource.location || dataSource.city || "",
        price: dataSource.price || "",
        category: dataSource.category || "",
        subCategory: dataSource.subCategory || "",
        childCategory: dataSource.childCategory || null,
        categoryGroup: dataSource.categoryGroup || "Buy and Sell",
        contactNumber: dataSource.contactNumber || "",
        negotiable: dataSource.negotiable ?? true,
        attributes: dataSource.attributes || {},
        serviceKeywords:
          dataSource.serviceKeywords ||
          dataSource.attributes?.serviceKeywords ||
          [],
      };

      setFormData(initialData);
    }
  }, [product, productData]);

  // Memoized change handler
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        if (!prev) return prev;

        // Handle numeric fields
        if (name === "price") {
          return { ...prev, [name]: value === "" ? "" : value };
        }

        return { ...prev, [name]: value };
      });
    },
    []
  );

  // Update specific field
  const updateField = useCallback((field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  // Update multiple fields at once
  const updateFields = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    const dataSource = productData || product;
    if (dataSource) {
      setFormData({
        name: dataSource.name || dataSource.title || "",
        title: dataSource.title || dataSource.name || "",
        description: dataSource.description || "",
        location: dataSource.location || dataSource.city || "",
        price: dataSource.price || "",
        category: dataSource.category || "",
        subCategory: dataSource.subCategory || "",
        childCategory: dataSource.childCategory || null,
        categoryGroup: dataSource.categoryGroup || "Buy and Sell",
        contactNumber: dataSource.contactNumber || "",
        negotiable: dataSource.negotiable ?? true,
        attributes: dataSource.attributes || {},
        serviceKeywords:
          dataSource.serviceKeywords ||
          dataSource.attributes?.serviceKeywords ||
          [],
      });
    }
  }, [product, productData]);

  // Reset attributes to empty object
  const resetAttributes = useCallback(() => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        attributes: {},
        serviceKeywords: [],
      };
    });
  }, []);

  // Reset dynamic fields (attributes + category info)
  const resetDynamicFields = useCallback(() => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        attributes: {},
        category: "",
        subCategory: "",
        childCategory: null,
        serviceKeywords: [],
      };
    });
  }, []);

  // Check if form has been modified
  const isModified = useMemo(() => {
    if (!formData || !product) return false;

    return (
      formData.title !== product.title ||
      formData.description !== product.description ||
      formData.price !== product.price ||
      formData.location !== product.location ||
      formData.category !== product.category ||
      formData.subCategory !== product.subCategory ||
      JSON.stringify(formData.attributes) !== JSON.stringify(product.attributes)
    );
  }, [formData, product]);

  return {
    formData,
    setFormData,
    handleChange,
    updateField,
    updateFields,
    resetForm,
    resetAttributes,
    resetDynamicFields,
    isModified,
  };
};
