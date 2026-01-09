"use client";
import { useMyPostData } from "./useMyPostData";
import { memo, useState } from "react";
import ErrorPage from "./components/ErrorPage";
import NoProductFound from "./components/NoProductFound";
import LoadingPage from "./components/LoadingPage";
import PostCard from "./components/PostCard";
import CardContainer from "./components/CardContainer";
import { usePostContext } from "./context/PostContext";
import { Product } from "./types";
import { UpdatePostRequest, usePostUpdatePost } from "./usePostUpdatePost";

const ReviewProducts = () => {
  const {
    data,
    loading: isEditLoading,
    error: editProductError,
  } = useMyPostData("Reviewing");
  const reviewProducts: Product[] = data?.results || [];

  const {
    isOpen,
    editProductId,
    handleOpenModal,
    handleCloseModal,
    handleEditProductId,
  } = usePostContext();
  const { updatePost, result: updateResult } = usePostUpdatePost();

  const [imgSrcMap, setImgSrcMap] = useState<Record<string, string>>({});

  const handleEdit = (productId: string) => {
    handleOpenModal();
    handleEditProductId(productId);
  };

  const handleClose = (productId: string) => {
    console.log(`Close product with ID: ${productId}`);
    handleCloseModal();
  };

  const handleCancelEdit = () => {
    handleCloseModal();
    handleEditProductId(null);
  };

  const handleImageError = (productId: string) => {
    setImgSrcMap((prev) => ({ ...prev, [productId]: "/f4.png" }));
  };

  const handleUpdateProduct = (
    reqBody: UpdatePostRequest,
    listingId: string
  ) => {
    updatePost({ body: reqBody, id: listingId });
    // Do not close modal here; wait for updateResult.success
  };

  if (isEditLoading) {
    return <LoadingPage status="review" />;
  }

  if (editProductError) {
    return <ErrorPage error={editProductError} />;
  }

  if (!reviewProducts.length) {
    return <NoProductFound />;
  }

  return (
    <CardContainer>
      {reviewProducts.map((product) => {
        const normalizedProduct: Product = {
          ...product,
          id: product.id ?? product._id ?? "",
        };

        const imgSrc = product.images[0].imageUrl;

        return (
          <PostCard
            key={normalizedProduct._id ?? normalizedProduct.id}
            editProductId={editProductId}
            isOpen={isOpen}
            isEditLoading={isEditLoading}
            editProductError={editProductError}
            onCancel={handleCancelEdit}
            imgSrc={imgSrc}
            product={normalizedProduct}
            onImageError={handleImageError}
            onClose={handleClose}
            onEdit={handleEdit}
            onUpdateProduct={handleUpdateProduct}
          />
        );
      })}
    </CardContainer>
  );
};

export default memo(ReviewProducts);
