
import { Calendar, Star } from 'lucide-react';
import { useAuth } from '../../Auth/Hooks/useAuth'
import { useReview } from '../Hooks/UseReview';

function ReviewsShowSelectedListing({ id }) {

    const { userData } = useAuth();
    const { allReview, deleteReview } = useReview()
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
            {allReview && allReview.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allReview.map((review, i) => (
                        <div key={i} className="group relative bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center">
                                        <span className="text-white font-medium">
                                            {review.user.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                            {review.user.name ? review.user.name : 'Anonymous'}
                                        </h3>
                                        <div className="flex items-center">
                                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                            <span className="ml-1 font-medium">{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-2 line-clamp-3">{review.comment}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <time dateTime={review.createdAt}>
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </time>
                                    </div>
                                </div>
                                {userData?.id === review.user.id && (
                                    <div className="absolute top-4 right-4">
                                        <button className="invisible group-hover:visible bg-white shadow border border-gray-200 rounded-full p-1 hover:bg-gray-100 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                        <div className="invisible group-hover:visible absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                            <button
                                                onClick={() => deleteReview(id, review.id)}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                Delete Review
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600">Be the first one to review this place!</p>
                </div>
            )}
        </div>
    )
}

export default ReviewsShowSelectedListing
