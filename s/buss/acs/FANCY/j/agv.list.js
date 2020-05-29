import { renderList } from '/s/buss/acs/FANCY/j/agv.list.render.one.js';
import { overlay } from '/s/buss/g/j/g.overlay.js';
import { gf } from "/s/buss/g/j/g.f.js";

var reloadFlag = 0;
var intervalVal;
export var agvNum = 0;

var agvDiv = function () {
    if ($("div#agvDiv").length == 0) {
        let agvDiv = $(`<div id='agvDiv' class='fixed'><fieldset><legend>运输工具</legend>
        <div id='agvDiv' class='withBorder'></div></fieldset></div>`);
        $("#rootContainer").prepend(agvDiv);
    }
    if (agvNum >= 6) { $("div#agvDiv").addClass("big"); }
    return $("div#agvDiv");
}

var getAgvList = function () {
    jQuery.ajax({
        url: "/s/jsons/" + localStorage.projectKey + "/agv/agvList.json",
        type: "GET",
        dataType: "json",
        cache: false,
        error: function (e) {
        },
        complete: function () {
            setTimeout(function () {
                overlay.hide();
            }, 1000);
        },
        timeout: 6000,
        success: whenSuccess
    });
}

var whenSuccess = function (data) {
    overlay.show();
    agvNum = data.length;
    doWhenSuccess(data);
}

var doWhenSuccess = function (data) {
    reloadFlag = 0;
    agvDiv().html("");
    renderList(data, agvDiv());
    gf.resizeTable();
}

var openAGVMGR = function (tmpAgvId, layerName) {
    let url = "/s/buss/acs/" + localStorage.projectKey + "/h/agv/agv.html?agvId=" + tmpAgvId;
    layer.open({
        type: 2,
        title: '单车管理',
        shadeClose: false,
        shade: 0.5,
        maxmin: true,
        area: gf.layerArea(),
        content: url
    });
    return;
}

var checkLogin = function () {
    gf.checkLogin();
}

var init = function () {
    getAgvList();
    intervalVal = setInterval(getAgvList, 3000);
    if (localStorage.projectKey == 'TAIKAI_JY')
        setInterval(checkLogin, 5 * 60 * 1000);

    agvDiv().delegate("button", "click", function () {
        openAGVMGR($(this).attr("id"), $(this).html());
    });

    // var currentAgvId = localStorage.currentAgvId;
    // if (currentAgvId) {
    //     openAGVMGR(currentAgvId);
    // }

    var height = "300px";
    if (localStorage.projectKey != 'HONGFU_ZHENMU') height = $(window).height();
}

init();
