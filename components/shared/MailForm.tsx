"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateMailRequestFromSchema } from "@/lib/validator";
import { createMailRequestDefaultValue } from "@/constants";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploader } from "../shared/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { createMailRequest } from "@/actions/mailRequest.action";
import { toast } from "sonner";
import { sendRegistrationEmail } from "@/actions/sendEmail";
import { Label } from "../ui/label";

const MailForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");
  const form = useForm<z.infer<typeof CreateMailRequestFromSchema>>({
    resolver: zodResolver(CreateMailRequestFromSchema),
    defaultValues: createMailRequestDefaultValue,
  });

  async function onSubmit(values: z.infer<typeof CreateMailRequestFromSchema>) {
    let uploadedImageUrl = values.organizationPhoto;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    const emailResult = await sendRegistrationEmail({
      toEmail: values.email,
      responsiblePerson: values.responsiblePerson,
      organizationName: values.organizationName,
    });

    if (emailResult.success) {
      toast.success("Email berhasil dikirim!");
    } else {
      toast.error("Gagal mengirim email.");
    }

    console.log("EmailJS result:", emailResult);

    try {
      const newOrganization = await createMailRequest({
        mail: { ...values, organizationPhoto: uploadedImageUrl },
        path: "/register/success",
      });

      if (newOrganization) {
        form.reset();
        router.push(
          `/register/success?org=${encodeURIComponent(values.organizationName)}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label htmlFor="email">
                Email<span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input placeholder="Email" {...field} className="input-field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subjectMail"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label htmlFor="subjectMail">
              Subject Mail<span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="Subject Email"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label htmlFor="organizationName">
                Nama Organisasi<span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="Nama organisasi"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsiblePerson"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label htmlFor="responsiblePerson">
                Penanggung Jawab<span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="Responsible Person"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label htmlFor="origin">
                Asal Organisasi<span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="Darimana organisasinya"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label htmlFor="description">
                Deskripsi Organisasi<span className="text-red-500">*</span>
              </Label>
              <FormControl className="h-72">
                <Textarea
                  placeholder="Description"
                  {...field}
                  className="textarea rounded-2xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizationPhoto"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label htmlFor="organizationPhoto">
                Logo Organisasi<span className="text-red-500">*</span>
              </Label>
              <FormControl className="h-72">
                <FileUploader
                  onFieldChange={field.onChange}
                  imageUrl={field.value}
                  setFiles={setFiles}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `Send Message`}
        </Button>
      </form>
    </Form>
  );
};

export default MailForm;
