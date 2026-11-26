// services/auth.service.ts
import bcrypt from "bcryptjs";
import { signToken } from "../fourni/auth/crypto.js";
import { AuthHttpError } from "../fourni/auth/errors.js";
import { findUserByEmail, findUserById, createUser } from "../repositories/user.repository.js";

function toPublicUser(user: { id: number; email: string; name: string; role: string }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);

  // même message si l'email n'existe pas ou si le mot de passe est faux
  const isPasswordValid = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !isPasswordValid) {
    throw new AuthHttpError(401, "UNAUTHORIZED", "Invalid email or password");
  }

  const token = signToken({ id: user.id, role: user.role }, process.env.SECRET_JWT!, "1h");
  return { token, user: toPublicUser(user) };
}

export async function registerUser(data: { name: string; email: string; password: string }) {
  const passwordHash = await bcrypt.hash(data.password, 10);

  try {
    const user = await createUser({ name: data.name, email: data.email, passwordHash });
    return toPublicUser(user);
  } catch (error: any) {
    if (error?.code === "P2002") {
      throw new AuthHttpError(409, "CONFLICT", "Email already in use");
    }
    throw error;
  }
}

export async function getCurrentUser(id: number) {
  const user = await findUserById(id);
  if (!user) {
    throw new AuthHttpError(404, "USER_NOT_FOUND", "User not found");
  }
  return toPublicUser(user);
}