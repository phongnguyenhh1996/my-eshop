"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";

interface Slide {
  main_title: string;
  description: string;
  bg_img: string;
  button_text: string;
}

export interface HeroProps {
  slide?: Slide[];
}

export function Hero({ slide = [] }: HeroProps) {
  return (
    <Carousel autoPlay autoPlayDelay={4000} className="w-full">
      <CarouselContent>
        {slide.map((item, index) => (
          <CarouselItem key={index}>
            <div className={`w-full h-[22vh] md:h-[50vh] lg:h-[calc(100vh-100px)] bg-[url(${item.bg_img})] bg-cover`}>
              <div className="container h-full mx-auto px-3 flex">
                <div className="my-auto">
                  <h5 className="text-lg lg:text-2xl mb-2 text-gray-950 font-medium">
                    {item.main_title}
                  </h5>
                  <h3
                    className="hidden md:block md:text-3xl lg:text-6xl/17"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />

                  <Button
                    variant="destructive"
                    className="mt-7 bg-gray-950 hover:bg-white hover:text-gray-950 rounded-none px-8 py-6 text-xl font-normal"
                  >
                    {item.button_text}
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
