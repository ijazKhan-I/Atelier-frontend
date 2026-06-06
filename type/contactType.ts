import type { StrapiImage } from "@/type/shopType";

/** Form labels and placeholders (Strapi: form component). */
export type ContactFormFields = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
};

/** Email, phone, and section headings (Strapi: directContact component). */
export type ContactDirectInfo = {
  directHeading: string;
  email: string;
  phone: string;
  socialsHeading: string;
};

export type ContactSocialLink = {
  id?: number;
  label: string;
  url: string;
};

export type ContactStoreLocation = {
  id?: number;
  city: string;
  address: string;
  country: string;
  hoursLabel: string;
  hoursTime: string;
};

/** Raw shape from GET /api/contact-page (Strapi single type). */
export type ContactPage = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  form: ContactFormFields;
  officeImage?: StrapiImage | null;
  directContact: ContactDirectInfo;
  socialLinks: ContactSocialLink[];
  locationsHeading: string;
  locations: ContactStoreLocation[];
};

/** Normalized data passed into ContactClient. */
export type ContactPageContent = {
  title: string;
  description: string;
  form: ContactFormFields;
  officeImageUrl: string;
  directContact: ContactDirectInfo;
  socialLinks: ContactSocialLink[];
  locationsHeading: string;
  locations: ContactStoreLocation[];
};

/** Response from POST /api/contact-inquiries/submit */
export type SubmitInquiryResponse = {
  data: {
    inquiryNumber: string;
    message: string;
  };
};

export type SubmitInquiryInput = {
  name: string;
  email: string;
  message: string;
};

export type SubmitInquiryResult =
  | { ok: true; inquiryNumber: string; message: string }
  | { ok: false; error: string };
