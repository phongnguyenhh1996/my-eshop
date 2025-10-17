import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
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
  IconDiscount
} from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const highlightIcons = (idx: number) => {
  const Icon = [IconTruckDelivery, IconPackageImport, IconHeadset, IconDiscount][idx];
  return <Icon stroke={1} className="h-10 w-10 mr-2" />;
}

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
      <div className="bg-gray-800 py-2">
        <div className="max-w-6xl mx-auto flex px-3 text-sm justify-between">
          <div className="flex gap-2.5">
            <div className="text-background/75 flex items-center">
              <IconPhone className="mr-0.5 h-5 w-5" />
              +84 123 456 789
            </div>
            <div className="text-background/75 flex items-center">
              <IconMail className="mr-0.5 h-5 w-5" />
              phongnguyenhh.1996@gmail.com
            </div>
          </div>
          <ul className="flex text-background/75 gap-5 uppercase">
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
      <div className="max-w-6xl mx-auto px-3 flex place-content-between">
        <img src="/logo.svg" alt="My E-Shop Logo" width="150" height="40" />
        <NavigationMenu>
          <NavigationMenuList className="uppercase">
            {["new_products", "dresses", "tops", "sale", "best_sellers"].map(
              (item) => (
                <NavigationMenuItem key={item}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/">{t(item)}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-4">
          <IconSearch />
          <IconUser />
          <IconShoppingCart />
        </div>
      </div>
      <Carousel autoPlay className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="w-full h-[calc(100vh-100px)] bg-[url(/slider1.png)] bg-cover">
                <div className="max-w-6xl h-full mx-auto px-3 flex">
                  <div className="my-auto">
                    <h5 className="text-2xl mb-2 text-gray-950 font-medium">
                      Khuyến mãi thu đông 2025
                    </h5>
                    <h3 className="text-6xl/17 ">
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
      <div className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-3 flex divide-x divide-gray-300">
          {[1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              className="basis-1/4 flex items-center py-2 justify-center"
            >
              {highlightIcons(index)}
              <div className="flex flex-col">
                <h4 className="font-medium">{t(highlightTextsTranslatedkeys[index].title)}</h4>
                <p className="text-sm text-gray-700">{t(highlightTextsTranslatedkeys[index].description)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
