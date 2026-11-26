// controllers/auth.controller.ts
import { loginSchema } from "../schemas/auth/login.schema.js";
import { registerSchema } from "../schemas/auth/register.schema.js";
import { AuthHttpError } from "../fourni/auth/errors.js";
import { loginUser, registerUser, getCurrentUser } from "../services/auth.service.js";

function handleError(res, error, fallbackMessage: string) {
  if (error instanceof AuthHttpError) {
    return res.status(error.status).json({ error: error.message });
  }
  console.error(fallbackMessage, error);
  return res.status(500).json({ error: fallbackMessage });
}

export async function login(req, res) {
  try {
    const result = await loginSchema.safeParseAsync(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const { token, user } = await loginUser(result.data.email, result.data.password);
    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    return handleError(res, error, "Failed to login");
  }
}

export async function register(req, res) {
  try {
    const result = await registerSchema.safeParseAsync(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const user = await registerUser(result.data);
    return res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    return handleError(res, error, "Failed to register");
  }
}

export async function me(req, res) {
  try {
    const user = await getCurrentUser(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error, "Failed to fetch user info");
  }
}