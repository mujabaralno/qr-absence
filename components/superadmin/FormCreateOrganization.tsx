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
import { createOrganizationFromSchema } from "@/lib/validator";
import * as z from "zod";
import { createOrganizationDefaultValues } from "@/constants";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploader } from "../shared/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";

import {
  createOrganization,
  updateOrganization,
} from "@/actions/organization.actions";
import { IOrganization } from "@/lib/database/models/organization.model";

type CreateOrganizationFormProps = {
  type: "Create" | "Update";
  organization?: IOrganization;
  organizationId?: string;
};

const FormCreateOrganization = ({
  type,
  organization,
  organizationId,
}: CreateOrganizationFormProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const intialValues =
    organization && type === "Update"
      ? {
          ...organization,
        }
      : createOrganizationDefaultValues;

  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof createOrganizationFromSchema>>({
    resolver: zodResolver(createOrganizationFromSchema),
    defaultValues: intialValues,
  });

  async function onSubmit(
    values: z.infer<typeof createOrganizationFromSchema>
  ) {
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    if (type === "Create") {
      try {
        const newOrganization = await createOrganization({
          organization: { ...values, imageUrl: uploadedImageUrl },
          path: "all-organizations",
        });

        if (newOrganization) {
          form.reset();
          router.push(`/all-organizations/${newOrganization._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      try {
        const updatedOrganization = await updateOrganization({
          organization: { ...values, imageUrl: uploadedImageUrl },
          path: `/all-organizations/${organizationId}`,
        });

        if (updatedOrganization) {
          form.reset();
          router.push(`/events/${updatedOrganization._id}`);
        }
      } catch (error) {
        console.log(error);
      }
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
          name="organizationName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Organization Name"
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
          name="imageUrl"
          render={({ field }) => (
            <FormItem className="w-full">
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
          {form.formState.isSubmitting ? "Submitting..." : `${type} Organization`}

        </Button>
      </form>
    </Form>
  );
};

export default FormCreateOrganization;
