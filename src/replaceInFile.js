import FS from "fs";

/**
 * Replace all instances of a template variable with a value.
 * The variables are the keys of an object.
 * Opens the file 
 */
function replaceInFile (filename, pairs) {
    FS.writeFileSync(filename, loadTemplate(filename, pairs));
}

/**
 * Load a file with template variables, replacing the variables
 * with values from 'pairs' object.
 */
 function loadTemplate (filename, pairs) {
    let text = FS.readFileSync(filename, `utf-8`);
    for (const search in pairs){
        const replace = pairs[search];
        text = text.replaceAll("${" + search + "}", replace);
    }
    return text;
}

export {replaceInFile, loadTemplate};
