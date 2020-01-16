
const util = require("util");

let error = {
    "code": "TEXT.SEVERAL_H1",
    "error": "Блок text с модификатором type h1 на странице должен быть единственным.",
    "location": false
};

let isH1there, isH2there, isH3there = false;

const checkArr = (content) => {
    if (Array.isArray(content)) {
        content.forEach(function (item) {
            if (Array.isArray(item)) {
                checkArr(item);
            }
            else if (typeof item === "object") {
                checkObj(item);
            }
        });
    }
    else if (typeof content === "object") {
        checkObj(content);
    }
};


const checkObj = (obj) => {
    
    if (Object.prototype.hasOwnProperty.call(obj, "block")) {
        if (obj.block === "text") {
            switch (obj.mods.type) {
                case "h1": {
                    if (isH1there) {
                        console.log(util.inspect(obj.location, false, null, true /* enable colors */));
                        error.location = obj.location;
                    }
                    else {
                        isH1there = true;
                    }
                    break;
                }
            }
        }
        else if (Object.prototype.hasOwnProperty.call(obj, "content")) {
            checkArr(obj.content);
        }
    }
    else if (Object.prototype.hasOwnProperty.call(obj, "content")) {
        checkArr(obj.content);
    }
    // если в объекте ошибки заполнено поле location
    // значит ошибка найдена и мы должны ее вернуть
    if (error.location !== false) {
        return error;
    }
    else {
        // иначе возвращаем false
        return false;
    }
};

module.exports.checkObj = checkObj;