import { gf } from "/s/buss/g/j/g.f.js";
import { currentShipmentPaperid, setCurrentShipmentPaperid } from "/s/buss/wms/rf/j/rf.main.js";

var _tasktype = null;

let _receipttype = gf.urlParam("receipttype");

export var btns = {};
var initBtns = function () {
    btns.add = {
        url: `/s/buss/wms/h/${_tasktype}AddUI.html?receipttype=${_receipttype}`,
        id: "add", name: "增加", class: "btn-primary",
        bind: function () {
            paperOp.add(this);
        },
    }; btns.detail = {
        url: `/s/buss/wms/h/${_tasktype}Details.html?${_tasktype}MainFormMap.paperid=`,
        id: "detail", name: "明细", class: "btn-primary",
        bind: function () {
            paperOp.detail(this);
        },
    }; btns.edit = {
        url: `/s/buss/wms/h/${_tasktype}AddUI.html`,
        id: "edit", name: "修改", class: "btn-warning",
        bind: function () {
            paperOp.edit(this);
        },
    }; btns.send = {
        url: `/${_tasktype}/main/send.shtml`,
        id: "send", name: "下达", class: "btn-warning",
        bind: function () {
            paperOp.doJob("send", this);
        },
    }; btns.execute = {
        url: `/${_tasktype}/main/execute.shtml`,
        id: "execute", name: "执行", class: "btn-warning",
        bind: function () {
            paperOp.doJob("execute", this);
        },
    }; btns.taked = {
        url: `/${_tasktype}/main/taked.shtml`,
        id: "taked", name: "接单", class: "btn-warning",
        bind: function () {
            paperOp.doJob("taked", this, function (paperid) {
                setCurrentShipmentPaperid(paperid);
            });
        },
    }; btns.over = {
        url: `/${_tasktype}/main/over.shtml`,
        id: "over", name: "结束", class: "btn-danger",
        bind: function () {
            paperOp.doJob("over", this, function (paperid) {
                if (paperid == currentShipmentPaperid()) {
                    setCurrentShipmentPaperid("");
                }
                if (parent && parent.layer) { parent.layer.close(parent.pageii); }
            });
        },
    }; btns.del = {
        url: `/${_tasktype}/main/deleteEntity.shtml`,
        id: "del", name: "删除", class: "btn-danger",
        bind: function () {
            paperOp.del(this);
        },
    }; btns.cancel = {
        url: `/${_tasktype}/main/cancel.shtml`,
        id: "cancel", name: "撤销", class: "btn-danger",
        bind: function () {
            paperOp.doJob("cancel", this);
        },
    }; btns.refresh = {
        id: "refresh", name: "刷新", class: "btn-info",
        bind: function () {
            window.datagrid.loadData();
        },
    }; btns.whichAgv = {
        url: `/bd/conf.shtml?table=task_agv`,
        id: "whichAgv", name: "执行AGV", class: "btn-info",
        bind: function () {
            var cbox = gf.checkOnlyOne("paperid");
            if (!cbox) { return; }
            gf.ajax(this.url, { key: cbox + "%" }, "json", function (s) {
                var info = "";
                for (var item of s) {
                    info = info + item.key + ":" + item.value + "<br/>";
                }
                if (!info) { info = "未找到执行信息！"; }
                layer.msg(info);
            });
        },
    }; btns.whichOne = {
        id: "whichOne", name: "经办", class: "btn-info",
        bind: function () {
            var cbox = gf.checkOnlyOne("json");
            if (!cbox) { return; }
            var info = "";
            if (cbox) {
                Object.keys(cbox).forEach(function (key) {
                    info = info + key + ":" + cbox[key] + "<br/>";
                });
            }
            if (!info) { info = "未找到相关信息！"; }
            layer.msg(info);
        },
    }; btns.stockOut = {
        url: `/s/buss/wms/h/shipmentMainMgr.html?status=2,TAKED,SCANED&type=RF${escape("出库")}`,
        id: "stockOut", name: "RF-出库", class: "btn-primary",
        bind: function () {
            window.location.href = this.url;
        },
    }; btns.receiptColdOne = {
        url: `/s/buss/wms/rf/h/rf.receipt.html?warehouse=2`,
        id: "receiptColdOne", name: "RF-冷库按单入库", class: "btn-warning",
        bind: function () {
            paperOp.receiptColdOne(this);
        },
    }; btns.receiptColdMore = {
        url: `/s/buss/wms/rf/h/rf.receipt.html?warehouse=2`,
        id: "receiptColdMore", name: "RF-冷库入库", class: "btn-warning",
        bind: function () {
            window.location.href = this.url;
        },
    }; btns.pickOne = {
        url: `/s/buss/wms/rf/h/rf.picking.html`,
        id: "pickOne", name: "RF-按单拣货", class: "btn-warning",
        bind: function () {
            paperOp.pickOne(this);
        },
    }; btns.pickVNA = {
        url: `/s/buss/wms/rf/h/rf.picking.html?warehouse=1`,
        id: "pickVNA", name: "RF-VNA拣货", class: "btn-warning",
        bind: function () {
            window.location.href = this.url;
        },
    }; btns.pickCold = {
        url: `/s/buss/wms/rf/h/rf.picking.html?warehouse=2`,
        id: "pickCold", name: "RF-冷库拣货", class: "btn-warning",
        bind: function () {
            window.location.href = this.url;
        },
    }; btns.combineVNA = {
        url: `/s/buss/wms/rf/h/rf.combine.html?warehouse=1`,
        id: "combineVNA", name: "RF-VNA组盘", class: "btn-warning",
        bind: function () {
            window.location.href = this.url;
        },
    }; btns.combineCold = {
        url: `/s/buss/wms/rf/h/rf.combine.html?warehouse=2`,
        id: "combineCold", name: "RF-冷库组盘", class: "btn-warning",
        bind: function () {
            window.location.href = this.url;
        },
    }; btns.back = {
        id: "back", name: "返回", class: "btn-info",
        bind: function () {
            window.history.back();
        },
    };
}

class PaperOp {
    del(that) {
        var cbox = gf.checkNotNull("paperid");
        if (!cbox) { return; }
        layer.confirm(`是否${that.name}${cbox}？`, function (index) {
            gf.ajax(that.url, { paperids: cbox.join(",") }, "json", function (s) {
                layer.msg(s.msg);
                window.datagrid.loadData();
            });
        });
    }; edit(that) {
        var cbox = gf.checkOnlyOne("paperid");
        if (!cbox) { return; }

        let url = `/${_tasktype}/main/findOneData.shtml`;
        gf.ajax(url, { paperid: cbox }, "json", function (s) {
            if (!s.object) {
                layer.msg(`该单无法${that.name}！`);
                return;
            }
            let main = s.object.main;
            if (!main || (main["status"] != "1") || main["delflag"] != "0") {
                layer.msg(`该单无法${that.name}！`);
                return;
            }
            window.pageii = layer.open({
                title: `${that.name}：` + cbox,
                type: 2,
                area: localStorage.layerArea.split(","),
                content: that.url + "?paperid=" + cbox
            });
        });
    }; pickOne(that) {
        var cbox = gf.checkOnlyOne("paperid");
        if (!cbox) { return; }

        let url = `/${_tasktype}/main/findOneData.shtml`;
        gf.ajax(url, { paperid: cbox }, "json", function (s) {
            if (!s.object) {
                layer.msg(`该单无法${that.name}！`);
                return;
            }
            let main = s.object.main;
            if (!main || (main["status"] != "TAKED" && main["status"] != "SCANED") || main["delflag"] != "0") {
                layer.msg(`该单无法${that.name}！`);
                return;
            }
            window.location.href = that.url + "?paperid=" + cbox
        });
    }; receiptColdOne(that) {
        var cbox = gf.checkOnlyOne("paperid");
        if (!cbox) { return; }

        let url = `/${_tasktype}/main/findOneData.shtml`;
        gf.ajax(url, { paperid: cbox }, "json", function (s) {
            if (!s.object) {
                layer.msg(`该单无法${that.name}！`);
                return;
            }
            let main = s.object.main;
            if (!main || (main["status"] != "1") || main["delflag"] != "0") {
                layer.msg(`该单无法${that.name}！`);
                return;
            }
            window.location.href = that.url + "&paperid=" + cbox
        });
    }; add(that) {
        window.pageii = layer.open({
            title: `${that.name}`,
            type: 2,
            area: localStorage.layerArea.split(","),
            content: that.url
        });
    }; detail(that) {
        var cbox = gf.checkOnlyOne("paperid");
        if (!cbox) { return; }
        window.pageii = layer.open({
            title: `${that.name}：` + cbox,
            type: 2,
            area: localStorage.layerArea.split(","),
            content: that.url + cbox
        });
    }; doJob(param, that, callback) {
        var paperid;
        if (that.paperid) {
            paperid = that.paperid;
        } else {
            paperid = gf.checkOnlyOne("paperid");
        }
        if (!paperid) { return; }
        layer.confirm(`是否${that.name}${paperid}？`, function (index) {
            gf.ajax(that.url, { paperid: paperid }, "json", function (s) {
                if (s.code >= 0) {
                    layer.msg(`成功${that.name}！`);
                    if (window.datagrid) window.datagrid.loadData();
                    else if (parent.datagrid) parent.datagrid.loadData();
                    if (callback) { callback(paperid); }
                } else {
                    layer.msg(`${that.name}失败！` + s.msg);
                }
            });
        });
    }
}

var paperOp = new PaperOp();

var doInitPaperOp = function (tasktype) {
    _tasktype = tasktype;
    initBtns();
}

var overPaper = function (paperid) {
    let obj = {};
    Object.assign(obj, btns.over, { paperid: paperid });
    paperOp.over(obj);
}

export { doInitPaperOp, paperOp, overPaper };