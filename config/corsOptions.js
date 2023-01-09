const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        console.log('origin value sent to corsOptions');
        console.log(origin);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    maxAge:0,
    optionsSuccessStatus: 204
}

// const corsOptions = {
//     origin: true,
//     optionsSuccessStatus: 200
// }


module.exports = corsOptions;