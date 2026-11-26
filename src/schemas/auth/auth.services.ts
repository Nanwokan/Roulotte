export function getSessionKeyFromRequest(req: Express.Request) {
  return req.headers["x-session-key"] as string;
}   