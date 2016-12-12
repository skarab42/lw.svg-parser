(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("SVGParser", [], factory);
	else if(typeof exports === 'object')
		exports["SVGParser"] = factory();
	else
		root["SVGParser"] = factory();
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
/******/ 	__webpack_require__.p = "";
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

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Parser = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Imports
	
	
	var _tag = __webpack_require__(2);
	
	var _tagparser = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// SVG parser class
	var Parser = function () {
	    // Class constructor...
	    function Parser(settings) {
	        _classCallCheck(this, Parser);
	
	        // Defaults settings
	        settings = settings || {};
	
	        // Init properties
	        this.element = null; // XML document Element object
	        this.editor = null; // Editor info { name, version, fingerprint }
	        this.document = null; // Document info { width, height, viewBox }
	        this.defs = null; // Defined <defs> (DOM) nodes list by id
	        this.tags = null; // Tag objects hierarchy
	
	        // Supported tags by this lib
	        this.supportedTags = ['svg', 'g', 'defs', 'use', 'line', 'polyline', 'polygon', 'rect', 'circle', 'ellipse', 'path', 'title', 'desc'];
	
	        // Tags list to includes/excludes
	        this.parseTags = settings.includes || this.supportedTags;
	        this.skipTags = settings.excludes || ['#text']; // silent (no warning)
	
	        // User onTag callback ?
	        settings.onTag && this.onTag(settings.onTag, settings.onTagContext);
	    }
	
	    // Load raw XML string, XMLDocument, Element or File object
	
	
	    _createClass(Parser, [{
	        key: 'load',
	        value: function load(input) {
	            // Load raw XML string
	            if (typeof input === 'string') {
	                return this.loadFromString(input);
	            }
	
	            // Load File object
	            if (input instanceof File) {
	                return this.loadFromFile(input);
	            }
	
	            // Load XMLDocument object
	            if (input instanceof XMLDocument) {
	                return this.loadFromXMLDocument(input);
	            }
	
	            // Load Element object
	            if (input instanceof Element) {
	                return this.loadFromElement(input);
	            }
	
	            // Return rejected promise with an Error object
	            return Promise.reject(new Error('Unsupported input format.'));
	        }
	
	        // Load from Element object
	
	    }, {
	        key: 'loadFromElement',
	        value: function loadFromElement(input) {
	            var _this = this;
	
	            return new Promise(function (resolve, reject) {
	                // Bad input type
	                if (!(input instanceof Element)) {
	                    reject(new Error('Input param must be a Element object.'));
	                }
	
	                // Parser error
	                if (input.nodeName === 'parsererror') {
	                    // FF
	                    reject(new Error(input.textContent));
	                }
	
	                if (input.nodeName === 'html' && input.getElementsByTagName('parsererror')) {
	                    // Chrome
	                    reject(new Error(input.getElementsByTagName('parsererror')[0].textContent));
	                }
	
	                // Set document element
	                _this.element = input;
	
	                // Resolve promise
	                resolve(input);
	            });
	        }
	
	        // Load from XMLDocument object
	
	    }, {
	        key: 'loadFromXMLDocument',
	        value: function loadFromXMLDocument(input) {
	            var _this2 = this;
	
	            return new Promise(function (resolve, reject) {
	                // Bad input type
	                if (!(input instanceof XMLDocument)) {
	                    reject(new Error('Input param must be a XMLDocument object.'));
	                }
	
	                // Load from Element...
	                _this2.loadFromElement(input.documentElement).then(resolve).catch(reject);
	            });
	        }
	
	        // Load raw XML string
	
	    }, {
	        key: 'loadFromString',
	        value: function loadFromString(input) {
	            var _this3 = this;
	
	            return new Promise(function (resolve, reject) {
	                // Bad input type
	                if (typeof input !== 'string') {
	                    reject(new Error('Input param must be a string.'));
	                }
	
	                // Parse svg editor
	                _this3._parseEditor(input);
	
	                // Parse string as DOM object
	                var parser = new DOMParser();
	                var XMLDoc = parser.parseFromString(input, 'text/xml');
	
	                // Load from XMLDocument...
	                _this3.loadFromXMLDocument(XMLDoc).then(resolve).catch(reject);
	            });
	        }
	
	        // Try to get the svg editor from input string
	
	    }, {
	        key: '_parseEditor',
	        value: function _parseEditor(input) {
	            // Reset editor
	            this.editor = {
	                name: 'unknown',
	                version: null,
	                fingerprint: null
	            };
	
	            // Fingerprint matches
	            var fingerprint = void 0;
	
	            // Inkscape
	            fingerprint = input.match(/<!-- Created with Inkscape .*-->/i);
	
	            if (fingerprint) {
	                this.editor.name = 'inkscape';
	                this.editor.fingerprint = fingerprint[0];
	
	                return this.editor;
	            }
	
	            // Illustrator
	            fingerprint = input.match(/<!-- Generator: Adobe Illustrator ([0-9\.]+), .*-->/i);
	
	            if (fingerprint) {
	                this.editor.name = 'illustrator';
	                this.editor.version = fingerprint[1];
	                this.editor.fingerprint = fingerprint[0];
	
	                return this.editor;
	            }
	
	            // Return default
	            return this.editor;
	        }
	
	        // Load from File object
	
	    }, {
	        key: 'loadFromFile',
	        value: function loadFromFile(input) {
	            var _this4 = this;
	
	            return new Promise(function (resolve, reject) {
	                // Bad input type
	                if (!(input instanceof File)) {
	                    reject(new Error('Input param must be a File object.'));
	                }
	
	                // Create file reader
	                var reader = new FileReader();
	
	                // Register reader events handlers
	                reader.onload = function (event) {
	                    _this4.loadFromString(event.target.result).then(resolve).catch(reject);
	                };
	
	                reader.onerror = function (event) {
	                    reject(new Error('Error reading file : ' + input.name));
	                };
	
	                // Finally read input file as text
	                reader.readAsText(input);
	            });
	        }
	
	        // Parse the (loaded) element
	
	    }, {
	        key: 'parse',
	        value: function parse(input) {
	            var _this5 = this;
	
	            // Reset properties
	            this.document = null;
	            this.defs = {};
	            this.tags = null;
	
	            // Load input if provided
	            if (input) {
	                return new Promise(function (resolve, reject) {
	                    _this5.load(input).then(function () {
	                        resolve(_this5.parse());
	                    }).catch(reject);
	                });
	            }
	
	            // Start parsing element
	            return new Promise(function (resolve, reject) {
	                // If no element is loaded
	                if (!_this5.element) {
	                    reject(new Error('No element is loaded, call the load method before.'));
	                }
	
	                // Parse the main Element (recursive)
	                _this5.tags = _this5._parseElement(_this5.element);
	
	                if (!_this5.tags) {
	                    reject(new Error('No supported tags found.'));
	                }
	
	                // Apply matrix (recursive)
	                _this5.tags.applyMatrix();
	
	                // Resolve the promise
	                resolve(_this5.tags);
	            });
	        }
	
	        // On tag callback
	
	    }, {
	        key: '_onTag',
	        value: function _onTag(tag) {
	            console.info('onTag:', tag);
	        }
	
	        // Register on tag callback
	
	    }, {
	        key: 'onTag',
	        value: function onTag(callback, context) {
	            var _this6 = this;
	
	            this._onTag = function (tag) {
	                return callback.call(context || _this6, tag);
	            };
	        }
	
	        // Parse the provided Element and return an Tag collection (recursive)
	
	    }, {
	        key: '_parseElement',
	        value: function _parseElement(element, parent) {
	            var _this7 = this;
	
	            // Create base tag object
	            var tag = new _tag.Tag(element, parent);
	
	            // Exluded tag ?
	            if (this.skipTags.indexOf(tag.name) !== -1) {
	                return null; // silent
	            }
	
	            // Supported tag ?
	            if (this.parseTags.indexOf(tag.name) === -1) {
	                return this._skipTag(tag, 'unsupported');
	            }
	
	            // Parse the tag
	            var tagParser = new _tagparser.TagParser(tag, parser);
	
	            if (!tagParser.parse()) {
	                return false;
	            }
	
	            // Call the on tag callback
	            this._onTag(tag);
	
	            // Parse child nodes
	            var childTag = void 0;
	
	            element.childNodes.forEach(function (childNode) {
	                // Parse child element
	                if (childTag = _this7._parseElement(childNode, tag)) {
	                    tag.addChild(childTag);
	                }
	            });
	
	            // Empty group
	            if (['svg', 'g'].indexOf(tag.name) !== -1 && !tag.children.length) {
	                return this._skipTag(tag, 'empty');
	            }
	
	            // Return tag object
	            return tag;
	        }
	
	        // Log skip tag warning message
	
	    }, {
	        key: '_skipTag',
	        value: function _skipTag(tag, message) {
	            console.warn('Skip tag :', message + ':', tag);
	            return false;
	        }
	
	        // Log skip tag attribute warning message
	
	    }, {
	        key: '_skipTagAttr',
	        value: function _skipTagAttr(tag, attr, message) {
	            console.warn('Skip tag attribute :', message + ':', attr, tag);
	            return false;
	        }
	    }]);
	
	    return Parser;
	}();
	
	// Exports
	
	
	exports.Parser = Parser;
	exports.default = Parser;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Tag = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _path = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DEG_TO_RAD = Math.PI / 180;
	
	// SVG tag class
	
	var Tag = function () {
	    // Class constructor...
	    function Tag(element, parent) {
	        var _this = this;
	
	        _classCallCheck(this, Tag);
	
	        // Init properties
	        this.element = element;
	        this.name = element.nodeName.toLowerCase();
	        this.parent = parent || null;
	        this.layer = null;
	        this.attrs = {};
	        this.children = [];
	        this.paths = [];
	        this.matrix = null;
	        this.matrixApplied = false;
	        this.path = new _path.Path();
	        this.point = new _path.Point(0, 0);
	
	        // Add first path
	        this.paths.push(this.path);
	
	        // Reset/Set transform matrix
	        this.setMatrix(this.parent && this.parent.matrix);
	
	        // Clone parent attributes
	        if (this.parent && this.parent.name === 'g') {
	            // Inherit layer name
	            this.layer = this.parent.layer;
	
	            // Clone parent attributes
	            Object.keys(this.parent.attrs).forEach(function (key) {
	                _this.setAttr(key, _this.parent.attrs[key]);
	            });
	        }
	    }
	
	    _createClass(Tag, [{
	        key: 'setAttr',
	        value: function setAttr(name, value) {
	            this.attrs[name] = value;
	        }
	    }, {
	        key: 'getAttr',
	        value: function getAttr(name, defaultValue) {
	            return this.attrs[name] !== undefined ? this.attrs[name] : defaultValue !== undefined ? defaultValue : null;
	        }
	    }, {
	        key: 'getLayerName',
	        value: function getLayerName() {
	            if (this.name === 'g') {
	                return this.getAttr('inkscape:label', this.getAttr('id', null));
	            }
	        }
	    }, {
	        key: 'setLayerName',
	        value: function setLayerName(name) {
	            if (this.name === 'g') {
	                this.layer = name || this.getLayerName();
	            }
	        }
	    }, {
	        key: 'addChild',
	        value: function addChild(childTag) {
	            this.children.push(childTag);
	        }
	    }, {
	        key: 'clearPath',
	        value: function clearPath() {
	            this.path = new _path.Path();
	        }
	    }, {
	        key: 'newPath',
	        value: function newPath() {
	            if (this.path.length > 0) {
	                this.clearPath();
	                this.paths.push(this.path);
	            }
	        }
	    }, {
	        key: 'closePath',
	        value: function closePath() {
	            return this.path.close();
	        }
	    }, {
	        key: 'addPoint',
	        value: function addPoint(x, y, relative) {
	            // Relative from the last point
	            if (relative) {
	                x += this.point.x;
	                y += this.point.y;
	            }
	
	            // Add current point
	            this.path.addPoint(x, y);
	
	            // Update current point
	            this.point = this.path.getPoint(-1);
	        }
	    }, {
	        key: 'addPoints',
	        value: function addPoints(points, relative) {
	            // For each couple of points
	            for (var i = 0, il = points.length; i < il; i += 2) {
	                this.addPoint(points[i], points[i + 1], relative);
	            }
	        }
	    }, {
	        key: 'setMatrix',
	        value: function setMatrix(matrix) {
	            this.matrix = matrix || [1, 0, 0, 1, 0, 0];
	            this.matrixApplied = false;
	        }
	    }, {
	        key: 'addMatrix',
	        value: function addMatrix(matrix) {
	            this.matrixApplied = false;
	            this.matrix = [this.matrix[0] * matrix[0] + this.matrix[2] * matrix[1], this.matrix[1] * matrix[0] + this.matrix[3] * matrix[1], this.matrix[0] * matrix[2] + this.matrix[2] * matrix[3], this.matrix[1] * matrix[2] + this.matrix[3] * matrix[3], this.matrix[0] * matrix[4] + this.matrix[2] * matrix[5] + this.matrix[4], this.matrix[1] * matrix[4] + this.matrix[3] * matrix[5] + this.matrix[5]];
	        }
	    }, {
	        key: 'translate',
	        value: function translate(x, y) {
	            y = y === undefined ? 0 : y;
	            this.addMatrix([1, 0, 0, 1, x, y]);
	        }
	    }, {
	        key: 'rotate',
	        value: function rotate(angle, x, y) {
	            angle = angle * DEG_TO_RAD;
	
	            if (arguments.length == 2) {
	                this.addMatrix([1, 0, 0, 1, x, y]);
	            }
	
	            this.addMatrix([Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0, 0]);
	
	            if (arguments.length == 2) {
	                this.addMatrix([1, 0, 0, 1, -x, -y]);
	            }
	        }
	    }, {
	        key: 'scale',
	        value: function scale(x, y) {
	            y = y === undefined ? x : y;
	            this.addMatrix([x, 0, 0, y, 0, 0]);
	        }
	    }, {
	        key: 'skewX',
	        value: function skewX(angle) {
	            this.addMatrix([1, 0, Math.tan(angle * DEG_TO_RAD), 1, 0, 0]);
	        }
	    }, {
	        key: 'skewY',
	        value: function skewY(angle) {
	            this.addMatrix([1, Math.tan(angle * DEG_TO_RAD), 0, 1, 0, 0]);
	        }
	    }, {
	        key: 'applyMatrix',
	        value: function applyMatrix(matrix) {
	            var _this2 = this;
	
	            if (this.matrixApplied) {
	                return null;
	            }
	
	            matrix && this.addMatrix(matrix);
	
	            this.paths.forEach(function (path) {
	                path.transform(_this2.matrix);
	            });
	
	            this.setMatrix(null);
	            this.matrixApplied = true;
	
	            this.children.forEach(function (tag) {
	                tag.applyMatrix(matrix);
	            });
	        }
	    }]);
	
	    return Tag;
	}();
	
	// Exports
	
	
	exports.Tag = Tag;
	exports.default = Tag;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Point = function () {
	    // Class constructor...
	    function Point(x, y) {
	        _classCallCheck(this, Point);
	
	        // Init properties
	        this.x = parseFloat(x);
	        this.y = parseFloat(y);
	
	        if (isNaN(this.x) || isNaN(this.y)) {
	            console.error('x:', x, 'y:', y);
	            throw new Error('Float value!!!');
	        }
	    }
	
	    _createClass(Point, [{
	        key: 'isEqual',
	        value: function isEqual(point) {
	            return this.x === point.x && this.y === point.y;
	        }
	    }]);
	
	    return Point;
	}();
	
	var Path = function () {
	    // Class constructor...
	    function Path(element, parent) {
	        _classCallCheck(this, Path);
	
	        // Init properties
	        this.points = [];
	        this.length = 0;
	    }
	
	    _createClass(Path, [{
	        key: 'getPoint',
	        value: function getPoint(i) {
	            return this.points[i < 0 ? this.length + i : i] || null;
	        }
	    }, {
	        key: 'addPoint',
	        value: function addPoint(x, y) {
	            this.points.push(new Point(x, y));
	            this.length = this.points.length;
	        }
	    }, {
	        key: 'addPoints',
	        value: function addPoints(points) {
	            // For each couple of points
	            for (var i = 0, il = points.length; i < il; i += 2) {
	                this.addPoint(points[i], points[i + 1]);
	            }
	        }
	    }, {
	        key: 'isClosed',
	        value: function isClosed() {
	            var firstPoint = this.getPoint(0);
	            return firstPoint && firstPoint.isEqual(this.getPoint(-1));
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            if (!this.isClosed() && this.length > 2) {
	                var firstPoint = this.getPoint(0);
	                this.addPoint(firstPoint.x, firstPoint.y);
	                return true;
	            }
	
	            return false;
	        }
	    }, {
	        key: 'transform',
	        value: function transform(matrix) {
	            this.points = this.points.map(function (point) {
	                return new Point(matrix[0] * point.x + matrix[2] * point.y + matrix[4], matrix[1] * point.x + matrix[3] * point.y + matrix[5]);
	            });
	        }
	    }]);
	
	    return Path;
	}();
	
	// Exports
	
	
	exports.Path = Path;
	exports.Point = Point;
	exports.default = Path;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.TagParser = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _trace = __webpack_require__(5);
	
	var _path2 = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// SVG tag parser
	var TagParser = function () {
	    // Class constructor...
	    function TagParser(tag, parser) {
	        _classCallCheck(this, TagParser);
	
	        // Init properties
	        this.tag = tag;
	        this.parser = parser;
	        this.currentCommand = null;
	        this.lastCommand = null;
	        this.pathData = null;
	    }
	
	    _createClass(TagParser, [{
	        key: 'parse',
	        value: function parse() {
	            // Get internal parser from node name
	            var handler = this['_' + this.tag.name];
	
	            // Implemented tag handler?
	            if (!handler || typeof handler !== 'function') {
	                return this.parser._skipTag(this.tag, 'not yet implemented');
	            }
	
	            // Parse tag attributes
	            this._parseTagAttrs();
	
	            // Parse tag
	            return handler.call(this);
	        }
	
	        // Parse the tag attributes
	
	    }, {
	        key: '_parseTagAttrs',
	        value: function _parseTagAttrs() {
	            var _this = this;
	
	            // Get tag attributes
	            var attrs = this.tag.element.attributes;
	
	            if (!attrs) {
	                return null;
	            }
	
	            // For each attribute
	            var attr = void 0,
	                value = void 0,
	                style = void 0;
	
	            Object.keys(attrs).some(function (key) {
	                // Current attribute
	                attr = attrs[key];
	
	                // Normalize attribute value
	                value = _this._normalizeTagAttr(attr);
	
	                if (value === false) {
	                    return false; // continue
	                }
	
	                // Special case
	                if (attr.nodeName === 'style') {
	                    style = value;
	                } else {
	                    // Set new attribute name/value
	                    _this.tag.setAttr(attr.nodeName, value);
	                }
	            });
	
	            // If style attribute (override tag attributes)
	            // TODO get/parse global style and override this one...
	            style && style.split(';').some(function (attr) {
	                // Current style
	                attr = attr.split(':');
	                attr = { nodeName: attr[0], nodeValue: attr[1] };
	
	                // Normalize attribute value
	                value = _this._normalizeTagAttr(attr);
	
	                if (value === false) {
	                    return false; // continue
	                }
	
	                // Set new attribute name/value
	                _this.tag.setAttr(attr.nodeName, value);
	            });
	
	            // Set inherited color
	            var colorsAttrs = ['fill', 'stroke', 'color'];
	
	            colorsAttrs.forEach(function (attrName) {
	                if (_this.tag.getAttr(attrName) === 'inherit') {
	                    _this.tag.setAttr(attrName, _this.tag.parent.getAttr(attrName, 'none'));
	                }
	            });
	
	            // Parse viewBox attribute
	            this._parseViewBoxAttr();
	
	            // Parse transform attribute
	            this._parseTransformAttr();
	        }
	
	        // Normalize tag attribute
	
	    }, {
	        key: '_normalizeTagAttr',
	        value: function _normalizeTagAttr(attr) {
	            // Normalize whitespaces
	            var value = attr.nodeValue.replace(/(\r?\n|\r)+/gm, ' ') // Remove all new line chars
	            .replace(/\s+/gm, ' ') // Reduce multiple whitespaces
	            .trim(); // Remove trailing whitespaces
	
	            if (!value.length) {
	                return this.parser._skipTagAttr(this.tag, attr, 'empty');
	            }
	
	            // Filters
	            switch (attr.nodeName) {
	                // Normalize size unit -> to px
	                case 'x':
	                case 'y':
	                case 'x1':
	                case 'y1':
	                case 'x2':
	                case 'y2':
	                case 'r':
	                case 'rx':
	                case 'ry':
	                case 'cx':
	                case 'cy':
	                case 'width':
	                case 'height':
	                case 'fontSize':
	                case 'strokeWidth':
	                    value = this._normalizeTagAttrUnit(attr);
	                    break;
	
	                // Normalize points attribute
	                case 'points':
	                case 'viewBox':
	                    value = this._normalizeTagAttrPoints(attr);
	                    break;
	
	                // Range limit to [0 - 1]
	                case 'opacity':
	                case 'fillOpacity':
	                case 'strokeOpacity':
	                    value = this._normalizeTagAttrRange(attr, 0, 1);
	                    break;
	
	                case 'preserveAspectRatio':
	                    value = this._normalizeTagAttrPreserveAspectRatio(attr);
	                    break;
	            }
	
	            // Return normalized value
	            return value;
	        }
	
	        // Normalize attribute unit to px
	
	    }, {
	        key: '_normalizeTagAttrUnit',
	        value: function _normalizeTagAttrUnit(attr) {
	            var stringValue = attr.nodeValue.toLowerCase();
	            var floatValue = parseFloat(stringValue);
	
	            if (isNaN(floatValue)) {
	                return this.parser._skipTagAttr(this.tag, attr, 'only numeric value allowed');
	            }
	
	            if (stringValue.indexOf('mm') !== -1) {
	                return floatValue * 3.5433070869;
	            }
	
	            if (stringValue.indexOf('cm') !== -1) {
	                return floatValue * 35.433070869;
	            }
	
	            if (stringValue.indexOf('in') !== -1) {
	                return floatValue * 90.0;
	            }
	
	            if (stringValue.indexOf('pt') !== -1) {
	                return floatValue * 1.25;
	            }
	
	            if (stringValue.indexOf('pc') !== -1) {
	                return floatValue * 15.0;
	            }
	
	            return floatValue;
	        }
	
	        // Normalize points attribute
	
	    }, {
	        key: '_normalizeTagAttrPoints',
	        value: function _normalizeTagAttrPoints(attr) {
	            var points = this._parseNumbers(attr.nodeValue);
	
	            if (points === false) {
	                return this.parser._skipTagAttr(this.tag, attr, 'only numeric values are allowed');
	            }
	
	            if (!points.length) {
	                return this.parser._skipTagAttr(this.tag, attr, 'empty points list');
	            }
	
	            if (points.length % 0) {
	                return this.parser._skipTagAttr(this.tag, attr, 'the number of points must be even');
	            }
	
	            return points;
	        }
	
	        // Normalize range attribute like "opacity"
	
	    }, {
	        key: '_normalizeTagAttrRange',
	        value: function _normalizeTagAttrRange(attr, min, max) {
	            var stringValue = attr.nodeValue.trim();
	            var floatValue = parseFloat(stringValue);
	
	            if (isNaN(floatValue)) {
	                return this.parser._skipTagAttr(this.tag, attr, 'only numeric values are allowed');
	            }
	
	            if (floatValue < min || floatValue > max) {
	                return this.parser._skipTagAttr(this.tag, attr, 'out of range [' + min + ', ' + max + ']');
	            }
	
	            return floatValue;
	        }
	
	        // Parse points string as numbers array
	
	    }, {
	        key: '_parseNumbers',
	        value: function _parseNumbers(points) {
	            // http://stackoverflow.com/questions/638565/parsing-scientific-notation-sensibly
	            if (typeof points === 'string') {
	                points = points.split(/([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?/g).filter(function (point) {
	                    return point && ['', ','].indexOf(point.trim()) === -1;
	                });
	            }
	
	            // Normalize to float values
	            points = points.map(parseFloat);
	
	            // Test if all numbers is valid
	            if (points.some(isNaN)) {
	                return false;
	            }
	
	            return points;
	        }
	
	        // Normalize the preserveAspectRatio attribute
	
	    }, {
	        key: '_normalizeTagAttrPreserveAspectRatio',
	        value: function _normalizeTagAttrPreserveAspectRatio(attr) {
	            var params = {
	                defer: false,
	                align: 'none',
	                meet: true,
	                slice: false
	            };
	
	            var rawParams = attr.nodeValue;
	
	            if (rawParams.indexOf('defer') === 0) {
	                rawParams = rawParams.substr(6);
	                params.defer = true;
	            }
	
	            rawParams = rawParams.split(' ');
	            params.align = rawParams[0];
	            params.meet = rawParams[1] || 'meet';
	            params.meet = params.meet === 'meet';
	            params.slice = !params.meet;
	
	            return params;
	        }
	
	        // Parse viewBox attribute and set transformations
	
	    }, {
	        key: '_parseViewBoxAttr',
	        value: function _parseViewBoxAttr() {
	            // Get viewBox attribute
	            var viewBox = this.tag.getAttr('viewBox', null);
	
	            // No viewBox...
	            if (viewBox === null) {
	                return null;
	            }
	
	            var width = this.tag.getAttr('width', viewBox[2]);
	            var height = this.tag.getAttr('height', viewBox[3]);
	            var scaleX = width / viewBox[2];
	            var scaleY = height / viewBox[3];
	            var translateX = viewBox[0];
	            var translateY = viewBox[1];
	
	            var preserveAspectRatio = this.tag.getAttr('preserveAspectRatio');
	
	            if (preserveAspectRatio) {
	                var newWidth = void 0,
	                    newHeight = void 0;
	
	                if (preserveAspectRatio.meet) {
	                    if (scaleX > scaleY) {
	                        scaleX = scaleY;
	                        newWidth = viewBox[2] * scaleX;
	                    } else if (scaleX < scaleY) {
	                        scaleY = scaleX;
	                        newHeight = viewBox[3] * scaleY;
	                    }
	                } else if (preserveAspectRatio.slice) {
	                    if (scaleX < scaleY) {
	                        scaleX = scaleY;
	                        newWidth = viewBox[2] * scaleX;
	                    } else if (scaleX > scaleY) {
	                        scaleY = scaleX;
	                        newHeight = viewBox[3] * scaleY;
	                    }
	                }
	
	                if (newWidth !== undefined) {
	                    if (preserveAspectRatio.align === 'xMidYMid') {
	                        this.tag.translate((width - newWidth) / 2, 0);
	                    } else if (preserveAspectRatio.align === 'xMaxYMax') {
	                        this.tag.translate(width - newWidth, 0);
	                    }
	                } else if (newHeight !== undefined) {
	                    if (preserveAspectRatio.align === 'xMidYMid') {
	                        this.tag.translate(0, (height - newHeight) / 2);
	                    } else if (preserveAspectRatio.align === 'xMaxYMax') {
	                        this.tag.translate(0, height - newHeight);
	                    }
	                }
	            }
	
	            this.tag.scale(scaleX, scaleY);
	            this.tag.translate(-translateX, -translateY);
	
	            this.tag.setAttr('width', width);
	            this.tag.setAttr('height', height);
	        }
	
	        // Parse transform attribute and set transformations
	
	    }, {
	        key: '_parseTransformAttr',
	        value: function _parseTransformAttr() {
	            var _this2 = this;
	
	            // Get transform attribute
	            var transformAttr = this.tag.getAttr('transform', null);
	
	            // No transformation...
	            if (transformAttr === null || !transformAttr.length) {
	                return null;
	            }
	
	            // Parse attribute (split group on closing parenthesis)
	            var transformations = transformAttr.split(')');
	
	            // Remove last entry due to last ")" found
	            transformations.pop();
	
	            // For each transformation
	            var transform = void 0,
	                type = void 0,
	                params = void 0,
	                matrix = void 0;
	
	            transformations.some(function (raw) {
	                // Split name and value on opening parenthesis
	                transform = raw.split('(');
	
	                // Invalid parts number
	                if (transform.length !== 2) {
	                    return _this2.parser._skipTagAttr(_this2.tag, transformAttr, 'malformed'); // continue
	                }
	
	                type = transform[0].trim();
	
	                // Quik hack 1/2
	                var func = type;
	                if (func === 'matrix') {
	                    func = 'addMatrix';
	                }
	
	                // Get tag transform method
	                var tagTransform = _this2.tag[func];
	
	                if (typeof tagTransform !== 'function') {
	                    return _this2.parser._skipTagAttr(_this2.tag, transformAttr, 'unsupported transform type :' + type);
	                }
	
	                params = transform[1].trim();
	                params = _this2._parseNumbers(params);
	
	                // Skip empty value
	                if (!params.length) {
	                    return _this2.parser._skipTagAttr(_this2.tag, transformAttr, 'malformed transform type :' + type);
	                }
	
	                // Quik hack 2/2
	                if (func == 'addMatrix') {
	                    params = [params];
	                }
	
	                // Call tag transform method like "tag.translate(param1, ..., paramN)"
	                tagTransform.apply(_this2.tag, params);
	            });
	        }
	    }, {
	        key: '_newPath',
	        value: function _newPath() {
	            this.tag.newPath();
	        }
	    }, {
	        key: '_clearPath',
	        value: function _clearPath() {
	            this.tag.clearPath();
	        }
	    }, {
	        key: '_closePath',
	        value: function _closePath() {
	            return this.tag.closePath();
	        }
	    }, {
	        key: '_addPoints',
	        value: function _addPoints(points, relative) {
	            if (!points.length) {
	                return this.parser._skipTag(this.tag, 'empty points list');
	            }
	
	            if (points.length % 0) {
	                return this.parser._skipTag(this.tag, 'the number of points must be even');
	            }
	
	            relative = arguments.length < 2 && this.currentCommand.relative;
	
	            this.tag.addPoints(points, relative);
	            return true;
	        }
	
	        // SVG specs at https://www.w3.org/TR/SVG11/
	
	    }, {
	        key: '_svg',
	        value: function _svg() {
	            // Only parse the root SVG tag as main document
	            if (this.parser.document) {
	                // Handled tag
	                return true;
	            }
	
	            // Get the document size
	            var width = this.tag.getAttr('width');
	            var height = this.tag.getAttr('height');
	
	            // Invalid size
	            if (!width || width < 0 || !height || height < 0) {
	                throw new Error('Invalid document size: ' + width + ' / ' + height);
	            }
	
	            // Set document size
	            this.parser.document = {
	                width: width,
	                height: height
	            };
	
	            // Get document viewBox or set default to document size
	            var viewBox = this.tag.getAttr('viewBox', [0, 0, width, height]);
	
	            this.parser.document.viewBox = {
	                x: viewBox[0],
	                y: viewBox[1],
	                width: viewBox[2],
	                height: viewBox[3]
	            };
	
	            // Check inkscape version
	            if (this.parser.editor.name === 'inkscape') {
	                this.parser.editor.version = this.tag.getAttr('inkscape:version');
	            }
	
	            // Handled tag
	            return true;
	        }
	    }, {
	        key: '_title',
	        value: function _title() {
	            // Register the first encountered title tag as document title
	            if (this.parser.document && !this.parser.document.title) {
	                this.parser.document.title = this.tag.element.textContent;
	            }
	
	            // Skipped tag
	            return false;
	        }
	    }, {
	        key: '_desc',
	        value: function _desc() {
	            // Register the first encountered desc tag as document description
	            if (this.parser.document && !this.parser.document.description) {
	                this.parser.document.description = this.tag.element.textContent;
	            }
	
	            // Skipped tag
	            return false;
	        }
	    }, {
	        key: '_defs',
	        value: function _defs() {
	            var _this3 = this;
	
	            // Register all child element with an id attribute
	            this.tag.element.childNodes.forEach(function (childNode) {
	                childNode.id && (_this3.parser.defs[childNode.id] = childNode);
	            });
	
	            // Skipped tag
	            return false;
	        }
	    }, {
	        key: '_use',
	        value: function _use() {
	            // Get the target id
	            var target = this.tag.getAttr('xlink:href').replace(/^#/, '');
	
	            // Try to get the defined element
	            var element = this.parser.defs[target];
	
	            if (!element) {
	                return this.parser._skipTag(this.tag, 'undefined reference [' + target + ']');
	            }
	
	            // Parse the defined element and set new parent from <use> tag parent
	            var useTag = this.parser._parseElement(element, this.tag.parent);
	
	            if (!useTag) {
	                return this.parser._skipTag(this.tag, 'empty reference [' + target + ']');
	            }
	
	            // Set matrix from real parent (<use>)
	            useTag.setMatrix(this.tag.matrix);
	
	            // Replace the use tag with new one
	            this.tag.parent.addChild(useTag);
	
	            // Skipped tag
	            return false;
	        }
	    }, {
	        key: '_g',
	        value: function _g() {
	            // Set the tag layer name
	            this.tag.setLayerName();
	
	            // Handled tag
	            return true;
	        }
	    }, {
	        key: '_line',
	        value: function _line() {
	            // Handled tag
	            return this._path(['M', this.tag.getAttr('x1'), this.tag.getAttr('y1'), 'L', this.tag.getAttr('x2'), this.tag.getAttr('y2')]);
	        }
	    }, {
	        key: '_polyline',
	        value: function _polyline() {
	            var close = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	
	            var points = this.tag.getAttr('points');
	            var path = ['M', points.shift(), points.shift(), 'L'];
	
	            path = path.concat(points);
	            close && path.push('Z');
	
	            // Handled tag
	            return this._path(path);
	        }
	    }, {
	        key: '_polygon',
	        value: function _polygon() {
	            // Handled like polyline but closed
	            return this._polyline(true);
	        }
	    }, {
	        key: '_rect',
	        value: function _rect() {
	            // Get rectangle attributes
	            var w = this.tag.getAttr('width');
	            var h = this.tag.getAttr('height');
	            var x = this.tag.getAttr('x', 0);
	            var y = this.tag.getAttr('y', 0);
	            var rx = this.tag.getAttr('rx', null);
	            var ry = this.tag.getAttr('ry', null);
	
	            // Simple rect
	            if (!rx && !ry) {
	                // Handled tag
	                return this._path(['M', x, y, 'h', w, 'v', h, 'h', -w, 'z']);
	            }
	
	            // If a properly specified value is provided for ‘rx’, but not for ‘ry’,
	            // then set both rx and ry to the value of ‘rx’ and vis-vera...
	            if (rx === null) rx = ry;
	            if (ry === null) ry = rx;
	
	            // A negative value is an error
	            if (rx === null || rx === null || rx < 0 || ry < 0) {
	                // Skip tag
	                return this.parser._skipTag(this.tag, 'negative value for "rx/ry" not allowed');
	            }
	
	            // If rx is greater than half of ‘width’, then set rx to half of ‘width’.
	            // If ry is greater than half of ‘height’, then set ry to half of ‘height’.
	            if (rx > w / 2) rx = w / 2;
	            if (ry > h / 2) ry = h / 2;
	
	            var dx = rx * 2;
	            var dy = ry * 2;
	
	            // Handled tag
	            return this._path(['M', x + rx, y, 'h', w - dx, 'c', rx, 0, rx, ry, rx, ry, 'v', h - dy, 'c', 0, ry, -rx, ry, -rx, ry, 'h', -w + dx, 'c', -rx, 0, -rx, -ry, -rx, -ry, 'v', -h + dy, 'c', 0, 0, 0, -ry, rx, -ry, 'z']);
	        }
	    }, {
	        key: '_circle',
	        value: function _circle() {
	            var r = this.tag.getAttr('r', 0);
	
	            if (r <= 0) {
	                // Skipped tag
	                return false;
	            }
	
	            var cx = this.tag.getAttr('cx', 0);
	            var cy = this.tag.getAttr('cy', 0);
	
	            // Handled tag
	            return this._path(['M', cx - r, cy, 'A', r, r, 0, 0, 0, cx, cy + r, 'A', r, r, 0, 0, 0, cx + r, cy, 'A', r, r, 0, 0, 0, cx, cy - r, 'A', r, r, 0, 0, 0, cx - r, cy, 'Z']);
	        }
	    }, {
	        key: '_ellipse',
	        value: function _ellipse() {
	            var rx = this.tag.getAttr('rx', 0);
	            var ry = this.tag.getAttr('ry', 0);
	
	            if (rx <= 0 || ry <= 0) {
	                // Skipped tag
	                return false;
	            }
	
	            var cx = this.tag.getAttr('cx', 0);
	            var cy = this.tag.getAttr('cy', 0);
	
	            // Handled tag
	            return this._path(['M', cx - rx, cy, 'A', rx, ry, 0, 0, 0, cx, cy + ry, 'A', rx, ry, 0, 0, 0, cx + rx, cy, 'A', rx, ry, 0, 0, 0, cx, cy - ry, 'A', rx, ry, 0, 0, 0, cx - rx, cy, 'Z']);
	        }
	    }, {
	        key: '_paths',
	        value: function _paths(type, num, points) {
	            if (points.length > num) {
	                var handler = void 0,
	                    result = true;
	
	                while (result && points.length) {
	                    handler = this['_path' + type];
	                    result = handler.call(this, points.splice(0, num));
	                }
	
	                return result;
	            }
	
	            return null;
	        }
	    }, {
	        key: '_path',
	        value: function _path(path) {
	            var _this4 = this;
	
	            // Provided path
	            if (path && typeof path !== 'string') {
	                path = path.join(' ');
	            }
	
	            // Get the paths data attribute value
	            var dAttr = path || this.tag.getAttr('d', null);
	
	            if (!dAttr) {
	                // Skipped tag
	                return false;
	            }
	
	            // Split on each commands
	            var commands = dAttr.match(/([M|Z|L|H|V|C|S|Q|T|A]+([^M|Z|L|H|V|C|S|Q|T|A]+)?)/gi);
	
	            if (!commands) {
	                return this.parser._skipTag(this.tag, 'malformed "d" attribute');
	            }
	
	            // For each command...
	            this.currentCommand = {
	                raw: null,
	                type: null,
	                params: null,
	                relative: null
	            };
	            this.lastCommand = this.currentCommand;
	            this.pathData = {};
	
	            var handler = null;
	            var parseError = false;
	
	            commands.some(function (raw) {
	                // Remove trailing whitespaces
	                raw = raw.trim();
	
	                // Extract command char and params
	                _this4.currentCommand.raw = raw;
	                _this4.currentCommand.type = raw[0].toUpperCase();
	                _this4.currentCommand.params = raw.substr(1).trim();
	                _this4.currentCommand.relative = _this4.currentCommand.type !== raw[0];
	
	                // Get path handler from command char
	                handler = _this4['_path' + _this4.currentCommand.type];
	
	                if (!handler || typeof handler !== 'function') {
	                    _this4.parser._skipTag(_this4.tag, 'unsupported path command [' + raw[0] + ']');
	                    return parseError = true; // break
	                }
	
	                // Extract all numbers from arguments string
	                _this4.currentCommand.params = _this4._parseNumbers(_this4.currentCommand.params);
	
	                if (_this4.currentCommand.params === false) {
	                    _this4.parser._skipTag(_this4.tag, 'only numeric values are allowed in [' + _this4.currentCommand.raw + ']');
	                    return parseError = true; // break
	                }
	
	                // Execute command parser
	                if (!handler.call(_this4, _this4.currentCommand.params)) {
	                    return parseError = true; // break
	                }
	
	                // Update last command
	                _this4.lastCommand = {};
	
	                Object.keys(_this4.currentCommand).forEach(function (key) {
	                    _this4.lastCommand[key] = _this4.currentCommand[key];
	                });
	            });
	
	            // Skip tag
	            if (parseError) {
	                this._clearPath();
	                return false;
	            }
	
	            // Handled tag
	            return true;
	        }
	    }, {
	        key: '_pathM',
	        value: function _pathM(points) {
	            // New path
	            this._newPath();
	
	            // Set the current point (start of new path)
	            // If is followed by multiple pairs of coordinates,
	            // the subsequent pairs are treated as implicit lineto commands.
	            return this._addPoints(points);
	        }
	    }, {
	        key: '_pathZ',
	        value: function _pathZ() {
	            this._closePath();
	            return true;
	        }
	    }, {
	        key: '_pathL',
	        value: function _pathL(points) {
	            return this._addPoints(points);
	        }
	    }, {
	        key: '_pathH',
	        value: function _pathH(points) {
	            var _this5 = this;
	
	            return points.every(function (x) {
	                return _this5._addPoints([x, _this5.currentCommand.relative ? 0 : _this5.tag.point.y]);
	            });
	        }
	    }, {
	        key: '_pathV',
	        value: function _pathV(points) {
	            var _this6 = this;
	
	            return points.every(function (y) {
	                return _this6._addPoints([_this6.currentCommand.relative ? 0 : _this6.tag.point.x, y]);
	            });
	        }
	    }, {
	        key: '_pathC',
	        value: function _pathC(points) {
	            // Multiple paths
	            var result = this._paths('C', 6, points);
	
	            if (result !== null) {
	                return result;
	            }
	
	            // Single path
	            var p1 = this.tag.point;
	            var rl = this.currentCommand.relative;
	
	            var x1 = points[0] + (rl ? p1.x : 0);
	            var y1 = points[1] + (rl ? p1.y : 0);
	            var x2 = points[2] + (rl ? p1.x : 0);
	            var y2 = points[3] + (rl ? p1.y : 0);
	            var x = points[4] + (rl ? p1.x : 0);
	            var y = points[5] + (rl ? p1.y : 0);
	
	            this.pathData.x2 = x2;
	            this.pathData.y2 = y2;
	
	            var p2 = new _path2.Point(x1, y1);
	            var p3 = new _path2.Point(x2, y2);
	            var p4 = new _path2.Point(x, y);
	
	            //console.log('C', p1, p2, p3, p4)
	
	            // p1  : starting point
	            // p2  : control point
	            // p3  : control point
	            // p4  : end point
	            var bezier = new CubicBezier({ p1: p1, p2: p2, p3: p3, p4: p4 });
	            var coords = bezier.trace(); // => [x,y, x,y, ...]
	
	            // Remove first point since it is added by last command
	            coords = coords.slice(2);
	
	            // Trace the line
	            return this._addPoints(coords, false);
	        }
	    }, {
	        key: '_pathS',
	        value: function _pathS(points) {
	            // Multiple paths
	            var result = this._paths('S', 4, points);
	
	            if (result !== null) {
	                return result;
	            }
	
	            // Single path
	            var p1 = this.tag.point;
	            var rl = this.currentCommand.relative;
	
	            var x1 = p1.x;
	            var y1 = p1.y;
	
	            if (this.lastCommand.type === 'S' || this.lastCommand.type === 'C') {
	                x1 -= this.pathData.x2 - x1;
	                y1 -= this.pathData.y2 - y1;
	            }
	
	            var x2 = points[0] + (rl ? p1.x : 0);
	            var y2 = points[1] + (rl ? p1.y : 0);
	            var x = points[2] + (rl ? p1.x : 0);
	            var y = points[3] + (rl ? p1.y : 0);
	
	            this.pathData.x2 = x2;
	            this.pathData.y2 = y2;
	
	            var p2 = new _path2.Point(x1, y1);
	            var p3 = new _path2.Point(x2, y2);
	            var p4 = new _path2.Point(x, y);
	
	            //console.log('S', p1, p2, p3, p4)
	
	            // p1  : starting point
	            // p2  : control point
	            // p3  : control point
	            // p4  : end point
	            var bezier = new CubicBezier({ p1: p1, p2: p2, p3: p3, p4: p4 });
	            var coords = bezier.trace(); // => [x,y, x,y, ...]
	
	            // Remove first point since it is added by last command
	            coords = coords.slice(2);
	
	            // Trace the line
	            return this._addPoints(coords, false);
	        }
	    }, {
	        key: '_pathQ',
	        value: function _pathQ(points) {
	            // Multiple paths
	            var result = this._paths('Q', 4, points);
	
	            if (result !== null) {
	                return result;
	            }
	
	            // Single path
	            var p1 = this.tag.point;
	            var rl = this.currentCommand.relative;
	
	            var x1 = points[0] + (rl ? p1.x : 0);
	            var y1 = points[1] + (rl ? p1.y : 0);
	            var x = points[2] + (rl ? p1.x : 0);
	            var y = points[3] + (rl ? p1.y : 0);
	
	            this.pathData.x1 = x1;
	            this.pathData.y1 = y1;
	
	            var p2 = new _path2.Point(x1, y1);
	            var p3 = new _path2.Point(x, y);
	
	            //console.log('Q', p1, p2, p3)
	
	            // p1  : starting point
	            // p2  : control point
	            // p3  : end point
	            var bezier = new QuadricBezier({ p1: p1, p2: p2, p3: p3 });
	            var coords = bezier.trace(); // => [x,y, x,y, ...]
	
	            // Remove first point since it is added by last command
	            coords = coords.slice(2);
	
	            // Trace the line
	            return this._addPoints(coords, false);
	        }
	    }, {
	        key: '_pathT',
	        value: function _pathT(points) {
	            // Multiple paths
	            var result = this._paths('T', 2, points);
	
	            if (result !== null) {
	                return result;
	            }
	
	            // Single path
	            var p1 = this.tag.point;
	            var rl = this.currentCommand.relative;
	
	            var x1 = p1.x;
	            var y1 = p1.y;
	
	            if (this.lastCommand.type === 'Q' || this.lastCommand.type === 'T') {
	                x1 -= this.pathData.x1 - x1;
	                y1 -= this.pathData.y1 - y1;
	            }
	
	            var x = points[0] + (rl ? p1.x : 0);
	            var y = points[1] + (rl ? p1.y : 0);
	
	            this.pathData.x1 = x1;
	            this.pathData.y1 = y1;
	
	            var p2 = new _path2.Point(x1, y1);
	            var p3 = new _path2.Point(x, y);
	
	            //console.log('T', p1, p2, p3)
	
	            // p1  : starting point
	            // p2  : control point
	            // p3  : end point
	            var bezier = new QuadricBezier({ p1: p1, p2: p2, p3: p3 });
	            var coords = bezier.trace(); // => [x,y, x,y, ...]
	
	            // Remove first point since it is added by last command
	            coords = coords.slice(2);
	
	            // Trace the line
	            return this._addPoints(coords, false);
	        }
	    }, {
	        key: '_pathA',
	        value: function _pathA(points) {
	            // Multiple paths
	            var result = this._paths('A', 7, points);
	
	            if (result !== null) {
	                return result;
	            }
	
	            // Single path
	            var rl = this.currentCommand.relative;
	            var p1 = this.tag.point;
	            var rx = points[0];
	            var ry = points[1];
	            var angle = points[2];
	            var large = !!points[3];
	            var sweep = !!points[4];
	            var x = points[5] + (rl ? p1.x : 0);
	            var y = points[6] + (rl ? p1.y : 0);
	            var p2 = new _path2.Point(x, y);
	
	            //console.log('A', p1, rx, ry, angle, large, sweep, p2)
	
	            var arc = new _trace.Arc({ p1: p1, rx: rx, ry: ry, angle: angle, large: large, sweep: sweep, p2: p2 });
	            var coords = arc.trace(); // => [x,y, x,y, ...]
	
	            // Remove first point since it is added by last command
	            coords = coords.slice(2);
	
	            // Trace the line
	            return this._addPoints(coords, false);
	        }
	    }]);
	
	    return TagParser;
	}();
	
	// Exports
	
	
	exports.TagParser = TagParser;
	exports.default = TagParser;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Arc = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _path = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MATH_PI_2 = Math.PI * 2;
	var DEG_TO_RAD = Math.PI / 180;
	
	// Rewrite from https://github.com/MadLittleMods/svg-curve-lib/blob/master/src/js/svg-curve-lib.js#L84
	
	var Arc = function () {
	    // Class constructor...
	    function Arc(settings) {
	        _classCallCheck(this, Arc);
	
	        this.init(settings);
	    }
	
	    // Init arc properties
	
	
	    _createClass(Arc, [{
	        key: 'init',
	        value: function init(settings) {
	            // Init properties
	            this.p1 = settings.p1;
	            this.p2 = settings.p2;
	            this.rx = settings.rx;
	            this.ry = settings.ry;
	            this.angle = settings.angle;
	            this.large = settings.large;
	            this.sweep = settings.sweep;
	
	            this.points = null;
	            this.radians = null;
	            this.startAngle = null;
	            this.sweepAngle = null;
	            this.center = null;
	        }
	    }, {
	        key: 'mod',
	        value: function mod(x, m) {
	            return (x % m + m) % m;
	        }
	    }, {
	        key: 'angleBetween',
	        value: function angleBetween(v0, v1) {
	            var p = v0.x * v1.x + v0.y * v1.y;
	            var n = Math.sqrt((Math.pow(v0.x, 2) + Math.pow(v0.y, 2)) * (Math.pow(v1.x, 2) + Math.pow(v1.y, 2)));
	            return (v0.x * v1.y - v0.y * v1.x < 0 ? -1 : 1) * Math.acos(p / n);
	        }
	    }, {
	        key: 'getPoint',
	        value: function getPoint(t) {
	            var angle = this.startAngle + this.sweepAngle * t;
	
	            var x = this.rx * Math.cos(angle);
	            var y = this.ry * Math.sin(angle);
	
	            return new _path.Point(Math.cos(this.radians) * x - Math.sin(this.radians) * y + this.center.x, Math.sin(this.radians) * x + Math.cos(this.radians) * y + this.center.y);
	        }
	    }, {
	        key: '_addPoint',
	        value: function _addPoint(point) {
	            this.points.push(point.x, point.y);
	        }
	    }, {
	        key: 'trace',
	        value: function trace() {
	            // Reset points collection
	            this.points = [];
	
	            // Get angle in radians
	            this.radians = this.mod(this.angle, 360) * DEG_TO_RAD;
	
	            // If the endpoints are identical, then this is equivalent
	            // to omitting the elliptical arc segment entirely.
	            if (this.p1.x === this.p2.x && this.p1.y === this.p2.y) {
	                return this.points;
	            }
	
	            this.rx = Math.abs(this.rx);
	            this.ry = Math.abs(this.ry);
	
	            // If rx = 0 or ry = 0 then this arc is treated as
	            // a straight line segment joining the endpoints.
	            if (this.rx === 0 || this.ry === 0) {
	                this._addPoint(this.p1);
	                this._addPoint(this.p2);
	                return this.points;
	            }
	
	            // Following "Conversion from endpoint to center parameterization"
	            // http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
	
	            // Step #1: Compute transformedPoint
	            var dx = (this.p1.x - this.p2.x) / 2;
	            var dy = (this.p1.y - this.p2.y) / 2;
	
	            var transformedPoint = {
	                x: Math.cos(this.radians) * dx + Math.sin(this.radians) * dy,
	                y: -Math.sin(this.radians) * dx + Math.cos(this.radians) * dy
	            };
	
	            // Ensure radii are large enough
	            var radiiCheck = Math.pow(transformedPoint.x, 2) / Math.pow(this.rx, 2) + Math.pow(transformedPoint.y, 2) / Math.pow(this.ry, 2);
	
	            if (radiiCheck > 1) {
	                this.rx = Math.sqrt(radiiCheck) * this.rx;
	                this.ry = Math.sqrt(radiiCheck) * this.ry;
	            }
	
	            // Step #2: Compute transformedCenter
	            var cSquareNumerator = Math.pow(this.rx, 2) * Math.pow(this.ry, 2) - Math.pow(this.rx, 2) * Math.pow(transformedPoint.y, 2) - Math.pow(this.ry, 2) * Math.pow(transformedPoint.x, 2);
	            var cSquareRootDenom = Math.pow(this.rx, 2) * Math.pow(transformedPoint.y, 2) + Math.pow(this.ry, 2) * Math.pow(transformedPoint.x, 2);
	            var cRadicand = cSquareNumerator / cSquareRootDenom;
	
	            // Make sure this never drops below zero because of precision
	            cRadicand = cRadicand < 0 ? 0 : cRadicand;
	            var cCoef = (this.large !== this.sweep ? 1 : -1) * Math.sqrt(cRadicand);
	            var transformedCenter = {
	                x: cCoef * (this.rx * transformedPoint.y / this.ry),
	                y: cCoef * (-(this.ry * transformedPoint.x) / this.rx)
	            };
	
	            // Step #3: Compute center
	            this.center = {
	                x: Math.cos(this.radians) * transformedCenter.x - Math.sin(this.radians) * transformedCenter.y + (this.p1.x + this.p2.x) / 2,
	                y: Math.sin(this.radians) * transformedCenter.x + Math.cos(this.radians) * transformedCenter.y + (this.p1.y + this.p2.y) / 2
	            };
	
	            // Step #4: Compute start/sweep angles
	            // Start angle of the elliptical arc prior to the stretch and rotate operations.
	            // Difference between the start and end angles
	            var startVector = {
	                x: (transformedPoint.x - transformedCenter.x) / this.rx,
	                y: (transformedPoint.y - transformedCenter.y) / this.ry
	            };
	
	            var endVector = {
	                x: (-transformedPoint.x - transformedCenter.x) / this.rx,
	                y: (-transformedPoint.y - transformedCenter.y) / this.ry
	            };
	
	            this.startAngle = this.angleBetween({ x: 1, y: 0 }, startVector);
	            this.sweepAngle = this.angleBetween(startVector, endVector);
	
	            if (!this.sweep && this.sweepAngle > 0) {
	                this.sweepAngle -= MATH_PI_2;
	            } else if (this.sweep && this.sweepAngle < 0) {
	                this.sweepAngle += MATH_PI_2;
	            }
	
	            // We use % instead of `mod(..)` because we want it to be -360deg to 360deg(but actually in radians)
	            this.sweepAngle %= MATH_PI_2;
	
	            for (var t = 0; t <= 1; t += 0.01) {
	                this._addPoint(this.getPoint(t));
	            }
	
	            // Push last point
	            this._addPoint(this.p2);
	
	            // Return the points collection
	            return this.points;
	        }
	    }]);
	
	    return Arc;
	}();
	
	// Exports
	
	
	exports.Arc = Arc;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=lw.svg-parser.js.map