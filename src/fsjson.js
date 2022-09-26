import Path from "path";
import FS from "fs";
import mkdirIf from "./mkdirif.js";

/**
 * Load a JSON file by merging paths.
 * Returns an empty object if no file found.
 * @param  {...any} paths
 * @returns parsed json object
 */
function loadJSON (...paths) {
    const path = Path.join(...paths);
    if (!FS.existsSync(path)) return {};
    return JSON.parse(FS.readFileSync(Path.join(...paths)));
}

function saveJSON (path, json) {
    FS.writeFileSync(mkdirIf(path), JSON.stringify(json, null, 2));
}

function writeFileField (path, key, value) {
    const json = loadJSON(path);
    json[key] = value;
    saveJSON(path, json);
}

/**
 * Load and return the JSON at path, combining it with object.
 * Similar to mergeJSON except existing values are preserved.
 * @param {*} path 
 * @param {*} object 
 */
 function loadIfJSON(path, object = {}){
    const previous = loadJSON(path);
    const next = {...object, ...previous};
    saveJSON(path, next);
    return next;
}

/**
 * Load json from path and merge it with object.
 * Similar to loadIfJSON except existing values are overwritten.
 * @param {*} path 
 * @param {*} object 
 * @returns 
 */
function mergeJSON(path, object = {}){
    const previous = loadJSON(path);
    const next = {...previous, ...object};
    saveJSON(path, next);
    return next;
}

const fsjson = {
    loadIf: loadIfJSON,
    load: loadJSON,
    save: saveJSON,
    merge: mergeJSON,
    writeField: writeFileField
};

export default fsjson;
