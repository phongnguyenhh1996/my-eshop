import prisma from '@/lib/prisma';

export default async function HomePage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Sản phẩm mới nhất
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            {/* Có thể thêm ảnh sản phẩm ở đây */}
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-500">{product.category.name}</p>
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