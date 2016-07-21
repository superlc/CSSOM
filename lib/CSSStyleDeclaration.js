//.CommonJS
var CSSOM = {};
///CommonJS


/**
 * @constructor
 * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
 */
CSSOM.CSSStyleDeclaration = function CSSStyleDeclaration(){
	this.length = 0;
	this.parentRule = null;
};


CSSOM.CSSStyleDeclaration.prototype = {

	constructor: CSSOM.CSSStyleDeclaration,

	/**
	 *
	 * @param {string} name
	 * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-getPropertyValue
	 * @return {string} the value of the property if it has been explicitly set for this declaration block.
	 * Returns the empty string if the property has not been set.
	 */
	getPropertyValue: function(name) {
		var self = this, valueIndexes = this[name], result;
		if (!valueIndexes) return null;
		if (valueIndexes.length === 1) {
			return this[valueIndexes[0]].value;
		}
		result = [];
		valueIndexes.forEach(function(i) {
			result.push(self[i].value);
		});
		return result;
	},

	/**
	 *
	 * @param {string} name
	 * @param {string} value
	 * @param {string} [priority=null] "important" or null
	 * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-setProperty
	 */
	setProperty: function(name, value, priority, overwrite) {
		var self = this;
		priority = priority ? priority : undefined;
		if (this[name]) {
			// Property already exist.
			if (overwrite) {
				// overwrite the first item, remove the rest items in the style
				this[name].forEach(function(valueIndex, index) {
					if (index === 0) {
						Array.prototype.splice.call(self, valueIndex, 1, {
							"name": name,
							"value": value,
							"priority": priority
						});
						return;
					}
					Array.prototype.splice.call(self, styleIndex - index + 1, 1);
				});
				return;
			}

			// not overwrite, add as a new item
			this[this.length] = {
				"name": name,
				"value": value,
				"priority": priority
			};
			this[name].push(this.length);
			this.length++;
		} else {
			// New property.
			this[this.length] = {
				"name": name,
				"value": value,
				"priority": priority
			};
			this[name] = [this.length];
			this.length++;
		}
	},

	/**
	 *
	 * @param {string} name
	 * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration-removeProperty
	 * @return {string} the value of the property if it has been explicitly set for this declaration block.
	 * Returns the empty string if the property has not been set or the property name does not correspond to a known CSS property.
	 */
	removeProperty: function(name) {
		if (!(name in this)) {
			return "";
		}
		var self = this, returnValue;
		if (this[name].length === 1) {
			returnValue = this[this[name][0]].value;
		} else {
			returnValue = [];
			this[name].forEach(function(i) {
				returnValue.push(self[i].value);
			});
		}
		this[name].forEach(function(styleIndex, index) {
			Array.prototype.splice.call(self, styleIndex - index, 1);
		});

		return returnValue;
	},

	getPropertyCSSValue: function() {
		//FIXME
	},

	/**
	 *
	 * @param {String} name
	 */
	getPropertyPriority: function(name) {
		if (!(name in this)) {
			return "";
		}
		if (this[name].length === 1) {
			return this[this[name][0]].priority ? this[this[name][0]].priority : "";
		}
		var self = this, result = [];
		this[name].forEach(function(i) {
			result.push(self[i].priority ? self[i].priority : "");
		});
		return result;
	},


	/**
	 *   element.style.overflow = "auto"
	 *   element.style.getPropertyShorthand("overflow-x")
	 *   -> "overflow"
	 */
	getPropertyShorthand: function() {
		//FIXME
	},

	isPropertyImplicit: function() {
		//FIXME
	},

	// Doesn't work in IE < 9
	get cssText(){
		var properties = [];
		var name, value, priority;
		for (var i = 0, length = this.length; i < length; i++) {
			name = this[i].name;
			value = this[i].value;
			priority = this[i].priority ? " !" + priority : "";
			properties[i] = name + ": " + value + priority + ";";
		}
		return properties.join(" ");
	},

	set cssText(cssText){
		for(var i = 0, length = this.length; i < length; i++) {
			this[this[i].name] = undefined;
		}
		Array.prototype.splice.call(this, 0, this.length);

		var dummyRule = CSSOM.parse('#bogus{' + cssText + '}').cssRules[0].style;
		var length = dummyRule.length;
		for (i = 0; i < length; ++i) {
			this.setProperty(dummyRule[i].name, dummyRule[i].value, dummyRule[i].priority);
		}
	}
};


//.CommonJS
exports.CSSStyleDeclaration = CSSOM.CSSStyleDeclaration;
CSSOM.parse = require('./parse').parse; // Cannot be included sooner due to the mutual dependency between parse.js and CSSStyleDeclaration.js
///CommonJS
