

import { useListing } from '../../Hooks/UseListing';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function Gallery() {


    const { currentImage, setCurrentImage,

        currentImageIndex, setCurrentImageIndex,
        selectedListing,

    } = useListing()


    const handleImgChange = (url, index) => {
        setCurrentImage(url);
        setCurrentImageIndex(index);
    }

    const nextImage = () => {
        if (selectedListing && selectedListing.image && selectedListing.image.length > 0) {
            const nextIndex = (currentImageIndex + 1) % selectedListing.image.length;
            setCurrentImageIndex(nextIndex);
            setCurrentImage(selectedListing.image[nextIndex].url);
        }
    }

    const prevImage = () => {
        if (selectedListing && selectedListing.image && selectedListing.image.length > 0) {
            const prevIndex = (currentImageIndex - 1 + selectedListing.image.length) % selectedListing.image.length;
            setCurrentImageIndex(prevIndex);
            setCurrentImage(selectedListing.image[prevIndex].url);
        }
    }

    return (
        <>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2 relative rounded-xl overflow-hidden">
                    <img
                        src={currentImage}
                        className="w-full h-[400px] md:h-[500px] object-cover"
                        alt={selectedListing.title}
                    />
                    {/* Navigation arrows */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                            onClick={prevImage}
                            className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                            aria-label="Previous image"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-800" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                            aria-label="Next image"
                        >
                            <ArrowRight className="w-5 h-5 text-gray-800" />
                        </button>
                    </div>
                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {selectedListing.image ? selectedListing.image.length : 0}
                    </div>
                </div>
                <div className="hidden md:grid grid-cols-2 gap-4 h-[500px] overflow-y-auto">
                    {selectedListing.image && selectedListing.image.map((img, i) => (
                        <div
                            key={i}
                            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${currentImageIndex === i ? 'ring-2 ring-rose-500' : 'hover:opacity-90'}`}
                            onClick={() => handleImgChange(img.url, i)}
                        >
                            <img
                                src={img.url}
                                alt={`View of ${selectedListing.title} - ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* Mobile Thumbnails */}
            <div className="flex md:hidden overflow-x-auto space-x-2 pb-4 mb-6">
                {selectedListing.image && selectedListing.image.map((img, i) => (
                    <div
                        key={i}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${currentImageIndex === i ? 'ring-2 ring-rose-500' : 'hover:opacity-90'}`}
                        onClick={() => handleImgChange(img.url, i)}
                    >
                        <img
                            src={img.url}
                            alt={`View of ${selectedListing.title} - ${i + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default Gallery
