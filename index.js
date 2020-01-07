
let acorn = require("acorn");
const parse = require('json-to-ast');
const walk = require("acorn-walk");
const util = require('util');

const settings = {
    // Appends location information. Default is <true>
    loc: true
};


const json = `{
    "block": "warning",
    "content": [
        { "block": "placeholder", "mods": { "size": "m" } },
        { "block": "button", "mods": { "size": "m" } }
    ]
}`;
/**
 * linter function
 */
function lint() {
    let ast = parse(json, settings);
    
    let walkArr = (arr) => {
        arr.forEach(function (item) {
            try{
                if (( item.key.value !== undefined ) && (item.key.value === "block")) {
                    console.log(item.loc);
                }
            }
            catch(err){
                console.error(err);
            }
            
            if (( item.children !== undefined ) && item.children) {
                walkArr(item.children);
            };
            if (( item.value.children !== undefined ) && item.value.children) {
                walkArr(item.value.children);
            }
        });
    };

    walkArr(ast.children);

}

lint();



