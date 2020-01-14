/* eslint-disable no-empty */
/* eslint-disable no-undef */
//const equalWarnTextSize = require("./equalWarnTextSize");
const util = require("util");

const checkArrBlock = (blocks = [{}], outWarningLoc = "", errors = []) => {

    let newErrors = [];
    blocks.forEach(function (item) {
        if (Array.isArray(item)) {
            newErrors = checkArrBlock(item, "", errors);
            if (newErrors !== false) {
                errors = errors.concat(newErrors);
            }
        }
        else {
            newErrors = equalWarnTextSize(item, "", errors);
            if (newErrors !== false) {
                errors = errors.concat(newErrors);
            }
        }

    });
    return errors;
};

/**
 * 
 * @param {*} block 
 * @param {*} outWarningLoc 
 * 
 * method for cheking rule:
 * Все тексты (блоки text) в блоке warning должны быть одного размера, 
 * то есть c одинаковым значением модификатора size, и этот размер должен быть определен. 
 * Размер первого из таких элементов в форме будем считать эталонным.
 */
const equalWarnTextSize = (block, outWarningLoc = "", errors = []) => {
    if (block.block === "warning") {
        if (outWarningLoc === "") {
            outWarningLoc = block.loc;
        } else {
            equalWarnTextSize(item, item.loc, errors);
            return;
        }
        // проверка первого условия для блока warning
        if (block.content) {
            let errorObj = {
                "code": "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
                "error": "Тексты в блоке warning должны быть одного размера",
                "location": {
                    "start": {},
                    "end": {}
                }
            };
            let childrens = block.content;
            if (Array.isArray(childrens)) {
                // find first "text" elem
                let idealSize;
                let error = false;
                let firstTextElem = false;
                firstTextElem = childrens.find((element, index, array) => {
                    if (element.block === "text") {
                        return element;
                    }
                    return false;
                });
                // set ideal size
                if (firstTextElem) {
                    idealSize = firstTextElem.mods.size;
                    // checking that another "text" blocks have same size 
                    error = childrens.some((element, index, array) => {
                        if (element.block === "text") {
                            if (element.mods !== idealSize) {
                                return true;
                            }
                        }
                    });
                }
                else {
                    return false;
                }

                let newErrors = [];


                // childrens.forEach(function (item) {

                //     if (Array.isArray(item)) {
                //         checkArrBlock(item);
                //     }
                //     else if (typeof childrens === "object") {
                //         newErrors = equalWarnTextSize(item);
                //         errors = errors.concat(newErrors);
                //     }

                // });

                // сохранение позиции ближайшего внешнего warning с ошибкой
                if (error) {
                    errorObj.location = outWarningLoc;
                    errors.push(errorObj);
                }


            }
            else if (typeof childrens === "object") {
                return false;
            }
        }

    }
    else {
        let childrens = block.content;

        if (Array.isArray(childrens)) {
            errors = checkArrBlock(childrens, "", errors);
        }
        else if (typeof childrens === "object") {
            newErrors = equalWarnTextSize(childrens, "", errors);
            errors = errors.concat(newErrors);
        }

        return false;

    }

    return errors;
};

module.exports.checkArrBlock = checkArrBlock;

module.exports.equalWarnTextSize = equalWarnTextSize;

