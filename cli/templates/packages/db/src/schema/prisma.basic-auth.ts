generator client {
  provider        = "prisma-client"
  previewFeatures = ["driverAdapters"]
  output          = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String   @db.VarChar(255)
  email     String   @unique(map: "user_email_unique") @db.VarChar(255)
  image     String   @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz(6)

  accounts Account[]
  sessions Session[]

  @@map("user")
}

model Account {
  provider  String  @db.VarChar(255)
  accountId String  @map("account_id") @db.VarChar(255)
  password  String? @db.VarChar(255)

  userId String @map("user_id") @db.Uuid
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "account_user_id_user_id_fk")

  @@id([provider, accountId], map: "account_provider_account_id_pk")
  @@map("account")
}

model Session {
  token   String   @id @db.VarChar(255)
  expires DateTime @db.Timestamptz(6)

  userId String @map("user_id") @db.Uuid
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "session_user_id_user_id_fk")

  @@map("session")
}
