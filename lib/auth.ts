import { prismaAdapter } from "better-auth/adapters/prisma"
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { username } from "better-auth/plugins"

import { prisma } from "./prisma"

export const auth = betterAuth({
  appName: "Sora",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username({
      displayUsername: false,
      minUsernameLength: 3,
      maxUsernameLength: 30,
    }),
    nextCookies(),
  ],
})
