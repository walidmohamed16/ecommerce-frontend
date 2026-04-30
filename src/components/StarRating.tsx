import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  numReviews?: number;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ rating, numReviews, size = 'md' }: StarRatingProps) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      {stars}
      {numReviews !== undefined && (
        <span className="text-gray-500 text-sm ml-1">({numReviews})</span>
      )}
    </div>
  );
};

export default StarRating;