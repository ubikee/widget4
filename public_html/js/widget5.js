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
		
		console.time('populate')
		content.populate(this.attributes);
		console.timeEnd('populate');
	
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


Node.prototype.populate = function (model) {
	
	var node;
	var re = /{{[A-Za-z0-9_]*}}/g;  
	 
	var textNodes = document.createTreeWalker(this,NodeFilter.SHOW_TEXT,null,false);
	while (node = textNodes.nextNode()) {
		var matches = node.textContent.match(re);
		if (matches) {
			matches.forEach( function (match) {
				var field = match.slice(2, match.length-2);
                if (model[field]) {
					var newStr = node.textContent.replace(match, model.getNamedItem(field).value);
                    node.textContent = newStr;
				}
			});
		}
	}
    
    var elementNodes = document.createTreeWalker(this,NodeFilter.SHOW_ELEMENT,null,false);
    while (node = elementNodes.nextNode()) {            
		for(var i = 0, length = node.attributes.length; i < length; i++) {
			var attr = node.attributes.item(i);   
			var matches = attr.value.match(re);
			if (matches) {
				matches.forEach( function (match) {
					var field = match.slice(2, match.length-2);
					attr.value = model.getNamedItem(field).value;
				});
			}
		}
	}
}
