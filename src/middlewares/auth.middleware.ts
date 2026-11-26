import { verifyToken } from "../fourni/auth/crypto.js";
import { AuthHttpError } from "../fourni/auth/errors.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization ?? "";

  if (!header.startsWith("Bearer ")) {
    throw new AuthHttpError(401, "UNAUTHORIZED", "Authentification requise");
  }

  // lève déjà une 401 si le jeton est invalide ou expiré
  req.user = verifyToken(header.slice(7).trim(), process.env.SECRET_JWT!);
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AuthHttpError(403, "FORBIDDEN", "Rôle insuffisant")
    }
    next()
  };
}