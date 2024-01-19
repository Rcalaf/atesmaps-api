const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });

    const foundUser = await User.findOne({ email: email.toLowerCase() }).exec();
   
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // if (foundUser.blocked) return res.status(409).json({message: 'Esta cuenta está sido borrada'});

    console.log('----- Checking password -----');
    const match = await bcrypt.compare(pwd, foundUser.password);
    console.log(match);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        console.log('Veryfing pass...')
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "userId": foundUser._id,
                    "username": foundUser.username,
                    "email": foundUser.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {}
            // { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            {}
            // { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        //console.log(result);
      
    
        const { ['__v']: aux, ['password']: aux2, ['refreshToken']: aux3, ['observations'] : aux4, ...restObject } = foundUser._doc;

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token and user details
        res.json({ user: restObject, accessToken });
        // res.json({ userName: foundUser.userName, email:foundUser.email, userId:foundUser._id, roles, accessToken });

    } else {
        res.sendStatus(401);
    }
}

const showVersion = (req, res) => {
    res.status(200).json({ 'version': '1.0.1' });
}

const showIosVersion = (req, res) => {
    res.status(200).json({ 'version': '1.0.7' });
}

const showAndroidVersion = (req, res) => {
    res.status(200).json({ 'version': '2.3' });
}

module.exports = { handleLogin, showVersion, showIosVersion, showAndroidVersion};