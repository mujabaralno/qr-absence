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
import { useState, useEffect, useCallback } from "react";
import { FileUploader } from "../shared/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";

import {
  createOrganization,
  updateOrganization,
} from "@/actions/organization.actions";
import { IOrganization } from "@/lib/database/models/organization.model";
import { updateMailRequestStatus } from "@/actions/mailRequest.action";

interface PrefilledData {
  organizationName: string;
  responsiblePerson: string;
  adminEmail: string; 
  origin: string;
  description: string;
  imageUrl: string;
}

type CreateOrganizationFormProps = {
  type: "Create" | "Update";
  organization?: IOrganization;
  organizationId?: string;
  prefilledData?: PrefilledData | null;
  requestId?: string | null;
};

const FormCreateOrganization = ({
  type,
  organization,
  organizationId,
  prefilledData,
  requestId,
}: CreateOrganizationFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");

  // Use useCallback to memoize getInitialValues
  const getInitialValues = useCallback(() => {
    if (prefilledData) {
      return {
        organizationName: prefilledData.organizationName || "",
        responsiblePerson: prefilledData.responsiblePerson || "",
        adminEmail: prefilledData.adminEmail || "",
        origin: prefilledData.origin || "",
        description: prefilledData.description || "",
        imageUrl: prefilledData.imageUrl || "",
      };
    }
  
    if (organization && type === "Update") {
      return {
        ...organization,
      };
    }
  
    return createOrganizationDefaultValues;
  }, [prefilledData, organization, type]);

  const initialValues = getInitialValues();

  const form = useForm<z.infer<typeof createOrganizationFromSchema>>({
    resolver: zodResolver(createOrganizationFromSchema),
    defaultValues: initialValues,
  });

  // Reset form when prefilledData changes - with complete dependencies
  useEffect(() => {
    if (prefilledData) {
      form.reset(getInitialValues());
    }
  }, [prefilledData, form, getInitialValues]);

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

          // If this was created from a request, you might want to update the request status
          if (requestId) {
            try {
              await updateMailRequestStatus({
                mailId: requestId,
                approved: true,
                organizationCreated: true, 
                path: "/superadmin/organization-request",
              });
              console.log(
                `Organization created and request ${requestId} marked as completed`
              );
            } catch (error) {
              console.error("Error updating mail request status:", error);
            }
          }

          router.push(`/superadmin/organization-management/${newOrganization._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      try {
        const updatedOrganization = await updateOrganization({
          organization: {
            ...values, imageUrl: uploadedImageUrl,
            _id: ""
          },
          path: `/superadmin/organization-management/${organizationId}`,
        });

        if (updatedOrganization) {
          form.reset();
          router.push(`/superadmin/organization-management/${updatedOrganization._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Show notification if data is prefilled */}
      {prefilledData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="text-blue-600">ℹ️</div>
            <div>
              <h4 className="font-medium text-blue-900">
                Data dari Email Request
              </h4>
              <p className="text-sm text-blue-700">
                Form telah diisi otomatis dengan data dari email request. Anda
                dapat mengubah data sesuai kebutuhan.
              </p>
            </div>
          </div>
        </div>
      )}

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
            name="adminEmail"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Admin Email"
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
            {
              form.formState.isSubmitting
                ? "Creating Organization..."
                : requestId
                ? "✅ Approve & Create Organization" // Jika dari request
                : `${type} Organization` // Jika biasa
            }
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FormCreateOrganization;