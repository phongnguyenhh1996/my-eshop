// file: prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import slugify from 'slugify';
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...');
  
  // Clean up previous data to make the script re-runnable.
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('Deleted existing data.');

  // Create a category with its translations.
  const tShirtCategory = await prisma.category.create({
    data: {
      translations: {
        create: [
          { locale: 'vi', name: 'Áo Thun' },
          { locale: 'en', name: 'T-Shirts' },
        ]
      }
    }
  });
  console.log('Created categories.');

  // Prepare product names for different languages.
  const productNameVI = 'Áo Thun Cotton Basic Trắng';
  const productNameEN = 'Basic White Cotton T-Shirt';

  // Create a product with its translations.
  await prisma.product.create({
    data: {
      price: 250000,
      stock: 100,
      categoryId: tShirtCategory.id,
      translations: {
        create: [
          {
            locale: 'vi',
            name: productNameVI,
            description: 'Chất liệu 100% cotton thoáng mát, phù hợp cho mọi hoạt động.',
            slug: slugify(productNameVI, { lower: true, strict: true, locale: 'vi' })
          },
          {
            locale: 'en',
            name: productNameEN,
            description: '100% breathable cotton material, suitable for all activities.',
            slug: slugify(productNameEN, { lower: true, strict: true })
          }
        ]
      }
    }
  });
  console.log('Created products.');
  console.log('Seeding finished.');
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