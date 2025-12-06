const Post = require("../models/Post");

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1});
        res.json(posts);
    } catch(error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error'});
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch(error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createPost = async (req, res) => {
    const {title, author, excerpt, content, imageUrl} = req.body;

    if(!title || !author || !excerpt || !content) {
        return res.status(400).json({message: "Please fill in all the required fields"});
    }

    try {
        const newPost = new Post({
            title,
            author,
            excerpt,
            content,
            imageUrl,
            createdAt: new Date()
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch(error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error'});
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted successfully' });
    } catch(error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
