// import { PrismaClient } from "./generated/prisma/client.js";
// import { PrismaPg } from "@prisma/adapter-pg";
// import "dotenv/config";

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });
// export const prisma = new PrismaClient({ adapter });

// // async function insertUser(username: string, password: string, firstName: string, lastName: string) {
// //   const res = await prisma.user.create({
// //     data: {
// //       username,
// //       password,
// //       firstName,
// //       lastName,
// //     },
// //   });
// //   console.log(res);
// // }

// // insertUser("exampl1212e1", "password11223", "John11212", "Doe11212")


// // async function getTodoAndUserDetails(userId: number) {
// //     await prisma.todo.create({
// //         data: {
// //             title: "Todo 1",
// //             descriptin: "This is the first todo",
// //             userId: 1,
// //         },
// //     });
// // }

// async function getTodoAndUserDetails(userId: number) {

//     // await prisma.todo.create({
//     //     data: {
//     //         title: "Todo 1",
//     //         descriptin: "This is the first todo",
//     //         userId: 1,
//     //     },
//     // }); 
    

//     const res = await prisma.todo.findMany({
//         //kind of JOINS i.e we are fetching the user details along with the todo details
//         where: {
//             userId,
//         },
//         select: {
//             id: true,
//             title: true,
//             descriptin: true,
//             user: true
//         }
//     });
//     console.log(res);
// }

// getTodoAndUserDetails(1);


// import { PrismaClient } from "./generated/prisma/client.js";
// import { PrismaPg } from "@prisma/adapter-pg";
// import "dotenv/config";

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });
// export const prisma = new PrismaClient({ adapter });






// async function main() {
//   console.log('--- 1. Setting up Store Inventory ---')
  
//   const laptop = await prisma.product.upsert({
//     where: { sku: 'TECH-LPT-01' },
//     update: {},
//     create: { sku: 'TECH-LPT-01', name: 'Pro Developer Laptop', price: 1299.99, inventory: 50 }
//   })

//   const mouse = await prisma.product.upsert({
//     where: { sku: 'TECH-MOU-02' },
//     update: {},
//     create: { sku: 'TECH-MOU-02', name: 'Ergonomic Wireless Mouse', price: 49.99, inventory: 200 }
//   })

//   console.log('Inventory ready.')

//   console.log('\n--- 2. Registering Customer ---')
//   const customer = await prisma.customer.upsert({
//     where: { email: 'sarah.shopper@example.com' },
//     update: {},
//     create: { email: 'sarah.shopper@example.com', name: 'Sarah Jenkins' }
//   })
//   console.log(`Customer ready: ${customer.name}`)

//   console.log('\n--- 3. Processing Checkout ---')
  
//   const cart = [
//     { product: laptop, quantity: 1 },
//     { product: mouse, quantity: 2 }
//   ]

//   const orderTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)

//   const newOrder = await prisma.order.create({
//     data: {
//       totalAmount: orderTotal,
//       status: 'PAID',
//       customer: {
//         connect: { id: customer.id }
//       },
//       items: {
//         create: cart.map(item => ({
//           quantity: item.quantity,
//           priceAtPurchase: item.product.price,
//           product: { connect: { id: item.product.id } }
//         }))
//       }
//     },
//     include: {
//       customer: true,
//       items: {
//         include: { product: true }
//       }
//     }
//   })

//   console.log('\n✅ Order Successfully Processed!')
//   console.log(`Order ID: #${newOrder.id}`)
//   console.log(`Total Paid: $${newOrder.totalAmount.toFixed(2)}`)
//   console.log('\nReceipt Details:')
//   console.dir(newOrder, { depth: null })
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })








import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
export const prisma = new PrismaClient({ adapter });


async function main() {
  const creator = await prisma.user.upsert({
    where: { email: 'tech.creator@example.com' },
    update: {},
    create: { email: 'tech.creator@example.com', username: 'TechTutorials101' }
  })

  const viewer = await prisma.user.upsert({
    where: { email: 'avid.watcher@example.com' },
    update: {},
    create: { email: 'avid.watcher@example.com', username: 'CodeLearner99' }
  })

  const newVideo = await prisma.video.create({
    data: {
      title: 'Learn TypeScript and Prisma in 10 Minutes',
      description: 'A quick guide to database relationships.',
      videoUrl: 'https://cdn.example.com/videos/ts-prisma.mp4',
      authorId: creator.id
    }
  })

  await prisma.comment.create({
    data: {
      text: 'This was super helpful, especially the compound unique constraints part!',
      videoId: newVideo.id,
      authorId: viewer.id
    }
  })

  await prisma.like.create({
    data: {
      videoId: newVideo.id,
      userId: viewer.id
    }
  })

  const videoDetails = await prisma.video.findUnique({
    where: { id: newVideo.id },
    include: {
      author: {
        select: { username: true }
      },
      comments: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { username: true } } }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  })

  console.dir(videoDetails, { depth: null })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })