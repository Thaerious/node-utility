import FS from "fs";
import Path from "path";

/**
 * Search root and all subdirectories for files that pass 'test'.
 * The test is passed a fileEntry from FS, with the full path appended to
 * the field 'full'.
 * 
 * Will follow symbolic links.
 * 
 * root: '',
 * dir: 'sub',
 * base: 'j1.json',
 * ext: '.json',
 * name: 'j1',
 * full: 'sub/j1.json'
 */
function seekFiles (roots, test = fe => true, result = []) {
    const visited = [];
    for (const root of [roots].flat(Infinity)) {
        processDirectory(root, test, result, visited);
    }

    return result;
}

function processDirectory (root, test, result, visited) {
    const absolute = Path.resolve(root);
    if (visited.indexOf(absolute) !== -1) return;
    visited.push(absolute);
    const contents = FS.readdirSync(root, { withFileTypes: true });

    for (const dirEntry of contents) {
        if (dirEntry.isSymbolicLink()) {
            const realpath = FS.realpathSync(Path.join(root, dirEntry.name));
            const stat = FS.lstatSync(realpath);
            if (stat.isDirectory()) processDirectory(realpath, test, result, visited);

        } else if (dirEntry.isDirectory()) {
            processDirectory(Path.join(root, dirEntry.name), test, result, visited);

        } else {
            const path = Path.join(root, dirEntry.name);
            const fileEntry = Path.parse(path);
            fileEntry.full = Path.join(fileEntry.dir, fileEntry.base);            
            if (test(fileEntry)) result.push(fileEntry);
        }
    }

    return result;
}

export default seekFiles;
