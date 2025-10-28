import { Banner } from "@/components/elements/Banner";
import { Hero } from "@/components/elements/Hero";
import { HighlightProducts } from "@/components/elements/HighlightProducts";
import { Hightlight } from "@/components/elements/Hightlight";
import { MainNav } from "@/components/elements/MainNav";
import { TopInfor } from "@/components/elements/TopInfor";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import prisma from "@/lib/prisma";
import {
  IconHeart,
  IconStarFilled,
} from "@tabler/icons-react";
import { GemIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("HomePage");
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      // This includes the nested translations.
      translations: {
        where: {
          locale: locale, // Filter translations by the current language.
        },
      },
      category: {
        include: {
          translations: {
            where: {
              locale: locale, // Also filter category translations.
            },
          },
        },
      },
    },
  });

  return (
    <main>
      <TopInfor />
      <MainNav />
      <Hero />
      <Hightlight />
      <Banner />
      <HighlightProducts products={products} />
      <div className="container mx-auto px-3 my-16 hidden">
        <h2 className="text-4xl font-medium mb-2 text-center">
          {t("featured_collections")}
        </h2>
        <div className="flex items-center justify-center mb-3">
          <span className="block w-10 h-0.5 bg-gray-600 ml-auto"></span>
          <GemIcon className="mx-2 h-6 w-6 text-gray-600" />
          <span className="block w-10 h-0.5 bg-gray-600 mr-auto"></span>
        </div>
        <h4 className="text-lg mb-8 text-center text-gray-700">
          {t("check_out_our_latest_products")}
        </h4>
        <Carousel opts={{ slidesToScroll: 4 }} className="">
          <CarouselContent className="-ml-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <CarouselItem className="basis-1/4 pl-6" key={index}>
                <div className="flex flex-col relative">
                  <img
                    src={`https://www.fullstacksolution.net/demo/ayira/assets/images/p-0${
                      index + 1
                    }.jpg`}
                    alt={`Product ${index + 1}`}
                    className="w-full h-auto mb-4"
                  />
                  <span className="absolute top-0 left-0 bg-red-500 px-4 py-1 text-white">
                    20% Off
                  </span>
                  <IconHeart
                    stroke={1}
                    className="absolute top-2 right-2 h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer"
                  />
                  <div className="flex items-start">
                    <div className="flex flex-col">
                      <div className="font-medium text-sm">
                        Product name {index + 1}
                      </div>
                      <div className="text-sm text-gray-800">$49.00</div>
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
          <CarouselPrevious />
          <CarouselNext />
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
      <div className="container mx-auto px-3 my-16 hidden">
        <h2 className="text-4xl font-medium mb-2 text-center">
          {t("our_lastest_blog")}
        </h2>
        <div className="flex items-center justify-center mb-3">
          <span className="block w-10 h-0.5 bg-gray-600 ml-auto"></span>
          <GemIcon className="mx-2 h-6 w-6 text-gray-600" />
          <span className="block w-10 h-0.5 bg-gray-600 mr-auto"></span>
        </div>
        <h4 className="text-lg mb-8 text-center text-gray-700">
          {t("check_out_our_latest_products")}
        </h4>
      </div>
    </main>
  );
}
