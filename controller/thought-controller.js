const { User, Thought } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThought => res.json(dbThought))
        .catch(err => {res.status(400).json(err)})
    },
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .select('-__v')
        .then(dbThought => res.json(dbThought))
        .catch(err => {res.status(400).json(err)})
    },
    createThought({ body }, res) {
        Thought.create(body)
        .then(dbThought => {
            User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: dbThought._id } },
                { new: true }
            )
            .then(dbUser => {
                if (!dbUser) {
                    res.status(404).json({ message: 'Nothing found' });
                    return;
                }
                res.json(dbUser);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    },
    updateThought({ params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbThought => {
            if (!dbThought) {
                res.status(404).json({ message: 'Nothing found'})
                return;
            }
            res.json(dbThought)
        })
        .catch(err => res.json(400).json(err))
    },
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThought => {
            if (!dbThought) {
                res.status(404).json({ message: 'Nothing found'})
                return;
            }
            res.json(dbThought)
        })
        .catch(err => res.json(err))
    },
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThought => {
            if (!dbThought) {
                res.status(404).json({ message: 'Nothing found '})
                return;
            }
            res.json(dbThought)
        })
        .catch((err) =>{ 
            res.json(err)
        });
    },
    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(dbThought => {
            if (!dbThought) {
                res.status(404).json({ message: 'Nothing found' });
                return;
            }
            res.json('All gone!');
        })
        .catch(err => res.json(err));
    },
};

module.exports = thoughtController;