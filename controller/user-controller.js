const { User } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .select('-__v')
        .then(dbUser => res.json(dbUser))
        .catch(err => {console.log(err);
        res.status(400).json(err)})
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        },
        {
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({ message: 'No user found with this ID! '});
                return;
            }
            res.json(dbUser);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    createUser({ body }, res) {
        User.create(body)
        .then(dbUser => res.json(dbUser))
        .catch(err => res.json(err));
    },
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({ message: 'No user found'});
                return;
            }
            res.json(dbUser)
        })
        .catch(err => res.status(400).json(err));
    },
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({ message: 'No user found' })
                return;
            }
            res.json(dbUser)
        })
        .catch(err => res.status(400).json(err))
    },
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id},
            { $addToSet: { friends: params.friendsId } },
            { new: true, runValidators: true }
        )
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({ message: 'No user found' })
                return;
            }
            res.json(dbUser)
        })
        .catch(err => res.json(err));
    },
    deleteFriend({ params}, res) {
        User.findOneAndUpdate(
            { _id: params.friendsId },
            {$pull: { friends: params.friendsId } },
            { new: true, runValidators: true }
        )
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({ message: 'No user found' })
                return;
            }
            res.json(dbUser)
        })
        .catch(err => res.json(err));
    }
 };

 module.exports = userController;