/*
 * 
 * @returns {boolean}
 */
function supportCustomElements() {
    return 'registerElement' in document;
}

/*
 * 
 * @returns {boolean}
 */
function supportTemplates() {
    return 'content' in document.createElement('template');
}

/*
 * 
 * @returns {boolean}
 */
function supportImports() {
    return 'import' in document.createElement('link');
}

Node.prototype.offSpring = function() {
    var n, a = [], walk = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, null, false);
    while (n = walk.nextNode())
        a.push(n);
    return a;
};

/*
 * 
 * @param {type} contentNode
 * @param {type} model
 * @returns {undefined}
 */
function parseContent(contentNode, model) {

    contentNode.offSpring().forEach(function(node) {

        var re = /{{[a-z]*}}/g;

        if (node.attributes) {
            for (var i = 0; i < node.attributes.length; i++) {
                var attribute = node.attributes.item(i);
                var matches = attribute.value.match(re);
                if (matches) {
                    matches.forEach(function(match) {
                        var field = match.slice(2, match.length - 2);
                        if (model.getNamedItem(field)) {
                            console.log('replace: ' + node.id + '.' + field + ' --> ' + model.getNamedItem(field).value);
                            var newStr = attribute.value.replace(match, model.getNamedItem(field).value);
                            node.setAttribute(attribute.nodeName, newStr);
                        }
                    });
                }
            }
        }

        if (node.textContent) {
            var matches = node.textContent.match(re);
            if (matches) {
                matches.forEach(function(match) {
                    var field = match.slice(2, match.length - 2);
                    if (model.getNamedItem(field)) {
                        console.log('replacecc: ' + node + '.' + field + ' --> ' + model.getNamedItem(field).value);
                        var newStr = node.textContent.replace(match, model.getNamedItem(field).value);
                        node.textContent = newStr;
                    }
                });
            }
        }
        
    });
}

/**
 * 
 * @param id
 * @param elem
 */
function CustomElement(id, elem) {

    var proto = Object.create(HTMLElement.prototype);

    proto.createdCallback = function(arg) {
        console.log('created');
        var link = document.querySelector('link[tag="'+id+'"]').import;
        var tmpl = link.querySelector('#' + id);
        var content = document.importNode(tmpl.content, true);
        parseContent(content, this.attributes);
        elem.shadowRoot = this.createShadowRoot();
        elem.shadowRoot.appendChild(content);
        if (elem.created)
            elem.created();
    };

    proto.attachedCallback = function(arg) {
        console.log('attached');
        if (elem.attached)
            elem.attached();
    };

    proto.detachedCallback = function(arg) {
        console.log('detached');
        if (elem.detached)
            elem.detached();
    };

    proto.attributeChangedCallback = function(attrName, oldVal, newVal) {
        console.log('attribute change');
        if (elem[attrName + 'Changed']) {
            elem[attrName + 'Changed'].call(elem, oldVal, newVal);
        }
    };

    proto.blink = function() {
        elem.blink();
    };

    return document.registerElement(id, {prototype: proto});
}

