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
const sizes = {
    "m": 1,
    "s": 2,
    "l": 3,
    "xl": 4
};

const json = `{
    "block": "warning",
    "content": [
        { "block": "text", "mods": { "size": "l" } },
        { "block": "text", "mods": { "size": "m" } }
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
                    outObj.mods = {
                        "size": property.value.value
                        };
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
    //console.log(blocks);
    warnTextSize(blocks);
}
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
    let errorObj = {
        "code": "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
        "error": "Тексты в блоке warning должны быть одного размера",
        "location": {
            "start": {},
            "end": {}
        }
    };
    let idealSize;
    let firstElem = blocks.find((element, index, array) => {
        if (element.block === "text") {
            return element;
        }
        return false;
    });
    idealSize = firstElem.mods.size;

    let error = blocks.some((element, index, array) => {
        if (element.block === "text") {
            if(element.mods !== idealSize){
                return true;
            };
        }
     });

    if(error){
        errorObj.location.start = 
    }

    console.log(idealSize);
};

// let warning = (blocks) => {
//     return {
//         textSize = (blocks)=>{
//             console.log("from func");
//         }
//     }; 
// };

let ast = parse(json, settings);

lint(ast);



