import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const writeStreem = fs.createWriteStream(path.join(__dirname, "access.log"), {
    flags: "a",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: writeStreem }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.ip} - ${req.method} - ${req.url} - ${new Date()}`);
    next();
});

const allowedOrigins = [
    "http://localhost:5173",
    "https://blog-app-dun-five.vercel.app",
];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", true);
    }

    res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE ,PATCH"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization "
    );

    next();
});

app.get("/api/v1/test", (req, res) => {
    res.json({ message: "All Good" });
});

import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import profileRoutes from "./routes/profile.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/profile", profileRoutes);

export default app;
