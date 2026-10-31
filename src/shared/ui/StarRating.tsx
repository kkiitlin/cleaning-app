import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 24,
}: StarRatingProps) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        size={size}
        color={i <= value ? '#f59e0b' : '#ddd'}
        name={i <= value ? 'star' : 'star-outline'}
      />
    );
  }

  return <>{stars}</>;
};

export default StarRating;