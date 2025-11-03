"use client";

import { IconMail, IconPhone } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import Link from "next/link";

export function TopInfor({ tel, email }: { tel: string; email: string }) {
  const t = useTranslations("HomePage");
  return (
    <div className="bg-gray-800 py-2">
      <div className="container mx-auto flex px-3 text-sm lg:justify-between">
        <div className="flex gap-2.5 text-xs mx-auto lg:mx-0">
          <div className="text-background/75 flex items-center">
            <IconPhone className="mr-0.5 h-4 w-4" />
            {tel}
          </div>
          <div className="text-background/75 flex items-center">
            <IconMail className="mr-0.5 h-4 w-4" />
            {email}
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
            <Link href="/admin">{t("admin")}</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
