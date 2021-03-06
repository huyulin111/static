import "/s/j/vue/vue.min.js";
import { allocData } from "/s/buss/wms/alloc/item/j/alloc.render.list.data.js";
import { gf } from "/s/buss/g/j/g.f.js";
import { gflayer } from "/s/buss/g/j/g.f.layer.js";
import { gfbtn } from "/s/buss/g/j/g.f.btn.js";

let clear = {
    url: `/alloc/item/util/clearSearch.shtml`, style: "width:49%;",
    id: "play", name: "重置", class: "btn-warning",
    bind: function () {
        $("#form").find("input").val("");
        doJob("clear", this);
    },
}, search = {
    url: ` `, style: "width:49%;",
    id: "find", name: "查询", class: "btn-warning",
    bind: function () {
        allocData(() => {
            gflayer.parentMsg("已提交查询");
        }, $("form").serializeObject());
    },
};

let doJob = (param, that, callback) => {
    let tmpJob = function (index) {
        gf.ajax(that.url, null, "json", function (s) {
            if (s.code >= 0) {
                gflayer.parentMsg(`成功${that.name}！`);
                if (window.datagrid) window.datagrid.loadData();
                else if (parent.datagrid) parent.datagrid.loadData();
            } else {
                gflayer.parentMsg(`${that.name}失败！` + s.msg);
            }
        });
    };
    tmpJob();
};

let tempBtns = [clear, search];
let btnContainer = $("div#btnss");
gfbtn.bindSimple(btnContainer, tempBtns);