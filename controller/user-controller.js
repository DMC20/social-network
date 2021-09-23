const { User, Thought } = require('../models');

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
            path: 'thoughts'
        })
        .populate({
            path: 'friends'
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
            return Thought.deleteMany({_id: { $in: dbUser.thoughts}});
        }).then(()=>{
            res.json('Bye bye!!!')
        })
        .catch(err => res.status(400).json(err))
    },
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({ message: 'No user found' })
                return;
            }
            res.json(dbUser)
        })
        .catch(err => console.log(err));
    },
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: 'No user found '})
                return;
            }
            res.json(dbData)
        }) 
        .catch(err => res.json(err))
    }
 };

 module.exports = userController;