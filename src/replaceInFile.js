import FS from "fs";

/**
 * Replace all instances of a template variable with a value.
 * The variables are the keys of an object.
 * Opens the file 
 */
function replaceInFile (filename, pairs) {
    let text = FS.readFileSync(filename, `utf-8`);
    for (const search in pairs){
        const replace = pairs[search];
        text = text.replaceAll("${" + search + "}", replace);
    }
    FS.writeFileSync(filename, text);
}

export default replaceInFile;
