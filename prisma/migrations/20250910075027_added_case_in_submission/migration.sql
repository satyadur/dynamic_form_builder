-- DropForeignKey
ALTER TABLE "public"."FormSubmission" DROP CONSTRAINT "FormSubmission_formId_fkey";

-- AddForeignKey
ALTER TABLE "public"."FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
