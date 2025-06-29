import emailjs from "@emailjs/browser";

export const sendRegistrationEmail = async (params: {
    toEmail: string;
    responsiblePerson: string;
    organizationName: string;
  }) => {
    const { toEmail, responsiblePerson, organizationName } = params;
  
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  
    if (!serviceId || !templateId || !publicKey) {
    throw new Error("Missing EmailJS environment variables.");
  }
  
    try {
      const res = await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: toEmail,
          responsiblePerson: responsiblePerson,
          organizationName: organizationName,
          from_name: "QRendence",
        },
        publicKey
      );
  
      return { success: true, response: res };
    } catch (err) {
      console.error("EmailJS error:", err);
  
      return { success: false, error: err };
    }
  };
  