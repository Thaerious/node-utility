import assert from "assert";
import FS from "fs";
import ParseArgs from "@thaerious/parseargs";
import seekFiles from "../src/seekfiles.js";
import bfs from "../src/bfsObject.js";
const args = new ParseArgs().run();

const TEST_DIRECTORY = "test/temp/";
const cwd = process.cwd();

function setUp() {
    if (FS.existsSync(TEST_DIRECTORY)) FS.rmSync(TEST_DIRECTORY, { recursive: true });
    mkdirIf(TEST_DIRECTORY);
    process.chdir(TEST_DIRECTORY);
}

function cleanUp() {
    process.chdir(cwd);
    if (!args.flags[`no-clean`]) {
        // clean up test directory unless --no-clean is specified
        if (FS.existsSync(TEST_DIRECTORY)) FS.rmSync(TEST_DIRECTORY, { recursive: true });
    } else {
        console.log("\n *** see test directory: test/temp");
    }
}

const simple = {
    key: "value",
};

const nested = {
    key: "value",
    child_0: {
        key: "value",
    },
    child_1: {
        key_1: "some_value_0",
    },
    child_2: {
        key_1: "some_value_1",
    },
    child_3: {
        key_2: "some_value_1",
    },
    child_4: {
        diff_key: "some_value_1",
    },
    isnull : null,
    isundef : undefined
};

const nestedArray = {
    array1 : [
        {
            key: "value1",
        },
        {
            key: "value2",
        },
        {
            key: "value3",
        },
        [
            {key : "value4"},
            {not_key : "not_value"}
        ],
        "ignore me"
    ]
}

describe("Test BFS Object", function () {
    describe("simple object with one field", function () {
        describe("look for key:value using bfs.first", function () {
            it("returns the root object", function () {
                const actual = bfs.first(simple, "key", "value");
                assert.strictEqual(actual, simple);
            });
        });

        describe("nested array", function () {
            describe("bfs.first", function(){
                it("returns nested object", function () {
                    const actual = bfs.first(nestedArray, "key", "value1");
                    assert.strictEqual(actual, nestedArray.array1[0]);
                });
            });
            describe("bfs.all", function(){
                it("returns all nested objects", function () {
                    const actual = bfs.all(nestedArray, "key");
                    assert.strictEqual(actual.length, 4);
                });                
            });
        });

        describe("bfs.first undefined results", function () {
            describe("array of string bfs.first returns undefined", function () {
                it("returns undefined", function () {
                    const local = ["a", "b", "c"];
                    const actual = bfs.first(local, "key", "value");
                    assert.strictEqual(actual, undefined);
                });
            });

            describe("empty object returns undefined", function () {
                it("returns undefined", function () {
                    const local = {};
                    const actual = bfs.first(local, "key", "value");
                    assert.strictEqual(actual, undefined);
                });
            });

            describe("undefined object returns undefined", function () {
                it("returns undefined", function () {
                    const local = undefined;
                    const actual = bfs.first(local, "key", "value");
                    assert.strictEqual(actual, undefined);
                });
            });

            describe("null object returns undefined", function () {
                it("returns undefined", function () {
                    const local = null;
                    const actual = bfs.first(local, "key", "value");
                    assert.strictEqual(actual, undefined);
                });
            });
        });

        describe("bfs.all empty results", function () {
            describe("array of string returns empty", function () {
                it("returns empty", function () {
                    const local = ["a", "b", "c"];
                    const actual = bfs.all(local, "key", "value");
                    assert.strictEqual(actual.length, 0);
                });
            });

            describe("empty object returns empty", function () {
                it("returns empty", function () {
                    const local = {};
                    const actual = bfs.all(local, "key", "value");
                    assert.strictEqual(actual.length, 0);
                });
            });

            describe("undefined object returns empty", function () {
                it("returns empty", function () {
                    const local = undefined;
                    const actual = bfs.all(local, "key", "value");
                    assert.strictEqual(actual.length, 0);
                });
            });

            describe("null object returns empty", function () {
                it("returns empty", function () {
                    const local = null;
                    const actual = bfs.all(local, "key", "value");
                    assert.strictEqual(actual.length, 0);
                });
            });
        });

        describe("look for key:value using bfs.all", function () {
            it("returns an array containing only the root object", function () {
                const actual = bfs.all(simple, "key", "value");
                assert.strictEqual(actual[0], simple);
            });
        });

        describe("key:value doesn't exist with bfs.first", function () {
            it("returns undefined", function () {
                const actual = bfs.first(simple, "key", "not a value");
                assert.strictEqual(actual, undefined);
            });
        });

        describe("key:value doesn't exist using bfs.all", function () {
            it("returns an empty array", function () {
                const actual = bfs.all(simple, "key", "not a value");
                assert.strictEqual(actual.length, 0);
            });
        });
    });

    describe("nested object with two fields", function () {
        describe("look for key:value using bfs.first", function () {
            it("returns the root object", function () {
                const actual = bfs.first(nested, "key", "value");
                assert.strictEqual(actual, nested);
            });
        });

        describe("look for key:value using bfs.all", function () {
            it("returns an array containing two objects", function () {
                const actual = bfs.all(nested, "key", "value");
                assert.strictEqual(actual.length, 2);
            });

            it("first object is the root", function () {
                const actual = bfs.all(nested, "key", "value");
                assert.strictEqual(actual[0], nested);
            });

            it("second object is the child", function () {
                const actual = bfs.all(nested, "key", "value");
                assert.strictEqual(actual[1], nested.child_0);
            });
        });

        describe("key:value doesn't exist with bfs.first", function () {
            it("returns undefined", function () {
                const actual = bfs.first(nested, "key", "not a value");
                assert.strictEqual(actual, undefined);
            });
        });

        describe("key:value doesn't exist using bfs.all", function () {
            it("returns an empty array", function () {
                const actual = bfs.all(nested, "key", "not a value");
                assert.strictEqual(actual.length, 0);
            });
        });

        describe("search for all objects with specific key but any value", function () {
            it("finds all objects", function () {
                const actual = bfs.all(nested, "key_1");
                assert.strictEqual(actual.length, 2);
                assert.strictEqual(actual[0], nested.child_1);
                assert.strictEqual(actual[1], nested.child_2);
            });
        });

        describe("search for first object with specific key but any value", function () {
            it("finds the correct object", function () {
                const actual = bfs.first(nested, "key_1");
                assert.strictEqual(actual, nested.child_1);
            });
        });

        describe("custom test find first", function () {
            it("finds the correct object", function () {
                const test = obj => {
                    for (const key in obj) {
                        if (key.startsWith("key_")) return true;
                    }
                    return false;
                };

                const actual = bfs.first(nested, test);
                assert.strictEqual(actual, nested.child_1);
            });
        });

        describe("custom test find all", function () {
            it("finds the correct objects", function () {
                const test = obj => {
                    for (const key in obj) {
                        if (key.startsWith("key_")) return true;
                    }
                    return false;
                };

                const actual = bfs.all(nested, test);
                assert.strictEqual(actual.length, 3);
            });
        });
    });
});
