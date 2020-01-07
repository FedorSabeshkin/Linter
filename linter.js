
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

let walkArr = (arr) => {

    arr.forEach(function (item) {

        if(item.type === "Property"){
            if ((item.key.value !== undefined) && (item.key.value === "block")) {
                console.log(item.loc);
                return false;;
            }
    
            if ((item.key.value !== undefined) && (item.key.value === "content")) {
                item.value.children
                walkArr(item.value.children);
                return false;
            }
        }
        else if (item.type === "Object"){
            // array
            let obj = item.children;
            walkArr(obj);
            return false;
        }
    });
};

/**
 * linter function
 */
function lint(ast) {
    walkArr(ast.children);
}

let ast = parse(json, settings);

lint(ast);



