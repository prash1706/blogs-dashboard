(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("JSONFormatter", [], factory);
	else if(typeof exports === 'object')
		exports["JSONFormatter"] = factory();
	else
		root["JSONFormatter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(2);
	var helpers_ts_1 = __webpack_require__(6);
	var DATE_STRING_REGEX = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
	var PARTIAL_DATE_REGEX = /\d{2}:\d{2}:\d{2} GMT-\d{4}/;
	var JSON_DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
	// When toggleing, don't animated removal or addition of more than a few items
	var MAX_ANIMATED_TOGGLE_ITEMS = 10;
	var requestAnimationFrame = window.requestAnimationFrame || function (cb) { cb(); return 0; };
	;
	var _defaultConfig = {
	    hoverPreviewEnabled: false,
	    hoverPreviewArrayCount: 100,
	    hoverPreviewFieldCount: 5,
	    theme: null
	};
	module.exports = (function () {
	    /**
	     * @param {object} json The JSON object you want to render. It has to be an
	     * object or array. Do NOT pass raw JSON string.
	     *
	     * @param {number} [open=1] his number indicates up to how many levels the
	     * rendered tree should expand. Set it to `0` to make the whole tree collapsed
	     * or set it to `Infinity` to expand the tree deeply
	     *
	     * @param {object} [config=defaultConfig] -
	     *  defaultConfig = {
	     *   hoverPreviewEnabled: false,
	     *   hoverPreviewArrayCount: 100,
	     *   hoverPreviewFieldCount: 5
	     * }
	     *
	     * Available configurations:
	     *  #####Hover Preview
	     * * `hoverPreviewEnabled`:  enable preview on hover
	     * * `hoverPreviewArrayCount`: number of array items to show in preview Any
	     *    array larger than this number will be shown as `Array[XXX]` where `XXX`
	     *    is length of the array.
	     * * `hoverPreviewFieldCount`: number of object properties to show for object
	     *   preview. Any object with more properties that thin number will be
	     *   truncated.
	     *
	     * @param {string} [key=undefined] The key that this object in it's parent
	     * context
	    */
	    function JSONFormatter(json, open, config, key) {
	        if (open === void 0) { open = 1; }
	        if (config === void 0) { config = _defaultConfig; }
	        this.json = json;
	        this.open = open;
	        this.config = config;
	        this.key = key;
	        // Hold the open state after the toggler is used
	        this._isOpen = null;
	        // Setting default values for config object
	        if (this.config.hoverPreviewEnabled === undefined) {
	            this.config.hoverPreviewEnabled = _defaultConfig.hoverPreviewEnabled;
	        }
	        if (this.config.hoverPreviewArrayCount === undefined) {
	            this.config.hoverPreviewArrayCount = _defaultConfig.hoverPreviewArrayCount;
	        }
	        if (this.config.hoverPreviewFieldCount === undefined) {
	            this.config.hoverPreviewFieldCount = _defaultConfig.hoverPreviewFieldCount;
	        }
	    }
	    Object.defineProperty(JSONFormatter.prototype, "isOpen", {
	        /*
	         * is formatter open?
	        */
	        get: function () {
	            if (this._isOpen !== null) {
	                return this._isOpen;
	            }
	            else {
	                return this.open > 0;
	            }
	        },
	        /*
	         * set open state (from toggler)
	        */
	        set: function (value) {
	            this._isOpen = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JSONFormatter.prototype, "isDate", {
	        /*
	         * is this a date string?
	        */
	        get: function () {
	            return (this.type === 'string') &&
	                (DATE_STRING_REGEX.test(this.json) ||
	                    JSON_DATE_REGEX.test(this.json) ||
	                    PARTIAL_DATE_REGEX.test(this.json));
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JSONFormatter.prototype, "isUrl", {
	        /*
	         * is this a URL string?
	        */
	        get: function () {
	            return this.type === 'string' && (this.json.indexOf('http') === 0);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JSONFormatter.prototype, "isArray", {
	        /*
	         * is this an array?
	        */
	        get: function () {
	            return Array.isArray(this.json);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JSONFormatter.prototype, "isObject", {
	        /*
	         * is this an object?
	         * Note: In this context arrays are object as well
	        */
	        get: function () {
	            return helpers_ts_1.isObject(this.json);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JSONFormatter.prototype, "isEmptyObject", {
	        /*
	         * is this an empty object with no properties?
	        */
	        get: function () {
	            return !this.keys.length && this.isOpen && !this.isArray;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JSONFormatter.prototype, "isEmpty", {
	        /*
	         * is this an empty object or array?
	        */
	        get: function () {
	            return this.isEmptyObject || (this.keys && !this.keys.length && this.isArray);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JSONFormatter.prototype, "hasKey", {
	        /*
	         * did we recieve a key argument?
	         * This means that the formatter was called as a sub formatter of a parent formatter
	        */
	        get: function () {
	            return typeof this.key !== 'undefined';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JSONFormatter.prototype, "constructorName", {
	        /*
	         * if this is an object, get constructor function name
	        */
	        get: function () {
	            return helpers_ts_1.getObjectName(this.json);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JSONFormatter.prototype, "type", {
	        /*
	         * get type of this value
	         * Possible values: all JavaScript primitive types plus "array" and "null"
	        */
	        get: function () {
	            return helpers_ts_1.getType(this.json);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JSONFormatter.prototype, "keys", {
	        /*
	         * get object keys
	         * If there is an empty key we pad it wit quotes to make it visible
	        */
	        get: function () {
	            if (this.isObject) {
	                return Object.keys(this.json).map(function (key) { return key ? key : '""'; });
	            }
	            else {
	                return [];
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Toggles `isOpen` state
	     *
	    */
	    JSONFormatter.prototype.toggleOpen = function () {
	        this.isOpen = !this.isOpen;
	        if (this.isOpen) {
	            this.appendChildern(true);
	        }
	        else {
	            this.removeChildren(true);
	        }
	        if (this.element) {
	            this.element.classList.toggle(helpers_ts_1.cssClass('open'));
	        }
	    };
	    /**
	     * Generates inline preview
	     *
	     * @returns {string}
	    */
	    JSONFormatter.prototype.getInlinepreview = function () {
	        var _this = this;
	        if (this.isArray) {
	            // if array length is greater then 100 it shows "Array[101]"
	            if (this.json.length > this.config.hoverPreviewArrayCount) {
	                return "Array[" + this.json.length + "]";
	            }
	            else {
	                return "[" + this.json.map(helpers_ts_1.getPreview).join(', ') + "]";
	            }
	        }
	        else {
	            var keys = this.keys;
	            // the first five keys (like Chrome Developer Tool)
	            var narrowKeys = keys.slice(0, this.config.hoverPreviewFieldCount);
	            // json value schematic information
	            var kvs = narrowKeys.map(function (key) { return (key + ":" + helpers_ts_1.getPreview(_this.json[key])); });
	            // if keys count greater then 5 then show ellipsis
	            var ellipsis = keys.length >= this.config.hoverPreviewFieldCount ? '…' : '';
	            return "{" + kvs.join(', ') + ellipsis + "}";
	        }
	    };
	    /**
	     * Renders an HTML element and installs event listeners
	     *
	     * @returns {HTMLDivElement}
	    */
	    JSONFormatter.prototype.render = function () {
	        // construct the root element and assign it to this.element
	        this.element = helpers_ts_1.createElement('div', 'row');
	        // construct the toggler link
	        var togglerLink = helpers_ts_1.createElement('a', 'toggler-link');
	        // if this is an object we need a wrapper span (toggler)
	        if (this.isObject) {
	            togglerLink.appendChild(helpers_ts_1.createElement('span', 'toggler'));
	        }
	        // if this is child of a parent formatter we need to append the key
	        if (this.hasKey) {
	            togglerLink.appendChild(helpers_ts_1.createElement('span', 'key', this.key + ":"));
	        }
	        // Value for objects and arrays
	        if (this.isObject) {
	            // construct the value holder element
	            var value = helpers_ts_1.createElement('span', 'value');
	            // we need a wrapper span for objects
	            var objectWrapperSpan = helpers_ts_1.createElement('span');
	            // get constructor name and append it to wrapper span
	            var constructorName = helpers_ts_1.createElement('span', 'constructor-name', this.constructorName);
	            objectWrapperSpan.appendChild(constructorName);
	            // if it's an array append the array specific elements like brackets and length
	            if (this.isArray) {
	                var arrayWrapperSpan = helpers_ts_1.createElement('span');
	                arrayWrapperSpan.appendChild(helpers_ts_1.createElement('span', 'bracket', '['));
	                arrayWrapperSpan.appendChild(helpers_ts_1.createElement('span', 'number', (this.json.length)));
	                arrayWrapperSpan.appendChild(helpers_ts_1.createElement('span', 'bracket', ']'));
	                objectWrapperSpan.appendChild(arrayWrapperSpan);
	            }
	            // append object wrapper span to toggler link
	            value.appendChild(objectWrapperSpan);
	            togglerLink.appendChild(value);
	        }
	        else {
	            // make a value holder element
	            var value = this.isUrl ? helpers_ts_1.createElement('a') : helpers_ts_1.createElement('span');
	            // add type and other type related CSS classes
	            value.classList.add(helpers_ts_1.cssClass(this.type));
	            if (this.isDate) {
	                value.classList.add(helpers_ts_1.cssClass('date'));
	            }
	            if (this.isUrl) {
	                value.classList.add(helpers_ts_1.cssClass('url'));
	                value.setAttribute('href', this.json);
	            }
	            // Append value content to value element
	            var valuePreview = helpers_ts_1.getValuePreview(this.json, this.json);
	            value.appendChild(document.createTextNode(valuePreview));
	            // append the value element to toggler link
	            togglerLink.appendChild(value);
	        }
	        // if hover preview is enabled, append the inline preview element
	        if (this.isObject && this.config.hoverPreviewEnabled) {
	            var preview = helpers_ts_1.createElement('span', 'preview-text');
	            preview.appendChild(document.createTextNode(this.getInlinepreview()));
	            togglerLink.appendChild(preview);
	        }
	        // construct a children element
	        var children = helpers_ts_1.createElement('div', 'children');
	        // set CSS classes for children
	        if (this.isObject) {
	            children.classList.add(helpers_ts_1.cssClass('object'));
	        }
	        if (this.isArray) {
	            children.classList.add(helpers_ts_1.cssClass('array'));
	        }
	        if (this.isEmpty) {
	            children.classList.add(helpers_ts_1.cssClass('empty'));
	        }
	        // set CSS classes for root element
	        if (this.config && this.config.theme) {
	            this.element.classList.add(helpers_ts_1.cssClass(this.config.theme));
	        }
	        if (this.isOpen) {
	            this.element.classList.add(helpers_ts_1.cssClass('open'));
	        }
	        // append toggler and children elements to root element
	        this.element.appendChild(togglerLink);
	        this.element.appendChild(children);
	        // if formatter is set to be open call appendChildern
	        if (this.isObject && this.isOpen) {
	            this.appendChildern();
	        }
	        // add event listener for toggling
	        if (this.isObject) {
	            togglerLink.addEventListener('click', this.toggleOpen.bind(this));
	        }
	        return this.element;
	    };
	    /**
	     * Appends all the children to children element
	     * Animated option is used when user triggers this via a click
	    */
	    JSONFormatter.prototype.appendChildern = function (animated) {
	        var _this = this;
	        if (animated === void 0) { animated = false; }
	        var children = this.element.querySelector("div." + helpers_ts_1.cssClass('children'));
	        if (!children || this.isEmpty) {
	            return;
	        }
	        if (animated) {
	            var index_1 = 0;
	            var addAChild_1 = function () {
	                var key = _this.keys[index_1];
	                var formatter = new JSONFormatter(_this.json[key], _this.open - 1, _this.config, key);
	                children.appendChild(formatter.render());
	                index_1 += 1;
	                if (index_1 < _this.keys.length) {
	                    if (index_1 > MAX_ANIMATED_TOGGLE_ITEMS) {
	                        addAChild_1();
	                    }
	                    else {
	                        requestAnimationFrame(addAChild_1);
	                    }
	                }
	            };
	            requestAnimationFrame(addAChild_1);
	        }
	        else {
	            this.keys.forEach(function (key) {
	                var formatter = new JSONFormatter(_this.json[key], _this.open - 1, _this.config, key);
	                children.appendChild(formatter.render());
	            });
	        }
	    };
	    /**
	     * Removes all the children from children element
	     * Animated option is used when user triggers this via a click
	    */
	    JSONFormatter.prototype.removeChildren = function (animated) {
	        if (animated === void 0) { animated = false; }
	        var childrenElement = this.element.querySelector("div." + helpers_ts_1.cssClass('children'));
	        if (animated) {
	            var childrenRemoved_1 = 0;
	            var removeAChild_1 = function () {
	                if (childrenElement && childrenElement.children.length) {
	                    childrenElement.removeChild(childrenElement.children[0]);
	                    childrenRemoved_1 += 1;
	                    if (childrenRemoved_1 > MAX_ANIMATED_TOGGLE_ITEMS) {
	                        removeAChild_1();
	                    }
	                    else {
	                        requestAnimationFrame(removeAChild_1);
	                    }
	                }
	            };
	            requestAnimationFrame(removeAChild_1);
	        }
	        else {
	            if (childrenElement) {
	                childrenElement.innerHTML = '';
	            }
	        }
	    };
	    return JSONFormatter;
	}());


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {"sourceMap":true});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js?sourceMap!./../node_modules/less-loader/index.js?sourceMap!./style.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js?sourceMap!./../node_modules/less-loader/index.js?sourceMap!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, ".json-formatter-row {\n  font-family: monospace;\n}\n.json-formatter-row,\n.json-formatter-row a,\n.json-formatter-row a:hover {\n  color: black;\n  text-decoration: none;\n}\n.json-formatter-row .json-formatter-row {\n  margin-left: 1rem;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty {\n  opacity: 0.5;\n  margin-left: 1rem;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty:after {\n  display: none;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-object:after {\n  content: \"No properties\";\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-array:after {\n  content: \"[]\";\n}\n.json-formatter-row .json-formatter-string {\n  color: green;\n  white-space: pre;\n  word-wrap: break-word;\n}\n.json-formatter-row .json-formatter-number {\n  color: blue;\n}\n.json-formatter-row .json-formatter-boolean {\n  color: red;\n}\n.json-formatter-row .json-formatter-null {\n  color: #855A00;\n}\n.json-formatter-row .json-formatter-undefined {\n  color: #ca0b69;\n}\n.json-formatter-row .json-formatter-function {\n  color: #FF20ED;\n}\n.json-formatter-row .json-formatter-date {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.json-formatter-row .json-formatter-url {\n  text-decoration: underline;\n  color: blue;\n  cursor: pointer;\n}\n.json-formatter-row .json-formatter-bracket {\n  color: blue;\n}\n.json-formatter-row .json-formatter-key {\n  color: #00008B;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-row .json-formatter-constructor-name {\n  cursor: pointer;\n}\n.json-formatter-row .json-formatter-toggler {\n  line-height: 1.2rem;\n  font-size: 0.7rem;\n  vertical-align: middle;\n  opacity: 0.6;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-row .json-formatter-toggler:after {\n  display: inline-block;\n  transition: transform 100ms ease-in;\n  content: \"\\25BA\";\n}\n.json-formatter-row > a > .json-formatter-preview-text {\n  opacity: 0;\n  transition: opacity 0.15s ease-in;\n  font-style: italic;\n}\n.json-formatter-row:hover > a > .json-formatter-preview-text {\n  opacity: 0.6;\n}\n.json-formatter-row.json-formatter-open > .json-formatter-toggler-link .json-formatter-toggler:after {\n  transform: rotate(90deg);\n}\n.json-formatter-row.json-formatter-open > .json-formatter-children:after {\n  display: inline-block;\n}\n.json-formatter-row.json-formatter-open > a > .json-formatter-preview-text {\n  display: none;\n}\n.json-formatter-row.json-formatter-open.json-formatter-empty:after {\n  display: block;\n}\n.json-formatter-dark.json-formatter-row {\n  font-family: monospace;\n}\n.json-formatter-dark.json-formatter-row,\n.json-formatter-dark.json-formatter-row a,\n.json-formatter-dark.json-formatter-row a:hover {\n  color: white;\n  text-decoration: none;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-row {\n  margin-left: 1rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty {\n  opacity: 0.5;\n  margin-left: 1rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty:after {\n  display: none;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-object:after {\n  content: \"No properties\";\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-array:after {\n  content: \"[]\";\n}\n.json-formatter-dark.json-formatter-row .json-formatter-string {\n  color: #31F031;\n  white-space: pre;\n  word-wrap: break-word;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-number {\n  color: #66C2FF;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-boolean {\n  color: #EC4242;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-null {\n  color: #EEC97D;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-undefined {\n  color: #ef8fbe;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-function {\n  color: #FD48CB;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-date {\n  background-color: rgba(255, 255, 255, 0.05);\n}\n.json-formatter-dark.json-formatter-row .json-formatter-url {\n  text-decoration: underline;\n  color: #027BFF;\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-bracket {\n  color: #9494FF;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-key {\n  color: #23A0DB;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-constructor-name {\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-toggler {\n  line-height: 1.2rem;\n  font-size: 0.7rem;\n  vertical-align: middle;\n  opacity: 0.6;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-toggler:after {\n  display: inline-block;\n  transition: transform 100ms ease-in;\n  content: \"\\25BA\";\n}\n.json-formatter-dark.json-formatter-row > a > .json-formatter-preview-text {\n  opacity: 0;\n  transition: opacity 0.15s ease-in;\n  font-style: italic;\n}\n.json-formatter-dark.json-formatter-row:hover > a > .json-formatter-preview-text {\n  opacity: 0.6;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > .json-formatter-toggler-link .json-formatter-toggler:after {\n  transform: rotate(90deg);\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > .json-formatter-children:after {\n  display: inline-block;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > a > .json-formatter-preview-text {\n  display: none;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open.json-formatter-empty:after {\n  display: block;\n}\n", "", {"version":3,"sources":["/./src/style.less","/./src/style.less"],"names":[],"mappings":"AA0GA;EA3FE,uBAAA;CCbD;ADcC;;;EACE,aAAA;EACA,sBAAA;CCVH;ADkGD;EApFI,kBAAA;CCXH;ADeG;EACE,aAAA;EACA,kBAAA;CCbL;ADeK;EAAU,cAAA;CCZf;ADaK;EAAgC,yBAAA;CCVrC;ADWK;EAA+B,cAAA;CCRpC;ADkFD;EArEI,aAAA;EACA,iBAAA;EACA,sBAAA;CCVH;AD6ED;EAjE2B,YAAA;CCT1B;AD0ED;EAhE4B,WAAA;CCP3B;ADuED;EA/DyB,eAAA;CCLxB;ADoED;EA9D8B,eAAA;CCH7B;ADiED;EA7D6B,eAAA;CCD5B;AD8DD;EA5DyB,sCAAA;CCCxB;AD2DD;EA1DI,2BAAA;EACA,YAAA;EACA,gBAAA;CCEH;ADsDD;EArD4B,YAAA;CCE3B;ADmDD;EAnDI,eAAA;EACA,gBAAA;EACA,sBAAA;CCGH;AD8CD;EA9CI,gBAAA;CCGH;AD2CD;EA1CI,oBAAA;EACA,kBAAA;EACA,uBAAA;EACA,aAAA;EACA,gBAAA;EACA,sBAAA;CCEH;ADAG;EACE,sBAAA;EACA,oCAAA;EACA,iBAAA;CCEL;AD8BD;EA1BI,WAAA;EACA,kCAAA;EACA,mBAAA;CCDH;ADGC;EACE,aAAA;CCDH;ADKC;EAEI,yBAAA;CCJL;ADEC;EAKI,sBAAA;CCJL;ADDC;EAQI,cAAA;CCJL;ADMG;EACE,eAAA;CCJL;ADeD;EAhGE,uBAAA;CCoFD;ADnFC;;;EACE,aAAA;EACA,sBAAA;CCuFH;ADMD;EAzFI,kBAAA;CCsFH;ADlFG;EACE,aAAA;EACA,kBAAA;CCoFL;ADlFK;EAAU,cAAA;CCqFf;ADpFK;EAAgC,yBAAA;CCuFrC;ADtFK;EAA+B,cAAA;CCyFpC;ADVD;EA1EI,eAAA;EACA,iBAAA;EACA,sBAAA;CCuFH;ADfD;EAtE2B,eAAA;CCwF1B;ADlBD;EArE4B,eAAA;CC0F3B;ADrBD;EApEyB,eAAA;CC4FxB;ADxBD;EAnE8B,eAAA;CC8F7B;AD3BD;EAlE6B,eAAA;CCgG5B;AD9BD;EAjEyB,4CAAA;CCkGxB;ADjCD;EA/DI,2BAAA;EACA,eAAA;EACA,gBAAA;CCmGH;ADtCD;EA1D4B,eAAA;CCmG3B;ADzCD;EAxDI,eAAA;EACA,gBAAA;EACA,sBAAA;CCoGH;AD9CD;EAnDI,gBAAA;CCoGH;ADjDD;EA/CI,oBAAA;EACA,kBAAA;EACA,uBAAA;EACA,aAAA;EACA,gBAAA;EACA,sBAAA;CCmGH;ADjGG;EACE,sBAAA;EACA,oCAAA;EACA,iBAAA;CCmGL;AD9DD;EA/BI,WAAA;EACA,kCAAA;EACA,mBAAA;CCgGH;AD9FC;EACE,aAAA;CCgGH;AD5FC;EAEI,yBAAA;CC6FL;AD/FC;EAKI,sBAAA;CC6FL;ADlGC;EAQI,cAAA;CC6FL;AD3FG;EACE,eAAA;CC6FL","file":"style.less","sourcesContent":[".theme(\n  @default-color: black,\n  @string-color: green,\n  @number-color: blue,\n  @boolean-color: red,\n  @null-color: #855A00,\n  @undefined-color: rgb(202, 11, 105),\n  @function-color: #FF20ED,\n  @rotate-time: 100ms,\n  @toggler-opacity: 0.6,\n  @toggler-color: #45376F,\n  @bracket-color: blue,\n  @key-color: #00008B,\n  @url-color: blue ){\n\n  font-family: monospace;\n  &, a, a:hover {\n    color: @default-color;\n    text-decoration: none;\n  }\n\n  .json-formatter-row {\n    margin-left: 1rem;\n  }\n\n  .json-formatter-children {\n    &.json-formatter-empty {\n      opacity: 0.5;\n      margin-left: 1rem;\n\n      &:after { display: none; }\n      &.json-formatter-object:after { content: \"No properties\"; }\n      &.json-formatter-array:after { content: \"[]\"; }\n    }\n  }\n\n  .json-formatter-string {\n    color: @string-color;\n    white-space: pre;\n    word-wrap: break-word;\n  }\n  .json-formatter-number { color: @number-color; }\n  .json-formatter-boolean { color: @boolean-color; }\n  .json-formatter-null { color: @null-color; }\n  .json-formatter-undefined { color: @undefined-color; }\n  .json-formatter-function { color: @function-color; }\n  .json-formatter-date { background-color: fade(@default-color, 5%); }\n  .json-formatter-url {\n    text-decoration: underline;\n    color: @url-color;\n    cursor: pointer;\n  }\n\n  .json-formatter-bracket { color: @bracket-color; }\n  .json-formatter-key {\n    color: @key-color;\n    cursor: pointer;\n    padding-right: 0.2rem;\n  }\n  .json-formatter-constructor-name {\n    cursor: pointer;\n  }\n\n  .json-formatter-toggler {\n    line-height: 1.2rem;\n    font-size: 0.7rem;\n    vertical-align: middle;\n    opacity: @toggler-opacity;\n    cursor: pointer;\n    padding-right: 0.2rem;\n\n    &:after {\n      display: inline-block;\n      transition: transform @rotate-time ease-in;\n      content: \"►\";\n    }\n  }\n\n  // Inline preview on hover (optional)\n  > a > .json-formatter-preview-text {\n    opacity: 0;\n    transition: opacity .15s ease-in;\n    font-style: italic;\n  }\n  &:hover > a > .json-formatter-preview-text {\n    opacity: 0.6;\n  }\n\n  // Open state\n  &.json-formatter-open {\n    > .json-formatter-toggler-link .json-formatter-toggler:after{\n      transform: rotate(90deg);\n    }\n    > .json-formatter-children:after {\n      display: inline-block;\n    }\n    > a > .json-formatter-preview-text {\n      display: none;\n    }\n    &.json-formatter-empty:after {\n      display: block;\n    }\n  }\n}\n\n// Default theme\n.json-formatter-row {\n  .theme();\n}\n\n// Dark theme\n.json-formatter-dark.json-formatter-row {\n  .theme(\n    @default-color: white,\n    @string-color: #31F031,\n    @number-color: #66C2FF,\n    @boolean-color: #EC4242,\n    @null-color: #EEC97D,\n    @undefined-color: rgb(239, 143, 190),\n    @function-color: #FD48CB,\n    @rotate-time: 100ms,\n    @toggler-opacity: 0.6,\n    @toggler-color: #45376F,\n    @bracket-color: #9494FF,\n    @key-color: #23A0DB,\n    @url-color: #027BFF);\n}\n",".json-formatter-row {\n  font-family: monospace;\n}\n.json-formatter-row,\n.json-formatter-row a,\n.json-formatter-row a:hover {\n  color: black;\n  text-decoration: none;\n}\n.json-formatter-row .json-formatter-row {\n  margin-left: 1rem;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty {\n  opacity: 0.5;\n  margin-left: 1rem;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty:after {\n  display: none;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-object:after {\n  content: \"No properties\";\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-array:after {\n  content: \"[]\";\n}\n.json-formatter-row .json-formatter-string {\n  color: green;\n  white-space: pre;\n  word-wrap: break-word;\n}\n.json-formatter-row .json-formatter-number {\n  color: blue;\n}\n.json-formatter-row .json-formatter-boolean {\n  color: red;\n}\n.json-formatter-row .json-formatter-null {\n  color: #855A00;\n}\n.json-formatter-row .json-formatter-undefined {\n  color: #ca0b69;\n}\n.json-formatter-row .json-formatter-function {\n  color: #FF20ED;\n}\n.json-formatter-row .json-formatter-date {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.json-formatter-row .json-formatter-url {\n  text-decoration: underline;\n  color: blue;\n  cursor: pointer;\n}\n.json-formatter-row .json-formatter-bracket {\n  color: blue;\n}\n.json-formatter-row .json-formatter-key {\n  color: #00008B;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-row .json-formatter-constructor-name {\n  cursor: pointer;\n}\n.json-formatter-row .json-formatter-toggler {\n  line-height: 1.2rem;\n  font-size: 0.7rem;\n  vertical-align: middle;\n  opacity: 0.6;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-row .json-formatter-toggler:after {\n  display: inline-block;\n  transition: transform 100ms ease-in;\n  content: \"►\";\n}\n.json-formatter-row > a > .json-formatter-preview-text {\n  opacity: 0;\n  transition: opacity 0.15s ease-in;\n  font-style: italic;\n}\n.json-formatter-row:hover > a > .json-formatter-preview-text {\n  opacity: 0.6;\n}\n.json-formatter-row.json-formatter-open > .json-formatter-toggler-link .json-formatter-toggler:after {\n  transform: rotate(90deg);\n}\n.json-formatter-row.json-formatter-open > .json-formatter-children:after {\n  display: inline-block;\n}\n.json-formatter-row.json-formatter-open > a > .json-formatter-preview-text {\n  display: none;\n}\n.json-formatter-row.json-formatter-open.json-formatter-empty:after {\n  display: block;\n}\n.json-formatter-dark.json-formatter-row {\n  font-family: monospace;\n}\n.json-formatter-dark.json-formatter-row,\n.json-formatter-dark.json-formatter-row a,\n.json-formatter-dark.json-formatter-row a:hover {\n  color: white;\n  text-decoration: none;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-row {\n  margin-left: 1rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty {\n  opacity: 0.5;\n  margin-left: 1rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty:after {\n  display: none;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-object:after {\n  content: \"No properties\";\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-array:after {\n  content: \"[]\";\n}\n.json-formatter-dark.json-formatter-row .json-formatter-string {\n  color: #31F031;\n  white-space: pre;\n  word-wrap: break-word;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-number {\n  color: #66C2FF;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-boolean {\n  color: #EC4242;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-null {\n  color: #EEC97D;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-undefined {\n  color: #ef8fbe;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-function {\n  color: #FD48CB;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-date {\n  background-color: rgba(255, 255, 255, 0.05);\n}\n.json-formatter-dark.json-formatter-row .json-formatter-url {\n  text-decoration: underline;\n  color: #027BFF;\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-bracket {\n  color: #9494FF;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-key {\n  color: #23A0DB;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-constructor-name {\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-toggler {\n  line-height: 1.2rem;\n  font-size: 0.7rem;\n  vertical-align: middle;\n  opacity: 0.6;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-toggler:after {\n  display: inline-block;\n  transition: transform 100ms ease-in;\n  content: \"►\";\n}\n.json-formatter-dark.json-formatter-row > a > .json-formatter-preview-text {\n  opacity: 0;\n  transition: opacity 0.15s ease-in;\n  font-style: italic;\n}\n.json-formatter-dark.json-formatter-row:hover > a > .json-formatter-preview-text {\n  opacity: 0.6;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > .json-formatter-toggler-link .json-formatter-toggler:after {\n  transform: rotate(90deg);\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > .json-formatter-children:after {\n  display: inline-block;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > a > .json-formatter-preview-text {\n  display: none;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open.json-formatter-empty:after {\n  display: block;\n}\n"],"sourceRoot":"webpack://"}]);
	
	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	/*
	 * Escapes `"` charachters from string
	*/
	function escapeString(str) {
	    return str.replace('"', '\"');
	}
	/*
	 * Determines if a value is an object
	*/
	function isObject(value) {
	    var type = typeof value;
	    return !!value && (type == 'object');
	}
	exports.isObject = isObject;
	/*
	 * Gets constructor name of an object.
	 * From http://stackoverflow.com/a/332429
	 *
	*/
	function getObjectName(object) {
	    if (object === undefined) {
	        return '';
	    }
	    if (object === null) {
	        return 'Object';
	    }
	    if (typeof object === 'object' && !object.constructor) {
	        return 'Object';
	    }
	    var funcNameRegex = /function (.{1,})\(/;
	    var results = (funcNameRegex).exec((object).constructor.toString());
	    if (results && results.length > 1) {
	        return results[1];
	    }
	    else {
	        return '';
	    }
	}
	exports.getObjectName = getObjectName;
	/*
	 * Gets type of an object. Returns "null" for null objects
	*/
	function getType(object) {
	    if (object === null) {
	        return 'null';
	    }
	    return typeof object;
	}
	exports.getType = getType;
	/*
	 * Generates inline preview for a JavaScript object based on a value
	*/
	function getValuePreview(object, value) {
	    var type = getType(object);
	    if (type === 'null' || type === 'undefined') {
	        return type;
	    }
	    if (type === 'string') {
	        value = '"' + escapeString(value) + '"';
	    }
	    if (type === 'function') {
	        // Remove content of the function
	        return object.toString()
	            .replace(/[\r\n]/g, '')
	            .replace(/\{.*\}/, '') + '{…}';
	    }
	    return value;
	}
	exports.getValuePreview = getValuePreview;
	/*
	 * Generates inline preview for a JavaScript object
	*/
	function getPreview(object) {
	    var value = '';
	    if (isObject(object)) {
	        value = getObjectName(object);
	        if (Array.isArray(object))
	            value += '[' + object.length + ']';
	    }
	    else {
	        value = getValuePreview(object, object);
	    }
	    return value;
	}
	exports.getPreview = getPreview;
	/*
	 * Generates a prefixed CSS class name
	*/
	function cssClass(className) {
	    return "json-formatter-" + className;
	}
	exports.cssClass = cssClass;
	/*
	  * Creates a new DOM element wiht given type and class
	  * TODO: move me to helpers
	*/
	function createElement(type, className, content) {
	    var el = document.createElement(type);
	    if (className) {
	        el.classList.add(cssClass(className));
	    }
	    if (content !== undefined) {
	        if (content instanceof Node) {
	            el.appendChild(content);
	        }
	        else {
	            el.appendChild(document.createTextNode(String(content)));
	        }
	    }
	    return el;
	}
	exports.createElement = createElement;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=bundle.js.map