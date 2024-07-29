const express = require("express");
const mongoose = require("mongoose");

const userRoute = require("./src/routes/userRoutes.js");
const refCodeRoute = require("./src/routes/refCodeRoutes.js");
const transactionRoute = require("./src/routes/transactionRoutes.js");
const bunAndPackRoute = require("./src/routes/bunAndPackRoutes.js");
const adminRoute = require("./src/routes/adminRoutes.js");
const constFunctions = require("./src/constants/functions.js");
const cors = require("cors");

const app = express();

// Global Middlewares

app.use(express.json()); // Allow reading json from req body
app.use(cors({
    origin: "http://localhost:5173",
optionsSuccessStatus: 200
})); // Allow request from this host



mongoose.connect(process.env.MONGO_DB_URL)
.then(() => {
    app.listen(8080, () => {
        console.log("Listening on http://localhost:8080 ...");
    });
})
.catch((e) => constFunctions.printError(`connection failed: ${e}`));


app.use("/user", userRoute);
app.use("/ref-link", refCodeRoute);
app.use("/transaction", transactionRoute);
app.use("/packs", bunAndPackRoute);
app.use("/admin", adminRoute);


