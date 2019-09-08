/**
 * 工具组件 对原有的工具进行封装，自定义某方法统一处理
 * 
 *  2014-12-12
 * @Email: mmm333zzz520@163.com
 * @version 3.0v
 */
;
(function () {
	ly = {};
	ly.ajax = (function (params) {
		var pp = {
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				layer.open({
					type: 1,
					title: "出错啦！",
					area: ['95%', '95%'],
					content: "<div id='layerError' style='color:red'>"
						+ XMLHttpRequest.responseText + "</div>"
				});
			}
		};
		$.extend(pp, params);
		$.ajax(pp);
	});
	ly.ajaxSubmit = (function (form, params) {// form 表单ID. params ajax参数
		var pp = {
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				layer.open({
					type: 1,
					title: "出错啦！",
					area: ['95%', '95%'],
					content: "<div id='layerError' style='color:red'>"
						+ XMLHttpRequest.responseText + "</div>"
				});
			}
		};
		$.extend(pp, params);
		$(form).ajaxSubmit(pp);
	});
	CommnUtil = {
		/**
		 * ajax同步请求 返回一个html内容 dataType=html. 默认为html格式 如果想返回json.
		 * CommnUtil.ajax(url, data,"json")
		 * 
		 */
		ajax: function (url, data, dataType) {
			if (!CommnUtil.notNull(dataType)) {
				dataType = "html";
			}
			var html = '没有结果!';
			// 所以AJAX都必须使用ly.ajax..这里经过再次封装,统一处理..同时继承ajax所有属性
			if (url.indexOf("?") > -1) {
				url = url + "&_t=" + new Date();
			} else {
				url = url + "?_t=" + new Date();
			}
			ly.ajax({
				type: "post",
				data: data,
				url: url,
				dataType: dataType,// 这里的dataType就是返回回来的数据格式了html,xml,json
				async: false,
				cache: false,// 设置是否缓存，默认设置成为true，当需要每次刷新都需要执行数据库操作的话，需要设置成为false
				success: function (data) {
					html = data;
				}
			});
			return html;
		},
		ajaxJson: function (url, data, dataType) {
			if (!CommnUtil.notNull(dataType)) {
				dataType = "html";
			}
			var html = '没有结果!';
			// 所以AJAX都必须使用ly.ajax..这里经过再次封装,统一处理..同时继承ajax所有属性
			if (url.indexOf("?") > -1) {
				url = url + "&_t=" + new Date();
			} else {
				url = url + "?_t=" + new Date();
			}
			ly.ajax({
				type: "post",
				data: data,
				url: url,
				dataType: dataType,// 这里的dataType就是返回回来的数据格式了html,xml,json
				async: false,
				contentType: 'application/json;charset=UTF-8',
				cache: false,// 设置是否缓存，默认设置成为true，当需要每次刷新都需要执行数据库操作的话，需要设置成为false
				success: function (data) {
					html = data;
				}
			});
			return html;
		},
		/**
		 * 判断某对象不为空..返回true 否则 false
		 */
		notNull: function (obj) {
			if (obj === null) {
				return false;
			} else if (obj === undefined) {
				return false;
			} else if (obj === "undefined") {
				return false;
			} else if (obj === "") {
				return false;
			} else if (obj === "[]") {
				return false;
			} else if (obj === "{}") {
				return false;
			} else {
				return true;
			}

		},

		/**
		 * 判断某对象不为空..返回obj 否则 ""
		 */
		notEmpty: function (obj) {
			if (obj === null) {
				return "";
			} else if (obj === undefined) {
				return "";
			} else if (obj === "undefined") {
				return "";
			} else if (obj === "") {
				return "";
			} else if (obj === "[]") {
				return "";
			} else if (obj === "{}") {
				return "";
			} else {
				return obj;
			}

		},
		loadingImg: function () {
			var html = '<div class="alert alert-warning">'
				+ '<button type="button" class="close" data-dismiss="alert">'
				+ '<i class="ace-icon fa fa-times"></i></button><div style="text-align:center">'
				+ '<img src="/s/i/loading2.gif"/><div>'
				+ '</div>';
			return html;
		},
		/**
		 * html标签转义
		 */
		htmlspecialchars: function (str) {
			var s = "";
			if (str.length == 0)
				return "";
			for (var i = 0; i < str.length; i++) {
				switch (str.substr(i, 1)) {
					case "<":
						s += "&lt;";
						break;
					case ">":
						s += "&gt;";
						break;
					case "&":
						s += "&amp;";
						break;
					case " ":
						if (str.substr(i + 1, 1) == " ") {
							s += " &nbsp;";
							i++;
						} else
							s += " ";
						break;
					case "\"":
						s += "&quot;";
						break;
					case "\n":
						s += "";
						break;
					default:
						s += str.substr(i, 1);
						break;
				}
			}
		},
		/**
		 * in_array判断一个值是否在数组中
		 */
		in_array: function (array, string) {
			for (var s = 0; s < array.length; s++) {
				thisEntry = array[s].toString();
				if (thisEntry == string) {
					return true;
				}
			}
			return false;
		},
		/**
		 * js获取项目根路径
		 */
		rootPath: function () {
			//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
			var curWwwPath = window.document.location.href;
			//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
			var pathName = window.document.location.pathname;
			var pos = curWwwPath.indexOf(pathName);
			//获取主机地址，如： http://localhost:8083
			var localhostPaht = curWwwPath.substring(0, pos);
			//获取带"/"的项目名，如：/uimcardprj
			var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
			return (localhostPaht + projectName);
		}
	};
})();