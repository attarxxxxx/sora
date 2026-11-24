# Sora

A Threads-style social platform built with Next.js 16, TypeScript, shadcn/ui
(Base UI), Prisma 7, Neon, Better Auth, and Cloudinary.

## Features

- Public feed with cursor pagination and image posts.
- Credentials auth with email or username login.
- Profiles with avatars, covers, bio, and follow/unfollow.
- Likes, replies, reposts, bookmarks, and basic notifications.
- User/post search.
- Signed server-side Cloudinary uploads with alt text and asset cleanup.

## Local development

1. Copy `.env.example` to `.env` and fill in the Neon, Better Auth, Cloudinary,
   and site URL values.
2. Install dependencies and prepare the database:

   ```powershell
   npm.cmd install
   npm.cmd run db:migrate
   npm.cmd run db:generate
   ```

3. Start the dev server:

   ```powershell
   npm.cmd run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npx.cmd auth@latest check --config ./lib/auth.ts
```

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the production environment,
migration, Cloudinary, and post-deploy checklist.
