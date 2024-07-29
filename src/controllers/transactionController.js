const { default: mongoose, mongo } = require("mongoose");
const { printWarning } = require("../constants/functions");
const { packageModel } = require("../models/packageModel");
const { transactionModel } = require("../models/transactionModel");
const { userModel } = require("../models/userModel");
const { bundleModel } = require("../models/bundleModel");


async function packageBought(req, res) {
    try {
        const session = await mongoose.startSession();
        await session.startTransaction();

        const currUser = await userModel.findById(req.body.uid)
            .select("name referred_by balance curr_package");

        if (currUser == null) {
            throw new Error("User not found!");
        }

        const package_bought = await packageModel.findById(req.body.pid);

        if (package_bought == null) {
            throw new Error("No package selected!");
        }
        
        await addTrAndUpdUser({
            uid: req.body.uid,
            amount: -package_bought.price,
            description: `Bought ${package_bought.name} package`
        }, session);


        // 25%, 20%, 15%
        const p1Amount = Math.round(package_bought.price * 0.25);
        const p2Amount = Math.round(package_bought.price * 0.2);
        const p3Amount = Math.round(package_bought.price * 0.15);


        // add transactions % for parents

        if (currUser.referred_by) {
            await addTrAndUpdUser({
                uid: currUser.referred_by,
                amount: p1Amount,
                description: `${currUser.name} bought ${package_bought.name} package for ${package_bought.price}`
            }, session);
            const p1 = await userModel.findById(currUser.referred_by).select("referred_by");

            if (p1 != null && p1.referred_by) {
                await addTrAndUpdUser({
                    uid: p1.referred_by,
                    amount: p2Amount,
                    description: `${currUser.name} bought ${package_bought.name} package for ${package_bought.price}`
                }, session);
                const p2 = await userModel.findById(p1.referred_by).select("referred_by");

                if (p2 != null && p2.referred_by) {
                    await addTrAndUpdUser({
                        uid: p2.referred_by,
                        amount: p3Amount,
                        description: `${currUser.name} bought ${package_bought.name} package for ${package_bought.price}`
                    }, session);
                }
            }
        }

        await session.commitTransaction();
        await session.endSession();

        res.json({
            error: null,
            data: "Package bought successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

async function bundleBought(req, res) {
    try {
        const currUser = await userModel.findById(req.body.uid)
            .select("name referred_by balance curr_package")
            .populate("curr_package");

        if (currUser == null) {
            throw new Error("User not found!");
        }

        const bundle_bought = await bundleModel.findById(req.body.bid);

        if (bundle_bought == null) {
            throw new Error("No bundle selected!");
        }

        var percent_off = 0;

        if (currUser.curr_package) {
            percent_off = currUser.curr_package.percent_off;
        }

        const amount_off = bundle_bought.price * (percent_off/100);

        const session = await mongoose.startSession();
        session.startTransaction();
        
        await addTrAndUpdUser({
            uid: req.body.uid,
            amount: -bundle_bought.price - amount_off,
            description: `Bought ${bundle_bought.name} bundle`
        }, session);

        session.commitTransaction();
        session.endSession();

        
        res.json({
            error: null,
            data: {
                msg: "Bundle bought successfully",
                bundle_link: ""
            }
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

async function getTransactions(req, res) {
    try {
        const transactions = await transactionModel.find({
            uid: req.params.uid
        });

        res.json({
            error: null,
            data: transactions
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}


////////////////////////////////////////////////

async function addTrAndUpdUser({uid, amount, description}, session) {
    const dbUser = await userModel.findById(uid);

    if (dbUser == null) {
        throw new Error("User not found!");
    }

    if (amount < 0 && dbUser.balance < -(amount)) {
        throw new Error("Insufficient balance");
    }

    await transactionModel.create(
        [
            {
                uid: uid,
                amount: amount,
                description: description
            }
        ],
        {
            session: session
        }
    );

    await userModel.updateOne(
        {
            _id: uid
        },
        {
            $inc: {
                balance: amount
            }
        },
        {
            session: session
        }
    );
}


module.exports = {
    packageBought,
    bundleBought,
    getTransactions,
    addTrAndUpdUser
}