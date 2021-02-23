(() => {
	if (document.readyState !== "loading") {
		return;
	}
	const scr = document.createElement("script");
	scr.innerText = `(${() => {
		const realAddEventListener = Node.prototype.addEventListener;
		const realRemoveEventListener = Node.prototype.removeEventListener;

		function checkEvent(self, a, b, c) {
			if (self === window &&
				[
					"pageshow",
					"pagehide",
					"focus",
					"blur",
				].includes(a)
			) {
				return false;
			}
			if (self === document && a === "visibilitychange") {
				return false;
			}
			return true;
		}

		Window.prototype.addEventListener =
			Node.prototype.addEventListener = function (a, b, c) {
				if (checkEvent(this, a, b, c)) {
					realAddEventListener.call(this, a, b, c);
				}
			};

		Window.prototype.removeEventListener =
			Node.prototype.removeEventListener = function (a, b, c) {
				if (checkEvent(this, a, b, c)) {
					realRemoveEventListener.call(this, a, b, c);
				}
			};

		document.hasFocus = function () {
			return true;
		};

		Object.defineProperty(document, "hidden", { value: false });
		Object.defineProperty(document, "mozHidden", { value: false });
		Object.defineProperty(document, "webkitHidden", { value: false });
		Object.defineProperty(document, "msHidden", { value: false });
		Object.defineProperty(document, "visibilityState", { value: "visible" });

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

		fakeProperty(document, "onvisibilitychange", null);
		fakeProperty(window, "onpageshow", null);
		fakeProperty(window, "onpagehide", null);
		fakeProperty(window, "onfocus", null);
		fakeProperty(window, "onblur", null);
	}})();`;
	const body = document.createElement("body");
	body.appendChild(scr);
	document.body = body;
	body.remove();
})();
