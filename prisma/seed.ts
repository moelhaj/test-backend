import { PrismaClient, User } from "@prisma/client";
import { hash, compare } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	await prisma.user.upsert({
		where: { email: "test.account@filemanament.com" },
		update: {},
		create: {
			email: "test.account@filemanament.com",
			name: "Test Account",
			password: await hash("password", 10),
		},
	});
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
