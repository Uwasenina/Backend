import express from "express";
import { getBlogs,getBlog,deleteBlog,updateBlog, newBlog } from "../controllers/blogControllers";

const router = express.Router()
router.get("/blogs", getBlogs);
router.get("/blogs/:id", getBlog);
router.post("/blogs", newBlog);
router.put("/blogs/:id", updateBlog );
router.delete("/blogs/:id", deleteBlog);

export default router 