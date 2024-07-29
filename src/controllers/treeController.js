const { printWarning } = require("../constants/functions");
const { userModel } = require("../models/userModel");

async function getUserTrees(req, res, next) {
    try {
        const currUser = await userModel.findById(req.params.uid).exec();

        if (currUser == null) {
            throw new Error("User does'nt exists");
        }

        // tree level 1
        const usersLev1 = await userModel.find({
            _id: {
                $in: currUser.people_referred
            }
        }).select("name image_link people_referred").lean();

        usersLev1.reverse();

        const level2Uids = getChildrenUidsFromUsers(usersLev1);
        
        // tree level 2
        const usersLev2 = await userModel.find({
            _id: {
                $in: level2Uids
            }
        }).select("name image_link people_referred").lean();

        const level3Uids = getChildrenUidsFromUsers(usersLev2);

        // tree level 3
        const usersLev3 = await userModel.find({
            _id: {
                $in: level3Uids
            }
        }).select("name image_link people_referred").lean();

        const result = [];

        var index = 2;      // starts from 1
        var treeNo = 0;     // starts from 0

        usersLev1.forEach((user) => {
            user.index = index;
            result[treeNo] = result[treeNo] ?? [];
            result[treeNo].push(user);

            if (index == 3) {
                index = 2;
                treeNo++;
            }
            else {
                index++;
            }
        });

        index = 4;
        treeNo = 0;

        usersLev2.forEach((user) => {
            user.index = index;
            result[treeNo] = result[treeNo] ?? [];
            result[treeNo].push(user);

            if (index == 7) {
                index = 4;
                treeNo++;
            }
            else {
                index++;
            }
        });

        index = 8;
        treeNo = 0;

        usersLev3.forEach((user) => {
            user.index = index;
            result[treeNo] = result[treeNo] ?? [];
            result[treeNo].push(user);

            if (index == 15) {
                index = 8;
                treeNo++;
            }
            else {
                index++;
            }
        });


        res.json({
            error: null,
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            error: error.message,
            data: null
        });
    }
}

/////////////////////////////////////////

function getChildrenUidsFromUsers(usersList) {
    const childrenUids = [];

    usersList.forEach((user) => {
        // get last 2 people referred
        const list = user.people_referred.slice(Math.max(user.people_referred.length - 2, 0));
        childrenUids.push(...list);
    });

    return childrenUids;
}



module.exports = {
    getUserTrees,
};