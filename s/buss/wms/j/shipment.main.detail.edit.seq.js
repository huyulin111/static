import { gf } from "/s/buss/g/j/g.f.js";

$("html").on("click", "a.editSeq", function () {
    doEdit(this);
});
var doEdit = function (that) {
    var td = $(that).parents("td");
    var tr = $(that).parents("tr");
    var data = td.find("span").html();
    td.html("<input type='text' class='editSeqInput' name='name' value='" + data
        + "' data-orivalue='" + data + "' title='回车保存！'/>");
    td.find("input").focus();
}
$("html").on("blur", "input.editSeqInput", function () {
    whenEditInputBlur(this);
});
var whenEditInputBlur = function (that) {
    var td = $(that).parents("td");
    var data = td.find("input").data("orivalue");
    td.html("<span>" + data + "</span>" + "&nbsp;&nbsp;&nbsp;&nbsp;"
        + "<a class='editSeq'><img src='/s/i/edit.png'/></a>");
}
$("html").on("keydown", "input.editSeqInput", function (e) {
    if (e && e.keyCode == 27) {
        whenEditInputBlur(this);
    } else if (e && e.keyCode == 13) {
        whenEditInputEnter(this);
    }
});
var whenEditInputEnter = function (that) {
    var td = $(that).parents("td");
    var tr = $(that).parents("tr");
    var data = td.find("input").val();
    var currentid = tr.find("input:checkbox").val();
    var url = '/shipment/main/editSeq.shtml';
    var json = {
        "sequence": data
    };
    json.paperid = tr.find("input:checkbox").data("paperid");
    json.su = tr.find("input:checkbox").data("item");
    layer.confirm('选择修改的类型', {
        btn: ['按单号', '按SU', '取消'],
        btn1: function () {
            json.type = "BY_PAPER";
            gf.ajax(url, json, "json");
        },
        btn2: function () {
            json.type = "BY_SU";
            gf.ajax(url, json, "json");
        },
        btn3: function () {
            return;
        },
    });

    var td = $(that).parents("td");
    var data = td.find("input").data("orivalue");
    td.html("<span>" + data + "</span>" + "&nbsp;&nbsp;&nbsp;&nbsp;"
        + "<a class='editSeq'><img src='/s/i/edit.png'/></a>");
}