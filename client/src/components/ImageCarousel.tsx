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
    <div className="p-2 bg-neutral-content dark:bg-base-300 flex flex-col justify-center content-center gap-3 w-fit justify-self-center self-center">
      <img className="mx-auto w-fit h-fit max-w-screen-sm max-h-full" src={images[currentIndex].mainUrl} alt={images[currentIndex].description} />
      { images.length > 1 && (
        <section className="flex justify-center content-center gap-x-3">
          <button onClick={handlePrevClick}>&#129128;</button>
          <span>{ currentIndex + 1 } of { images.length }</span>
          <button onClick={handleNextClick}>&#129130;</button>
        </section>
      )}
    </div>
  );
};

export default ImageCarousel;
