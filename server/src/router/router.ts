import { Router } from "express";
import { db } from "../db";
import { service, example, bid } from "../db/schema";
import { Request, Response } from "express";
import { print } from "../log/log";
import { decrypt } from "../auth/token";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";

const router = Router();

// ===================== MULTER =====================
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

// ===================== ADMIN CHECK =====================
const requireAdmin = (req: Request, res: Response, next: any) => {
  try {
    const role = decrypt(req.cookies?.role);
    if (role === "admin") return next();
  } catch (e) {}
  res.status(404).send("Not Found");
};

// ===================== HELPERS =====================
const getId = (param: any): number => {
  const idStr = Array.isArray(param) ? param[0] : param;
  const id = parseInt(idStr);
  return isNaN(id) ? 0 : id;
};

// ===================== SERVICES =====================
router.get("/services", async (req, res) => {
  const data = await db.select().from(service);
  res.json(data);
});

router.post("/admin/service", requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const imgLink = req.file ? `/uploads/${req.file.filename}` : '';
    const result = await db.insert(service).values({ name, description, imgLink }).returning();
    print("✅ Услуга добавлена");
    res.status(201).json(result[0]);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/admin/service/:id", requireAdmin, async (req, res) => {
  try {
    const id = getId(req.params.id);
    if (id === 0) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(service).where(eq(service.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ===================== EXAMPLES =====================
router.get("/examples", async (req, res) => {
  const data = await db.select().from(example);
  res.json(data);
});

router.post("/admin/example", requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    const imgLink = req.file ? `/uploads/${req.file.filename}` : '';
    const result = await db.insert(example).values({ description, imgLink }).returning();
    print("✅ Пример добавлен");
    res.status(201).json(result[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/admin/example/:id", requireAdmin, async (req, res) => {
  try {
    const id = getId(req.params.id);
    if (id === 0) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(example).where(eq(example.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ===================== BIDS =====================
router.post("/bid", async (req: Request, res: Response) => {
  try {
    const result = await db.insert(bid).values(req.body).returning();
    res.status(201).json(result[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/bids", requireAdmin, async (req, res) => {
  const data = await db.select().from(bid);
  res.json(data);
});

router.delete("/admin/bid/:id", requireAdmin, async (req, res) => {
  try {
    const id = getId(req.params.id);
    if (id === 0) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(bid).where(eq(bid.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;