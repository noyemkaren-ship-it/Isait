import express, { Request, Response } from "express";
import { Eta } from "eta";
import path from "path";
import { print } from "./log/log";
import { encrypt, decrypt } from "./auth/token";
import cookieParser from 'cookie-parser';
import router from "./router/router";
import cors from "cors";
import { writeToFile } from "./log/file_log";
import fs from "fs";
import https from "https";

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ИСПРАВЛЕННЫЙ CORS - ДОБАВЛЕН ПОРТ 3000
app.use(cors({
  origin: [
    'http://46.253.132.225:8000',
    'http://46.253.132.225',
    'http://46.253.132.225:3000',      // ← ДОБАВИЛ
    'http://localhost:8000',
    'http://localhost:3000',            // ← ДОБАВИЛ
    'https://isaitff.ru',
    'https://www.isaitff.ru'
  ],
  credentials: true
}))

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
      sameSite: "lax",              // ← ИСПРАВИЛ НА lax
      path: "/",
    });
    print("✅ Успешный вход администратора");
    writeToFile("log.txt", " Успешный вход на /login")
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
      writeToFile("log.txt", " Вход на /admin/panel")
      return res.send(html);
      
    }
  } catch (e) {
    console.error("Auth error:", e);
  }
  res.redirect("/login/worker");
});


app.get('/admin/monitor', (req: Request, res: Response) => {
    try {
        const role = decrypt(req.cookies.role);
        
        if (role === 'admin') { 
            const paths = [
                path.join(__dirname, '..', 'db_log.txt'),
                path.join(__dirname, 'db_log.txt'),
            ];
            
            let filePath = paths.find(p => fs.existsSync(p)) || '';
            let content = 'Файл не найден';
            
            if (filePath) {
                content = fs.readFileSync(filePath, 'utf-8');
            }
            
            const html = eta.render('./monitor.eta', { logs: content });
            writeToFile('log.txt', 'Вход на /admin/monitor');
            return res.send(html);
        } else {
            return res.redirect('/login/worker');
        }
    } catch (e) {
        console.error('Auth error:', e);
        const html = eta.render('./monitor.eta', { logs: 'Ошибка: '});
        return res.send(html);
    }
});

app.get("/logout", (req: Request, res: Response) => {
  res.clearCookie('role');
  res.redirect("/login/worker");
  writeToFile("log.txt", "Успешный вход на /logout");
});

app.use(router)

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '../key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../cert.pem'))
};

https.createServer(httpsOptions, app).listen(3443, () => {
  console.log("🚀 HTTPS СЕРВЕР ЗАПУЩЕН → https://46.253.132.225:3443");
});

app.listen(3000, () => {
  console.log("🚀 HTTP СЕРВЕР ЗАПУЩЕН → http://localhost:3000");
});