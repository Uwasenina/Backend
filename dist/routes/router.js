"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { getBlogs,getBlog,deleteBlog,updateBlog, newBlog } from "../controllers/blogControllers";
const router = express_1.default.Router();
// router.get("/blogs", getBlogs);
// router.get("/blogs/:id", getBlog);
// router.post("/blogs", newBlog);
// router.put("/blogs/:id", updateBlog );
// router.delete("/blogs/:id", deleteBlog);
exports.default = router;
