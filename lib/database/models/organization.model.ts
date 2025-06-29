import { Schema, model, models } from "mongoose";

export interface IOrganization extends Document {
  _id: string;
  organizationName: string;
  description: string;
  imageUrl: string;
  responsiblePerson: string; 
  adminEmail: string; // Tambahan email admin
  origin: string; 
  status: 'active' | 'inactive' | 'pending'; // Status organisasi
  memberCount: number; // Jumlah member
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema(
  {
    organizationName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    responsiblePerson: {
      type: String,
      required: true, 
    },
    adminEmail: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email"
      }
    },
    origin: {
      type: String,
      required: true, 
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending'
    },
    memberCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const Organization = models?.Organization || model("Organization", OrganizationSchema);

export default Organization;