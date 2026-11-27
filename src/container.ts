import { createAuth } from "./fourni/auth/index.js";
import { userRepository } from "./repositories/user.repository.js";

export function createContainer() {
  const auth = createAuth({
    users: userRepository,
    jwtSecret: process.env.JWT_SECRET!,      // 16 caractères au moins, lu dans .env
    jwtExpiresIn: process.env.JWT_EXPIRES_IN, // facultatif, "2h" par défaut
  });
  // … puis renvoyez `auth` avec le reste du container
  return {
    auth,
  };
}

export type container = ReturnType<typeof createContainer>;
