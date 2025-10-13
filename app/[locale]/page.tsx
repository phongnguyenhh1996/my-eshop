import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function HomePage({params: { locale }}: {params: {locale: string}}) {
  const t = await getTranslations('HomePage');
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'asc'
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
            }
          }
        }
      }
    },
  });

  return (
    <main className="p-8">
      <Link className="mb-4 inline-block" href="/admin">
        {t('admin')}
      </Link>
      <h1 className="text-3xl font-bold mb-4">
        Sản phẩm mới nhất
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            {/* Có thể thêm ảnh sản phẩm ở đây */}
            <h2 className="text-xl font-semibold">{product.translations[0].name}</h2>
            <p className="text-gray-500">{product.category.translations[0].name}</p>
            <p className="mt-2 text-lg font-bold">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(product.price)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}