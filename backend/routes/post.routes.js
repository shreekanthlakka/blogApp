import express from "express";
import { checkSchema } from "express-validator";
import {
    createPost,
    deletePost,
    getMyPosts,
    getPosts,
    getSinglePost,
    updatePost,
} from "../controllers/post.controller.js";
import { postValidationSchema } from "../validations/post.validationSchema.js";
import { uploadMemoryStorage } from "../middlewares/multer.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
    createComment,
    deleteSingleCommentByPostId,
    getAllComments,
    getSingleCommentByPostId,
    updateSingleCommentByPostId,
} from "../controllers/comment.controller.js";

const router = express.Router();

router
    .route("/")
    .post(
        isLoggedIn,
        // uploadMemoryStorage.fields([{ name: "featuredImage", maxCount: 1 }]),
        checkSchema(postValidationSchema),
        createPost
    )
    .get(isLoggedIn, getPosts);
router.route("/myposts").get(isLoggedIn, getMyPosts);

router
    .route("/:postId")
    .get(isLoggedIn, getSinglePost)
    .put(isLoggedIn, updatePost)
    .delete(isLoggedIn, deletePost);

router
    .route("/:postId/comments")
    .get(isLoggedIn, getAllComments)
    .post(isLoggedIn, createComment);

router
    .route("/:postId/comments/:commentId")
    .get(isLoggedIn, getSingleCommentByPostId)
    .put(isLoggedIn, updateSingleCommentByPostId)
    .delete(isLoggedIn, deleteSingleCommentByPostId);

export default router;
