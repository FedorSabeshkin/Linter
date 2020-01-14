const parse = require("json-to-ast");
const util = require("util");
const checkArrBlock = require("./checkArrBlock.js");

const settings = {
    // Appends location information. Default is <true>
    loc: true
};

/**
 * sizes
 */
const sizes = {
    "m": 1,
    "s": 2,
    "l": 3,
    "xl": 4
};

const markedJson = [{
    "block": "warning",
    "content": [
        { "block": "text", "mods": { "size": "l" }, "loc": { "start": { "line": 4, "column": 9 }, "end": { "line": 4, "column": 53 } }},
        { "block": "text", "mods": { "size": "m" }, "loc": { "start": { "line": 5, "column": 9 }, "end": { "line": 5, "column": 53 } }}
    ],
	"loc": { "start": { "line": 1, "column": 1 }, "end": { "line": 7, "column": 2 } }
}];

const json = `{
    "block": "warning",
    "content": [
        { "block": "text", "mods": { "size": "l" } },
        { "block": "text", "mods": { "size": "m" } }
    ]
}`;

const jsonTest = `{
    "block": "header",
    "content": {
        "block": "header",
        "elem": "content",
        "content": [
            {
                "block": "header",
                "elem": "logo"
            },
            [
                {
                    "block": "onoffswitch",
                    "mods": {
                        "checked": true,
                        "size": "l"
                    },
                    "content": [
                        {
                            "block": "onoffswitch",
                            "elem": "button"
                        }
                    ]
                }
            ]
        ]
    }
  }`;

let blocks = [];

let errors = [];

/**
 * 
 * @param {*массив "children" элемента в AST} arr  
 * @param {*позиция блока в исходном коде} parentLoc 
 * 
 *  Метод пробегает по дереву и заполнеят массив "blocks" объектами вида
 * {
    block: '<type>',
    loc: { start: [Object], end: [Object] },
    mods: '<size>'
  },
 */

let fillBlocksArr = (children, parentLoc) => {
    let outObj = {};

    if (Array.isArray(children)) {
        children.forEach(function (item) {
            checker(item, parentLoc, outObj);
        });
    }
    else if (typeof children === "object") {
        for (let item in children) {
            checker(item, parentLoc, outObj);
        }
    }
};

let checker = (item, parentLoc, outObj) => {

    switch (item.type) {
        case "Object": {
            // array
            let arrObjs = item.children;
            if (Array.isArray(item.children)) {
                fillBlocksArr(arrObjs, item.loc);
                break;
            } else {
                item = item.children;
            }
        }
        case "Array": {
            fillBlocksArr(item.children, "");
            break;
        }
        case "Property": {
            switch (item.key.value) {
                case "block": {
                    outObj = {};
                    outObj.block = item.value.value;

                    let loc;
                    if (parentLoc === "") {
                        parentLoc = item.loc;
                    }
                    loc = parentLoc;
                    outObj.loc = loc;
                    delete outObj.loc.start.offset;
                    delete outObj.loc.end.offset;
                    delete outObj.loc.source;
                    if (item.value.value === "warning") {
                        blocks.push(outObj);
                    }
                    else {
                        blocks.push(outObj);
                        break;
                    }

                }
                /**
                 * if "block" have "mods", then we will add their to @param outObj
                 *  */
                case "mods": {
                    outObj.mods = {};
                    let children = item.value.children;
                    if (Array.isArray(children)) {
                        /**
                         * ?????
                         * Что-то не то
                         * !!!!!
                         * Если это массив, то он должен содержать объекты и алгоритм пробегания будет иным
                         */
                        children.forEach(function (property) {
                            outObj.mods[property.key.value] = property.value.value;
                        });
                    }
                    else if (typeof children === "object") {
                        for (let property in children) {
                            outObj.mods[property.key.value] = property.value.value;
                        }
                    }

                    blocks.push(outObj);
                }
                case "content": {
                    item.value.children;
                    fillBlocksArr(item.value.children, item.value.loc);
                    break;
                }

            }
        }
    }
};

/**
 * 
 * @param {*} blocks  массив c объектами вида
 * 
 * {
    block: '<type>',
    loc: { start: [Object], end: [Object] },
    mods: '<size>'
  }
 * 
 */
let warnTextSize = (blocks) => {

    checkArrBlock(blocks);

    let errorObj = {
        "code": "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
        "error": "Тексты в блоке warning должны быть одного размера",
        "location": {
            "start": {},
            "end": {}
        }
    };
    let idealSize;
    let firstElem = false;
    firstElem = blocks.find((element, index, array) => {
        if (element.block === "text") {
            return element;
        }
        return false;
    });
    if (firstElem){
        idealSize = firstElem.mods.size;
    }
    else{
        return false;
    }

    let error = blocks.some((element, index, array) => {
        if (element.block === "text") {
            if (element.mods !== idealSize) {
                return true;
            }
        }
    });

    if (error) {
        // позиция родительского блока
        //errorObj.location.
    }

    console.log(idealSize);
};


/**
 * linter function
 */
function lint(ast) {
    // fillBlocksArr(ast.children, ast.loc);
    // console.log(blocks);
    blocks = markedJson;
    console.log(util.inspect(blocks, false, null, true /* enable colors */));
    warnTextSize(blocks);
}

let ast = parse(jsonTest, settings);

lint(ast);



