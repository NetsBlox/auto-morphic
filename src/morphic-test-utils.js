// This should contain a bunch of methods to be serialized and run in phantomjs

var select = function(id, root, selector, done) {
    return Test.Select(id, Test.MEMORY[root] || [], selector, done);
};

var attr = function(id, root, attr) {
    var roots = Test.MEMORY[root] || [],
        results = [];

    for (var i = roots.length; i--;) {
        if (roots[i].hasOwnProperty(attr)) {
            results.push(roots[i][attr]);
        }
    }

    //logger.log('found ' + results.length + ' w/ attr "' + attr + '"');
    Test.MEMORY[id] = results;
    return id;
};

var equal = function(id, value) {
    //logger.log('comparing ' + JSON.stringify(Test.MEMORY[id]) + ' to ' + value);
    return Test.MEMORY[id] == value;
};

var allEqual = function(id, value) {
    return Test.MEMORY[id] && Test.MEMORY[id].length && Test.MEMORY[id]
        .reduce(function(prev, curr) {
            return prev && curr == value;
        }, true);
};

var retrieve = function(id) {
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

    //logger.log('storing world(s) at ' + id);
    Test.MEMORY[id] = matches;
    return matches.length;
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
    
    //logger.log('clicked ' + clicked + ' items');
    return clicked !== 0;
};

var type = function(id, text) {
    var selection = Test.MEMORY[id],
        worlds = [],
        world,
        i;

    for (i = selection.length; i--;) {
        world = selection[i].world();
        if (worlds.indexOf(world) === -1) {
            worlds.push(world);
        }
    }

    for (i = 0; i < text.length; i++) {
        event = {charCode: text.charCodeAt(i)};  // TODO: Add shift, ctrl?
        for (var w = worlds.length; w--;) {
            worlds[w].keyboardReceiver.processKeyPress(event);
        }
    }

    return worlds.length > 0;
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
    attr: attr,
    retrieve: retrieve,
    length: length,
    selectWorlds: selectWorlds,
    equal: equal,
    allEqual: allEqual,

    // debugging
    hello: hello,
    addresses: addresses,

    // interaction
    click: click,
    type: type,
    delete: function(id) {
        delete Test.MEMORY[id];
    }

};

// Now some weird things happen to allow passing args btwn contexts...
//var createFn = function(fn, args) {
    //var defArgs,  // define arguments
        //newFn = fn;

    //if (args.length) {
        //defArgs = [];

        //for (var i = args.length; i--;) {
            //defArgs.push(args[i] + ' = ' + JSON.stringify(arguments[i+2]));
        //}

        //newFn = fn.replace('{', '{\n\tvar ' + defArgs.join(',\n\t\t') + ';\n')
            //.replace(/\t/g, '    ');  // tabs are 4 spaces (for debugging purposes)
    //}

    //return newFn;
//};

//// Convert the functions to templates
//var fn,
    //argRegex = /\(([\s]*[a-zA-Z_]{1}[a-zA-Z0-9_\s,]*)\)/,
    //matches,
    //args,
    //newFn;

    //// Add arrow fns with a single arg
    //// TODO

//for (var key in utils) {
    //fn = utils[key].toString();
    //matches = fn.match(argRegex);
    //newFn = fn.replace(argRegex, '()');
    //args = [];

    //if (matches) {
        //args = matches[1].replace(/\s*/g, '').split(',');
    //}

    //utils[key] = createFn.bind(null, newFn, args);
//}

module.exports = utils;
