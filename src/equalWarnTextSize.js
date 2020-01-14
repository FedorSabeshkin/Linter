/* eslint-disable no-empty */
/* eslint-disable no-undef */

const checkArrBlock = require("./checkArrBlock");

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
const equalWarnTextSize = (block, outWarningLoc = "") => {
    let errors = [];

    if (block.block === "warning") {
        if (outWarningLoc === "") {
            outWarningLoc = block.loc;
        } else {
            equalWarnTextSize(item, item.loc);
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

                let errors = [];
                let newErrors = [];


                childrens.forEach(function (item) {
                    
                    if (Array.isArray(item)) {
                        checkArrBlock(item);
                    }
                    else {
                        newErrors = equalWarnTextSize(item);
                        errors = errors.concat(newErrors);
                    }

                });

                // сохранение позиции ближайшего внешнего warning с ошибкой
                if (error) {
                    errorObj.location = outWarningLoc;
                    errors.push(errorObj);
                }
                return errors;

            }
            else if (typeof childrens === "object") {
                return false;
            }
        }
    }
    else {
        let childrens = block.content;
        if (Array.isArray(childrens)) {
            let errors = [];
            let newErrors = [];

            childrens.forEach(function (item) {
                newErrors = equalWarnTextSize(item);
                errors = errors.concat(newErrors);
            });
            return errors;
        }
        else {
            equalWarnTextSize(childrens);
        }
        return false;
    }
};

module.exports = equalWarnTextSize;

