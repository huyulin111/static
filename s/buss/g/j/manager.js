import "/s/buss/acs/g/j/wms.sku.js";
import "/s/buss/g/j/g.v.js";
import { gf } from "/s/buss/g/j/g.f.js";
import "/s/j/tool/urlSearcher.js";
import "/s/buss/g/j/g.p.js";
import "/s/buss/g/j/jquery/jquery.autofill.js";

var _frame = "#loadhtml";

gf.quote("/s/c/app.all.css", null, function () {
    $('body').fadeIn(3000);
});
var loadPage = function (url, openType, sn) {
    if (sn) {
        var snul = document.getElementById("topli");
        snul.innerHTML = '<li><i class="fa fa-home"></i> <a href="index.shtml">Home</a></li>';
        for (var i = 0; i < 2; i++) {
            var li = document.createElement("LI");
            var a = document.createElement("A");
            a.href = "#"; // href="#"：跳转到页首
            a.innerHTML = sn[i].name || "";
            if (sn[i].url) {
                $(a).click(function () {
                    loadPage(sn[i].url);
                });
            }
            li.appendChild(a);
            snul.appendChild(li);
        }
    }

    if (openType) {
        if (url.indexOf("?", (url.indexOf("?") + 1)) > 0) {
            url = url.replace(/(.*)\?/, "$1&");
        }
        if (url.indexOf("{PROJECT_KEY}") >= 0) {
            url = url.replace("{PROJECT_KEY}", localStorage.projectKey);
        }
        if (openType == "1") {
            gf.appOpen(url);
            return;
        } else if (openType == "2") {
            gf.layerOpen({
                title: "AGV信息",
                area: ["70%", "100%"],
                offset: 'rb',
                content: url
            }); return;
        }
    }

    gf.quoteModule("/s/buss/g/h/welcome.html", _frame);
    gf.quoteModule(url, _frame);
    $("#nav").removeClass("nav-off-screen");
}

// tb.load("/s/buss/wms/h/shipmentMainMgr.html");
// tb.attr("src","/s/buss/wms/h/shipmentMainMgr.html");
gf.quoteModule((localStorage.index ? localStorage.index : "/s/buss/g/h/welcome.html"), _frame);
$("[data-tip]").each(function () {
    $(this).bind("click", function () {
        var parentLi = $(this).parent("li");
        var nav = $(this).data("tip");
        var sn = nav.split(",");
        $(this).parents("nav").find("li").removeClass("current");
        parentLi.addClass("current");
        var html = '<li><i class="fa fa-home"></i>' + '<a href="index.shtml">Home</a></li>';
        for (var i = 0; i < 2; i++) {
            html += '<li><a>' + sn[i] + '</a></li>';
        }
        $("#topli").html(html);
        loadPage(sn[2], sn[3]);
    });
});

$("a#editUI").on("click", function () {
    window.pageii = layer.open({
        title: "编辑",
        type: 2,
        area: globalLayerArea,
        offset: "auto",
        content: '/user/selfInfo.shtml'
    });
});

$(_frame).on("load", function (params) {
});