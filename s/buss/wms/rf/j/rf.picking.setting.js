export var initSetting = function () {
    doInit(findChoosedType);
}

var render = function (laps, callback) {
    container().html("");

    let tabs = new Map();
    for (var a of laps) {
        if (a.type != 'PICK' && a.type != 'PROD_LINE') { continue; }
        let tab = tabs.get(a.type);
        if (!tab) {
            tab = {};
            tab.key = a.type;
            let tmp = [];
            tab.value = tmp;
        }
        tab.value.push(a);
        tabs.set(a.type, tab);
    }
    let tabStrs = "";
    for (let m of tabs) {
        let obj = m[1];
        tabStrs += (
            `<label>
                <input type="radio" name="tab" class='chooseRadio' data-id='${obj.key}'>
                <span>${obj.key == 'PICK' ? "按拣货点" : "按生产线"}</span>
            </label>`);
    }

    let chooseInfo = localStorage.PICKED_SETTING;
    if (chooseInfo) chooseInfo = JSON.parse(chooseInfo);
    for (let m of tabs) {
        let obj = m[1];
        if (obj.key == 'PICK') {
            obj.value.push({ id: "NORMAL", name: "恒温恒湿库", type: "WAREHOUSE", whid: 3 });
            obj.value.push({ id: "SIMPLE", name: "阴凉库", type: "WAREHOUSE", whid: 4 });
            obj.value.push({ id: "IRON", name: "钢平台", type: "WAREHOUSE", whid: 5 });
        }
        let btnsStr = gf.getButtonsTable({
            values: obj.value,
            numInLine: 4,
            choose: function (value) {
                if (chooseInfo) if (chooseInfo.filter((d) => { return d.id == value.id; }).length) { return true; }
                return false;
            },
        });
        tabStrs += (`<div class='chooseDiv hidden' data-id='${obj.key}'>${btnsStr}</div>`);
    }
    var tables = `<div class="wrap">${tabStrs}</div>`;
    container().append(tables);
    gf.resizeTable();
    if (callback) { callback(); }
}

var doInit = function (callback) {
    jQuery.ajax({
        url: "/sys/lap/findJsonList.shtml",
        type: "GET",
        dataType: "json",
        cache: false,
        success: function (laps) {
            render(laps, callback);
        }
    });
}

var container = function () {
    if ($("div#settingMgr").length == 0) {
        $("#settingContainer").append(
            `<fieldset>
                <legend>过滤筛选操作（红色为选中）
                <button id='save' style="min-height: 30px;width: 45px;">保存</button>
                </legend>
                <div id='settingMgr' class='withBorder'></div>
            </fieldset>`);
    }
    return $("div#settingMgr");
}

container().delegate("button", "click", function () {
    var that = $(this);
    if (that.hasClass("choosed")) {
        that.removeClass("choosed");
    } else {
        that.addClass("choosed");
    }
});

container().delegate("input.chooseRadio", "change", function () {
    let choosed = $(this).data("id");
    container().find("div.chooseDiv").each(function () {
        if ($(this).data("id") != choosed) {
            $(this).addClass("hidden");
        } else {
            $(this).removeClass("hidden");
        }
    });
});

$("html").delegate("button#save", "click", function () {
    let _value = $("html").find(`input.chooseRadio:checked`).data("id");
    if (!_value) { return; }
    localStorage.PICKED_TYPE = _value;
    let obj = [];
    container().find(`div.chooseDiv[data-id='${_value}']`).find("button").each(function () {
        if ($(this).hasClass("choosed")) {
            obj.push({ id: $(this).data("id"), name: $(this).data("name"), type: $(this).data("type"), whid: $(this).data("whid") });
        }
    });
    localStorage.PICKED_SETTING = JSON.stringify(obj);
    gf.doAjax({
        url: `/app/conf/setByUser.shtml`,
        data: { TABLE_KEY: "PICKING_SETTING", value: localStorage.PICKED_SETTING },
        success: function (data) {
            location.reload();
        }
    });
});

var findChoosedType = function () {
    let s = localStorage.PICKED_TYPE;
    if (s) { $("html").find(`input.chooseRadio[data-id='${s}']`).trigger("click"); }
}