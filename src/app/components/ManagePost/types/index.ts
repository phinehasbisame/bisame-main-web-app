export type UnifiedImage = {
  id: string;
  file?: File;
  preview?: string;
  imageUrl?: string;
  isMain?: boolean;
  isExisting?: boolean;
};

export type FlatFormValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | boolean[];

export type FlatForm = Record<string, FlatFormValue>;

export type ProductImagesType =
  | string
  | { id?: string; imageUrl?: string }
  | Array<string | { id?: string; imageUrl?: string }>;

export type ProductLike = {
  images?: ProductImagesType;
};

export type AttributeValue = string | string[];

export interface ProductEditData {
  categoryGroup?: string;
  category?: string;
  subCategory?: string;
  title?: string;
  location?: string;
  attributes?: Record<string, AttributeValue>;
  description?: string;
  price?: string;
  negotiable?: string;
  contactNumber?: string;
  [key: string]:
    | string
    | AttributeValue
    | Record<string, AttributeValue>
    | undefined;
}

export interface EditModalProps {
  id: string;
  product: unknown;
  onCancel: () => void;
}

export interface Product {
  id: string;

  title?: string;
  name?: string;
  description?: string;
  price?: number | string;

  location?: string;

  category?: string;
  subCategory?: string;
  childCategory?: string | null;
  categoryGroup?: string;

  contactNumber?: string;

  images?: string[] | { imageUrl: string }[];

  negotiable?: boolean | "true" | "false";

  attributes?: Record<string, any>;
}
