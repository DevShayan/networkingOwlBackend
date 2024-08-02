const whitelist = [
    "http://localhost:5173",
    "https://quiet-cheetah-64.telebit.io"
];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
            callback(null, true)
        }
        else {
            callback(new Error(`${origin}: Not allowed by CORS`))
        }
    },
    optionsSuccessStatus: 200, // for old browsers
    credentials: true // allow cookies
};

module.exports = {
    corsOptions
};