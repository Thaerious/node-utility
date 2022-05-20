import fsjson from "../src/fsjson.js";
import mkdirIf from "../src/mkdirif.js";
import assert from "assert";
import FS from "fs";
import ParseArgs from "@thaerious/parseargs";
const args = new ParseArgs().run();

const TEST_DIRECTORY = "test/temp/";
const cwd = process.cwd();

function setUp(){
    if (FS.existsSync(TEST_DIRECTORY)) FS.rmSync(TEST_DIRECTORY, { recursive: true });
    mkdirIf(TEST_DIRECTORY);
    process.chdir(TEST_DIRECTORY);    
}

function cleanUp() {
    if (!args.flags[`no-clean`]) {
        // clean up test directory unless --no-clean is specified
        process.chdir(cwd);
        if (FS.existsSync(TEST_DIRECTORY)) FS.rmSync(TEST_DIRECTORY, { recursive: true });
    } else {
        console.log("\n *** see test directory: test/temp");
    }
}

describe("Test FS Json", function () {
    before(setUp);
    after(cleanUp);

    it("returns empty object if it doesn't exist", () => {
        const actual = fsjson.load("none.json");
        const expected = {};
        assert.deepEqual(actual, expected);
    });

    it("saves a new object", () => {
        const actual = fsjson.save("test_save.json", {a:1, b:2});
        assert.ok(FS.existsSync("test_save.json"));
    });

    it("loads an object", () => {
        fsjson.save("test_load.json", {a:1, b:2})
        const actual = fsjson.load("test_load.json");
        const expected = {a:1, b:2};
        assert.deepEqual(actual, expected);
    });

    describe("add a field to a file", function (){
        before(function(){
            fsjson.save("test_add_field.json", {a:1, b:2})
            fsjson.writeField("test_add_field.json", "c", "3");
        });

        it("has the field", function(){
            const actual = fsjson.load("test_add_field.json");
            const expected = {a:1, b:2, c:3};
            assert.deepEqual(actual, expected);
        });
    });

    describe("overwrites an existing field", function (){
        before(function(){
            fsjson.save("test_add_field.json", {a:1, b:2})
            fsjson.writeField("test_add_field.json", "a", "3");
        });

        it("has the field", function(){
            const actual = fsjson.load("test_add_field.json");
            const expected = {a:3, b:2};
            assert.deepEqual(actual, expected);
        });
    });

    describe("merge objects", function (){
        before(function(){
            fsjson.save("test_merge.json", {a:1, b:2})
            fsjson.merge("test_merge.json", {b:3, c:4});
        });

        it("keeps previous fields", function(){
            const actual = fsjson.load("test_merge.json")['a'];
            const expected = 1;
            assert.deepEqual(actual, expected);
        });

        it("new fields have precedence", function(){
            const actual = fsjson.load("test_merge.json")['b'];
            const expected = 3;
            assert.deepEqual(actual, expected);
        });

        it("add new (previously non-existent fields)", function(){
            const actual = fsjson.load("test_merge.json")['c'];
            const expected = 4;
            assert.deepEqual(actual, expected);
        });
    });

});
