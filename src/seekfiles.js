import FS from "fs";
import Path from "path";

/**
 * Search root and all subdirectories for files that pass 'test'.
 * The test is passed a fileEntry from FS, with the full path appended to
 * the field 'full'.  The searched root will also the appened to the 
 * fileEntry object.
 * 
 * Will follow symbolic links.
 * 
 * root: 'dir',
 * dir: 'dir/sub',
 * base: 'j1.json',
 * ext: '.json',
 * name: 'j1',
 * full: 'dir/sub/j1.json'
 */
function seekFiles(roots, test = fe => true, result = []) {
    const visited = [];
    for (const root of [roots].flat(Infinity)) {
        processDirectory(root, test, result, visited, root);
    }

    return result;
}

function processDirectory (dir, test, result, visited, root) {
    const absolute = Path.resolve(dir);
    if (visited.indexOf(absolute) !== -1) return;
    visited.push(absolute);
    const contents = FS.readdirSync(dir, { withFileTypes: true });

    for (const dirEntry of contents) {
        if (dirEntry.isSymbolicLink()) {
            const realpath = FS.realpathSync(Path.join(dir, dirEntry.name));
            const stat = FS.lstatSync(realpath);
            if (stat.isDirectory()) processDirectory(realpath, test, result, visited, root);
        } else if (dirEntry.isDirectory()) {
            processDirectory(Path.join(dir, dirEntry.name), test, result, visited, root);
        } else {
            const path = Path.join(dir, dirEntry.name);
            const fileEntry = Path.parse(path);
            fileEntry.root = root;
            fileEntry.full = Path.join(fileEntry.dir, fileEntry.base);  
            if (test(fileEntry)) result.push(fileEntry);
        }
    }

    return result;
}

export default seekFiles;
