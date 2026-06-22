import { useReview } from "../Hooks/UseReview"


function ReviewFormSelectedList({ id }) {
    const { rating, setRating,
        comment, setComment,
        reviewSubLoading,
        createReview,

    } = useReview()
    return (
        <div>
            <form onSubmit={(e) => createReview(id, e)} className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Write a Review</h2>
                    <p className="text-gray-600">Share your experience with other travelers</p>
                    <label htmlFor="rating">Rating</label>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star

                        ) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`transition-all duration-200 transform hover:scale-110 focus:outline-none ${rating >= star
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            >
                                <svg
                                    className={`w-8 h-8 ${rating >= star
                                        ? 'fill-yellow-400'
                                        : 'fill-gray-300'
                                        }`}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-6 space-y-4">
                    <label htmlFor="comment">Comment</label>
                    <textarea
                        id="comment"
                        value={comment}
                        required
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-y transition duration-200 ease-in-out text-gray-700 placeholder-gray-400"
                        placeholder="Share your thoughts and experience about this place..."
                        maxLength={500}
                    ></textarea>
                </div>
                <button
                    type='submit'
                    className='mt-6 w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 px-6 rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    disabled={reviewSubLoading}
                >
                    {reviewSubLoading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    )
}

export default ReviewFormSelectedList
