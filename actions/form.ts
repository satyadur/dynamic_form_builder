"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schema/form";
import { auth } from "@clerk/nextjs/server";

export async function GetFormsStats() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const stats = prisma.form.aggregate({
    where: {
      userId: userId,
    },
    _sum: {
      visits: true,
      submission: true,
    },
  });

  const visits = (await stats)._sum.visits || 0;
  const submissions = (await stats)._sum.submission || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }
  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: userId,
      name,
      description,
    },
  });

  if (!form) {
    throw new Error("Something went wrong");
  }

  return form.id;
}

export async function GetForms() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.form.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
