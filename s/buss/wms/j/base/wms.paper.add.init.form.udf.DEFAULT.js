import { renderAll } from "/s/buss/g/j/jquery/jquery.jsSelect.js";
import { getInput } from "/s/buss/g/j/g.input.render.js";
import { sku } from "/s/buss/wms/sku/info/j/wms.sku.js";

export var initDetailColsData = function (_conf) {
}

export var initMainColsData = function (_tasktype) {
    let _cols;
    if (_tasktype == 'inventory') {
        _cols = [
            { name: "盘点类型", type: "jsSelect", patten: "WMS_INVENTORY_TYPE", notnull: true, key: "inventorytype" },
        ];
    } else if (_tasktype == 'receipt') {
        _cols = [
            { name: "目标仓库", type: "jsSelect", patten: "WAREHOUSE", notnull: true, key: "warehouse" },
        ];
    } else if (_tasktype == 'shipment') {
        let isHide = function (a) {
            if ($("#warehouse").val() != "1") { $(a).parents("div.col").addClass("hidden"); }
            else { $(a).parents("div.col").removeClass("hidden"); }
        }
        _cols = [
            {
                name: "目标仓库", type: "jsSelect", patten: "WAREHOUSE", notnull: true, key: "warehouse",
            },
            {
                name: "目的地", key: "name", notnull: true, type: "associating-input",
                searchurl: "/sys/lap/findFirstPage.shtml?lapInfoFormMap.type=PROD_LINE&name=",
                containerofinput: "#panelBody", showcol: 'name', bind: { event: "init", work: isHide },
            },
        ];
    } else if (_tasktype == "transfer") {
        _cols = [
            { name: "源仓库", type: "jsSelect", patten: "WAREHOUSE", notnull: true, key: "sourcewh" },
            { name: "目标仓库", type: "jsSelect", patten: "WAREHOUSE", notnull: true, key: "targetwh" },
        ];
    }
    return _cols;
}