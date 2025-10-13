import {createNavigation} from 'next-intl/navigation';
import { routing } from './i18n/routing'; // Your config file

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);