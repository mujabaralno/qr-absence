import { model, models, Schema } from "mongoose";


export interface IMailRequest extends Document {
  _id: string;
  email: string;
  subjectMail: string;
  organizationName: string;
  responsiblePerson: string;
  organizationPhoto: string;
  origin: string;
  approved: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const mailRequestSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subjectMail: {
    type: String,
    required: true
  },
  organizationName: {
    type: String,
    required: true
  },
  responsiblePerson: {
    type: String,
    required: true
  },
  organizationPhoto: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true
  }
},{
    timestamps: true
});

const MailRequest = models.MailRequest || model("MailRequest", mailRequestSchema);

export default MailRequest;