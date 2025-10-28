"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IconHeart, IconStarFilled } from "@tabler/icons-react";
import { GemIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ProductRowType } from "@/lib/queries/products";

export function HighlightProducts({products = []}: {products?: ProductRowType[]}) {
  const t = useTranslations("HomePage");
  return (
    <div className="container mx-auto px-3 my-16">
      <h2 className="text-3xl lg:text-4xl font-medium mb-2 text-center">
        {t("new_arrivals")}
      </h2>
      <div className="flex items-center justify-center mb-3">
        <span className="block w-10 h-0.5 bg-gray-600 ml-auto"></span>
        <GemIcon className="mx-2 h-6 w-6 text-gray-600" />
        <span className="block w-10 h-0.5 bg-gray-600 mr-auto"></span>
      </div>
      <h4 className="text-base lg:text-lg mb-4 lg:mb-8 text-center text-gray-700">
        {t("check_out_our_latest_products")}
      </h4>
      <Carousel
        opts={{
          slidesToScroll: 1,
          breakpoints: {
            "(min-width: 768px)": { slidesToScroll: 2 },
            "(min-width: 1024px)": { slidesToScroll: 4 },
          },
        }}
        className=""
      >
        <CarouselContent className="-ml-10 lg:-ml-6">
          {products.map((product, index) => (
            <CarouselItem
              className="pl-10 md:basis-1/2 lg:basis-1/4 lg:pl-6"
              key={index}
            >
              <div className="flex flex-col relative">
                <img
                  src={product.images?.length > 0 ? product.images[0] : `https://www.fullstacksolution.net/demo/ayira/assets/images/p-0${
                    index + 1
                  }.jpg`}
                  alt={`Product ${index + 1}`}
                  className="w-full h-auto mb-4"
                />
                {index % 2 === 0 ? (
                  <span className="absolute top-0 left-0 bg-red-500 px-4 py-1 text-white">
                    20% Off
                  </span>
                ) : (
                  <span className="absolute top-0 left-0 bg-green-600 px-4 py-1 text-white">
                    New
                  </span>
                )}
                <IconHeart
                  stroke={1}
                  className="absolute top-2 right-2 h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer"
                />
                <div className="flex flex-row items-start">
                  <div className="flex flex-col">
                    <div className="font-medium text-sm">
                      {product.translations[0]?.name || "Unnamed Product"}
                    </div>
                    <div className="text-sm text-gray-800">{product.price}</div>
                  </div>
                  <div className="ml-auto flex items-center">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <IconStarFilled
                          key={starIndex}
                          className="h-3 w-3 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 ml-2">(25)</div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden" />
        <CarouselNext className="hidden" />
      </Carousel>
      <div className="w-full flex justify-center mt-10">
        <Button
          variant="destructive"
          className="bg-gray-950 hover:bg-yellow-400 rounded-none px-8 py-6 font-normal text-md"
        >
          {t("view_all_products")}
        </Button>
      </div>
    </div>
  );
}
