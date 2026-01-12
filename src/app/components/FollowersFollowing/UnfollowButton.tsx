"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useFollows } from './useFollows';

interface UnfollowButtonProps {
  onToggle?: () => Promise<void>;
  userid: string; // This should be the userid from FollowerUser
  disabled?: boolean;
  mutate?: () => void; // Add mutate prop
}

const UnfollowButton: React.FC<UnfollowButtonProps> = ({
  onToggle,
  userid,
  disabled = false,
  mutate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
   const { unfollow } = useFollows();
  
  const handleClick = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    try {
      const res = await unfollow(userid);
      if (res && res.success) {
        toast.success('Unfollowed successfully!');
        if (onToggle) await onToggle();
        if (mutate) await mutate(); // Refetch followers data
        window.location.reload()
      } else {
        toast.error(res?.message || 'Failed to unfollow user');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || 'Unfollow failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`text-white text-xs font-semibold px-3 py-1 rounded-sm tracking-tighter transition-colors duration-200 bg-blue-600 hover:bg-blue-700 ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex items-center space-x-1">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
          <span>UNFOLLOW...</span>
        </div>
      ) : (
        'UNFOLLOW'
      )}
    </button>
  );
};

export default UnfollowButton; 