
let acorn = require("acorn");
const parse = require('json-to-ast');
const walk = require("acorn-walk");
const util = require('util');

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

let walkArr = (arr, parentLoc) => {
    let outObj = {};
    arr.forEach(function (item) {
        
        if (item.type === "Object"){
            // array
            let arrObjs = item.children;
            walkArr(arrObjs, item.loc);
            return false;
        }
        else if(item.type === "Property"){
            

            if ((item.key.value !== undefined) && (item.key.value === "block")) {
                outObj = {};
                outObj.block = item.value.value;
                //console.log(item.loc);
                let loc;
                if(parentLoc === ""){
                    loc = item.loc;
                }
                loc = parentLoc;
                outObj.loc = loc;
                delete outObj.loc.start.offset;
                delete outObj.loc.end.offset;
                delete outObj.loc.source;
            }
    
            if ((item.key.value !== undefined) && (item.key.value === "content")) {
                item.value.children;
                walkArr(item.value.children, "");
                return false;
            }

            if ((item.key.value !== undefined) && (item.key.value === "mods")) {
                item.value.children.forEach(function (property) {
                    outObj.mods = property.value.value;
                });
                console.log("outObj: ");
                console.log(outObj);
                blocks.push(outObj);
            }
            
        }
        
    });
};

/**
 * linter function
 */
function lint(ast) {
    walkArr(ast.children, ast.loc);
}

let ast = parse(json, settings);

lint(ast);



