Packages
========

convertdelimited.js
    Covert strings between different styles.
    delimiter(string, delimiter = '-')
    dash(string)
    pascal(string)
    camel(string)

fsjson.js
    Manage json files in one step.
    load(...paths) : if exists object from file else {}
    save(path, json) : makes directory if missing
    merge(path, object)
    writeField path, key, value)

mkdirif.js
    Make the parent directory of a path. Concats paths, if terminted with '/'
    treats as a path to a directory.
    mkdirIf (...paths:string) => fullpath

seekfiles.js
    Recursively seek all files that pass some test.
    seekFiles(roots:string[]) => fileData[]
    fileData = { root: '',
                 dir: 'sub',
                 base: 'j1.json',
                 ext: '.json',
                 name: 'j1',
                 full: 'sub/j1.json'
                }

replaceInFile.js
    Replace template literals (${..}) with values.
    replaceInFile(filename:string, literals:object)

Tests
=====

npx c8 mocha test
