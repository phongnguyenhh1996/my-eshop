"use client";

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
import {
  IconMenu2,
  IconSearch,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

type Navname = {
  id: string;
  link: string;
  name: string;
};
export interface MainNavProps {
  nav?: Navname[];
}

export function MainNav({ nav = [] }: MainNavProps) {
  const t = useTranslations("HomePage");

  return (
    <div className="container mx-auto px-3 flex place-content-between">
      <img src="/logo.svg" alt="My E-Shop Logo" width="150" height="40" />
      <NavigationMenu className="order-2 lg:order-1">
        <NavigationMenuList className="uppercase">
          {nav.map((item) => (
            <NavigationMenuItem className="hidden lg:block" key={item.id}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href={item.link}>{item.name}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
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
  );
}
