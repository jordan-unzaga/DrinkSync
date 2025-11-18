// src/routes/auth.routes.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db"; // your mysql2 pool

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Helper: find user by username OR email
async function findUserByUsernameOrEmail(identifier: string) {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
        [identifier, identifier]
    );
    // @ts-ignore
    return rows[0] || null;
}

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const existing = await findUserByUsernameOrEmail(username) ||
            await findUserByUsernameOrEmail(email);
        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            [username, email, hash]
        );
        // @ts-ignore
        const userId = result.insertId as number;

        const token = jwt.sign({ id: userId, username, email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(201).json({
            token,
            user: { id: userId, username, email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { identifier, password } = req.body; // username OR email

        if (!identifier || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const user = await findUserByUsernameOrEmail(identifier);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: { id: user.id, username: user.username, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
