import { gf } from "/s/buss/g/j/g.f.js";
import { gv } from "/s/buss/g/j/g.v.js";
import { dataGrid } from "/s/j/kf.grid.js";
import "/s/buss/sys/lap/j/lap.info.edit.name.js";
import { getInput } from "/s/buss/g/j/g.input.render.js";

let tempBtns = [{
    id: "back", name: "返回", class: "btn-info",
    bind: function () {
        window.history.back();
    }
}];
gf.bindBtns("div.doc-buttons", tempBtns);

let _type = gf.urlParam("type");
let _columns = [{
    colkey: "id",
    name: "id",
    hide: true,
}, {
    colkey: "key",
    name: "名称",
    renderData: function (rowindex, data, rowdata, column) {
        return data;
        // return "<div class='changable'>" + "<span>" + data + "</span>" + "&nbsp;&nbsp;&nbsp;&nbsp;"
        // 	+ "<a class='editLapName'><img src='/s/i/edit.png'/></a>" + "</div>";
    }
}, {
    colkey: "value",
    name: "值",
    renderData: function (rowindex, data, rowdata, column) {
        let col = {
            name: "键值", key: "key", notnull: true, type: "input",
        };
        let json = { key: rowdata.key };
        let btnStr = `<button type="button" class="edit btn btn-primary marR10" ${gf.jsonToLabelData(json)}>保存</button>`;
        let html = getInput(col, { value: data, width: '50%' });
        return html[0].outerHTML + btnStr;
    }
}, {
    colkey: "delflag",
    name: "是否删除",
    hide: true,
    renderData: function (rowindex, data, rowdata, column) {
        if (data == "1") {
            $("tr[d-tree='" + rowdata.dtee + "']").css("color", "#dcdcdc");
            return "已删除";
        } else {
            return "使用中";
        }
    }
}];

window.datagrid = dataGrid({
    pagId: 'paging',
    columns: _columns,
    jsonUrl: `/app/conf/findByPage.shtml`,
    checkbox: false,
    serNumber: true,
    data: { "TABLE_KEY": "CONF_KEY", "key": "LDAP_IP:LDAP_DOMAIN:FORBIT_SAME_TRANSID" }
});

$("#paging").delegate(".edit", "click", function (e) {
    let key = $(this).data("key");
    let target = $(this).parent("td").find("input").val();
    if (window.confirm(`是否要改变${key}的值为${target}？`)) {
        gf.doAjax({
            url: `/app/conf/set.shtml`,
            data: { table: "CONF_KEY", key: key, value: target }
        });
    }
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