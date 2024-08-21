const whitelist = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://kspfwvc5-5173.inc1.devtunnels.ms",
    "https://kspfwvc5-5174.inc1.devtunnels.ms"
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