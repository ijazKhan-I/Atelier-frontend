export type SubscribeNewsletterInput = {
  email: string;
};

export type SubscribeNewsletterResponse = {
  data: {
    email: string;
    message: string;
    alreadySubscribed?: boolean;
  };
};

export type SubscribeNewsletterResult =
  | { ok: true; message: string; alreadySubscribed?: boolean }
  | { ok: false; error: string };
