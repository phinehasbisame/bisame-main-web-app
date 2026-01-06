import { UnifiedImage } from "../types/index";
import { ProductLike } from "../types/index";


export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_IMAGES = 10;

export const validateImageFile = (file: File): string | null => {
  if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
    return `${file.name}: Only JPG and PNG allowed`;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `${file.name}: File too large (max ${
      MAX_IMAGE_SIZE / (1024 * 1024)
    }MB)`;
  }
  return null;
};

export const validateImageFiles = (
  files: File[]
): { validFiles: File[]; errors: string[] } => {
  const validFiles: File[] = [];
  const errors: string[] = [];

  files.forEach((file) => {
    const error = validateImageFile(file);
    if (error) {
      errors.push(error);
    } else {
      validFiles.push(file);
    }
  });

  return { validFiles, errors };
};

export const normalizeProductImages = (
  product: ProductLike
): UnifiedImage[] => {
  const srcList: (string | { id?: string; imageUrl?: string })[] = [];

  if (Array.isArray(product.images)) {
    srcList.push(...product.images);
  } else if (product.images) {
    srcList.push(product.images);
  }

  return srcList.map(
    (img: string | { id?: string; imageUrl?: string }, idx: number) => {
      const url = typeof img === "string" ? img : img.imageUrl ?? "";
      const imgId =
        typeof img === "object" && img.id ? img.id : `existing-${idx}`;
      return {
        id: imgId,
        imageUrl: url,
        isExisting: true,
        isMain: idx === 0,
      };
    }
  );
};

export const createTempImageEntry = (
  file: File,
  isFirstImage: boolean
): UnifiedImage => ({
  id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  file,
  preview: URL.createObjectURL(file),
  isMain: isFirstImage,
  isExisting: false,
});
