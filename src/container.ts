import { createAuth } from "./fourni/auth/index.js";

export function createContainer(
  repositories,
  config
) {
  const auth = createAuth({
    users: repositories.users,
    jwtSecret: config.JWT_SECRET,      // 16 caractères au moins, lu dans .env
    jwtExpiresIn: config.JWT_EXPIRES_IN, // facultatif, "2h" par défaut
  });
  // … puis renvoyez `auth` avec le reste du container
  return {
    auth,
    // … autres services et repositories
  };
}
