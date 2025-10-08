import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Bắt đầu quá trình seeding...')

  // Xóa dữ liệu cũ để tránh trùng lặp (tùy chọn)
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  
  // Tạo danh mục mẫu
  const aoThunCategory = await prisma.category.create({
    data: {
      name: 'Áo Thun',
    }
  })

  const aoSoMiCategory = await prisma.category.create({
    data: {
      name: 'Áo Sơ Mi',
    }
  })

  const quanJeanCategory = await prisma.category.create({
    data: {
      name: 'Quần Jean',
    }
  })

  console.log('Đã tạo xong danh mục.')

  // Tạo sản phẩm mẫu
  await prisma.product.create({
    data: {
      name: 'Áo Thun Cotton Basic Trắng',
      description: 'Chất liệu 100% cotton thoáng mát, phù hợp cho mọi hoạt động.',
      price: 250000,
      categoryId: aoThunCategory.id,
      images: [], // Thêm link ảnh nếu có
      slug: 'ao-thun-cotton-basic-trang',
    }
  })

  await prisma.product.create({
    data: {
      name: 'Áo Sơ Mi Oxford Dài Tay Xanh',
      description: 'Thiết kế lịch lãm, chất vải oxford dày dặn, đứng form.',
      price: 450000,
      categoryId: aoSoMiCategory.id,
      images: [],
      slug: 'ao-so-mi-oxford-dai-tay-xanh',
    }
  })
  
  await prisma.product.create({
    data: {
      name: 'Quần Jean Slim-fit Đen',
      description: 'Form quần ôm vừa vặn, tôn dáng. Chất liệu jean co giãn thoải mái.',
      price: 550000,
      categoryId: quanJeanCategory.id,
      images: [],
      slug: 'quan-jean-slim-fit-den',
    }
  })

  console.log('Đã tạo xong sản phẩm.')
  console.log('Quá trình seeding hoàn tất.')
}

main()
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })