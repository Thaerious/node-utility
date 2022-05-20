import Path from "path";
import FS from "fs";
import mkdirIf from "./mkdirif.js";

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

function mergeJSON(path, object){
    const previous = loadJSON(path);
    const next = {...previous, ...object};
    saveJSON(path, next);
}

const fsjson = {
    load: loadJSON,
    save: saveJSON,
    merge: mergeJSON,
    writeField: writeFileField
};

export default fsjson;
