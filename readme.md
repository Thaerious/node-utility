# Packages

## convert
Covert strings between different styles.

    convert.delimiter(string, delimiter = '-')
    convert.dash(string)
    convert.pascal(string)
    convert.camel(string)

## fsjson
Manage json files in one step.

    fsjson.load(...paths) : if exists object from file else {}
    fsjson.save(path, json) : makes directory if missing
    fsjson.merge(path, object)
    fsjson.writeField path, key, value)

## mkdirif
Make the parent directory of a path.     Concats paths, if terminted with '/' treats as a path to a directory.

    mkdirIf (...paths:string) => fullpath

## seekfiles
    seekFiles(roots:string[]) => filedata[]
        Recursively seek all files that pass some test.

### filedata       
    { root: '',
      dir: 'sub',
      base: 'j1.json',
      ext: '.json',
      name: 'j1',
      full: 'sub/j1.json'
    }

## bfsObject

    bfsObject.first(root : object, key : string))
        Return the first object that has a key parameter with any value.

    bfsObject.first(root : object, key : string, value : string))
        Return the first object with a matching key:value pair.

    bfsObject.first(root : object, cb : function))
        Return the first object for which cb(object) returns true.

    bfsObject.all(root : object, key : string))
        Return all objects that have a key parameter with any value.

    bfsObject.all(root : object, key : string, value : string))
        Return all objects with a matching key:value pair.

    bfsObject.all(root : object, cb : function))
        Return all objects for which cb(object) returns true.        

    
    

## replaceInFile
Replace template literals (${..}) with values.  The key:value pairs in the 'literals' parmeter define the replacement.

    replaceInFile(filename:string, literals:object)
    loadTemplate(filename:string, literals:object)

Tests
=====

npx c8 mocha test
