import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type File = {
	name: string;
	url: string;
	userId: string;
	type: string;
};

export const findByUserId = async (userId: string) => {
	return prisma.file.findMany({
		where: { userId },
		include: { user: true },
	});
};

export const create = async (file: File) => {
	return prisma.file.create({
		data: file,
	});
};

export const update = async (id: string, file: File) => {
	return prisma.file.update({
		where: { id },
		data: file,
	});
};
