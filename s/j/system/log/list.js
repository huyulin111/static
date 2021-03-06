import { dataGrid } from "/s/j/kf.grid.js";

window.datagrid = dataGrid({
	id: 'paging',
	columns: [{
		colkey: "id",
		name: "id",
		hide: true
	}, {
		colkey: "userName",
		name: "用户名"
	}, {
		colkey: "accountName",
		name: "账号",
	}, {
		colkey: "module",
		name: "模块"
	}, {
		colkey: "methods",
		name: "方法"
	}, {
		colkey: "actionTime",
		name: "响应时间",
		width: "150px"
	}, {
		colkey: "userIP",
		name: "IP"
	}, {
		colkey: "operTime",
		name: "时间",
		renderData: function (rowindex, data, rowdata, column) {
			return new Date(data).format("yyyy-MM-dd hh:mm:ss");
		}
	}, {
		colkey: "description",
		name: "备注",
		align: "left",
		hide: function () { return localStorage.projectKey == 'BJJK_HUIRUI'; }
	}],
	jsonUrl: '/log/findByPage.shtml',
	checkbox: false,
	serNumber: true
});

let doSearch = function () {
	var searchParams = $("#searchForm").serializeObject();
	window.datagrid.setOptions({
		data: searchParams
	});
}

$("#search").on("click", function () {
	doSearch();
});

$("#searchForm").on("submit", function () {
	doSearch();
	return false;
});