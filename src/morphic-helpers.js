// This contains the morphic testing helpers to be loaded on the client
var Test = {};  // namespace

(function(global) {

    var MEMORY = {};

    //////////// Selection ////////////
    var Selector = function(selector) {
    };

    // tl;dr selectors: '.CLASS_NAME', '#id', or '[attribute]'
    Selector.SELECTORS = /(#[a-zA-Z_]{1}[a-zA-Z0-9_]*|\[[a-zA-Z_]{1}[a-zA-Z0-9_]*\])/;

    Selector.prototype.parse = function(selector) {
    };

    Selector.prototype._select = function(root) {
        // Select on a single node (return [] of matches)
        var matches = [];
        // TODO
        return matches;
    };

    Selector.prototype.select = function(roots) {
        // For the given root node, find nodes that match
        return roots
            .map(function(root) {
                return this._select(root);
            }, this)
            .reduce(function(l1, l2) {
                return l1.concat(l2);
            }.bind(this), []);
    };

    // Select using .CLASS_NAME (like '.IDE_Morph')
    var ClassSelector = function(selector) {
        this._class = selector.slice(1);
    };
    
    ClassSelector.prototype = new Selector();
    ClassSelector.regex = /\.[a-zA-Z_]{1}[a-zA-Z0-9_]*/;

    ClassSelector.prototype._select = function(root) {
        // Search for children of the given class in the subtree
        // once we find a child, stop searching that tree
        var current,
            next = [root],
            result = [];

        while (next.length) {
            current = next;
            next = [];
            for (var i = current.length; i--;) {
                if (current[i].constructor.name === this._class) {
                    result.push(current[i]);
                } else {
                    next = next.concat(current[i].children);
                }
            }
        }

        return result;
    };

    var SELECTORS = [
        ClassSelector
    ];

    var matchSelector = function(selector) {
        var r,
            match;

        for (var i = SELECTORS.length; i--;) {
            r = SELECTORS[i].regex;
            match = selector.match(r);
            if (match) {
                return [match[0], SELECTORS[i]];
            }
        }
        return null;
    };

    var Select = function(string, roots) {
        var match = matchSelector(string),
            selector,
            s,
            selectors = [],
            nodes;

        while (match) {
            s = match[0];
            selector = match[1];
            // Find the string
            selectors.push(new selector(s));
            string = string.substring(s.length);
            match = matchSelector(string);
        }

        // use the selectors in order on the root nodes
        nodes = roots;
        for (var i = 0; i < selectors.length; i++) {
            nodes = selectors[i].select(nodes);
        }
        return nodes;
    };

    global.MEMORY = MEMORY;
    global.Selector = Selector;
    global.Select = Select;

})(Test);
