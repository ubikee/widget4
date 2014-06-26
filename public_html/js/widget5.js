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
function CustomElement(src, interface) {

    var tagName = (function (src) {
        var _link = document.querySelector('link[href$="' + src + '"]');
        return _link.id === "" ? 'w5-javasaurio' : _link.id;
    })(src);

    var proto = Object.create(HTMLElement.prototype);

    proto.createdCallback = function(arg) {
        
        // Obtain template through import link
        var link    = document.querySelector('link[href$="' + src + '"]').import;
        var tmpl    = link.querySelector('template');
        var content = document.importNode(tmpl.content, true);
        
        // Inject element instance
        this.element = createElement(interface, attributesIn(this));
        
        // Populate content
		content.populate(this.attributes);
	
		// Insert content into shadow
        var shadow = this.createShadowRoot();
        shadow.appendChild(content);
        
        if (this.element.created) element.created();
    };

    proto.attachedCallback = function(arg) {

    };

    proto.detachedCallback = function(arg) {

    };

    proto.attributeChangedCallback = function(attrName, oldVal, newVal) {
		/**
        if (elem[attrName + 'Changed']) {
            elem[attrName + 'Changed'].call(elem, oldVal, newVal);
        }
        **/
    };

    return document.registerElement(tagName, {prototype: proto});
}

Node.prototype.populate = function (model) {
	
	var node;
 
	var textNodes = document.createTreeWalker(this,NodeFilter.SHOW_TEXT,null,false);
	while (node = textNodes.nextNode()) {
		expressionsIn(node.textContent).forEach( function (match) {
			var field = match.slice(2, match.length-2);
			var newStr = node.textContent.replace(match, model.getNamedItem(field).value);
            node.textContent = newStr;
		});
	}
    
    var elementNodes = document.createTreeWalker(this,NodeFilter.SHOW_ELEMENT,null,false);
    while (node = elementNodes.nextNode()) {
		attributesIn(node).forEach( function(attribute) {
			var newValue = attribute.value;
			expressionsIn(attribute.value).forEach( function (match) {
				var field = match.slice(2, match.length-2);
				newValue = newValue.replace(match, model.getNamedItem(field).value);
			});
			attribute.value = newValue;
		});
	}
}

function expressionsIn(matchable) {
	var rexp = /{{[A-Za-z0-9_]*}}/g;
	var matches = matchable.match(rexp);
	return matches ? matches : [];
}

function attributesIn(node) {
	var attrs = [];
	for(var i = 0, length = node.attributes.length; i < length; i++) {
		attrs.push(node.attributes.item(i));
	}
	return attrs;
}

function createElement (interface, attributes) {
	var elem = interface();
	attributes.forEach( function (attribute) {
		//TODO: add attribute setter
	});
	return elem;
}
