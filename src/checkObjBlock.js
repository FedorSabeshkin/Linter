/* eslint-disable no-empty */
/* eslint-disable no-undef */


const checkObjBlock = (block, outWarningLoc = "") => {
    let errors = [];
    if (block.block === "warning") {
        if (outWarningLoc === "") {
            outWarningLoc = block.loc;
        }else {
            checkObjBlock(item, item.loc);
            return;
        }
        // проверка первого условия для блока warning
        if (block.content) {
            let errorObj = {};
            let childrens = block.content;
            if (Array.isArray(childrens)) {
                // find first "text" elem
                let idealSize;
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
                }
                else {
                    return false;
                }
                // checking that another "text" blocks have same size 
                let error = childrens.some((element, index, array) => {
                    if (element.block === "text") {
                        if (element.mods !== idealSize) {
                            return true;
                        }
                    }
                });
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
};

module.exports = checkObjBlock;

