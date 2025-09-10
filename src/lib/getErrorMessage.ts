export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (typeof err === "object" && err && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return fallback;
}
