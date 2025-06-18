generator client {
  provider        = "prisma-client"
  previewFeatures = ["driverAdapters"]
  output          = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id        String   @id @default(uuid()) @db.Uuid
  title     String   @db.VarChar(255)
  content   String   @db.VarChar(1000)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamp()
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamp()

  @@map("post")
}
