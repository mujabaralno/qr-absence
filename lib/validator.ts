import * as z from "zod";

export const createOrganizationFromSchema = z.object({
  organizationName: z
    .string()
    .min(3, "Organization Name must be at least 3 characters"),
    adminEmail: z
    .string()
    .min(3, "Organization Name must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description must be less than 500 characters"),
  imageUrl: z.string(),
  responsiblePerson: z
    .string()
    .min(3, "Responsible Person must be at least 3 characters"),
  origin: z.string().min(3, "Responsible Person must be at least 3 characters"),
});

export const attendanceSessionFormSchema = z.object({
  sessionName: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(400, "Description must be less than 400 characters"),
  locationMeeting: z.object({
    address: z.string().min(3, "Address must be at least 3 characters"),
    lat: z.number(),
    lng: z.number(),
  }),
  startTime: z.date(),
  endTime: z.date(),
});

export const CreateMailRequestFromSchema = z.object({
  email: z.string().email("Masukkan email yang valid"),
  subjectMail: z.string().min(5, "Subject must be at least 5 characters"),
  organizationName: z
    .string()
    .min(3, "Organization Name must be at least 3 characters"),
  origin: z.string().min(3, "Responsible Person must be at least 3 characters"),
  organizationPhoto: z.string(),
  responsiblePerson: z
    .string()
    .min(3, "Responsible Person must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description must be less than 500 characters"),
});
