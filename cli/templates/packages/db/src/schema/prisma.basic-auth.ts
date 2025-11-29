generator client {
  provider = "prisma-client"
  output   = "../src/generated"
}

datasource db {
  provider = "postgresql"
}

model User {
  id         String     @id @db.VarChar(24) @default(cuid())
  name       String     @db.VarChar(100)
  email      String     @db.VarChar(255)
  image      String?    @db.VarChar(500)
  createdAt  DateTime   @default(now()) @db.Timestamp(6) @map("created_at")
  updatedAt  DateTime   @default(now()) @db.Timestamp(6) @updatedAt @map("updated_at")

  accounts   Account[]
  sessions   Session[]

  @@index([name], map: "users_name_idx")
  @@unique([email], map: "users_email_uq_idx")
  @@map("users")
}

model Account {
  id         String  @id @db.VarChar(24) @default(cuid())
  userId     String  @db.VarChar(24) @map("user_id")
  provider   String  @db.VarChar(50)
  accountId  String  @db.VarChar(100) @map("account_id")
  password   String?

  users      User    @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "accounts_user_id_users_id_fk")

  @@index([userId], map: "accounts_user_id_idx")
  @@unique([provider, accountId], map: "accounts_provider_account_id_uq_idx")
  @@map("accounts")
}

// Remove this model if you use JWT strategy
model Session {
  id         String   @id @db.VarChar(24)
  userId     String   @db.VarChar(24) @map("user_id")
  token      String   @db.VarChar(64)
  expiresAt  DateTime @db.Timestamp(6) @map("expires_at")
  ipAddress  String?  @db.VarChar(45) @map("ip_address")
  userAgent  String?  @map("user_agent")

  users      User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "sessions_user_id_users_id_fk")

  @@index([userId], map: "sessions_user_id_idx")
  @@unique([id, token], map: "sessions_id_token_uq_idx")
  @@map("sessions")
}
