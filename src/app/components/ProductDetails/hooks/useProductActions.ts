import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Product } from "../ProductDetail";
import { useFollows } from "../../FollowersFollowing/useFollows";
import { useSave } from "./useSave";
import { KeyedMutator } from "swr";

interface UseProductActionsProps {
  product: Product | undefined;
  mutate: KeyedMutator<any>;
}

export const useProductActions = ({
  product,
  mutate,
}: UseProductActionsProps) => {
  const { follow, unfollow } = useFollows();
  const { save, unsave } = useSave();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle Follow Toggle
  const handleFollowToggle = useCallback(async () => {
    if (!product) return;

    const previousIsFollowed = product.isFollowed;
    const newIsFollowed = !previousIsFollowed;

    // Optimistically update SWR cache
    await mutate(
      { ...product, isFollowed: newIsFollowed },
      { revalidate: false }
    );

    setIsFollowing(true);

    try {
      let result;

      if (newIsFollowed) {
        result = await follow(product.userId);
        if (!result.success) {
          throw new Error(result.message || "Failed to update follow status");
        }
      } else {
        result = await unfollow(product.userId);
      }

      console.log("Follow/Unfollow result:", result);

      toast.success(
        result.message ||
          (newIsFollowed ? "Followed successfully" : "Unfollowed successfully")
      );

      // Revalidation
      await mutate();
    } catch (error: any) {
      console.error("Follow/Unfollow error:", error);

      toast.error(error.message || "Failed to update follow status");

      // Rollback on error
      await mutate(
        { ...product, isFollowed: previousIsFollowed },
        { revalidate: false }
      );
    } finally {
      setIsFollowing(false);
    }
  }, [product, mutate, follow, unfollow]); // Added unfollow to dependencies

  const handleFavoriteToggle = useCallback(async () => {
    if (!product) return;

    const previousIsFavorite = product.isFavorite;
    const newIsFavorite = !previousIsFavorite;

    await mutate(
      { ...product, isFavorite: newIsFavorite },
      { revalidate: false }
    );

    setIsSaving(true);

    try {
      if (newIsFavorite) {
        await save(product.id || product._id);
        toast.success("Added to saved items.");
      } else {
        await unsave(product.id || product._id);
        toast.success("Removed from saved items.");
      }

      await mutate();
    } catch (error: any) {
      console.error("Save error:", error);

      toast.error("Failed to update saved status");

      await mutate(
        { ...product, isFavorite: previousIsFavorite },
        { revalidate: false }
      );
    } finally {
      setIsSaving(false);
    }
  }, [product, mutate, save, unsave]);

  return {
    handleFollowToggle,
    handleFavoriteToggle,
    isFollowing,
    isSaving,
  };
};
