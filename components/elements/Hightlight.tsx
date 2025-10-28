"use client"

import { IconDiscount, IconHeadset, IconPackageImport, IconTruckDelivery } from "@tabler/icons-react";
import { useTranslations } from "next-intl";


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

export function Hightlight() {
    const t = useTranslations("HomePage");
    return (
        <div className="bg-gray-100 py-4 lg:py-8">
        <div className="container mx-auto px-3 flex md:flex-row flex-wrap divide-y md:divide-y-0 lg:divide-x divide-gray-300">
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
    )
}