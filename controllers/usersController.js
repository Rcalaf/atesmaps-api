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
    const { id, populate } = req.params;
    if (!id) return res.status(400).json({ "message": 'User ID required' });
    let user;
    if (populate) user = await User.findOne({ _id: id }).populate('observations').populate('payments').exec();  
    else user = await User.findOne({ _id: id }).exec();  

    if (!user) {
        return res.status(204).json({ 'message': `User ID ${id} not found` });
    }
    res.json(user);
}


const editUser = async (req, res) =>{
    const { id } = req.params;
    //console.log('------------edit user form body -------')
    //console.log(req.body);
    if (!id) return res.status(400).json({ "message": 'User ID required' });
    // console.log(id);
    const user = await User.findOne({ _id: id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${id} not found` });
    }

    if (req.body.password && req.body.passwordConfirmation) {
        console.log('Reset Password requested!');
        //hash new password:
        try {
            let newPwd = req.body.password;
            req.body.password = await bcrypt.hash(newPwd, 12);
        } catch (e) {
            console.log('Update user password failed!')
            console.log(e);
            delete req.body.password;
            delete req.body.passwordConfirmation;
        }
    } else {
        delete req.body.password;
        delete req.body.passwordConfirmation;
    }  
   
    req.body.status = false;
    if( req.body.gender 
        && req.body.professionalOrientation 
        && req.body.snowEducationLevel 
        && req.body.snowExperienceLevel 
        && req.body.avalanchExposure 
        && req.body.terrainType
        && req.body.conditionsType) req.body.status = true;
    
    if (req.body.blocked){
        user.blocked = true;
        user.name = "Anonimous";
        user.lastName = "";
        user.email = user._id+"@anonimous";
    } else{
        if (req.body.name) user.name = req.body.name;
        if (req.body.lastName) user.lastName = req.body.lastName;
        if (req.body.username) user.username = req.body.username;
        if (req.body.gender) user.gender = req.body.gender;
        if (req.body.professionalOrientation) user.professionalOrientation = req.body.professionalOrientation 
        if (req.body.snowEducationLevel) user.snowEducationLevel = req.body.snowEducationLevel 
        if (req.body.snowExperienceLevel) user.snowExperienceLevel = req.body.snowExperienceLevel 
        if (req.body.avalanchExposure) user.avalanchExposure = req.body.avalanchExposure 
        if (req.body.terrainType) user.terrainType = req.body.terrainType
        if (req.body.conditionsType) user.conditionsType = req.body.conditionsType
        if (req.body.license) user.license = req.body.license
        if (req.body.status) user.status = req.body.status
        if (req.body.age) user.age = req.body.age
        if (req.body.twitterProfile) user.twitterProfile = req.body.twitterProfile
        if (req.body.instagraProfile) user.instagraProfile = req.body.instagraProfile
    }
    // console.log('------- updated user ----')
    // console.log(user);
   //let response = await User.findOne({_id: id},req.body)
   try{
       // console.log('user saved')
        let response = await user.save();

      // console.log("----received from the app---");
        let aux = { 'roles':user.roles,
                    '_id':user._id, 
                    'status': user.status ,
                    'username': user.username,
                    'name': user.name,
                    'lastName': user.lastName,
                    'email': user.email,
                    'avalanchExposure': user.avalanchExposure,
                    'conditionsType': user.conditionsType,
                    'gender': user.gender,
                    'professionalOrientation': user.professionalOrientation,
                    'snowEducationLevel': user.snowEducationLevel,
                    'snowExperienceLevel': user.snowExperienceLevel,
                    'age': user.age,
                    'license':user.license,
                    'instagraProfile': user.instagraProfile,
                    'twitterProfile': user.twitterProfile,
                    'terrainType': user.terrainType}
        // console.log('-------    aux user ----')                    
        // console.log(aux);
        //console.log("----------------------------");
        res.status(200).json(aux);
   }catch (e){
        console.log(e);
        res.json({'message': e});
   }

   
   //const { ['__v']: aux, ['password']: aux2, ['refreshToken']: aux3, ['observations'] : aux4, ...restObject } = user;


}

module.exports = {
    getAllUsers,  
    getUser,
    editUser,
    deleteUser
}