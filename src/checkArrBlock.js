/* eslint-disable no-empty */
/* eslint-disable no-undef */
const checkObjBlock = require("./checkObjBlock");

const checkArrBlock = (blocks=[{}], outWarningLoc = "") => {
    console.log(" 1 all ok");
    blocks.forEach(function (item) {
        checkObjBlock(item);
        console.log("all ok");
    });
};

// checkArrBlock();

module.exports = checkArrBlock;

