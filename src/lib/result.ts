export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export const succeeded = (message: string): ActionResult => ({
  ok: true,
  message,
});

export const failed = (error: string): ActionResult => ({ ok: false, error });
