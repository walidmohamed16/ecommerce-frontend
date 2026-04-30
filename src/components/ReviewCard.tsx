import type { Review } from '../types';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const date = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* User Avatar */}
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {review.user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-gray-800">{review.user.name}</span>
        </div>
        <span className="text-sm text-gray-400">{date}</span>
      </div>

      {/* Rating */}
      <StarRating rating={review.rating} size="sm" />

      {/* Comment */}
      <p className="text-gray-600 mt-2">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;