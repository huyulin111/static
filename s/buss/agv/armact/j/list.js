import { gf } from "/s/buss/g/j/g.f.js";
import { gflayer } from "/s/buss/g/j/g.f.layer.js";
import { gv } from "/s/buss/g/j/g.v.js";
import { dataGrid } from "/s/j/kf.grid.js";

window.datagrid = dataGrid({
	pagId: 'paging',
	columns: [{
		colkey: "id",
		name: "id",
		hide: true,
	}, {
		colkey: "armactname",
		name: "动作名称"
	}, {
		colkey: "armactcode",
		name: "动作编码"
	}, {
		colkey: "delflag",
		name: "数据状态",
		renderData: function (rowindex, data, rowdata, column) {
			if (rowdata.delflag == "1") {
				$("tr[d-tree='" + rowdata.dtee + "']").css("color", "#dcdcdc");
				return "已删除";
			}
			return "正常使用";
		}
	}],
	jsonUrl: '/armact/findByPage.shtml',
	checkbox: true,
	serNumber: true
});

let doSearch = function () {
	var searchParams = $("#searchForm").serialize();
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

$("#add").click("click", function () {
	add();
});
$("#edit").click("click", function () {
	edit();
});
$("#del").click("click", function () {
	del();
});
function edit() {
	var cbox = window.datagrid.getSelectedCheckbox();
	if (cbox.length > 1 || cbox == "") {
		layer.msg("只能选中一个");
		return;
	}
	window.pageii = gflayer.open({
		title: "编辑",
		type: 2,
		content: '/s/buss/armact/editUI.html?id=' + cbox
	});
}
function add() {
	window.pageii = gflayer.open({
		title: "新增",
		type: 2,
		content: '/s/buss/agv/armact/h/addArmactUI.html'
	});
}
function del() {
	var cbox = window.datagrid.getSelectedCheckbox();
	if (cbox == "") {
		layer.msg("请选择删除项！！");
		return;
	}
	layer.confirm('是否删除？', function (index) {
		var url = '/armact/deleteEntity.shtml';
		gf.ajax(url, { ids: cbox.join(":") }, "json");
	});
}