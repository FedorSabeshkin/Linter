/* eslint-disable quotes */
var assert = require("assert");
const ruleWarning = require("../src/ruleWarning.js");

let blocks = [{
    "block": "header",
    "content": {
        "block": "header",
        "elem": "content",
        "loc": { "start": { "line": 0, "column": 0 }, "end": { "line": 0, "column": 0 } },
        "content": [
            {
                "block": "header",
                "elem": "logo",
                "loc": { "start": { "line": 0, "column": 0 }, "end": { "line": 0, "column": 0 } }
            },
            [
                {
                    "block": "onoffswitch",
                    "mods": {
                        "checked": true,
                        "size": "l",
                        "loc": { "start": { "line": 0, "column": 0 }, "end": { "line": 0, "column": 0 } }
                    },
                    "loc": { "start": { "line": 0, "column": 0 }, "end": { "line": 0, "column": 0 } },
                    "content": [
                        {
                            "block": "onoffswitch",
                            "elem": "button",
                            "loc": { "start": { "line": 0, "column": 0 }, "end": { "line": 0, "column": 0 } }
                        },
                        {
                            "block": "warning",
                            "content": [
                                { "block": "text", "mods": { "size": "l" }, "loc": { "start": { "line": 4, "column": 9 }, "end": { "line": 4, "column": 53 } } },
                                { "block": "text", "mods": { "size": "m" }, "loc": { "start": { "line": 5, "column": 9 }, "end": { "line": 5, "column": 53 } } }
                            ],
                            "loc": { "start": { "line": 1, "column": 1 }, "end": { "line": 7, "column": 2 } }
                        }
                    ]
                }
            ]
        ]
    }
}];
let errors = [];
errors = ruleWarning.checkArrBlock(blocks, "", errors);
var goodResult = [
    {
        code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
        error: 'Тексты в блоке warning должны быть одного размера',
        location: { start: { line: 1, column: 1 }, end: { line: 7, column: 2 } }
    }
];

assert.deepEqual(goodResult, errors); //OK