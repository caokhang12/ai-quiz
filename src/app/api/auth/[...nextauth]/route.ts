import { authOption } from "@/lib/nextauth";
import NextAuth from "next-auth";

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
