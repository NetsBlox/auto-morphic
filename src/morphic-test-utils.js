// This should contain a bunch of methods to be serialized and run in phantomjs

var select = function(id, root, selector) {
    var selection = Test.Select(selector, Test.MEMORY[root] || []);
    console.log('storing ' + selector + ' selection at ' + id);
    Test.MEMORY[id] = selection;
    return id;
};

var equal = function(id, value) {
    console.log('comparing ' + JSON.stringify(Test.MEMORY[id]) + ' to ' + value);
    return Test.MEMORY[id] == value;
};

var allEqual = function(id, value) {
    return Test.MEMORY[id].length && Test.MEMORY[id]
        .reduce(function(prev, curr) {
            return prev && curr == value;
        }, true);
};

var retrieve = function(id) {
    console.log('retrieving from ' + id);
    return Test.MEMORY[id];
};

var length = function(id) {
    return Test.MEMORY[id].length;
};

var selectWorlds = function(id) {
    var vars = Object.keys(window),
        matches = [];

    for (var i = vars.length; i--;) {
        if (window[vars[i]] instanceof WorldMorph) {
            matches.push(window[vars[i]]);
        }
    }

    console.log('found ' + matches.length + ' world(s)');
    console.log('storing world(s) at ' + id);
    Test.MEMORY[id] = matches;
    return id;
};

// Interaction
var click = function(id) {
    var item,
        clicked = 0,
        pos;

    for (var i = Test.MEMORY[id].length; i--;) {
        item = Test.MEMORY[id][i];
        pos = item.bounds.center();
        item.mouseClickLeft(pos);
        clicked++;
    }
    
    console.log('clicked ' + clicked + ' items');
    return clicked !== 0;
};

// debugging
var addresses = function() {
    return Object.keys(Test.MEMORY);
};

var hello = function() {
    return 'hello';
};

var utils = {
    select: select,
    click: click,
    retrieve: retrieve,
    length: length,
    selectWorlds: selectWorlds,
    equal: equal,
    allEqual: allEqual,
    hello: hello,
    addresses: addresses,
    delete: function(id) {
        delete Test.MEMORY[id];
    }

};

// Now some weird things happen to allow passing args btwn contexts...
var createFn = function(fn, args) {
    var defArgs,  // define arguments
        newFn = fn;

    if (args.length) {
        defArgs = [];

        for (var i = args.length; i--;) {
            defArgs.push(args[i] + ' = ' + JSON.stringify(arguments[i+2]));
        }

        newFn = fn.replace('{', '{\n\tvar ' + defArgs.join(',\n\t\t') + ';\n')
            .replace(/\t/g, '    ');  // tabs are 4 spaces (for debugging purposes)
    }

    return newFn;
};

// Convert the functions to templates
var fn,
    argRegex = /\(([\s]*[a-zA-Z_]{1}[a-zA-Z0-9_\s,]*)\)/,
    matches,
    args,
    newFn;

    // Add arrow fns with a single arg
    // TODO

for (var key in utils) {
    fn = utils[key].toString();
    matches = fn.match(argRegex);
    newFn = fn.replace(argRegex, '()');
    args = [];

    if (matches) {
        args = matches[1].replace(/\s*/g, '').split(',');
    }

    utils[key] = createFn.bind(null, newFn, args);
}

module.exports = utils;
