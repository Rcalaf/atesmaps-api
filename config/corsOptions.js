const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(err, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    preflightContinue: true,
    credentials: true,
    maxAge:5,
    optionsSuccessStatus: 200
}

// const corsOptions = {
//     origin: true,
//     optionsSuccessStatus: 200
// }


module.exports = corsOptions;