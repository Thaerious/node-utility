/**
 * Search the root object and all subsequent child objects for an object with
 * and attribute named 'key' with the value 'value'.  If value is omitted
 * returns any object with attribute named 'key'.
 *
 * Returns the first object in a breadth-first-search that matches the criteria.
 * Returns root if it meets the criteria.
 * Returns undefined when no match is found.
 * The 'test' function accepts the value of key when it is found on an object.
 * It defaults to simple equivalency.
 *
 * use: bfsObject(object, 'name', 'value');
 *
 * @param {*} root
 * @param {*} key
 * @param {*} value
 * @param {*} test (value) test function defaults for equivalency
 * @returns
 */
function bfsFirst (root, key, value) {
    if (typeof key === "function") return(bfsTestFirst(root, key));

    return bfsTestFirst(root, obj=>{
        if (value) return obj[key] === value;
        else return obj[key] !== undefined;
    });
}

function bfsTestFirst (root, test) {
    const queue = [];

    if (Array.isArray(root)) for (const item of root) queue.push(item);
    else if (typeof (root) === `object`) queue.push(root);
    else return undefined;

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;
        if (test(current)) return current;
        pushObjectValues(queue, current);
    }
    return undefined;
}

function bfsAll (root, key, value) {
    if (typeof key === "function") return(bfsTestAll(root, key));

    return bfsTestAll(root, obj=>{
        if (value) return obj[key] === value;
        else return obj[key] !== undefined;
    });
}

function bfsTestAll (root, test) {
    const found = [];
    const queue = [];

    if (Array.isArray(root)) for (const item of root) queue.push(item);
    else if (typeof (root) === `object`) queue.push(root);
    else return [];

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;
        if (test(current)) found.push(current);
        pushObjectValues(queue, current);
    }
    return found;
}

function pushObjectValues (queue, current) {
    for (const prop of Object.keys(current)) {
        if (typeof current[prop] === `object`) {
            queue.push(current[prop]);
        }
    }
}

const bfsObject = {
    first : bfsFirst,
    all : bfsAll
}

export default bfsObject;
