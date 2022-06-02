import assert from "assert";
import FS from "fs";
import Path from "path";
import ParseArgs from "@thaerious/parseargs";
import {replaceInFile} from "../src/replaceInFile.js";
import mkdirIf from "../src/mkdirif.js";
const args = new ParseArgs().run();

const TEST_DIRECTORY = "test/temp/";
const cwd = process.cwd();

function setUp() {
    if (FS.existsSync(TEST_DIRECTORY)) FS.rmSync(TEST_DIRECTORY, { recursive: true });
    mkdirIf(TEST_DIRECTORY);

    const source = "test/mock/replaceInFile";
    const files = FS.readdirSync(source);
    files.forEach(file => {
        var curSource = Path.join(source, file);
        if (FS.lstatSync(curSource).isFile()) {
            FS.copyFileSync(curSource, Path.join(TEST_DIRECTORY, file));
        }
    });

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

describe("Test Replace In File", function () {
    before(setUp);
    after(cleanUp);

    describe("File with single field", function () {
        before(function (){
            replaceInFile("single_sentence.txt", {"fruit" : "apple"});
        });

        it("replaces the template literal (key) with the value", function(){
            const actual = FS.readFileSync("single_sentence.txt", {encoding : "utf-8"});
            const expected = "An apple is a fruit.";
            assert.strictEqual(actual, expected);
        });
    });

    describe("File with multiple fields", function () {
        before(function (){
            replaceInFile("double_sentence.txt", {"fruit" : "apple", quality : "good"});
        });

        it("replaces all templates literal with values", function(){
            const actual = FS.readFileSync("double_sentence.txt", {encoding : "utf-8"});
            const expected = "An apple is a good apple.";
            assert.strictEqual(actual, expected);
        });
    });

    describe("Keys can have spaces", function () {
        before(function (){
            replaceInFile("with_spaces.txt", {"first name" : "Bruce", "last name" : "Banner"});
        });

        it("replaces all templates literal with values", function(){
            const actual = FS.readFileSync("with_spaces.txt", {encoding : "utf-8"});
            const expected = "Bruce Banner is going on vacation.";
            assert.strictEqual(actual, expected);
        });
    });
});
