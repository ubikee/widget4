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

/**
 * 
 * @param id
 * @param elem
 */
function CustomElement(src, elem) {

    var src = src;
    var elem = elem;
    
    var tagName = (function (src) {
        var _link = document.querySelector('link[href$="' + src + '"]');
        return _link.id === "" ? 'w5-javasaurio' : _link.id;
    })(src);

    var proto = Object.create(HTMLElement.prototype);

    proto.createdCallback = function(arg) {
        
        console.log('created');
        
        var link = document.querySelector('link[href$="' + src + '"]').import;
        var tmpl = link.querySelector('template');
        var content = document.importNode(tmpl.content, true);
        
        for (var i = 0, length = content.children.length; i < length; i++) {
            var templ = content.children[i].innerHTML;
            for (var j = 0, l2 = this.attributes.length; j< l2; j++ ) {
                var a = this.attributes.item(j);
                templ = templ.replace('{{'+a.nodeName+'}}', a.value);
            }
            content.children[i].innerHTML = templ;
        }

        elem.shadowRoot = this.createShadowRoot();
        elem.shadowRoot.appendChild(content);
        
        // TODO : bindings
        
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

    return document.registerElement(tagName, {prototype: proto});
}