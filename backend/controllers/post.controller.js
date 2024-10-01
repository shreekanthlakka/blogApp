import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import { CustomResponse } from "../utils/customResponse.js";
import {
    destroyFromCloudinary,
    uploadFromBuffer,
    uploadToCloudinary,
} from "../utils/uploadToCloudinary.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

const createPost = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "validation errors", errors.array()));
    }
    const resultUrls = [];
    // req.files.featuredImage.forEach(async (image) => {
    //     const result = await uploadToCloudinary(image.path);
    //     resultUrls.push({
    //         url: result.secure_url,
    //         public_id: result.public_id,
    //     });
    // });
    // for (let i = 0; i < req.files.featuredImage.length; i++) {
    //     const result = await uploadToCloudinary(
    //         req.files.featuredImage[i].path
    //     );
    //     resultUrls.push({
    //         url: result.secure_url,
    //         public_id: result.public_id,
    //     });
    // }

    // if (req.files.featuredImage.length > 0) {
    //     req.files.featuredImage.forEach(async (ele) => {
    //         const res = await uploadFromBuffer(ele);
    //         resultUrls.push({
    //             url: res.secure_url,
    //             public_id: res.public_id,
    //         });
    //     });
    // }

    const { title, content } = req.body;
    const post = await Post.create({
        title,
        content,
        // featuredImage: resultUrls,
        authorId: req.user._id,
    });
    if (!post) {
        throw new CustomError(400, "failed to create post");
    }
    const populatedPost = await Post.findById(post._id).populate("authorId", [
        "username",
        "email",
    ]);
    res.status(201).json(
        new CustomResponse(201, "Post created sucessfully", populatedPost)
    );
});

const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({}).populate("authorId", [
        "username",
        "email",
        "profilePic",
    ]);
    if (!posts) {
        throw new CustomError(400, "failed to get posts");
    }
    res.status(200).json(new CustomResponse(200, "all posts", posts));
});

const getSinglePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("authorId", [
        "username",
        "email",
    ]);
    if (!post) {
        throw new CustomError(400, "not able to find post");
    }
    res.status(200).json(new CustomResponse(200, "post by id", post));
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        throw new CustomError(400, "not able to delete the  post");
    }
    if (post.featuredImage.length) {
        for (let i = 0; i < post.featuredImage?.length; i++) {
            const res = await destroyFromCloudinary(post.featuredImage[i].url);
            console.log("RES => ", res);
        }
    }
    const commentsOfPosts = await Comment.deleteMany({
        authorId: req.user._id,
        postId: postId,
    });
    if (!commentsOfPosts) {
        throw new CustomError(
            400,
            "not able to find and delete comments of post"
        );
    }
    await Post.deleteOne({ _id: postId });
    res.status(200).json(
        new CustomResponse(200, "post deleted sucessfully", {})
    );
});

const updatePost = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "validation errors", errors.array()));
    }
    const { postId } = req.params;
    const post = await Post.findByIdAndUpdate(postId, req.body, { new: true });
    if (!post) {
        throw new CustomError(400, "failed to update post");
    }
    res.status(200).json(new CustomResponse(200, "updated post", post));
});

const getMyPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ authorId: req.user._id }).populate(
        "authorId",
        ["username", "email"]
    );
    if (!posts) {
        throw new CustomError(404, "no posts");
    }
    res.status(200).json(new CustomResponse(200, "all posts by user", posts));
});

export {
    createPost,
    getPosts,
    getSinglePost,
    deletePost,
    updatePost,
    getMyPosts,
};
