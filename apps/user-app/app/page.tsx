
import { useSession } from "next-auth/react";
import styles from "./page.module.css";

import  db  from "@repo/db/client";

export default async function  Home() {

const session  = await useSession()





  return (
    <div >
    {session.data?.user} 
    </div>
  );
}
