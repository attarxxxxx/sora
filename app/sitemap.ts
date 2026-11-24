import type { MetadataRoute } from "next"

import { prisma } from "@/lib/prisma"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      where: { username: { not: null } },
      select: { username: true, updatedAt: true },
      orderBy: { username: "asc" },
    }),
    prisma.post.findMany({
      where: { parentId: null },
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 1000,
    }),
  ])

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...users.map((user) => ({
      url: `${SITE_URL}/${user.username}`,
      lastModified: user.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/post/${post.id}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}
