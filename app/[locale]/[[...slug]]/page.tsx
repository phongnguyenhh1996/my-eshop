// file: app/[locale]/[...slug]/page.tsx (simplified example)
import { Banner } from "@/components/elements/Banner";
import { Footer } from "@/components/elements/Footer";
import { Hero } from "@/components/elements/Hero";
import { HighlightProducts } from "@/components/elements/HighlightProducts";
import { Hightlight } from "@/components/elements/Hightlight";
import { MainNav } from "@/components/elements/MainNav";
import { TopInfor } from "@/components/elements/TopInfor";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

// --- 2. Create a map to link identifiers to components ---
interface TopInforData {
  tel: string;
  email: string;
}

interface PageContent {
  id: string;
  type: keyof typeof componentMap;
  data: TopInforData;
}

const componentMap = {
  "top_infor": TopInfor,
  "banner": Banner,
  "footer": Footer,
  "hero": Hero,
  "highlight_products": HighlightProducts,
  "highlight": Hightlight,
  "main_nav": MainNav,
} as const;

export default async function DynamicPage({ params }: { params: { slug: string[], locale: string } }) {
    const { slug: slugParam, locale } = await params
    const slug = slugParam ? slugParam.join('/') : '/';

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
  // --- 3. Fetch the page data from the DB ---
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page || !page.content) {
    notFound();
  }

  const content = page.content as unknown as PageContent[]; // Double cast to safely convert JSON content

  // --- 4. Loop through the content and render ---
  return (
    <div>
      {content.map((element) => {
        const Component = componentMap[element.type];
        if (!Component) {
          return <div key={element.id}>Unknown element type: {element.type}</div>;
        }
        
        // Pass the element's saved data as props to the component
        return <Component key={element.id} {...element.data} products={products} />;
      })}
    </div>
  );
}