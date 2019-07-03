/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./request */ \"./src/request.js\");\n\n\nconst form = document.forms[0];\n\nfor(let elem of form.elements) {\n    if(elem.type === \"textarea\") {\n        elem.oninput = e => {\n            const submitBtn = document.getElementById('submit');\n            submitBtn.disabled = false;\n            submitBtn.value = \"Submit\"\n        }\n    }\n\n    if(elem.id === \"bfa\") {\n        elem.onchange = e => {\n            if(e.target.checked) {\n                document.getElementById('shift').disabled = true;\n            } else {\n                document.getElementById('shift').removeAttribute('disabled');\n            }\n        }\n    }\n\n    if(elem.id === \"with-shift\") {\n        elem.onchange = e => {\n            if(e.target.checked) {\n                document.getElementById('shift').removeAttribute('disabled');\n            }\n        }\n    }\n}\n\nform.onsubmit = e => {\n    e.preventDefault();\n    document.getElementById('result').innerHTML = '';\n\n    for(let elem of form.elements) {\n        if(elem.type === \"submit\") {\n            elem.value = \"Processing...\";\n            elem.disabled = true;\n        }\n    }\n\n    const formObject = formToObject(form);\n\n    Object(_request__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(formObject);\n}\n\nfunction formToObject(form) {\n    let text;\n    let shift;\n    let operation;\n    let bfa;\n\n    for(let elem of form.elements) {\n        if(elem.name === \"text\") {\n            text = elem.value;\n        }\n\n        if(elem.name === \"shift\") {\n            shift = elem.value;\n        }\n\n        if(elem.name === \"operation\") {\n            if(elem.checked) {\n                operation = elem.value;\n            }\n        }\n\n        if(elem.name === \"bfa\") {\n            if(elem.checked) {\n                bfa = elem.value;\n            }\n        }\n    }\n\n    const formObject = {\n        text: text,\n        shift: shift,\n        operation: operation,\n        bfa: bfa\n    }\n\n    return formObject;\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/request.js":
/*!************************!*\
  !*** ./src/request.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction request(formObject) {\n    const port = 3000;\n    const backendUrl = 'http://localhost:' + port;\n\n    const xhr = new XMLHttpRequest();\n    xhr.open(\"POST\", backendUrl + '/receive-text', true);\n\n    xhr.setRequestHeader('Content-Type', 'application/json');\n\n    xhr.send(JSON.stringify(formObject));\n\n    xhr.onload = function(e) {\n\n        if(xhr.readyState == 4) {\n\n            if(xhr.status == 200) {\n                const response = xhr.responseText;\n                console.log(response);\n\n                document.getElementById('result').innerHTML = response;\n                document.getElementById('submit').value = \"Processed!\";\n                document.getElementById('unknown-character').setAttribute('hidden', true);\n\n            } else if (xhr.status === 400) {\n                document.getElementById('unknown-character').removeAttribute('hidden');\n                document.getElementById('submit').value = \"Error :(\";\n            }\n        }\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (request);\n\n//# sourceURL=webpack:///./src/request.js?");

/***/ })

/******/ });