/* eslint-disable no-empty */
/* eslint-disable no-undef */
const equalWarnTextSize = require("./equalWarnTextSize");

const checkArrBlock = (blocks=[{}], outWarningLoc = "") => {
    let errors = [];
    let newErrors = [];
    blocks.forEach(function (item) {
        newErrors = equalWarnTextSize(item);
        errors = errors.concat(newErrors);
    });
    return errors;
};

// checkArrBlock();

module.exports = checkArrBlock;

