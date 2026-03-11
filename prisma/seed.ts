import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Clearing existing orders...");
  await prisma.order.deleteMany();

  console.log("Creating seed orders...");
  const statuses = ["pending", "processing", "completed"] as const;
  const orders = Array.from({ length: 20 }, (_, i) => ({
    title: `test_order_${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1_000_000_000)),
  }));

  await prisma.order.createMany({
    data: orders,
  });

  console.log(`Inserted ${orders.length} orders.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
