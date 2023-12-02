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
   // console.log('------------edit user form body -------')
    // console.log(req.body);
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
    
        // console.log("-----received from the app---");
        // console.log(req.body);
        // console.log("--------");
   
    if (req.body.blocked){
        user.blocked = true;
        user.name = "Anonimous";
        user.lastName = "";
        user.email = user._id+"@anonimous";
    } else{
        user.name = req.body.name;
        user.lastName = req.body.lastName;
        user.gender = req.body.gender 
        user.professionalOrientation = req.body.professionalOrientation 
        user.snowEducationLevel = req.body.snowEducationLevel 
        user.snowExperienceLevel = req.body.snowExperienceLevel 
        user.avalanchExposure = req.body.avalanchExposure 
        user.terrainType = req.body.terrainType
        user.conditionsType = req.body.conditionsType
        user.status = req.body.status
        user.age = req.body.age
        user.twitterProfile = req.body.twitterProfile
        user.instagraProfile = req.body.instagraProfile
    }
   //let response = await User.findOne({_id: id},req.body)
   try{
        let response = await user.save();
      
       // console.log("----received from the app---");
        let aux = { 'roles':user.roles,
                    '_id':user._id, 
                    'status': user.status ,
                    'username' : user.username,
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
                    'instagraProfile': user.instagraProfile,
                    'twitterProfile': user.twitterProfile,
                    'terrainType': user.terrainType}
       // console.log(aux);
       // console.log("----------------------------");
        res.json(aux);
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