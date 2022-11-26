const bcrypt = require('bcrypt');
const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    //const { id } = req.body;
    const { id } = req.params;
    if (!id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${id} not found` });
    }
    res.json(user);
}

const editUser = async (req, res) =>{
    const { id } = req.params;
    console.log('------------edit user form body -------')
    console.log(req.body);
    if (!id) return res.status(400).json({ "message": 'User ID required' });
    console.log(id);
    const user = await User.findOne({ _id: id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${id} not found` });
    }

    if (req.body.password && req.body.passwordConfirmation) {
        console.log('Reset Password requested!');
        //hash new password:
        //const hashedPwd = await bcrypt.hash(pwd, 12);
    } else {
        delete req.body.password;
        delete req.body.passwordConfirmation;
    }  
    console.log(req.body);
    let response = await User.updateOne({_id: id},req.body)
   // let response = await user.save();

    console.log(response);
    //Update the user on the data base
    res.json(user);
}

module.exports = {
    getAllUsers,  
    getUser,
    editUser,
    deleteUser
}