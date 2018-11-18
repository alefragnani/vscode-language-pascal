(function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function(exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                configurable: false,
                enumerable: true,
                get: getter
            });
        }
    };
    __webpack_require__.r = function(exports) {
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
    };
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module["default"];
        } : function getModuleExports() {
            return module;
        };
        __webpack_require__.d(getter, "a", getter);
        return getter;
    };
    __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    __webpack_require__.p = "{{root}}/out/ui/";
    return __webpack_require__(__webpack_require__.s = 1);
})({
    "./scss/main.scss": function(module, exports) {},
    "./shared/app-base.ts": function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, "App", function() {
            return App;
        });
        var _shared_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./shared/dom.ts");
        var _shared_colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./shared/colors.ts");
        const gitlens = window.gitlens;
        class App {
            constructor(_appName) {
                this._appName = _appName;
                this._changes = Object.create(null);
                this._scopes = null;
                this.log(`${this._appName}.ctor`);
                this._commandRelay = _shared_dom__WEBPACK_IMPORTED_MODULE_0__["DOM"].getElementById("commandRelay");
                const scopes = _shared_dom__WEBPACK_IMPORTED_MODULE_0__["DOM"].getElementById("scopes");
                if (scopes && gitlens.scopes.length > 1) {
                    for (const [scope, text] of gitlens.scopes) {
                        const option = document.createElement("option");
                        option.value = scope;
                        option.innerHTML = text;
                        if (gitlens.scope === scope) {
                            option.selected = true;
                        }
                        scopes.appendChild(option);
                    }
                    scopes.parentElement.classList.remove("hidden");
                    this._scopes = scopes;
                }
                Object(_shared_colors__WEBPACK_IMPORTED_MODULE_1__["initializeColorPalette"])();
                this.initialize();
                this.bind();
                setTimeout(() => {
                    document.body.classList.remove("preload");
                }, 500);
            }
            initialize() {
                this.log(`${this._appName}.initializeState`);
                for (const el of document.querySelectorAll('input[type="checkbox"].setting')) {
                    const checked = el.dataset.type === "array" ? (getSettingValue(el.name) || []).includes(el.value) : getSettingValue(el.name) || false;
                    el.checked = checked;
                }
                for (const el of document.querySelectorAll("select.setting")) {
                    const value = getSettingValue(el.name);
                    const option = el.querySelector(`option[value='${value}']`);
                    if (option != null) {
                        option.selected = true;
                    }
                }
                const state = flatten(gitlens.config);
                this.setVisibility(state);
                this.setEnablement(state);
            }
            bind() {
                const onInputChecked = this.onInputChecked.bind(this);
                _shared_dom__WEBPACK_IMPORTED_MODULE_0__["DOM"].listenAll('input[type="checkbox"].setting', "change", function() {
                    return onInputChecked(this, ...arguments);
                });
                const onInputSelected = this.onInputSelected.bind(this);
                _shared_dom__WEBPACK_IMPORTED_MODULE_0__["DOM"].listenAll("select.setting", "change", function() {
                    return onInputSelected(this, ...arguments);
                });
            }
            log(message) {
                console.log(message);
            }
            onInputChecked(element) {
                this.log(`${this._appName}.onInputChecked: name=${element.name}, checked=${element.checked}, value=${element.value}`);
                if (element.dataset.type === "array") {
                    const setting = getSettingValue(element.name) || [];
                    if (Array.isArray(setting)) {
                        if (element.checked) {
                            if (!setting.includes(element.value)) {
                                setting.push(element.value);
                            }
                        } else {
                            const i = setting.indexOf(element.value);
                            if (i !== -1) {
                                setting.splice(i, 1);
                            }
                        }
                        this._changes[element.name] = setting;
                    }
                } else {
                    if (element.checked) {
                        this._changes[element.name] = element.value === "on" ? true : element.value;
                    } else {
                        this._changes[element.name] = false;
                    }
                }
                this.setAdditionalSettings(element.checked ? element.dataset.addSettingsOn : element.dataset.addSettingsOff);
                this.applyChanges();
            }
            onInputSelected(element) {
                if (element === this._scopes) return;
                const value = element.options[element.selectedIndex].value;
                this.log(`${this._appName}.onInputSelected: name=${element.name}, value=${value}`);
                this._changes[element.name] = ensureIfBoolean(value);
                this.applyChanges();
            }
            applyChanges() {
                const args = JSON.stringify({
                    changes: this._changes,
                    scope: this.getScope(),
                    uri: gitlens.uri
                });
                this.log(`${this._appName}.applyChanges: args=${args}`);
                const command = "command:gitlens.saveSettings?" + encodeURI(args);
                setTimeout(() => this.executeCommand(command), 0);
            }
            executeCommand(command) {
                if (command === undefined) return;
                this.log(`${this._appName}.executeCommand: command=${command}`);
                this._commandRelay.setAttribute("href", command);
                this._commandRelay.click();
            }
            getScope() {
                return this._scopes != null ? this._scopes.options[this._scopes.selectedIndex].value : "user";
            }
            setAdditionalSettings(expression) {
                if (!expression) return;
                const addSettings = parseAdditionalSettingsExpression(expression);
                for (const [s, v] of addSettings) {
                    this._changes[s] = v;
                }
            }
            setEnablement(state) {
                for (const el of document.querySelectorAll("[data-enablement]")) {
                    if (!evaluateStateExpression(el.dataset.enablement, state)) continue;
                    el.removeAttribute("disabled");
                    if (el.matches("input,select")) {
                        el.disabled = false;
                    } else {
                        const input = el.querySelector("input,select");
                        if (input == null) continue;
                        input.disabled = false;
                    }
                }
            }
            setVisibility(state) {
                for (const el of document.querySelectorAll("[data-visibility]")) {
                    if (!evaluateStateExpression(el.dataset.visibility, state)) continue;
                    el.classList.remove("hidden");
                }
            }
        }
        function ensureIfBoolean(value) {
            if (value === "true") return true;
            if (value === "false") return false;
            return value;
        }
        function evaluateStateExpression(expression, changes) {
            let state = false;
            for (const expr of expression.trim().split("&")) {
                const [lhs, op, rhs] = parseStateExpression(expr);
                switch (op) {
                  case "=":
                    {
                        let value = changes[lhs];
                        if (value === undefined) {
                            value = getSettingValue(lhs) || false;
                        }
                        state = rhs !== undefined ? rhs === "" + value : !!value;
                        break;
                    }

                  case "!":
                    {
                        let value = changes[lhs];
                        if (value === undefined) {
                            value = getSettingValue(lhs) || false;
                        }
                        state = rhs !== undefined ? rhs !== "" + value : !value;
                        break;
                    }

                  case "+":
                    {
                        if (rhs !== undefined) {
                            const setting = getSettingValue(lhs);
                            state = setting !== undefined ? setting.includes(rhs.toString()) : false;
                        }
                        break;
                    }
                }
                if (!state) break;
            }
            return state;
        }
        function get(o, path) {
            return path.split(".").reduce((o = {}, key) => o[key], o);
        }
        function getSettingValue(path) {
            return get(gitlens.config, path);
        }
        function parseAdditionalSettingsExpression(expression) {
            const settingsExpression = expression.trim().split(",");
            return settingsExpression.map(s => {
                const [setting, value] = s.split("=");
                return [ setting, ensureIfBoolean(value) ];
            });
        }
        function parseStateExpression(expression) {
            const [lhs, op, rhs] = expression.trim().split(/([=\+\!])/);
            return [ lhs.trim(), op !== undefined ? op.trim() : "=", rhs !== undefined ? rhs.trim() : rhs ];
        }
        function flatten(o, path) {
            const results = {};
            for (const key in o) {
                const value = o[key];
                if (Array.isArray(value)) continue;
                if (typeof value === "object") {
                    Object.assign(results, flatten(value, path === undefined ? key : `${path}.${key}`));
                } else {
                    results[path === undefined ? key : `${path}.${key}`] = value;
                }
            }
            return results;
        }
    },
    "./shared/colors.ts": function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, "darken", function() {
            return darken;
        });
        __webpack_require__.d(__webpack_exports__, "lighten", function() {
            return lighten;
        });
        __webpack_require__.d(__webpack_exports__, "initializeColorPalette", function() {
            return initializeColorPalette;
        });
        __webpack_require__.d(__webpack_exports__, "toRgb", function() {
            return toRgb;
        });
        const cssColorRegEx = /^(?:(#?)([0-9a-f]{3}|[0-9a-f]{6})|((?:rgb|hsl)a?)\((-?\d+%?)[,\s]+(-?\d+%?)[,\s]+(-?\d+%?)[,\s]*(-?[\d\.]+%?)?\))$/i;
        function adjustLight(color, amount) {
            const cc = color + amount;
            const c = amount < 0 ? cc < 0 ? 0 : cc : cc > 255 ? 255 : cc;
            const hex = Math.round(c).toString(16);
            return hex.length > 1 ? hex : `0${hex}`;
        }
        function darken(color, percentage) {
            return lighten(color, -percentage);
        }
        function lighten(color, percentage) {
            const rgb = toRgb(color);
            if (rgb == null) return color;
            const [r, g, b] = rgb;
            percentage = 255 * percentage / 100;
            return `#${adjustLight(r, percentage)}${adjustLight(g, percentage)}${adjustLight(b, percentage)}`;
        }
        function initializeColorPalette() {
            const onColorThemeChanged = () => {
                const body = document.body;
                const computedStyle = getComputedStyle(body);
                const bodyStyle = body.style;
                let color = computedStyle.getPropertyValue("--color").trim();
                const rgb = toRgb(color);
                if (rgb != null) {
                    const [r, g, b] = rgb;
                    bodyStyle.setProperty("--color--75", `rgba(${r}, ${g}, ${b}, 0.75)`);
                    bodyStyle.setProperty("--color--50", `rgba(${r}, ${g}, ${b}, 0.5)`);
                }
                color = computedStyle.getPropertyValue("--background-color").trim();
                bodyStyle.setProperty("--background-color--lighten-05", lighten(color, 5));
                bodyStyle.setProperty("--background-color--darken-05", darken(color, 5));
                bodyStyle.setProperty("--background-color--lighten-075", lighten(color, 7.5));
                bodyStyle.setProperty("--background-color--darken-075", darken(color, 7.5));
                bodyStyle.setProperty("--background-color--lighten-15", lighten(color, 15));
                bodyStyle.setProperty("--background-color--darken-15", darken(color, 15));
                bodyStyle.setProperty("--background-color--lighten-30", lighten(color, 30));
                bodyStyle.setProperty("--background-color--darken-30", darken(color, 30));
                color = computedStyle.getPropertyValue("--link-color").trim();
                bodyStyle.setProperty("--link-color--darken-20", darken(color, 20));
            };
            const observer = new MutationObserver(onColorThemeChanged);
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: [ "class" ]
            });
            onColorThemeChanged();
            return observer;
        }
        function toRgb(color) {
            color = color.trim();
            const result = cssColorRegEx.exec(color);
            if (result == null) return null;
            if (result[1] === "#") {
                const hex = result[2];
                switch (hex.length) {
                  case 3:
                    return [ parseInt(hex[0] + hex[0], 16), parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16) ];

                  case 6:
                    return [ parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16) ];
                }
                return null;
            }
            switch (result[3]) {
              case "rgb":
              case "rgba":
                return [ parseInt(result[4], 10), parseInt(result[5], 10), parseInt(result[6], 10) ];

              default:
                return null;
            }
        }
    },
    "./shared/dom.ts": function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, "DOM", function() {
            return DOM;
        });
        var DOM;
        (function(DOM) {
            function getElementById(id) {
                return document.getElementById(id);
            }
            DOM.getElementById = getElementById;
            function listenAll(selector, name, listener) {
                const els = document.querySelectorAll(selector);
                for (const el of els) {
                    el.addEventListener(name, listener, false);
                }
            }
            DOM.listenAll = listenAll;
        })(DOM || (DOM = {}));
    },
    "./welcome/app.ts": function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, "WelcomeApp", function() {
            return WelcomeApp;
        });
        var _shared_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./shared/dom.ts");
        var _shared_app_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./shared/app-base.ts");
        class WelcomeApp extends _shared_app_base__WEBPACK_IMPORTED_MODULE_1__["App"] {
            constructor() {
                super("WelcomeApp");
            }
            bind() {
                super.bind();
                const onClicked = this.onClicked.bind(this);
                _shared_dom__WEBPACK_IMPORTED_MODULE_0__["DOM"].listenAll("button[data-href]", "click", function() {
                    onClicked(this);
                });
            }
            onClicked(element) {
                this.executeCommand(element.dataset.href);
            }
        }
    },
    "./welcome/index.ts": function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./welcome/app.ts");
        new _app__WEBPACK_IMPORTED_MODULE_0__["WelcomeApp"]();
    },
    1: function(module, exports, __webpack_require__) {
        __webpack_require__("./welcome/index.ts");
        module.exports = __webpack_require__("./scss/main.scss");
    }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2hhcmVkL2FwcC1iYXNlLnRzIiwid2VicGFjazovLy8uL3NoYXJlZC9jb2xvcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc2hhcmVkL2RvbS50cyIsIndlYnBhY2s6Ly8vLi93ZWxjb21lL2FwcC50cyIsIndlYnBhY2s6Ly8vLi93ZWxjb21lL2luZGV4LnRzIl0sIm5hbWVzIjpbImluc3RhbGxlZE1vZHVsZXMiLCJfX3dlYnBhY2tfcmVxdWlyZV9fIiwibW9kdWxlSWQiLCJleHBvcnRzIiwibW9kdWxlIiwiaSIsImwiLCJtb2R1bGVzIiwiY2FsbCIsIm0iLCJjIiwiZCIsIm5hbWUiLCJnZXR0ZXIiLCJvIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiciIsInZhbHVlIiwibiIsIl9fZXNNb2R1bGUiLCJnZXREZWZhdWx0IiwiZ2V0TW9kdWxlRXhwb3J0cyIsIm9iamVjdCIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJwIiwicyIsImdpdGxlbnMiLCJ3aW5kb3ciLCJBcHAiLCJbb2JqZWN0IE9iamVjdF0iLCJfYXBwTmFtZSIsInRoaXMiLCJfY2hhbmdlcyIsImNyZWF0ZSIsIl9zY29wZXMiLCJsb2ciLCJfY29tbWFuZFJlbGF5IiwiX3NoYXJlZF9kb21fX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXyIsImdldEVsZW1lbnRCeUlkIiwic2NvcGVzIiwibGVuZ3RoIiwic2NvcGUiLCJ0ZXh0Iiwib3B0aW9uIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwic2VsZWN0ZWQiLCJhcHBlbmRDaGlsZCIsInBhcmVudEVsZW1lbnQiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJfc2hhcmVkX2NvbG9yc19fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fIiwiaW5pdGlhbGl6ZSIsImJpbmQiLCJzZXRUaW1lb3V0IiwiYm9keSIsImVsIiwicXVlcnlTZWxlY3RvckFsbCIsImNoZWNrZWQiLCJkYXRhc2V0IiwidHlwZSIsImdldFNldHRpbmdWYWx1ZSIsImluY2x1ZGVzIiwicXVlcnlTZWxlY3RvciIsInN0YXRlIiwiZmxhdHRlbiIsImNvbmZpZyIsInNldFZpc2liaWxpdHkiLCJzZXRFbmFibGVtZW50Iiwib25JbnB1dENoZWNrZWQiLCJsaXN0ZW5BbGwiLCJhcmd1bWVudHMiLCJvbklucHV0U2VsZWN0ZWQiLCJtZXNzYWdlIiwiY29uc29sZSIsImVsZW1lbnQiLCJzZXR0aW5nIiwiQXJyYXkiLCJpc0FycmF5IiwicHVzaCIsImluZGV4T2YiLCJzcGxpY2UiLCJzZXRBZGRpdGlvbmFsU2V0dGluZ3MiLCJhZGRTZXR0aW5nc09uIiwiYWRkU2V0dGluZ3NPZmYiLCJhcHBseUNoYW5nZXMiLCJvcHRpb25zIiwic2VsZWN0ZWRJbmRleCIsImVuc3VyZUlmQm9vbGVhbiIsImFyZ3MiLCJKU09OIiwic3RyaW5naWZ5IiwiY2hhbmdlcyIsImdldFNjb3BlIiwidXJpIiwiY29tbWFuZCIsImVuY29kZVVSSSIsImV4ZWN1dGVDb21tYW5kIiwidW5kZWZpbmVkIiwic2V0QXR0cmlidXRlIiwiY2xpY2siLCJleHByZXNzaW9uIiwiYWRkU2V0dGluZ3MiLCJwYXJzZUFkZGl0aW9uYWxTZXR0aW5nc0V4cHJlc3Npb24iLCJ2IiwiZXZhbHVhdGVTdGF0ZUV4cHJlc3Npb24iLCJlbmFibGVtZW50IiwicmVtb3ZlQXR0cmlidXRlIiwibWF0Y2hlcyIsImRpc2FibGVkIiwiaW5wdXQiLCJ2aXNpYmlsaXR5IiwiZXhwciIsInRyaW0iLCJzcGxpdCIsImxocyIsIm9wIiwicmhzIiwicGFyc2VTdGF0ZUV4cHJlc3Npb24iLCJ0b1N0cmluZyIsInBhdGgiLCJyZWR1Y2UiLCJrZXkiLCJzZXR0aW5nc0V4cHJlc3Npb24iLCJtYXAiLCJyZXN1bHRzIiwiYXNzaWduIiwiX193ZWJwYWNrX2V4cG9ydHNfXyIsInRvUmdiIiwiY3NzQ29sb3JSZWdFeCIsImFkanVzdExpZ2h0IiwiY29sb3IiLCJhbW91bnQiLCJjYyIsImhleCIsIk1hdGgiLCJyb3VuZCIsImRhcmtlbiIsInBlcmNlbnRhZ2UiLCJsaWdodGVuIiwicmdiIiwiZyIsImIiLCJpbml0aWFsaXplQ29sb3JQYWxldHRlIiwib25Db2xvclRoZW1lQ2hhbmdlZCIsImNvbXB1dGVkU3R5bGUiLCJnZXRDb21wdXRlZFN0eWxlIiwiYm9keVN0eWxlIiwic3R5bGUiLCJnZXRQcm9wZXJ0eVZhbHVlIiwic2V0UHJvcGVydHkiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJvYnNlcnZlIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUZpbHRlciIsInJlc3VsdCIsImV4ZWMiLCJwYXJzZUludCIsInN1YnN0cmluZyIsIkRPTSIsImlkIiwic2VsZWN0b3IiLCJsaXN0ZW5lciIsImVscyIsImFkZEV2ZW50TGlzdGVuZXIiLCJXZWxjb21lQXBwIiwiX3NoYXJlZF9hcHBfYmFzZV9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fIiwic3VwZXIiLCJvbkNsaWNrZWQiLCJocmVmIiwiX2FwcF9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fIl0sIm1hcHBpbmdzIjoiO0lBQ0EsSUFBQUE7SUFHQSxTQUFBQyxvQkFBQUM7UUFHQSxJQUFBRixpQkFBQUUsV0FBQTtZQUNBLE9BQUFGLGlCQUFBRSxVQUFBQzs7UUFHQSxJQUFBQyxTQUFBSixpQkFBQUU7WUFDQUcsR0FBQUg7WUFDQUksR0FBQTtZQUNBSDs7UUFJQUksUUFBQUwsVUFBQU0sS0FBQUosT0FBQUQsU0FBQUMsZUFBQUQsU0FBQUY7UUFHQUcsT0FBQUUsSUFBQTtRQUdBLE9BQUFGLE9BQUFEOztJQUtBRixvQkFBQVEsSUFBQUY7SUFHQU4sb0JBQUFTLElBQUFWO0lBR0FDLG9CQUFBVSxJQUFBLFNBQUFSLFNBQUFTLE1BQUFDO1FBQ0EsS0FBQVosb0JBQUFhLEVBQUFYLFNBQUFTLE9BQUE7WUFDQUcsT0FB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RVhNLG1CQUEwQkMsOENBQUE7WUFFNUIzSTtnQkFDSTRJLE1BQU07O1lBR0E1STtnQkFDTjRJLE1BQU1uSDtnQkFFTixNQUFNb0gsWUFBWTNJLEtBQUsySSxVQUFVcEgsS0FBS3ZCO2dCQUN0Q00seUNBQUEsT0FBSWtDLFVBQVUscUJBQXFCLFNBQVM7b0JBQW9DbUcsVUFBVTNJOzs7WUFHdEZGLFVBQVUrQztnQkFDZDdDLEtBQUttRSxlQUFldEIsUUFBUWhCLFFBQVErRzs7Ozs7Ozs7UUNmNUMsSUFBSUMsa0NBQUEiLCJmaWxlIjoid2VsY29tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcInt7cm9vdH19L291dC91aS9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgeyBET00gfSBmcm9tICcuLy4uL3NoYXJlZC9kb20nO1xyXG5pbXBvcnQgeyBpbml0aWFsaXplQ29sb3JQYWxldHRlIH0gZnJvbSAnLi4vc2hhcmVkL2NvbG9ycyc7XHJcbmltcG9ydCB7IElDb25maWcgfSBmcm9tICcuLy4uL2NvbmZpZyc7XHJcblxyXG5jb25zdCBnaXRsZW5zOiB7IGNvbmZpZzogSUNvbmZpZywgc2NvcGU6ICd1c2VyJyB8ICd3b3Jrc3BhY2UnLCBzY29wZXM6IFsndXNlcicgfCAnd29ya3NwYWNlJywgc3RyaW5nXVtdLCB1cmk6IHN0cmluZyB9ID0gKHdpbmRvdyBhcyBhbnkpLmdpdGxlbnM7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQXBwIHtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9jb21tYW5kUmVsYXk6IEhUTUxBbmNob3JFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfY2hhbmdlczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zY29wZXM6IEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfYXBwTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5sb2coYCR7dGhpcy5fYXBwTmFtZX0uY3RvcmApO1xyXG5cclxuICAgICAgICB0aGlzLl9jb21tYW5kUmVsYXkgPSBET00uZ2V0RWxlbWVudEJ5SWQ8SFRNTEFuY2hvckVsZW1lbnQ+KCdjb21tYW5kUmVsYXknKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHNjb3BlcyBpZiBhdmFpbGFibGVcclxuICAgICAgICBjb25zdCBzY29wZXMgPSBET00uZ2V0RWxlbWVudEJ5SWQ8SFRNTFNlbGVjdEVsZW1lbnQ+KCdzY29wZXMnKTtcclxuICAgICAgICBpZiAoc2NvcGVzICYmIGdpdGxlbnMuc2NvcGVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBbc2NvcGUsIHRleHRdIG9mIGdpdGxlbnMuc2NvcGVzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IHNjb3BlO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ2l0bGVucy5zY29wZSA9PT0gc2NvcGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2NvcGVzLmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNjb3Blcy5wYXJlbnRFbGVtZW50IS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuICAgICAgICAgICAgdGhpcy5fc2NvcGVzID0gc2NvcGVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5pdGlhbGl6ZUNvbG9yUGFsZXR0ZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgIHRoaXMuYmluZCgpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdwcmVsb2FkJyk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICB0aGlzLmxvZyhgJHt0aGlzLl9hcHBOYW1lfS5pbml0aWFsaXplU3RhdGVgKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxJbnB1dEVsZW1lbnQ+KCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0uc2V0dGluZycpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSBlbC5kYXRhc2V0LnR5cGUgPT09ICdhcnJheSdcclxuICAgICAgICAgICAgICAgID8gKGdldFNldHRpbmdWYWx1ZTxzdHJpbmdbXT4oZWwubmFtZSkgfHwgW10pLmluY2x1ZGVzKGVsLnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgOiBnZXRTZXR0aW5nVmFsdWU8Ym9vbGVhbj4oZWwubmFtZSkgfHwgZmFsc2U7XHJcbiAgICAgICAgICAgIGVsLmNoZWNrZWQgPSBjaGVja2VkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxTZWxlY3RFbGVtZW50Pignc2VsZWN0LnNldHRpbmcnKSkge1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGdldFNldHRpbmdWYWx1ZTxzdHJpbmc+KGVsLm5hbWUpO1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb24gPSBlbC5xdWVyeVNlbGVjdG9yPEhUTUxPcHRpb25FbGVtZW50Pihgb3B0aW9uW3ZhbHVlPScke3ZhbHVlfSddYCk7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBmbGF0dGVuKGdpdGxlbnMuY29uZmlnKTtcclxuICAgICAgICB0aGlzLnNldFZpc2liaWxpdHkoc3RhdGUpO1xyXG4gICAgICAgIHRoaXMuc2V0RW5hYmxlbWVudChzdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGJpbmQoKSB7XHJcbiAgICAgICAgY29uc3Qgb25JbnB1dENoZWNrZWQgPSB0aGlzLm9uSW5wdXRDaGVja2VkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgRE9NLmxpc3RlbkFsbCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdLnNldHRpbmcnLCAnY2hhbmdlJywgZnVuY3Rpb24odGhpczogSFRNTElucHV0RWxlbWVudCkgeyByZXR1cm4gb25JbnB1dENoZWNrZWQodGhpcywgLi4uYXJndW1lbnRzKTsgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9uSW5wdXRTZWxlY3RlZCA9IHRoaXMub25JbnB1dFNlbGVjdGVkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgRE9NLmxpc3RlbkFsbCgnc2VsZWN0LnNldHRpbmcnLCAnY2hhbmdlJywgZnVuY3Rpb24odGhpczogSFRNTElucHV0RWxlbWVudCkgeyByZXR1cm4gb25JbnB1dFNlbGVjdGVkKHRoaXMsIC4uLmFyZ3VtZW50cyk7IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBsb2cobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbklucHV0Q2hlY2tlZChlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5sb2coYCR7dGhpcy5fYXBwTmFtZX0ub25JbnB1dENoZWNrZWQ6IG5hbWU9JHtlbGVtZW50Lm5hbWV9LCBjaGVja2VkPSR7ZWxlbWVudC5jaGVja2VkfSwgdmFsdWU9JHtlbGVtZW50LnZhbHVlfWApO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudC5kYXRhc2V0LnR5cGUgPT09ICdhcnJheScpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2V0dGluZyA9IGdldFNldHRpbmdWYWx1ZShlbGVtZW50Lm5hbWUpIHx8IFtdO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzZXR0aW5nKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2V0dGluZy5pbmNsdWRlcyhlbGVtZW50LnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nLnB1c2goZWxlbWVudC52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaSA9IHNldHRpbmcuaW5kZXhPZihlbGVtZW50LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlc1tlbGVtZW50Lm5hbWVdID0gc2V0dGluZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlc1tlbGVtZW50Lm5hbWVdID0gZWxlbWVudC52YWx1ZSA9PT0gJ29uJyA/IHRydWUgOiBlbGVtZW50LnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlc1tlbGVtZW50Lm5hbWVdID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0QWRkaXRpb25hbFNldHRpbmdzKGVsZW1lbnQuY2hlY2tlZCA/IGVsZW1lbnQuZGF0YXNldC5hZGRTZXR0aW5nc09uIDogZWxlbWVudC5kYXRhc2V0LmFkZFNldHRpbmdzT2ZmKTtcclxuICAgICAgICB0aGlzLmFwcGx5Q2hhbmdlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25JbnB1dFNlbGVjdGVkKGVsZW1lbnQ6IEhUTUxTZWxlY3RFbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPT09IHRoaXMuX3Njb3BlcykgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnQub3B0aW9uc1tlbGVtZW50LnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xyXG5cclxuICAgICAgICB0aGlzLmxvZyhgJHt0aGlzLl9hcHBOYW1lfS5vbklucHV0U2VsZWN0ZWQ6IG5hbWU9JHtlbGVtZW50Lm5hbWV9LCB2YWx1ZT0ke3ZhbHVlfWApO1xyXG5cclxuICAgICAgICB0aGlzLl9jaGFuZ2VzW2VsZW1lbnQubmFtZV0gPSBlbnN1cmVJZkJvb2xlYW4odmFsdWUpO1xyXG5cclxuICAgICAgICB0aGlzLmFwcGx5Q2hhbmdlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXBwbHlDaGFuZ2VzKCkge1xyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIGNoYW5nZXM6IHRoaXMuX2NoYW5nZXMsXHJcbiAgICAgICAgICAgIHNjb3BlOiB0aGlzLmdldFNjb3BlKCksXHJcbiAgICAgICAgICAgIHVyaTogZ2l0bGVucy51cmlcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmxvZyhgJHt0aGlzLl9hcHBOYW1lfS5hcHBseUNoYW5nZXM6IGFyZ3M9JHthcmdzfWApO1xyXG5cclxuICAgICAgICBjb25zdCBjb21tYW5kID0gJ2NvbW1hbmQ6Z2l0bGVucy5zYXZlU2V0dGluZ3M/JyArIGVuY29kZVVSSShhcmdzKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZXhlY3V0ZUNvbW1hbmQoY29tbWFuZCksIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBleGVjdXRlQ29tbWFuZChjb21tYW5kOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoY29tbWFuZCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMubG9nKGAke3RoaXMuX2FwcE5hbWV9LmV4ZWN1dGVDb21tYW5kOiBjb21tYW5kPSR7Y29tbWFuZH1gKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29tbWFuZFJlbGF5LnNldEF0dHJpYnV0ZSgnaHJlZicsIGNvbW1hbmQpO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRSZWxheS5jbGljaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U2NvcGUoKTogJ3VzZXInIHwgJ3dvcmtzcGFjZScge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY29wZXMgIT0gbnVsbFxyXG4gICAgICAgICAgICA/IHRoaXMuX3Njb3Blcy5vcHRpb25zW3RoaXMuX3Njb3Blcy5zZWxlY3RlZEluZGV4XS52YWx1ZSBhcyAndXNlcicgfCAnd29ya3NwYWNlJ1xyXG4gICAgICAgICAgICA6ICd1c2VyJztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEFkZGl0aW9uYWxTZXR0aW5ncyhleHByZXNzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoIWV4cHJlc3Npb24pIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgYWRkU2V0dGluZ3MgPSBwYXJzZUFkZGl0aW9uYWxTZXR0aW5nc0V4cHJlc3Npb24oZXhwcmVzc2lvbik7XHJcbiAgICAgICAgZm9yIChjb25zdCBbcywgdl0gb2YgYWRkU2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlc1tzXSA9IHY7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0RW5hYmxlbWVudChzdGF0ZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBib29sZWFuIH0pIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCdbZGF0YS1lbmFibGVtZW50XScpKSB7XHJcbiAgICAgICAgICAgIC8vIFNpbmNlIGV2ZXJ5dGhpbmcgc3RhcnRzIGRpc2FibGVkLCBraWNrIG91dCBpZiBpdCBzdGlsbCBpc1xyXG4gICAgICAgICAgICBpZiAoIWV2YWx1YXRlU3RhdGVFeHByZXNzaW9uKGVsLmRhdGFzZXQuZW5hYmxlbWVudCEsIHN0YXRlKSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZWwubWF0Y2hlcygnaW5wdXQsc2VsZWN0JykpIHtcclxuICAgICAgICAgICAgICAgIChlbCBhcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQpLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IGVsLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50PignaW5wdXQsc2VsZWN0Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQgPT0gbnVsbCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFZpc2liaWxpdHkoc3RhdGU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgYm9vbGVhbiB9KSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignW2RhdGEtdmlzaWJpbGl0eV0nKSkge1xyXG4gICAgICAgICAgICAvLyBTaW5jZSBldmVyeXRoaW5nIHN0YXJ0cyBoaWRkZW4sIGtpY2sgb3V0IGlmIGl0IHN0aWxsIGlzXHJcbiAgICAgICAgICAgIGlmICghZXZhbHVhdGVTdGF0ZUV4cHJlc3Npb24oZWwuZGF0YXNldC52aXNpYmlsaXR5ISwgc3RhdGUpKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZW5zdXJlSWZCb29sZWFuKHZhbHVlOiBzdHJpbmcgfCBib29sZWFuKTogc3RyaW5nIHwgYm9vbGVhbiB7XHJcbiAgICBpZiAodmFsdWUgPT09ICd0cnVlJykgcmV0dXJuIHRydWU7XHJcbiAgICBpZiAodmFsdWUgPT09ICdmYWxzZScpIHJldHVybiBmYWxzZTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXZhbHVhdGVTdGF0ZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nLCBjaGFuZ2VzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IGJvb2xlYW4gfSk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHN0YXRlID0gZmFsc2U7XHJcbiAgICBmb3IgKGNvbnN0IGV4cHIgb2YgZXhwcmVzc2lvbi50cmltKCkuc3BsaXQoJyYnKSkge1xyXG4gICAgICAgIGNvbnN0IFtsaHMsIG9wLCByaHNdID0gcGFyc2VTdGF0ZUV4cHJlc3Npb24oZXhwcik7XHJcblxyXG4gICAgICAgIHN3aXRjaCAob3ApIHtcclxuICAgICAgICAgICAgY2FzZSAnPSc6IHsgLy8gRXF1YWxzXHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBjaGFuZ2VzW2xoc107XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0U2V0dGluZ1ZhbHVlPHN0cmluZyB8IGJvb2xlYW4+KGxocykgfHwgZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHJocyAhPT0gdW5kZWZpbmVkID8gcmhzID09PSAnJyArIHZhbHVlIDogISF2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgJyEnOiB7IC8vIE5vdCBlcXVhbHNcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGNoYW5nZXNbbGhzXTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBnZXRTZXR0aW5nVmFsdWU8c3RyaW5nIHwgYm9vbGVhbj4obGhzKSB8fCBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0YXRlID0gcmhzICE9PSB1bmRlZmluZWQgPyByaHMgIT09ICcnICsgdmFsdWUgOiAhdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlICcrJzogeyAvLyBDb250YWluc1xyXG4gICAgICAgICAgICAgICAgaWYgKHJocyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZyA9IGdldFNldHRpbmdWYWx1ZTxzdHJpbmdbXT4obGhzKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSA9IHNldHRpbmcgIT09IHVuZGVmaW5lZCA/IHNldHRpbmcuaW5jbHVkZXMocmhzLnRvU3RyaW5nKCkpIDogZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdGF0ZSkgYnJlYWs7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldDxUPihvOiB7IFtrZXk6IHN0cmluZyBdOiBhbnl9LCBwYXRoOiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcclxuICAgIHJldHVybiBwYXRoLnNwbGl0KCcuJykucmVkdWNlKChvID0ge30sIGtleSkgPT4gb1trZXldLCBvKSBhcyBUO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZXR0aW5nVmFsdWU8VD4ocGF0aDogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XHJcbiAgICByZXR1cm4gZ2V0PFQ+KGdpdGxlbnMuY29uZmlnLCBwYXRoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VBZGRpdGlvbmFsU2V0dGluZ3NFeHByZXNzaW9uKGV4cHJlc3Npb246IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZyB8IGJvb2xlYW5dW10ge1xyXG4gICAgY29uc3Qgc2V0dGluZ3NFeHByZXNzaW9uID0gZXhwcmVzc2lvbi50cmltKCkuc3BsaXQoJywnKTtcclxuICAgIHJldHVybiBzZXR0aW5nc0V4cHJlc3Npb24ubWFwPFtzdHJpbmcsIHN0cmluZyB8IGJvb2xlYW5dPihzID0+IHtcclxuICAgICAgICBjb25zdCBbc2V0dGluZywgdmFsdWVdID0gcy5zcGxpdCgnPScpO1xyXG4gICAgICAgIHJldHVybiBbc2V0dGluZywgZW5zdXJlSWZCb29sZWFuKHZhbHVlKV07XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTdGF0ZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nKTogW3N0cmluZywgc3RyaW5nLCBzdHJpbmcgfCBib29sZWFuIHwgdW5kZWZpbmVkXSB7XHJcbiAgICBjb25zdCBbbGhzLCBvcCwgcmhzXSA9IGV4cHJlc3Npb24udHJpbSgpLnNwbGl0KC8oWz1cXCtcXCFdKS8pO1xyXG4gICAgcmV0dXJuIFtsaHMudHJpbSgpLCBvcCAhPT0gdW5kZWZpbmVkID8gb3AudHJpbSgpIDogJz0nLCByaHMgIT09IHVuZGVmaW5lZCA/IHJocy50cmltKCkgOiByaHNdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmbGF0dGVuKG86IHsgW2tleTogc3RyaW5nXTogYW55IH0sIHBhdGg/OiBzdHJpbmcpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcclxuICAgIGNvbnN0IHJlc3VsdHM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBvW2tleV07XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihyZXN1bHRzLCBmbGF0dGVuKHZhbHVlLCBwYXRoID09PSB1bmRlZmluZWQgPyBrZXkgOiBgJHtwYXRofS4ke2tleX1gKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHRzW3BhdGggPT09IHVuZGVmaW5lZCA/IGtleSA6IGAke3BhdGh9LiR7a2V5fWBdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHRzO1xyXG59IiwiY29uc3QgY3NzQ29sb3JSZWdFeCA9IC9eKD86KCM/KShbMC05YS1mXXszfXxbMC05YS1mXXs2fSl8KCg/OnJnYnxoc2wpYT8pXFwoKC0/XFxkKyU/KVssXFxzXSsoLT9cXGQrJT8pWyxcXHNdKygtP1xcZCslPylbLFxcc10qKC0/W1xcZFxcLl0rJT8pP1xcKSkkL2k7XHJcblxyXG5mdW5jdGlvbiBhZGp1c3RMaWdodChjb2xvcjogbnVtYmVyLCBhbW91bnQ6IG51bWJlcikge1xyXG4gICAgY29uc3QgY2MgPSBjb2xvciArIGFtb3VudDtcclxuICAgIGNvbnN0IGMgPSBhbW91bnQgPCAwXHJcbiAgICAgICAgPyBjYyA8IDAgPyAwIDogY2NcclxuICAgICAgICA6IGNjID4gMjU1ID8gMjU1IDogY2M7XHJcblxyXG4gICAgY29uc3QgaGV4ID0gTWF0aC5yb3VuZChjKS50b1N0cmluZygxNik7XHJcbiAgICByZXR1cm4gaGV4Lmxlbmd0aCA+IDEgPyBoZXggOiBgMCR7aGV4fWA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXJrZW4oY29sb3I6IHN0cmluZywgcGVyY2VudGFnZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gbGlnaHRlbihjb2xvciwgLXBlcmNlbnRhZ2UpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGlnaHRlbihjb2xvcjogc3RyaW5nLCBwZXJjZW50YWdlOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHJnYiA9IHRvUmdiKGNvbG9yKTtcclxuICAgIGlmIChyZ2IgPT0gbnVsbCkgcmV0dXJuIGNvbG9yO1xyXG5cclxuICAgIGNvbnN0IFtyLCBnLCBiXSA9IHJnYjtcclxuICAgIHBlcmNlbnRhZ2UgPSAoMjU1ICogcGVyY2VudGFnZSkgLyAxMDA7XHJcbiAgICByZXR1cm4gYCMke2FkanVzdExpZ2h0KHIsIHBlcmNlbnRhZ2UpfSR7YWRqdXN0TGlnaHQoZywgcGVyY2VudGFnZSl9JHthZGp1c3RMaWdodChiLCBwZXJjZW50YWdlKX1gO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbG9yUGFsZXR0ZSgpIHtcclxuICAgIGNvbnN0IG9uQ29sb3JUaGVtZUNoYW5nZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoYm9keSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJvZHlTdHlsZSA9IGJvZHkuc3R5bGU7XHJcbiAgICAgICAgbGV0IGNvbG9yID0gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLWNvbG9yJykudHJpbSgpO1xyXG4gICAgICAgIGNvbnN0IHJnYiA9IHRvUmdiKGNvbG9yKTtcclxuICAgICAgICBpZiAocmdiICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgW3IsIGcsIGJdID0gcmdiO1xyXG4gICAgICAgICAgICBib2R5U3R5bGUuc2V0UHJvcGVydHkoJy0tY29sb3ItLTc1JywgYHJnYmEoJHtyfSwgJHtnfSwgJHtifSwgMC43NSlgKTtcclxuICAgICAgICAgICAgYm9keVN0eWxlLnNldFByb3BlcnR5KCctLWNvbG9yLS01MCcsIGByZ2JhKCR7cn0sICR7Z30sICR7Yn0sIDAuNSlgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbG9yID0gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLWJhY2tncm91bmQtY29sb3InKS50cmltKCk7XHJcbiAgICAgICAgYm9keVN0eWxlLnNldFByb3BlcnR5KCctLWJhY2tncm91bmQtY29sb3ItLWxpZ2h0ZW4tMDUnLCBsaWdodGVuKGNvbG9yLCA1KSk7XHJcbiAgICAgICAgYm9keVN0eWxlLnNldFByb3BlcnR5KCctLWJhY2tncm91bmQtY29sb3ItLWRhcmtlbi0wNScsIGRhcmtlbihjb2xvciwgNSkpO1xyXG4gICAgICAgIGJvZHlTdHlsZS5zZXRQcm9wZXJ0eSgnLS1iYWNrZ3JvdW5kLWNvbG9yLS1saWdodGVuLTA3NScsIGxpZ2h0ZW4oY29sb3IsIDcuNSkpO1xyXG4gICAgICAgIGJvZHlTdHlsZS5zZXRQcm9wZXJ0eSgnLS1iYWNrZ3JvdW5kLWNvbG9yLS1kYXJrZW4tMDc1JywgZGFya2VuKGNvbG9yLCA3LjUpKTtcclxuICAgICAgICBib2R5U3R5bGUuc2V0UHJvcGVydHkoJy0tYmFja2dyb3VuZC1jb2xvci0tbGlnaHRlbi0xNScsIGxpZ2h0ZW4oY29sb3IsIDE1KSk7XHJcbiAgICAgICAgYm9keVN0eWxlLnNldFByb3BlcnR5KCctLWJhY2tncm91bmQtY29sb3ItLWRhcmtlbi0xNScsIGRhcmtlbihjb2xvciwgMTUpKTtcclxuICAgICAgICBib2R5U3R5bGUuc2V0UHJvcGVydHkoJy0tYmFja2dyb3VuZC1jb2xvci0tbGlnaHRlbi0zMCcsIGxpZ2h0ZW4oY29sb3IsIDMwKSk7XHJcbiAgICAgICAgYm9keVN0eWxlLnNldFByb3BlcnR5KCctLWJhY2tncm91bmQtY29sb3ItLWRhcmtlbi0zMCcsIGRhcmtlbihjb2xvciwgMzApKTtcclxuXHJcbiAgICAgICAgY29sb3IgPSBjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUoJy0tbGluay1jb2xvcicpLnRyaW0oKTtcclxuICAgICAgICBib2R5U3R5bGUuc2V0UHJvcGVydHkoJy0tbGluay1jb2xvci0tZGFya2VuLTIwJywgZGFya2VuKGNvbG9yLCAyMCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG9uQ29sb3JUaGVtZUNoYW5nZWQpO1xyXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7IGF0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZUZpbHRlcjogWydjbGFzcyddIH0pO1xyXG5cclxuICAgIG9uQ29sb3JUaGVtZUNoYW5nZWQoKTtcclxuICAgIHJldHVybiBvYnNlcnZlcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvUmdiKGNvbG9yOiBzdHJpbmcpIHtcclxuICAgIGNvbG9yID0gY29sb3IudHJpbSgpO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IGNzc0NvbG9yUmVnRXguZXhlYyhjb2xvcik7XHJcbiAgICBpZiAocmVzdWx0ID09IG51bGwpIHJldHVybiBudWxsO1xyXG5cclxuICAgIGlmIChyZXN1bHRbMV0gPT09ICcjJykge1xyXG4gICAgICAgIGNvbnN0IGhleCA9IHJlc3VsdFsyXTtcclxuICAgICAgICBzd2l0Y2ggKGhleC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChoZXhbMF0gKyBoZXhbMF0sIDE2KSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChoZXhbMV0gKyBoZXhbMV0sIDE2KSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChoZXhbMl0gKyBoZXhbMl0sIDE2KVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChoZXguc3Vic3RyaW5nKDAsIDIpLCAxNiksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoaGV4LnN1YnN0cmluZygyLCA0KSwgMTYpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGhleC5zdWJzdHJpbmcoNCwgNiksIDE2KVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCAocmVzdWx0WzNdKSB7XHJcbiAgICAgICAgY2FzZSAncmdiJzpcclxuICAgICAgICBjYXNlICdyZ2JhJzpcclxuICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHJlc3VsdFs0XSwgMTApLFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQocmVzdWx0WzVdLCAxMCksXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludChyZXN1bHRbNl0sIDEwKVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBET00ge1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRCeUlkPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oaWQ6IHN0cmluZyk6IFQge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgVDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBleHBvcnQgZnVuY3Rpb24gcXVlcnk8VCBleHRlbmRzIEhUTUxFbGVtZW50PihzZWxlY3RvcnM6IHN0cmluZyk6IFQ7XHJcbiAgICAvLyBleHBvcnQgZnVuY3Rpb24gcXVlcnk8VCBleHRlbmRzIEhUTUxFbGVtZW50PihlbGVtZW50OiBIVE1MRWxlbWVudCwgc2VsZWN0b3JzOiBzdHJpbmcpOiBUO1xyXG4gICAgLy8gZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5PFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oZWxlbWVudE9yc2VsZWN0b3JzOiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgc2VsZWN0b3JzPzogc3RyaW5nKTogVCB7XHJcbiAgICAvLyAgICAgbGV0IGVsZW1lbnQ6IERvY3VtZW50IHwgSFRNTEVsZW1lbnQ7XHJcbiAgICAvLyAgICAgaWYgKHR5cGVvZiBlbGVtZW50T3JzZWxlY3RvcnMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAvLyAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudDtcclxuICAgIC8vICAgICAgICAgc2VsZWN0b3JzID0gZWxlbWVudE9yc2VsZWN0b3JzO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBlbHNlIHtcclxuICAgIC8vICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRPcnNlbGVjdG9ycztcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIHJldHVybiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzKSBhcyBUO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIGV4cG9ydCBmdW5jdGlvbiBxdWVyeUFsbDxUIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3JzOiBzdHJpbmcpOiBUO1xyXG4gICAgLy8gZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5QWxsPFQgZXh0ZW5kcyBFbGVtZW50PihlbGVtZW50OiBIVE1MRWxlbWVudCwgc2VsZWN0b3JzOiBzdHJpbmcpOiBUO1xyXG4gICAgLy8gZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5QWxsPFQgZXh0ZW5kcyBFbGVtZW50PihlbGVtZW50T3JzZWxlY3RvcnM6IHN0cmluZyB8IEhUTUxFbGVtZW50LCBzZWxlY3RvcnM/OiBzdHJpbmcpOiBUIHtcclxuICAgIC8vICAgICBsZXQgZWxlbWVudDogRG9jdW1lbnQgfCBIVE1MRWxlbWVudDtcclxuICAgIC8vICAgICBpZiAodHlwZW9mIGVsZW1lbnRPcnNlbGVjdG9ycyA9PT0gJ3N0cmluZycpIHtcclxuICAgIC8vICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50O1xyXG4gICAgLy8gICAgICAgICBzZWxlY3RvcnMgPSBlbGVtZW50T3JzZWxlY3RvcnM7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBlbGVtZW50ID0gZWxlbWVudE9yc2VsZWN0b3JzO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMpIGFzIE5vZGVMaXN0PFQ+O1xyXG4gICAgLy8gfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5BbGwoc2VsZWN0b3I6IHN0cmluZywgbmFtZTogc3RyaW5nLCBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdCkge1xyXG4gICAgICAgIGNvbnN0IGVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gICAgICAgIGZvciAoY29uc3QgZWwgb2YgZWxzKSB7XHJcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgbGlzdGVuZXIsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCB7IERPTSB9IGZyb20gJy4vLi4vc2hhcmVkL2RvbSc7XHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4uL3NoYXJlZC9hcHAtYmFzZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2VsY29tZUFwcCBleHRlbmRzIEFwcCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoJ1dlbGNvbWVBcHAnKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYmluZCgpIHtcclxuICAgICAgICBzdXBlci5iaW5kKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9uQ2xpY2tlZCA9IHRoaXMub25DbGlja2VkLmJpbmQodGhpcyk7XHJcbiAgICAgICAgRE9NLmxpc3RlbkFsbCgnYnV0dG9uW2RhdGEtaHJlZl0nLCAnY2xpY2snLCBmdW5jdGlvbih0aGlzOiBIVE1MQnV0dG9uRWxlbWVudCkgeyBvbkNsaWNrZWQodGhpcyk7IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25DbGlja2VkKGVsZW1lbnQ6IEhUTUxCdXR0b25FbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZChlbGVtZW50LmRhdGFzZXQuaHJlZik7XHJcbiAgICB9XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgeyBXZWxjb21lQXBwIH0gZnJvbSAnLi9hcHAnO1xyXG5cclxubmV3IFdlbGNvbWVBcHAoKTsiXSwic291cmNlUm9vdCI6IiJ9