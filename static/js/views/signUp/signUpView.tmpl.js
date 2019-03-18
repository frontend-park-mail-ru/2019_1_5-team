;(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['signUp/signUpView.tmpl']=function (__fest_context){"use strict";var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_element_stack = [],__fest_short_tags = {"area": true, "base": true, "br": true, "col": true, "command": true, "embed": true, "hr": true, "img": true, "input": true, "keygen": true, "link": true, "meta": true, "param": true, "source": true, "wbr": true},__fest_jschars = /[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test = /[\\'"\/\n\r\t\b\f<>]/,__fest_htmlchars = /[&<>"]/g,__fest_htmlchars_test = /[&<>"]/,__fest_jshash = {"\"": "\\\"", "\\": "\\\\", "/": "\\/", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\b": "\\b", "\f": "\\f", "'": "\\'", "<": "\\u003C", ">": "\\u003E"},__fest_htmlhash = {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"},__fest_escapeJS = function __fest_escapeJS(value) {
		if (typeof value === 'string') {
			if (__fest_jschars_test.test(value)) {
				return value.replace(__fest_jschars, __fest_replaceJS);
			}
		}

		return value == null ? '' : value;
	},__fest_replaceJS = function __fest_replaceJS(chr) {
		return __fest_jshash[chr];
	},__fest_escapeHTML = function __fest_escapeHTML(value) {
		if (typeof value === 'string') {
			if (__fest_htmlchars_test.test(value)) {
				return value.replace(__fest_htmlchars, __fest_replaceHTML);
			}
		}

		return value == null ? '' : value;
	},__fest_replaceHTML = function __fest_replaceHTML(chr) {
		return __fest_htmlhash[chr];
	},__fest_extend = function __fest_extend(dest, src) {
		for (var key in src) {
			if (src.hasOwnProperty(key)) {
				dest[key] = src[key];
			}
		}
	},__fest_param = function __fest_param(fn) {
		fn.param = true;
		return fn;
	},i18n=__fest_self && typeof __fest_self.i18n === "function" ? __fest_self.i18n : function (str) {return str;},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}var params=__fest_context;__fest_buf+=("<div class=\"container\"><section class=\"container__block container__block_side\"><div class=\"settings\"><a class=\"settings__btn\"><svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" width=\"0.7em\" height=\"0.7em\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M6.937 1.291A1 1 0 0 1 8.642 2v12a1 1 0 0 1-1.697.717L3 11H1.25C.56 11 0 10.44 0 9.75v-3.5C0 5.56.56 5 1.25 5H3l3.937-3.709zM14.287 8a5.105 5.105 0 0 0-4.115-4.973l-.021-.007a.862.862 0 0 1 .507-1.646l.303.079A6.821 6.821 0 0 1 16 8a6.821 6.821 0 0 1-5.039 6.547l-.303.079a.861.861 0 0 1-.486-1.653A5.105 5.105 0 0 0 14.287 8zM11 8a1.812 1.812 0 0 0-.952-1.563l-.01-.008a.833.833 0 0 1 .939-1.369l.186.109A3.478 3.478 0 0 1 12.666 8a3.478 3.478 0 0 1-1.503 2.831l-.186.109a.832.832 0 0 1-.939-1.369l.01-.008c.558-.301.94-.887.952-1.563z\"></path></svg></a><a class=\"settings__btn\" href=\"\/about\"><svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" width=\"0.7em\" height=\"0.7em\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M8 0c4.415 0 8 3.585 8 8s-3.585 8-8 8-8-3.585-8-8 3.585-8 8-8zm1.331 12a.996.996 0 0 0 0-1.993h-.333v-3.25c0-.443-.239-.757-.68-.757H6.683a1.006 1.006 0 0 0 0 2.01h.312v1.997h-.341a.997.997 0 0 0 0 1.993h2.677zM8 2.658a1.342 1.342 0 1 1 0 2.684 1.342 1.342 0 0 1 0-2.684z\"></path></svg></a></div></section><main class=\"container__block container__block_center\"><div class=\"content\"><h1 class=\"content__header\">SIGN UP</h1><form class=\"form js-signup-form\"><label class=\"form__label\" for=\"login\">login</label><input class=\"form__input js-login\" type=\"text\" name=\"login\" id=\"login\"/><label class=\"form__label\" for=\"email\">email</label><input class=\"form__input js-email\" type=\"email\" name=\"email\" id=\"email\"/><label class=\"form__label\" for=\"password\">password</label><input class=\"form__input js-password\" type=\"password\" name=\"password\" id=\"password\"/><button class=\"btn btn_contained form__btn js-submit\" type=\"submit\">let\'s go!</button></form><a class=\"btn btn_back-menu\" href=\"\/\">back to menu</a></div></main><section class=\"container__block container__block_side\"><div class=\"users\"><a class=\"btn users__btn\" href=\"\/login\">Login</a><a class=\"btn users__btn\" href=\"\/signup\">Signup</a></div></section></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}}})();