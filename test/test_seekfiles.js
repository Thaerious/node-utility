import mkdirIf from "../src/mkdirif.js";
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

const structure = {
    files: ["file1.txt", "file2.txt", "j1.json"],
    sub: {
        circular : "../sub",
        files: ["file3.txt"],
        deep1: {
            files: ["j1.json", "j2.json"],
        },
        deep2: {
            files: ["k1.json", "k2.json"],
        },
    },
    deep2: "sub/deep2"
};

function buildDir(current = structure) {
    const cwdBefore = process.cwd();

    for (const key in current) {
        const value = current[key];
        if (Array.isArray(value)) {
            for (const fn of value) {
                FS.writeFileSync(fn, "");
            }
        } else if (typeof value === "object") {
            mkdirIf(key + "/");
            process.chdir(key);
            buildDir(value);
            process.chdir("..");
        } else if (typeof value === "string") {
            FS.symlinkSync(value, key);
        }
    }

    process.chdir(cwdBefore);
}

describe("Test Seek Files", function () {
    before(setUp);
    before(buildDir);
    after(cleanUp);

    describe("search for all files", function () {
        before(function () {
            this.result = seekFiles(".");
        });

        it("8 results returned", function () {
            assert.equal(this.result.length, 8);
        });

        it("check a record", function () {
            const acutal = bfs.first(this.result, "full", "sub/deep1/j2.json");
            const expected = {
                root: '',
                dir: 'sub/deep1',
                base: 'j2.json',
                ext: '.json',
                name: 'j2',
                full: 'sub/deep1/j2.json'
              };
            assert.deepEqual(acutal, expected);
        });
    });

    describe("search for .txt files", function () {
        before(function () {
            this.result = seekFiles(".", fe => fe.ext === ".txt");
        });

        it("3 results returned", function () {
            assert.equal(this.result.length, 3);
        });
    });

    describe("search specific directories", function () {
        before(function () {
            this.result = seekFiles(["./sub/deep1", ["./sub/deep2"]]);
        });

        it("3 results returned", function () {
            assert.equal(this.result.length, 4);
        });
    });  
    
    describe("search same directory twice", function () {
        before(function () {
            this.result = seekFiles(["./sub/deep1", "./sub/deep1"]);
        });

        it("will not return repeats", function () {
            assert.equal(this.result.length, 2);
        });
    });   

    describe("follows symbolic links", function () {
        before(function () {
            this.result = seekFiles("deep2");
        });

        it("returns followed files", function () {
            assert.equal(this.result.length, 2);
        });
    });   
});
