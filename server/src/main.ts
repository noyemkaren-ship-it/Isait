import express, { Request, Response } from "express";
import { Eta } from "eta";
import path from "path";
import { print } from "./log/log";
import { encrypt, decrypt } from "./auth/token";
import cookieParser from 'cookie-parser';
import router from "./router/router";
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const eta = new Eta({
  views: path.join(__dirname, "../views"),
  cache: false
});

app.get("/login/worker", (req: Request, res: Response) => {
  const html = eta.render("./login.eta", { error: req.query.error || "" });
  res.send(html);
});

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "1asdasd-asdasdasd=asdadsad") {
    res.cookie('role', encrypt("admin"), {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    });
    print("✅ Успешный вход администратора");
    return res.redirect("/admin/panel");
  }
  print("❌ Неверный логин или пароль");
  res.redirect("/login/worker?error=Неверный_логин_или_пароль");
});

app.get("/admin/panel", (req: Request, res: Response) => {
  try {
    const role = decrypt(req.cookies.role);
    if (role === "admin") {
      const html = eta.render("./index.eta", { name: "Карен" });
      return res.send(html);
    }
  } catch (e) {
    console.error("Auth error:", e);
  }
  res.redirect("/login/worker");
});

app.get("/logout", (req, res) => {
  res.clearCookie('role');
  res.redirect("/login/worker");
});

app.use(router)
app.listen(3000, () => {
  console.log("🚀 СЕРВЕР ЗАПУЩЕН → http://localhost:3000/login/worker");
});