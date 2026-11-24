# Sora deployment checklist

This checklist assumes a Node.js host that can run a long-lived Next.js server
(for example Vercel, Railway, or a VPS). Sora uses Server Actions, Better Auth,
Prisma, and a hosted Neon database, so a static export is not supported.

## 1. Environment variables

Copy `.env.example` and set every value in the hosting platform:

| Variable                | Purpose                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `DATABASE_URL`          | Neon pooled connection string used by Prisma Client at runtime.   |
| `DIRECT_URL`            | Neon direct connection string used by Prisma CLI for migrations.  |
| `BETTER_AUTH_SECRET`    | Random secret for signing auth tokens (`npx auth@latest secret`). |
| `BETTER_AUTH_URL`       | Public app URL, e.g. `https://sora.example.com`.                  |
| `NEXT_PUBLIC_SITE_URL`  | Same public URL; used for canonical URLs, robots, and sitemap.    |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name.                                            |
| `CLOUDINARY_API_KEY`    | Cloudinary API key.                                               |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (server-only).                              |

Only `NEXT_PUBLIC_SITE_URL` is public. Never expose the database URL, Better Auth
secret, or Cloudinary API secret to the browser.

Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the final production origin
before building. Update the Better Auth trusted origin if the host uses a
different dashboard setting.

## 2. Database

1. Create the Neon database and allow the deploy host's IP ranges if required.
2. Use the pooled URL for `DATABASE_URL` and the direct URL for `DIRECT_URL`.
3. Apply migrations during deploy:

   ```powershell
   npm.cmd run db:deploy
   npm.cmd run db:generate
   ```

   On Vercel, the build command can be:

   ```text
   npm run db:deploy && npm run db:generate && npm run build
   ```

4. Confirm the `notification_type` enum and the `notification` table exist.

## 3. Cloudinary

1. Use an unsigned-free setup: uploads are signed by Sora server actions.
2. Keep the API secret server-only.
3. Optional hardening: restrict upload folders to `sora/posts/*`,
   `sora/avatars/*`, and `sora/covers/*`, and allow only image resource types.
4. Verify the remote image host `res.cloudinary.com` is allowed by the
   `next.config.ts` image configuration (already configured).

## 4. Build and run

```powershell
npm.cmd install
npm.cmd run lint
npm.cmd run typecheck
npx.cmd auth@latest check --config ./lib/auth.ts
npm.cmd run build
npm.cmd run start
```

The production server must run `next start` or an equivalent Node server.
Do not use a static export.

## 5. Post-deploy smoke test

- Open `/` while signed out; the public feed and image posts render.
- Sign up, create a text post, then an image post with alt text.
- Open `/search?q=<keyword>` and verify matching users and posts.
- Like, reply to, repost, and follow another account; verify `/notifications`
  shows the activity and the unread badge updates.
- Open `/settings/profile`, upload/replace/remove an avatar and cover.
- Delete an image post and confirm its Cloudinary asset is removed.
- Open `/robots.txt` and `/sitemap.xml`; confirm URLs use the production origin.

## 6. Operational notes

- `npm.cmd run db:deploy` is idempotent; run it on every deploy.
- Roll back code first if a deploy fails; do not delete applied migrations.
- Keep `.env` and `.env.*` out of git. Only `.env.example` is committed.
- Monitor server logs for Better Auth errors, Prisma connection errors, and
  Cloudinary signature/verification failures.
