import { PrismaClient } from "@prisma/client";
import { createApp, type ProductRepository } from "./app.js";

const port = Number(process.env.PORT ?? 3001);
const prisma = new PrismaClient();
const app = createApp(prisma as unknown as ProductRepository);

const server = app.listen(port, () => {
  console.log(`WebMCP Vision API listening on port ${port}`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}; shutting down.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
