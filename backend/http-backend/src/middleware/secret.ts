/** HMAC secret for JWT sign/verify. Prefer `JWT_SECRET`; `jwt_secret` is supported for compatibility. */
export const secret: string =
  process.env.JWT_SECRET ?? process.env.jwt_secret ?? "12322";