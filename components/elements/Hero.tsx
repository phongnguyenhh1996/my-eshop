"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";

export function Hero() {
    return (
        <Carousel autoPlay autoPlayDelay={4000} className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="w-full h-[22vh] md:h-[50vh] lg:h-[calc(100vh-100px)] bg-[url(/slider1.png)] bg-cover">
                <div className="container h-full mx-auto px-3 flex">
                  <div className="my-auto">
                    <h5 className="text-lg lg:text-2xl mb-2 text-gray-950 font-medium">
                      Khuyến mãi thu đông 2025
                    </h5>
                    <h3 className="hidden md:block md:text-3xl lg:text-6xl/17">
                      Mua trực tuyến và <br />
                      nhận ưu đãi <br />
                      <strong>lên tới 50%</strong>
                    </h3>
                    <Button
                      variant="destructive"
                      className="mt-7 bg-gray-950 hover:bg-white hover:text-gray-950 rounded-none px-8 py-6 text-xl font-normal"
                    >
                      Mua ngay
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )
}