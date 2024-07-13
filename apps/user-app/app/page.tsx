
import styles from "./page.module.css";

import { PrismaClient } from "@prisma/client";

export default async function  Home() {

  const prisma = new PrismaClient()

const users = await prisma.user.findMany();

console.log(users);


  return (
    <div className="bg-black text-white">
     hello
    </div>
  );
}
