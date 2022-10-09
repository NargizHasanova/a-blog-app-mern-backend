import PostModel from '../models/Post.js'

//GET ALL POSTS
export const getAllPosts = async (req, res) => {
    try {
        let posts = await PostModel.find().populate('user').exec() // userle elagelendirdi
        return res.json(posts)
    } catch (err) {
        return res.status(500).json({
            message: 'could not get all posts',
            error: err.message,
        })
    }
}

// CREATE POST
export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        return res.json(post);
    } catch (err) {
        return res.status(500).json({
            error: err.message,
            message: 'Не удалось создать статью',
        });
    }
};

// GET SINGLE POST
export const getSinglePost = async (req, res) => {
    try {
        const postId = req.params.id
        PostModel.findOneAndUpdate( // bunun evvelinde await yazanda error gelir
        // Can't set headers after they are sent to the client
            { _id: postId },
            { $inc: { viewsCount: 1 } }, // uvelich viewsCount na 1 
            { returnDocument: 'after' },  // verni document tolko posle obnovleniy
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью',
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    });
                }
                return res.json(doc)
            }
        ).populate('user');
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
}

// DELETE POST
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить статью',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    });
                }

                res.json({
                    success: true,
                });
            },
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

// UPDATE POST
export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.findByIdAndUpdate(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            }
        )
        return res.json({
            success: true,
            message: "updated successfuly"
        })


    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};

// GET TAGS
export const getLastTags = async (req, res) => {
    try {
        let posts = await PostModel.find().limit(5).exec()
        const tags = posts.map((obj) => obj.tags).flat().slice(0, 5)
        return res.json(tags)
    } catch (err) {
        return res.status(500).json({
            message: 'could not get tags',
            error: err.message,
        })
    }
}