import { postData } from "@/app/api/strapi";
import type {
  SubscribeNewsletterInput,
  SubscribeNewsletterResponse,
  SubscribeNewsletterResult,
} from "@/type/newsletterType";

/**
 * Home page newsletter signup.
 * Saves the email in Strapi and notifies the admin.
 */
export async function subscribeNewsletter(
  input: SubscribeNewsletterInput
): Promise<SubscribeNewsletterResult> {
  const response = await postData<SubscribeNewsletterResponse>(
    "/api/newsletter-subscribers/subscribe",
    {
      data: {
        email: input.email.trim(),
      },
    }
  );

  if (!response?.data?.message) {
    return {
      ok: false,
      error: "Could not subscribe right now. Please try again.",
    };
  }

  return {
    ok: true,
    message: response.data.message,
    alreadySubscribed: response.data.alreadySubscribed,
  };
}
