/*
  Warnings:

  - You are about to drop the column `customername` on the `procustomer` table. All the data in the column will be lost.
  - You are about to drop the column `productname` on the `procustomer` table. All the data in the column will be lost.
  - Added the required column `productids` to the `procustomer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_procustomer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerid" TEXT NOT NULL,
    "productids" TEXT NOT NULL,
    "productcount" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_procustomer" ("createdAt", "customerid", "id", "productcount") SELECT "createdAt", "customerid", "id", "productcount" FROM "procustomer";
DROP TABLE "procustomer";
ALTER TABLE "new_procustomer" RENAME TO "procustomer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
