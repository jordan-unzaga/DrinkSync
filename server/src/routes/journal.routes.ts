import { Router, Request, Response } from "express";
import { pool } from "../db";
import { authGuard } from "../middleware/authGuard";


const router = Router();

// POST /api/journal/entries
router.post("/entries", authGuard, async (req: Request, res: Response) => {
    try {
        const user = req.user!;
        const { apiDrinkId, apiSource, notes, rating, drankAt } = req.body;

        if (!apiDrinkId || !apiSource) {
            return res.status(400).json({ message: "Missing drink info" });
        }

        const [result] = await pool.execute(
            `INSERT INTO drink_journal_entries
       (user_id, api_drink_id, api_source, notes, rating, drank_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                user.id,
                apiDrinkId,
                apiSource,
                notes || null,
                rating ?? null,
                drankAt || new Date()
            ]
        );

        const insertResult = result as any;
        const id = insertResult.insertId;

        res.status(201).json({ id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/journal/entries
router.get("/entries", authGuard, async (req: Request, res: Response) => {
    try {
        const user = req.user!;

        const [rows] = await pool.execute(
            `SELECT id, api_drink_id, api_source, notes, rating, drank_at, created_at
       FROM drink_journal_entries
       WHERE user_id = ?
       ORDER BY drank_at DESC`,
            [user.id]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
