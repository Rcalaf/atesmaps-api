const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailer = require('../config/mailer');

 
const handleRequestNewPassword = async (req, res) => {
    // console.log('params: ')
    console.log(req.body);
    const {email} = req.body;
    // console.log(await User.find({}));
    const user = await User.findOne({ email: email.toLowerCase() }).exec();
    // console.log(user);
    if (user) {
        user.generatePasswordReset();
        try{
            let savedUser = await user.save();
            let mailOptions = {
                from: '"Atesmaps" <info@atesmaps.org>', // sender address
                to: user.email, // list of receivers
                subject: 'Petición de cambio de contraseña', // Subject line
                text: 'Pinche en éste link para generar una nueva contraseña: https://atesmaps.org/reset-password/'+savedUser.resetPasswordToken, // plain text body
                html: '<p><b>Pinche en éste link para generar una nueva contraseña: </b></br><a href="https://atesmaps.org/reset-password/'+savedUser.resetPasswordToken+'">Reset password</a></p>' // html body
            };

            mailer.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.json({ error: error});
                }
                console.log(info);
                //console.log('Message %s sent: %s', info.messageId, info.response);
                res.status(200).json({ msg: 'email sent...'});
            });
        }catch (error){
            console.log(error);
            res.status(500).json({error});
        }
    }else{
        res.sendStatus(404); 
    }


}

const handleNewUser = async (req, res) => {
    const { email, userName, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'email and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: email.toLowerCase() }).exec();
    // if (duplicate.blocked) return res.status(409).json({message: 'Esta cuenta está siendo borrada'});
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 12);

        //create and store the new user
        const user = await User.create({
            "username": userName?.toLowerCase()?.replace(/[^a-zA-Z0-9_ ]/g, ''),
            "email": email?.toLowerCase(),
            "password": hashedPwd
        });

        //------ Login right after register   -----


        const roles = Object.values(user.roles).filter(Boolean);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": user.username,
                    "email": user.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
            { "username": user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        user.refreshToken = refreshToken;
        const result = await user.save();
        
        const { ['__v']: aux, ['observations'] : aux4 ,['password']: aux2, ['refreshToken']: aux3, ...restObject } = user._doc;
        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        let mailOptions = {
            from: '"Atesmaps" <info@atesmaps.org>', // sender address
            to: restObject.email, // list of receivers
            subject: 'Bienvenidos a Atesmaps', // Subject line
            text: 'Bienvenidos a Atesmaps, Os damos las gracias por vestra aportación como colaboradores.', // plain text body
            html: '<p><b>Bienvenidos a Atesmaps,<b></p> <p> Os damos las gracias por vestra aportación como colaboradores.</p>' // html body
        };

        mailer.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.json({ error: error});
            }
            console.log(info);
            console.log('Registration Email sent...')
        });

       // Send authorization roles and access token to user
       res.json({ user: restObject, accessToken });


    } catch (err) {
        console.log(err.message);
        res.status(500).json({ 'message': err.message });
    }
}

const handleResetPassword = async (req, res) => {
    try{
        const { token } = req.params;
        const { password, passwordConfirmation } = req.body;

        if (!token) return res.status(400).json({ "message": 'recovery token required' });
        
        const user = await User.findOne({ resetPasswordToken: token }).exec();
        console.log(user);
        if (!user) return res.status(200).json({ 'message': `Token no valid` });
        
        if (user.resetPasswordExpires < Date.now()) {
            console.log('token expired...');
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            const result = await user.save();
            return res.status(200).json({ 'message': `Token expired` });
        }

        if (password != passwordConfirmation) return res.status(200).json({ 'message': `password don't match` });
            
        const hashedPwd = await bcrypt.hash(password, 12);
        user.password = hashedPwd;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        console.log('password updated...');
        console.log(user);
        const result = await user.save();
        res.status(200).json(user);
    } catch (err){
        res.status(500).json({ 'message': err.message });
    }

}


module.exports = { handleNewUser, handleResetPassword, handleRequestNewPassword };