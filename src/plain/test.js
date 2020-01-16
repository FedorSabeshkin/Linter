const parseAstObject = require("./parseAstObject");
const parseJson = require("json-to-ast");
const util = require("util");

const test = (astJson) => {

  console.log(util.inspect(parseAstObject.parseObj(astJson), false, null, true /* enable colors */), `\n`);
};

let arrJson = `{
  "key1": [true, false, null]
}`;

let astJson = `{
  "block": "warning"
}`;

let astJsonDouble = `{
  "block": "warning",
  "mods": {
    "checked": {
                "checked": "inner",
                "size": "m"
              },
    "size": "l"
  }
}`;

let difficultObj = `{
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

// astJson = parseJson(astJson);
// arrJson = parseJson(arrJson);
// astJsonDouble = parseJson(astJsonDouble);
difficultObj = parseJson(difficultObj);

// test(astJson);
// test(arrJson);
// test(astJsonDouble);
test(difficultObj);