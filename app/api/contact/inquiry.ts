import { postData } from "@/app/api/strapi";
import type { SubmitInquiryInput, SubmitInquiryResponse, SubmitInquiryResult } from "@/type/contactType";

/**
 * Submit the public contact form.
 * Saves the inquiry in Strapi and triggers an admin notification email.
 */
export async function submitContactInquiry(
  input: SubmitInquiryInput
): Promise<SubmitInquiryResult> {
  const response = await postData<SubmitInquiryResponse | { error?: { message?: string } }>(
    "/api/contact-inquiries/submit",
    {
      data: {
        name: input.name.trim(),
        email: input.email.trim(),
        message: input.message.trim(),
      },
    }
  );

  if (!response || !("data" in response) || !response.data?.inquiryNumber) {
    const apiMessage =
      response && "error" in response && response.error?.message
        ? response.error.message
        : "Could not send your inquiry. Please try again.";

    return { ok: false, error: apiMessage };
  }

  return {
    ok: true,
    inquiryNumber: response.data.inquiryNumber,
    message: response.data.message,
  };
}
