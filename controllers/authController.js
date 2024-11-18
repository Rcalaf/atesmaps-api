const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');

const { jwtDecode } = require("jwt-decode");


const client = new OAuth2Client();
const mailer = require('../config/mailer');


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
        const loginData = await jwtSingIn(foundUser);
        // const roles = Object.values(foundUser.roles).filter(Boolean);
        // // create JWTs
        // console.log('Veryfing pass...')
        // const accessToken = jwt.sign(
        //     {
        //         "UserInfo": {
        //             "userId": foundUser._id,
        //             "username": foundUser.username,
        //             "email": foundUser.email,
        //             "roles": roles
        //         }
        //     },
        //     process.env.ACCESS_TOKEN_SECRET,
        //     {}
        //     // { expiresIn: '30m' }
        // );
        // const refreshToken = jwt.sign(
        //     { "username": foundUser.email },
        //     process.env.REFRESH_TOKEN_SECRET,
        //     {}
        //     // { expiresIn: '1d' }
        // );
        // // Saving refreshToken with current user
        // foundUser.refreshToken = refreshToken;
        // const result = await foundUser.save();
        // console.log(loginData);
      
    
        const { ['__v']: aux, ['password']: aux2, ['refreshToken']: aux3, ['observations'] : aux4, ...restObject } = loginData.user._doc;

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', loginData.user.refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        // console.log('this is the rest object...');
        // console.log(restObject);
        // Send authorization roles and access token and user details
        res.json({ user: restObject, accessToken: loginData.accessToken });
        // res.json({ userName: foundUser.userName, email:foundUser.email, userId:foundUser._id, roles, accessToken });

    } else {
        res.sendStatus(401);
    }
}

const jwtSingIn = async (user) => {
    const roles = Object.values(user.roles).filter(Boolean);
    // create JWTs
    console.log('Veryfing pass...')
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "userId": user._id,
                "username": user.username,
                "email": user.email,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {}
        // { expiresIn: '30m' }
    );
    const refreshToken = jwt.sign(
        { "username": user.email },
        process.env.REFRESH_TOKEN_SECRET,
        {}
        // { expiresIn: '1d' }
    );
    // Saving refreshToken with current user
    user.refreshToken = refreshToken;
    const result = await user.save();
    //console.log(result);

    return {user,accessToken};
}

const handleGoogleLogin = async (req, res) => {
    console.log("Goolge Login.")
    //console.log(req.body);
    const token = req.body.tokenId;
    const platform = req.body.platform;
    const clientId = platform === 'ios' ? process.env.GOOGLE_IOS_CLIENT_ID : process.env.GOOGLE_ANDROID_CLIENT_ID; 
    //console.log( process.env.GOOGLE_IOS_CLIENT_ID)
    let isNewUser = false;
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientId,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        console.log(payload);

        const userId = payload['sub'];
        const email = payload['email'];
       
        //User already exists and merged.
        let user = await User.findOne({$and: [{googleUserId: userId },{email: email.toLowerCase() }]}).exec();
        if (!user) {
            user =  await User.findOne({ googleUserId: userId }).exec();
            if (!user){
                 user =  await User.findOne({ email: email }).exec();
                 if (!user){
                      // register a new user.
                     const hashedPwd = await bcrypt.hash(userId, 12);
                     user = await User.create({
                     //create random username
                         "username": (payload['name']).toLowerCase()?.replace(/[^a-zA-Z0-9_ ]/g, ''),
                         "googleUserId": userId,
                         "email": email?.toLowerCase(),
                         "password": hashedPwd,
                         "socialLogin": true,
                     });
                     isNewUser = true;
                     console.log('New user created...')
                 }else{
                     user.googleUserId = userId;
                     console.log('User merged...')
                 }    
            }else{
                console.log('User exists but not merged...')
            }
        }else{
            console.log('User exists and merged...')
        }

       if (user.blocked) return res.status(409).json({message: 'Esta cuenta está sido borrada'});

       const loginData = await jwtSingIn(user);
       const { ['__v']: aux, ['password']: aux2, ['refreshToken']: aux3, ['observations'] : aux4, ...restObject } = loginData.user._doc;
       // Creates Secure Cookie with refresh token
       res.cookie('jwt', loginData.user.refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        if(isNewUser){
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
                //console.log(info);
                console.log('Registration Email sent...')
            });
        }

       // Send authorization roles and access token and user details
       res.json({ user: restObject, accessToken: loginData.accessToken });

        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }catch (error){
        console.log(error);
        res.sendStatus(401);
    }
}

const handleAppleLogin = async (req, res) => {
    console.log("Apple Login.")
    //console.log(req.body);
    const token = req.body.tokenId;
    const platform = req.body.platform;
    const userDetails = req.body.user;
    //console.log( process.env.GOOGLE_IOS_CLIENT_ID)
    let isNewUser = false;
    try{
        // console.log(jwtDecode(token))
        const {email, sub  } =  jwtDecode(token);
        let user = await User.findOne({$and: [{appleUserId: sub },{email: email.toLowerCase() }]}).exec();
        if (!user) {
            user =  await User.findOne({ appleUserId: sub }).exec();
            if (!user){
                user =  await User.findOne({ email: email }).exec();
                if (!user){
                    // register a new user.
                   const hashedPwd = await bcrypt.hash(sub, 12);
                   let username;
                   if ( userDetails && (userDetails?.fullName?.givenName || userDetails?.fullName?.familyName)){
                        username = userDetails?.fullName?.givenName+userDetails?.fullName?.familyName;
                   }else{
                        username = 'apple_'+ await User.countDocuments().exec();
                   }
                   user = await User.create({
                       "username": (username).toLowerCase()?.replace(/[^a-zA-Z0-9_ ]/g, ''),
                       "appleUserId": sub,
                       "name":userDetails ? userDetails.fullName?.givenName : '',
                       "lastName":userDetails ? userDetails.fullName?.familyName : '',
                       "email": email?.toLowerCase(),
                       "password": hashedPwd,
                       "socialLogin": true,
                   });
                   isNewUser = true;
                   console.log('New user created via social loggin.')
               }else{
                   user.appleUserId = sub;
                   console.log('User found via social loggin and merged.')
               }    
          }else{
              console.log('User found via social loggin emails.')
          }
      }else{
          console.log('merged User found.')
      }

      if (user.blocked) return res.status(409).json({message: 'Esta cuenta está sido borrada'});

      const loginData = await jwtSingIn(user);
      const { ['__v']: aux, ['password']: aux2, ['refreshToken']: aux3, ['observations'] : aux4, ...restObject } = loginData.user._doc;
      // Creates Secure Cookie with refresh token
      res.cookie('jwt', loginData.user.refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

    //   console.log(restObject.email);

       if(isNewUser){
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
              // console.log(info);
               console.log('Registration Email sent...')
           });
       }

       //console.log(restObject);

      // Send authorization roles and access token and user details
      res.json({ user: restObject, accessToken: loginData.accessToken });
  
    }catch (error){
        console.log(error);
        res.sendStatus(401);
    }

}

const showVersion = (req, res) => {
    res.status(200).json({ 'version': '1.0.1' });
}

const showIosVersion = (req, res) => {
    res.status(200).json({ 'version': '1.1.2' });
}

const showAndroidVersion = (req, res) => {
    res.status(200).json({ 'version': '2.9' });
}

module.exports = { handleLogin, handleGoogleLogin, handleAppleLogin, showVersion, showIosVersion, showAndroidVersion};