import { gf } from "/s/buss/g/j/g.f.js";
import { gfbtn } from "/s/buss/g/j/g.f.btn.js";
import { dataGrid } from "/s/j/kf.grid.js";
import "/s/buss/sys/lap/j/lap.info.edit.name.js";
import { taskexe } from "/s/buss/acs/g/j/agv.taskexe.add.js";
import { getInput } from "/s/buss/g/j/g.input.render.js";

let _columns = [{
    colkey: "key",
    name: "关键字"
}, {
    colkey: "value",
    name: "交管区域",
    renderData: function (rowindex, data, rowdata, column) {
        let col = { name: "键值", key: "key", notnull: true, type: "input" };
        try {
            let json = JSON.parse(data);
            if (json instanceof Array || json instanceof Object) {
                col = { name: "键值", key: "key", notnull: true, type: "textarea" };
            }
        } catch (error) {
        }
        let json = { key: rowdata.key };
        let btnStr = `<button type="button" class="edit btn btn-primary marR10" ${gf.jsonToLabelData(json)}>保存</button>`;
        let html = getInput(col, { value: data, width: '50%', });
        $(html).append(btnStr);
        return html;
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
    checkbox: true,
    serNumber: true,
    pageSize: 10,
    data: { "TABLE_KEY": "AGV_CROSS_LOCK_OBJS", "ORDER_BY_KEY": "key" }
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

$("#paging").delegate(".edit", "click", function (e) {
    let key = $(this).data("key");
    let target = $(this).parents("td").find("input").val();
    if (!target) {
        target = $(this).parents("td").find("textarea").val();
    }
    if (window.confirm(`保存成功后需重启服务器方可生效，是否要保存${key}的值为${target}？`)) {
        gf.doAjax({
            url: `/app/conf/set.shtml`, type: "POST",
            data: { table: "AGV_CROSS_LOCK_OBJS", key: key, value: target }
        });
    }
});

let add = (that) => {
    layer.prompt({ title: '输入关键字', formType: 0 }, function (key, index) {
        layer.close(index);
        layer.prompt({ title: '输入交管区域', formType: 2 }, function (text, index) {
            layer.close(index);
            if (window.confirm(`新增成功后需重启服务器方可生效，是否新增？名称：${key}，内容：${text}`)) {
                gf.doAjax({
                    url: `/app/conf/set.shtml`, type: "POST",
                    data: { table: "AGV_CROSS_LOCK_OBJS", key: key, value: text }
                });
            }
        });
    });
};
let del = (that) => {
    var cbox = gf.checkOnlyOne("key");
    if (!cbox) { return; }
    layer.confirm(`${that.name}成功后需重启服务器方可生效，是否${that.name}${cbox}？`, function (index) {
        gf.doAjax({
            url: that.url, type: "POST",
            data: { table: "AGV_CROSS_LOCK_OBJS", key: cbox }
        });
    });
}
let btnAdd = {
    id: "add", name: "新增", class: "btn-primary",
    bind: function () {
        add(this);
    },
};
let btnUpload = {
    id: "upload", name: "更新", class: "btn-danger",
    bind: function () {
        if (window.confirm(`改变将提交到服务器，此举会将更新现有的交管逻辑，确定是否更新？`)) {
            taskexe.addCtrlTask(0, "IS_REFRESH_LOCK_CACHE");
        }
    },
};
let btnsDel = {
    url: `/app/conf/del.shtml`,
    id: "del", name: "删除", class: "btn-danger",
    bind: function () {
        del(this);
    },
};
let tempBtns = [btnAdd, btnsDel];
gfbtn.bindByRes("div.doc-buttons", tempBtns);