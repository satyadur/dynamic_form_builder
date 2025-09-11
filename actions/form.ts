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
      submissions: true,
    },
  });

  const visits = (await stats)._sum.visits || 0;
  const submissions = (await stats)._sum.submissions || 0;

  let submissionRate = 0;
  let bounceRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
    bounceRate = 100 - submissionRate;
  }

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

export async function GetFormById(id: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.form.findUnique({
    where: {
      userId: userId,
      id: id,
    },
  });
  return result;
}

export async function UpdateFormContext(id: number, jsonContent: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.form.update({
    where: {
      userId: userId,
      id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishForm(id: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.form.update({
    data: {
      published: true,
    },
    where: {
      userId: userId,
      id,
    },
  });
}

export async function GetFormControlByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareURL: formUrl,
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmission: {
        create: {
          content,
        },
      },
    },
    where: {
      shareURL: formUrl,
      published: true,
    },
  });
}

export async function GetFormWithSubmissions(id: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.form.findUnique({
    where: {
      id,
    },
    include: {
      FormSubmission: true,
    },
  });
}

export async function DeleteForm(id: number) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.form.delete({
    where: {
      id,
      userId,
    },
  });
}

export async function getSubmissionsByFormId(formId: number) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const form = await prisma.form.findUnique({
    where: { id: formId, userId },
    include: { FormSubmission: true },
  })

  if (!form) return { form: null, submissions: [] }

  // parse submissions
  const submissions = form.FormSubmission.map((s) => {
    const content = JSON.parse(s.content)
    return {
      ...content,
      submittedAt: s.createdAt.toISOString(),
    }
  })

  return { form: JSON.parse(form.content), submissions }
}

export async function DeleteSubmissions(ids: number[]) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!ids || ids.length === 0) {
    throw new Error("No submission IDs provided");
  }

  // Ensure submissions belong to forms owned by this user
  await prisma.formSubmission.deleteMany({
    where: {
      id: { in: ids },
      form: {
        userId: userId,
      },
    },
  });

  return { success: true };
}