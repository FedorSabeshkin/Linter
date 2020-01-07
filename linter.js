let acorn = require("acorn");
const parse = require("json-to-ast");
const walk = require("acorn-walk");
const util = require("util");

const settings = {
    // Appends location information. Default is <true>
    loc: true
};

/**
 * sizes
 */
const sizes = ["m", "s", "l", "xl"];

const json = `{
    "block": "warning",
    "content": [
        { "block": "placeholder", "mods": { "size": "m" } },
        { "block": "button", "mods": { "size": "m" } }
    ]
}`;

let blocks = [];

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

let fillBlocksArr = (arr, parentLoc) => {
    let outObj = {};
    arr.forEach(function (item) {

        if (item.type === "Object") {
            // array
            let arrObjs = item.children;
            fillBlocksArr(arrObjs, item.loc);
            return false;
        }
        else if (item.type === "Property") {
            if (item.key.value === "block") {
                outObj = {};
                outObj.block = item.value.value;
                //console.log(item.loc);
                let loc;
                if (parentLoc === "") {
                    loc = item.loc;
                }
                loc = parentLoc;
                outObj.loc = loc;
                delete outObj.loc.start.offset;
                delete outObj.loc.end.offset;
                delete outObj.loc.source;
                if (item.value.value === "warning") {
                    blocks.push(outObj);
                }
            }

            if (item.key.value === "content") {
                item.value.children;
                fillBlocksArr(item.value.children, "");
                return false;
            }

            if (item.key.value === "mods") {
                item.value.children.forEach(function (property) {
                    outObj.mods = property.value.value;
                });
                blocks.push(outObj);
            }

        }

    });

};

/**
 * linter function
 */
function lint(ast) {
    fillBlocksArr(ast.children, ast.loc);
    console.log(blocks);
}

// let  = (arr, parentLoc) => {

// }

let ast = parse(json, settings);

lint(ast);



