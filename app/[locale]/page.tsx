import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import prisma from "@/lib/prisma";
import {
  IconMail,
  IconPhone,
  IconSearch,
  IconShoppingCart,
  IconTruckDelivery,
  IconUser,
  IconPackageImport,
  IconHeadset,
  IconDiscount,
  IconDiamond,
  IconHeart,
  IconStar,
  IconStarFilled,
  IconMenu2,
} from "@tabler/icons-react";
import { GemIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const highlightIcons = (idx: number) => {
  const Icon = [
    IconTruckDelivery,
    IconPackageImport,
    IconHeadset,
    IconDiscount,
  ][idx];
  return <Icon stroke={1} className="h-10 w-10 mr-2" />;
};

const highlightTextsTranslatedkeys = [
  { title: "free_shipping", description: "on_all_orders_over_100" },
  { title: "easy_returns", description: "30_day_return_policy" },
  { title: "support_24_7", description: "we_are_here_to_help" },
  { title: "best_deals", description: "save_up_to_50_off" },
];

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("HomePage");
  // const products = await prisma.product.findMany({
  //   orderBy: {
  //     createdAt: "asc",
  //   },
  //   include: {
  //     // This includes the nested translations.
  //     translations: {
  //       where: {
  //         locale: locale, // Filter translations by the current language.
  //       },
  //     },
  //     category: {
  //       include: {
  //         translations: {
  //           where: {
  //             locale: locale, // Also filter category translations.
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  return (
    <main>
      <div className="bg-gray-800 py-2">
        <div className="max-w-2xl lg:max-w-6xl mx-auto flex px-3 text-sm lg:justify-between">
          <div className="flex gap-2.5 text-xs mx-auto lg:mx-0">
            <div className="text-background/75 flex items-center">
              <IconPhone className="mr-0.5 h-4 w-4" />
              +84123456789
            </div>
            <div className="text-background/75 flex items-center">
              <IconMail className="mr-0.5 h-4 w-4" />
              phongnguyenhh.1996@gmail.com
            </div>
          </div>
          <ul className="hidden lg:flex text-background/75 gap-5 uppercase">
            <li>
              <Link href="/">{t("about_us")}</Link>
            </li>
            <li>
              <Link href="/about">{t("blog")}</Link>
            </li>
            <li>
              <Link href="/products">{t("contact_us")}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-2xl lg:max-w-6xl mx-auto px-3 flex place-content-between">
        <img src="/logo.svg" alt="My E-Shop Logo" width="150" height="40" />
        <NavigationMenu className="order-2 lg:order-1">
          <NavigationMenuList className="uppercase">
            {["new_products", "dresses", "tops", "sale", "best_sellers"].map(
              (item) => (
                <NavigationMenuItem className="hidden lg:block" key={item}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/">{t(item)}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
            <NavigationMenuItem className="lg:hidden">
              <Drawer direction="left">
                <DrawerTrigger asChild>
                  <Button variant="outline">
                    <IconMenu2 className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="hidden">
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                  </DrawerHeader>

                  <NavigationMenu className="order-2 lg:order-1">
                    <NavigationMenuList className="uppercase flex-col">
                      {[
                        "new_products",
                        "dresses",
                        "tops",
                        "sale",
                        "best_sellers",
                      ].map((item) => (
                        <NavigationMenuItem className="" key={item}>
                          <NavigationMenuLink
                            asChild
                            className={navigationMenuTriggerStyle()}
                          >
                            <Link href="/">{t(item)}</Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </DrawerContent>
              </Drawer>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="order-1 lg:order-2 flex items-center gap-4 ml-auto lg:mx-0 mr-4">
          <IconSearch className="hidden lg:block" />
          <IconUser />
          <IconShoppingCart />
        </div>
      </div>
      <Carousel autoPlay autoPlayDelay={4000} className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="w-full h-[22vh] md:h-[50vh] lg:h-[calc(100vh-100px)] bg-[url(/slider1.png)] bg-cover">
                <div className="max-w-2xl lg:max-w-6xl h-full mx-auto px-3 flex">
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
      <div className="bg-gray-100 py-4 lg:py-8">
        <div className="max-w-2xl lg:max-w-6xl mx-auto px-3 flex md:flex-row flex-wrap divide-y md:divide-y-0 lg:divide-x divide-gray-300">
          {[1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              className="md:basis-1/2 lg:basis-1/4 flex items-center py-2 lg:justify-center"
            >
              {highlightIcons(index)}
              <div className="flex flex-col">
                <h4 className="font-medium text-sm lg:text-base">
                  {t(highlightTextsTranslatedkeys[index].title)}
                </h4>
                <p className="text-sm text-gray-700">
                  {t(highlightTextsTranslatedkeys[index].description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-2xl lg:max-w-6xl mx-auto my-10 flex flex-col md:flex-row gap-2 lg:gap-5 p-2 mx-p-0">
        <div className="basis-1/2 grid grid-flow-col grid-rows-2 gap-2 lg:gap-5">
          <div className="relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-01.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
          <div className="relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-02.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
          <div className="row-span-2 relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-03.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
        </div>
        <div className="basis-1/2 grid grid-flow-row grid-cols-2 gap-2 lg:gap-5">
          <div className="relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-04.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
          <div className="relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-05.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
          <div className="col-span-2 relative group overflow-hidden">
            <img
              src="http://fullstacksolution.net/demo/ayira/assets/images/banner-07.jpg"
              alt="Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 text-gray-50 px-6 py-2">
              <h4 className="text-xs lg:text-lg font-medium">
                Winter Collection
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-2xl lg:max-w-6xl mx-auto px-3 my-16">
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
            {Array.from({ length: 8 }).map((_, index) => (
              <CarouselItem
                className="pl-10 md:basis-1/2 lg:basis-1/4 lg:pl-6"
                key={index}
              >
                <div className="flex flex-col relative">
                  <img
                    src={`https://www.fullstacksolution.net/demo/ayira/assets/images/p-0${
                      index + 1
                    }.jpg`}
                    alt={`Product ${index + 1}`}
                    className="w-full h-auto mb-4"
                  />
                  <span className="absolute top-0 left-0 bg-green-600 px-4 py-1 text-white">
                    New
                  </span>
                  <IconHeart
                    stroke={1}
                    className="absolute top-2 right-2 h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer"
                  />
                  <div className="flex flex-row items-start">
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
      <div className="max-w-2xl lg:max-w-6xl mx-auto px-3 my-16 hidden">
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
      <div className="max-w-2xl lg:max-w-6xl mx-auto px-3 my-16 hidden">
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
