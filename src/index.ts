import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
export const prisma = new PrismaClient({ adapter });

// async function insertUser(username: string, password: string, firstName: string, lastName: string) {
//   const res = await prisma.user.create({
//     data: {
//       username,
//       password,
//       firstName,
//       lastName,
//     },
//   });
//   console.log(res);
// }

// insertUser("exampl1212e1", "password11223", "John11212", "Doe11212")


// async function getTodoAndUserDetails(userId: number) {
//     await prisma.todo.create({
//         data: {
//             title: "Todo 1",
//             descriptin: "This is the first todo",
//             userId: 1,
//         },
//     });
// }

async function getTodoAndUserDetails(userId: number) {

    // await prisma.todo.create({
    //     data: {
    //         title: "Todo 1",
    //         descriptin: "This is the first todo",
    //         userId: 1,
    //     },
    // }); 
    

    const res = await prisma.todo.findMany({
        //kind of JOINS i.e we are fetching the user details along with the todo details
        where: {
            userId,
        },
        select: {
            id: true,
            title: true,
            descriptin: true,
            user: true
        }
    });
    console.log(res);
}

getTodoAndUserDetails(1);