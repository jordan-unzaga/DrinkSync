import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

async function findUserByUsernameOrEmail(identifier: string) {
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
        [identifier, identifier]
    );
    const arr = rows as any[];
    return arr[0] || null;
}

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const existingByUsername = await findUserByUsernameOrEmail(username);
        const existingByEmail = await findUserByUsernameOrEmail(email);

        if (existingByUsername || existingByEmail) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            [username, email, hash]
        );

        const insertResult = result as any;
        const userId = insertResult.insertId as number;

        const token = jwt.sign({ id: userId, username, email }, JWT_SECRET, {
            expiresIn: "7d"
        });

        res.status(201).json({
            token,
            user: { id: userId, username, email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const user = await findUserByUsernameOrEmail(identifier);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const ok = await bcrypt.compare(password, (user as any).password_hash);
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
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
