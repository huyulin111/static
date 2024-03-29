import "/s/j/vue/vue.min.js";
import { gf } from "/s/buss/g/j/g.f.js";
import { gp } from "/s/buss/g/j/g.p.js";

let from = gf.urlParam("from");
var data = { shortname: "凯钒科技", expireTime: "" }
let logingBtnStr = $("#loginBtn").html();
var loginSuccess = function (data) {
    if (data.code >= 0) {
        let indexUrl;
        if (from) {
            indexUrl = "/s/buss/g/h/loginSuccess.html";
        } else if (data.object) {
            indexUrl = data.object;
        } else if (!gf.isPc()) {
            indexUrl = "/s/buss/wms/rf/h/rf.mgr.html";
        } else {
            indexUrl = "/s/buss/g/h/manager.html";
        }
        location.assign(indexUrl);
        gf.loginSuccessEvent();
    } else {
        layer.msg(data.msg);
        $("#username").focus();
        $("#loginBtn").html(logingBtnStr);
    }
}
var login = function () {
    $("#loginBtn").html(logingBtnStr + "&nbsp;&nbsp;" + `<img style="width:12px;" src="/s/i/loading2.gif"/>`);
    $("#loginform").ajaxSubmit({
        type: "post",
        dataType: "json",
        timeout: 5000,
        error: function (data) {
            layer.msg("连接错误！");
            $("#loginBtn").html(logingBtnStr);
        },
        success: loginSuccess
    });
};

var vm = new Vue({
    data: data,
    el: "#loginbox",
    created: function () {
        this.calExpireTime();
        console.log('App is power by: ' + this.shortname);
        if (from) return;
        switch (localStorage.projectKey) {
            case "BJJK_HUIRUI":
                $("title").html("MFA");
                $("#titleTr").find("td").html("MFA");
                $("div.normal_text").find("tr[id='titleTr']").removeClass("hidden");
                break;
            default:
                $("title").html("ACS");
                $("#titleTr").find("td").html("统一认证");
                $("div.normal_text").find("tr").removeClass("hidden");
                break;
        }
    },
    mounted: function () {
        console.log('App is power by: ' + this.shortname);
        $("#username").focus();
    },
    methods: {
        checkUserForm: function () {
            login();
        },
        doLogin: function () {
            login();
        },
        calExpireTime: function () {
            var times = gp.expireTime;
            var deadline;
            var errMsg;
            if (times == "0") {
                deadline = "永久";
            } else {
                let deadtime = new Date(0 + Number(times));
                let leftDays = (deadtime - new Date()) / (24 * 3600 * 1000);
                if (leftDays >= 0 && leftDays < 7) {
                    errMsg = "授权日期不足七天，请提前与技术提供商联系，防止授权到期影响您的使用！";
                    layer.msg(errMsg);
                    this.expireTime = errMsg;
                } else if (leftDays < 0) {
                    errMsg = "当前授权已过期！";
                    layer.msg(errMsg);
                    this.expireTime = errMsg;
                }
                deadline = deadtime.toLocaleDateString() + "(测试授权)";
            }
            console.log("授权有效期至:" + deadline);
        }
    },
    computed: {
        powerInfo: function () {
            return "power by" + this.shortname;
        },
    }
});