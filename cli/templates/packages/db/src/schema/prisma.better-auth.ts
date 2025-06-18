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
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false) @map("email_verified")
  image         String?
  createdAt     DateTime  @map("created_at")
  updatedAt     DateTime  @map("updated_at")
  sessions      Session[]
  accounts      Account[]

  @@map("user")
}

model Session {
  id        String   @id
  userId    String   @map("user_id")
  token     String
  expiresAt DateTime @map("expires_at")
  ipAddress String?  @map("ip_address")
  userAgent String?  @map("user_agent")
  createdAt DateTime @map("created_at")
  updatedAt DateTime @map("updated_at")
  user      User     @relation(fields: [userId], references: [id])

  @@map("session")
}

model Account {
  id                     String    @id
  userId                 String    @map("user_id")
  accountId              String    @map("account_id")
  providerId             String    @map("provider_id")
  accessToken            String?   @map("access_token")
  refreshToken           String?   @map("refresh_token")
  accessTokenExpiresAt   DateTime? @map("access_token_expires_at")
  refreshTokenExpiresAt  DateTime? @map("refresh_token_expires_at")
  scope                  String?
  idToken                String?   @map("id_token")
  password               String?
  createdAt              DateTime  @map("created_at")
  updatedAt              DateTime  @map("updated_at")
  user                   User      @relation(fields: [userId], references: [id])

  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime @map("expires_at")
  createdAt  DateTime @map("created_at")
  updatedAt  DateTime @map("updated_at")

  @@map("verification")
}
