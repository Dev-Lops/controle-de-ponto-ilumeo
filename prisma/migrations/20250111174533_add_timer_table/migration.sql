-- CreateTable
CREATE TABLE "Timer" (
    "user_code" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Timer_user_code_key" ON "Timer"("user_code");
