import { Schema, model, models } from "mongoose";

export interface IOrganization extends Document {
  _id: string;
  organizationName: string,
  description: string,
  imageUrl: string
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
    }
  },
  {
    timestamps: true,
  }
);

const Organization = models?.Organization || model("Organization", OrganizationSchema);

export default Organization;
