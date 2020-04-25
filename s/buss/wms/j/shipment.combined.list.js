import { gv } from "/s/buss/g/j/g.v.js";
import { gf } from "/s/buss/g/j/g.f.js";
import { dataGrid } from "/s/j/kf.grid.js";

let params = {
	pagId: 'paging',
	jsonColumn: 'value',
	columns: [{
		colkey: "key",
		name: "托盘号",
	}, {
		colkey: "name",
		name: "目的地",
	}, {
		colkey: "seq",
		name: "优先级",
		renderData: function (rowindex, data, rowdata, column, json) {
			let sequence = json.sequence;
			if (!sequence) {
				sequence = 1;
			}
			return sequence;
		}
	}, {
		colkey: "company",
		name: "订单号",
		hide: true,
	}, {
		colkey: "value",
		name: "状态",
		renderData: function (rowindex, data, rowdata, column, json) {
			let status = json.status;
			if (status) {
				return gv.get("ACS_STATUS", status) + gf.rowDisplay(rowdata, json);
			}
			return "--空--";
		}
	}, {
		colkey: "value",
		name: "货物",
		renderData: function (rowindex, data, rowdata, column, json) {
			let items = json.items;
			if (items) {
				let itemArr = [];
				for (let item of items) {
					itemArr.push(item.su);
				}
				return itemArr.join(',');
			}
			return "--空--";
		}
	}],
	jsonUrl: '/app/conf/findByPage.shtml',
	checkbox: true,
	serNumber: true
}

export var init = function () {
	params = Object.assign(params, {
		data: { "TABLE_KEY": "COMBINED_TU_INFO", "ORDER_BY_KEY": "UPDATETIME DESC" }
	});

	window.datagrid = dataGrid(params);
}

$("#search").on("click", function () {
	var searchParams = $("#searchForm").serialize();
	window.datagrid.setOptions({
		data: searchParams
	});
});
let tempBtns = [{
	id: "back", name: "返回", class: "btn-info",
	bind: function () {
		window.history.back();
	}
}, {
	url: `/app/conf/bjjkhuirui/deleteBySure.shtml`,
	id: "deleteSure", name: "确认撤销", class: "btn-danger",
	bind: function () {
		var cbox = gf.checkOnlyOne("key");
		if (!cbox) { return; }
		let that = this;
		let work = function (index) {
			gf.ajax(that.url, { key: cbox, TABLE_KEY: "COMBINED_TU_INFO" }, "json");
		}
		layer.confirm(`是否确定撤销托盘${cbox}？`, function (index) { work(index); });
	},
}];
if (localStorage.isTest) {
	tempBtns = tempBtns.concat(
		[{
			url: `/shipment/main/startPcs.shtml`,
			id: "startPcs", name: "上PCS", class: "btn-primary",
			bind: function () {
				var cbox = gf.checkOnlyOne("key");
				if (!cbox) { return; }
				gf.ajax(this.url, { tu: cbox }, "json");
			},
		}, {
			url: `/shipment/main/overPcs.shtml`,
			id: "overPcs", name: "出PCS", class: "btn-primary",
			bind: function () {
				var cbox = gf.checkOnlyOne("key");
				if (!cbox) { return; }
				gf.ajax(this.url, { tu: cbox }, "json");
			},
		}, {
			url: `/shipment/main/overAll.shtml`,
			id: "overAll", name: "结束运输", class: "btn-primary",
			bind: function () {
				var cbox = gf.checkOnlyOne("key");
				if (!cbox) { return; }
				gf.ajax(this.url, { tu: cbox }, "json");
			}
		}]);
}
gf.bindBtns("div.doc-buttons", tempBtns);