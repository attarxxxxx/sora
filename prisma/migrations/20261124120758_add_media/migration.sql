-- AlterTable
ALTER TABLE "user" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "coverImagePublicId" TEXT,
ADD COLUMN     "imagePublicId" TEXT;

-- CreateTable
CREATE TABLE "post_image" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_image_publicId_key" ON "post_image"("publicId");

-- CreateIndex
CREATE INDEX "post_image_postId_position_idx" ON "post_image"("postId", "position");

-- AddForeignKey
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
