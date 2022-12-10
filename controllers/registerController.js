const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailer = require('../config/mailer');

 
const handleResetPassword = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({ email: email }).exec();
    if (user) {
        user.generatePasswordReset();
        try{
            let savedUser = await user.save();
            let mailOptions = {
                from: '"Atesmaps" <info@atesmaps.org>', // sender address
                to: savedUser.email, // list of receivers
                subject: 'Petición de cambio de Password', // Subject line
                text: 'Pinche en éste link para generar un nuevo password. https://atesmaps.org/admin/resetpassword/'+savedUser.resetPasswordToken, // plain text body
                html: '<p><b>Pinche en éste link para generar un nuevo password</b></br><a href="https://atesmaps.org/admin/resetpassword/'+savedUser.resetPasswordToken+'">reset password</a></p>' // html body
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
    const duplicate = await User.findOne({ email: email }).exec();
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

        // Send authorization roles and access token to user
        res.json({ user: restObject, accessToken });

        // mailer.sendMail(mailOptions, (error, info) => {
        //     // if (error) {
        //     //     console.log(error);
        //     // }
        //     console.log('Message %s sent: %s', info.messageId, info.response);
        //         //res.json({ roles, accessToken });
                // res.json({ userName: user.userName, email:user.email, userId:user._id, roles, accessToken });
        // });
        

        //------ END Login after register code ----
        //  console.log(user);
        //  res.status(201).json({ 'success': `New user ${user} created!` });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser, handleResetPassword };