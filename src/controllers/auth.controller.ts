import { prisma } from "../lib/prisma.js";
import { loginSchema } from "../schemas/auth/login.schema.js";
import bcrypt from "bcryptjs";
import { registerSchema } from "../schemas/auth/register.schema.js";
import { signToken } from "../fourni/auth/crypto.js";
import { AuthHttpError } from "../fourni/auth/errors.js";
export async function login(req, res) {
  try {
    // Implement your login logic here
    const result = await loginSchema.safeParseAsync(req.body);

    if (!result.success) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const userLoginInfo = {
      email: result.data.email,
      password: result.data.password,
    };

    const isExisting = await prisma.user.findUnique({
      where: {
        email: userLoginInfo.email,
      },
    });
    // For demonstration purposes, let's assume a simple check for email and password
    // Validate the email and password

    const isPasswordValid = await bcrypt.compare(
      userLoginInfo.password,
      isExisting.passwordHash,
    );
    if (!isExisting || !isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(
      { id: isExisting.id, role: isExisting.role },
      process.env.SECRET_JWT!,
      "1h",
    );

    // If the email and password are valid, return a success response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: isExisting.id,
        email: isExisting.email,
        name: isExisting.name,
        role: isExisting.role,
      },
    });
  } catch (error) {
    console.error("Error fetching login info:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
}

export async function register(req, res) {
  try {
    // Implement your registration logic here
    const result = await registerSchema.safeParseAsync(req.body);

    if (!result.success) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const hashPassword = await bcrypt.hash(result.data.password, 10);

    const userRegisterInfo = {
      name: result.data.name,
      email: result.data.email,
      passwordHash: hashPassword,
    };

    const user = await prisma.user.create({
      data: userRegisterInfo,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "Failed to register" });
  }
}

export async function me(req, res) {
  try {
    // Implement your "get current user" logic here

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      throw new AuthHttpError(404, "USER_NOT_FOUND", "User not found");
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error during fetching user info:", error);
    return res.status(500).json({ error: "Failed to fetch user info" });
  }
}
