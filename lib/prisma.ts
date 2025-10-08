import { PrismaClient } from '@prisma/client'

// Khai báo một biến global để lưu trữ instance của PrismaClient
declare global {
  var prisma: PrismaClient | undefined
}

// Khởi tạo PrismaClient
// Nếu đang ở môi trường development, chúng ta gán nó vào biến global
// để tránh tạo ra nhiều instance mới mỗi khi Next.js hot-reload.
// Ở môi trường production, nó sẽ luôn tạo một instance mới.
const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma