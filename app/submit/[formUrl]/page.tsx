import { GetFormControlByUrl } from "@/actions/form";
import { FormElementInstance } from "@/components/FormElements";
import FormSubmitComponent from "@/components/FormSubmitComponent";
import React from "react";

async function SubmitPag({ params }: { params: Promise<{ formUrl: string }> }) {
  const { formUrl } = await params;
  const form = await GetFormControlByUrl(formUrl);

  if (!form) {
    throw new Error("form not found");
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  return <FormSubmitComponent formUrl={formUrl} content={formContent} />;
}

export default SubmitPag;
