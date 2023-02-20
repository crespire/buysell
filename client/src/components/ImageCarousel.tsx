import { useState } from 'react';

interface ImageCarouselProps {
  images: Array<{ mainUrl: string; description?: string }>;
}

function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div>
      <img src={images[currentIndex].mainUrl} alt={images[currentIndex].description} />
      <button onClick={handlePrevClick}>&#129128;</button>
      <span>{ currentIndex + 1 } of { images.length }</span>
      <button onClick={handleNextClick}>&#129130;</button>
    </div>
  );
};

export default ImageCarousel;
