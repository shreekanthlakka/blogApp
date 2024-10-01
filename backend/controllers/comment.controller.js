import Comment from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import { CustomResponse } from "../utils/customResponse.js";

const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const createComment = await Comment.create({
        content,
        authorId: req.user._id,
        postId,
    });
    if (!createComment) {
        throw new CustomError(400, "failed to create comment");
    }
    const comment = await Comment.findById(createComment._id).populate(
        "authorId",
        ["username", "email"]
    );
    res.status(201).json(
        new CustomResponse(201, "comment created sucessfully", comment)
    );
});

const getAllComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).populate("authorId", [
        "username",
        "email",
    ]);
    if (!comments) {
        throw new CustomError(400, "no comments");
    }
    res.status(200).json(
        new CustomResponse(200, "comments fetched successfully", comments)
    );
});

const getSingleCommentByPostId = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;
    const comment = await Comment.find({ _id: commentId, postId }).populate(
        "authorId",
        ["username", "email"]
    );
    if (!comment) {
        throw new CustomError(400, "no comments");
    }
    res.status(200).json(
        new CustomResponse(200, "comment fetched successfully", comment)
    );
});

const updateSingleCommentByPostId = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            postId,
        },
        { content },
        { new: true }
    );
    if (!comment) {
        throw new CustomError(400, "failed to get updated comment");
    }
    // const updatedComment = await Comment.findByIdAndUpdate(
    //     comment._id,
    //     { content },
    //     { new: true }
    // );
    // if (!updatedComment) {
    //     throw new CustomError(400, "failed to get updated comment");
    // }
    res.status(200).json(
        new CustomResponse(200, "comment updated successfully", comment)
    );
});

const deleteSingleCommentByPostId = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;
    const comment = await Comment.findOneAndDelete({ _id: commentId, postId });
    if (!comment) {
        throw new CustomError(400, "no comments");
    }
    // const deletedComment = await Comment.findOneAndDelete({ _id: comment._id });
    // console.log("deletedComment ------>", deletedComment);
    // if (!deletedComment) {
    //     throw new CustomError(400, "failed to delete comment");
    // }

    res.status(200).json(
        new CustomResponse(200, "comment deleted successfully", comment)
    );
});

export {
    createComment,
    getAllComments,
    getSingleCommentByPostId,
    updateSingleCommentByPostId,
    deleteSingleCommentByPostId,
};
