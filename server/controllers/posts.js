import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import {
  fetchFindByIdData,
  fetchFindData,
} from "../utils/fetchPopulatedData.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { description, explanation } = req.body;
    const { id } = req.user;

    let post = {
      content: description,
      explanation,
      author: id,
      likes: {},
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Posts",
      });
      post.image = result.secure_url;
      post.imagePath = req.file.filename;
    }

    const newPost = new Post(post);
    const savedPost = await newPost.save();
    const populatedPost = await fetchFindByIdData(savedPost._id, {
      isDelete: false,
    });

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await fetchFindData({ isDelete: false });
    const sortedPosts = posts.sort((a, b) => b.createdAt - a.createdAt); // Sort posts by createdAt in descending order
    res.status(200).json(sortedPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await fetchFindData({ author: userId, isDelete: false });

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);

    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    const populatedPost = await fetchFindData({
      author: updatedPost.author,
      isDelete: false,
    });

    res.status(200).json(populatedPost[0]);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// ADD COMMENT
export const postComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, userId } = req.body;
    const post = await Post.findById(id);
    post.comments.unshift({ coment: comment, author: userId });
    const savedPost = await post.save();
    const populatedPost = await fetchFindByIdData(savedPost._id, {
      isDelete: false,
    });

    res.status(200).json(populatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndUpdate(postId, { isDelete: true }, { new: true });
    const populatedPost = await fetchFindData({ isDelete: false });
    res.status(200).json(populatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};