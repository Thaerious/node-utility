import mkdirIf from "../src/mkdirif.js";
import assert from "assert";
import FS from "fs";
import ParseArgs from "@thaerious/parseargs";
const args = new ParseArgs().run();

const TEST_DIRECTORY = "test/temp";
const cwd = process.cwd();

function setUp(){
    mkdirIf(TEST_DIRECTORY);
    process.chdir("test");
}

function cleanUp () {
    if (!args.flags[`no-clean`]) {
        // clean up test directory unless --no-clean is specified
        process.chdir(cwd);
        if (FS.existsSync(TEST_DIRECTORY)) FS.rmSync(TEST_DIRECTORY, { recursive: true });
    } else {
        console.log("\n *** see test directory: test/temp");
    }
};

describe("Test Make Directory If", function () {
    describe("make directory for file path (/temp/ima-file)", function () {
        before(setUp);
        after(cleanUp);

        it("directory exists", () => {
            mkdirIf("temp/ima-file")
            assert.ok(FS.existsSync("temp"));
        });

        it("returns the full path when the dir doesn't exist", () => {
            const actual = mkdirIf("temp/2/ima-file")
            const expected = "temp/2/ima-file";
            assert.strictEqual(actual, expected);
        });

        it("returns the full path when the dir does exist", () => {
            const actual = mkdirIf("temp/ima-file")
            const expected = "temp/ima-file";
            assert.strictEqual(actual, expected);
        });

        it("works with deep nested directory", () => {
            const actual = mkdirIf("temp/one/two/three/ima-file")
            assert.ok(FS.existsSync("temp/one/two/three"));
        });

        it("creates path from var-len-arg strings", () => {
            const actual = mkdirIf("temp", "one", "dir", "filename")
            assert.ok(FS.existsSync("temp/one/dir"));
        });

        it("when terminated with / treats the path as a whole directory", () => {
            const actual = mkdirIf("temp/sub/")
            assert.ok(FS.existsSync("temp/sub"));
        });

        it("just a file does nothing", () => {
            const actual = mkdirIf("filename")
            assert.ok(!FS.existsSync("filename"));
        });
    });
});
