import express from "express";
import mongoose from 'mongoose';
import { login, register, getMe } from './controllers/UserController.js'
import { createPost, getAllPosts, getSinglePost, deletePost, updatePost, getLastTags } from './controllers/PostController.js'
import checkAuth from "./utils/checkAuth.js";
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import multer from "multer";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import cors from 'cors';

mongoose
    .connect(process.env.MONGODB_URI)
    // mongodb+srv://nargiz:123@cluster0.t4fryak.mongodb.net/blog?retryWrites=true&w=majority
    .then(() => console.log("DB ok"))
    .catch(err => console.log('DB error', err))
const app = express()

app.use(express.json())
app.use(cors());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer({ storage })
app.post("/upload", checkAuth, upload.single("file"), (req, res) => {
    res.status(200).json({
        url: `/uploads/${req.file.originalname}`
    });
});

// AUTH
app.post("/auth/login", loginValidation, handleValidationErrors, login)
app.post("/auth/register", registerValidation, handleValidationErrors, register)
app.get("/auth/me", checkAuth, getMe)

// POSTS
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, createPost)
app.get("/posts", getAllPosts)
app.get("/tags", getLastTags)
app.get("/posts/tags", getLastTags)
app.get("/posts/:id", getSinglePost)
app.delete("/posts/:id", checkAuth, deletePost)
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, updatePost)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("SERVER OK");
})
