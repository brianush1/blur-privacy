// ==UserScript==
// @name         Blur privacy
// @namespace    http://github.com/brianush1
// @version      1.0
// @description  Prevents websites from knowing when they lose your attention
// @author       Brian <brianush1@outlook.com>
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL  https://raw.github.com/brianush1/blur-privacy/master/privacy.user.js
// @updateURL    https://raw.github.com/brianush1/blur-privacy/master/privacy.user.js
// @license      GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright    Copyright (C) 2021, by Brian <brianush1@outlook.com>
// ==/UserScript==

(() => {
	if (document.readyState !== "loading") {
		return;
	}
	const func = $ => {
		const realAddEventListener = $.Node.prototype.addEventListener;
		const realRemoveEventListener = $.Node.prototype.removeEventListener;

		function checkEvent(self, a, b, c) {
			if (self === $.window &&
				[
					"pageshow",
					"pagehide",
					"focus",
					"blur",
				].includes(a)
			) {
				return false;
			}
			if (self === $.document && a === "visibilitychange") {
				return false;
			}
			return true;
		}

		$.Window.prototype.addEventListener =
			$.Node.prototype.addEventListener = function (a, b, c) {
				if (checkEvent(this, a, b, c)) {
					realAddEventListener.call(this, a, b, c);
				}
			};

		$.Window.prototype.removeEventListener =
			$.Node.prototype.removeEventListener = function (a, b, c) {
				if (checkEvent(this, a, b, c)) {
					realRemoveEventListener.call(this, a, b, c);
				}
			};

		$.document.hasFocus = function () {
			return true;
		};

		Object.defineProperty($.document, "hidden", { value: false });
		Object.defineProperty($.document, "mozHidden", { value: false });
		Object.defineProperty($.document, "webkitHidden", { value: false });
		Object.defineProperty($.document, "msHidden", { value: false });
		Object.defineProperty($.document, "visibilityState", { value: "visible" });

		function fakeProperty(self, name, def) {
			let val = def;
			Object.defineProperty(self, name, {
				get() {
					return val;
				},
				set(newVal) {
					val = newVal;
				},
			});
		}

		fakeProperty($.document, "onvisibilitychange", null);
		fakeProperty($.window, "onpageshow", null);
		fakeProperty($.window, "onpagehide", null);
		fakeProperty($.window, "onfocus", null);
		fakeProperty($.window, "onblur", null);
	};
	if ("unsafeWindow" in self) {
		func(unsafeWindow);
	}
	else {
		const scr = document.createElement("script");
		scr.innerText = `(${func})(self);`;
		const body = document.createElement("body");
		body.appendChild(scr);
		document.body = body;
		body.remove();
	}
})();
