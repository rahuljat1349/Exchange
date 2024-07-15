import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";
import db from "@repo/db/client";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Phone number",
      credentials: {
        phone: {
          label: "Phone",
          type: "text",
          placeholder: "+91 xxxxxxxxxx",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "........",
        },
      },
      async authorize(credentials: any) {
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await db.user.findFirst({
          where: {
            phone: credentials.phone,
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          console.log(passwordValidation);
          console.log(existingUser);

          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              number: existingUser.phone,
              name: existingUser.name,
            };
          }
        }

        try {
          const user = await db.user.create({
            data: {
              phone: credentials.phone,
              password: hashedPassword,
            },
          });
          console.log(user);

          return {
            id: user.id.toString(),
            phone: user.phone,
            name: user.name,
          };
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
