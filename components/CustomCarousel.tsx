"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";

export default function CustomCarousel() {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const images = [
    "/images/carousel/carousel-1.jpg",
    "/images/carousel/carousel-2.jpg",
    "/images/carousel/carousel-3.jpg",
    "/images/carousel/carousel-4.jpg",
    "/images/carousel/carousel-5.jpg",
  ];

  return (
    <Carousel
      responsive={responsive}
      infinite
      autoPlay
      autoPlaySpeed={3000}
      arrows={false}
      customTransition="all 1s ease-in-out"
      transitionDuration={1000}
    >
      {images.map((src, index) => (
        <div key={index} className="w-full h-[300px] overflow-hidden">
          <Image
            src={src}
            alt={`Carousel image ${index + 1}`}
            width={500}
            height={300}
            className="object-cover w-full h-full"
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </div>
      ))}
    </Carousel>
  );
}
