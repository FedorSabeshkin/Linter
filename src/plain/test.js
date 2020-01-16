const parseAstObject = require("./parseAstObject");
const util = require("util");

const test = (astJson) => {

    console.log(util.inspect(parseAstObject.parse(astJson), false, null, true /* enable colors */));
};

const AstJson = {
    "type": "Object",
    "children": [
      {
        "type": "Property",
        "key": {
          "type": "Identifier",
          "value": "block",
          "raw": "\"block\"",
          "loc": {
            "start": {
              "line": 2,
              "column": 5,
              "offset": 6
            },
            "end": {
              "line": 2,
              "column": 12,
              "offset": 13
            },
            "source": null
          }
        },
        "value": {
          "type": "Literal",
          "value": "header",
          "raw": "\"header\"",
          "loc": {
            "start": {
              "line": 2,
              "column": 14,
              "offset": 15
            },
            "end": {
              "line": 2,
              "column": 22,
              "offset": 23
            },
            "source": null
          }
        },
        "loc": {
          "start": {
            "line": 2,
            "column": 5,
            "offset": 6
          },
          "end": {
            "line": 2,
            "column": 22,
            "offset": 23
          },
          "source": null
        }
      }
    ],
    "loc": {
      "start": {
        "line": 1,
        "column": 1,
        "offset": 0
      },
      "end": {
        "line": 3,
        "column": 2,
        "offset": 25
      },
      "source": null
    }
  };

test(AstJson);