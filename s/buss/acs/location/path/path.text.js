import { tool } from "/s/buss/acs/location/location.tool.js";
import { conf } from "/s/buss/acs/location/location.conf.js";

export default {
    drawPathTexts(datas) {
        var home = d3.select("#pathTextHome"),
            text = home.selectAll("text");
        text.remove();
        text.data(datas).enter().append("text")
            .attr("id", function (d) {
                return "tpath" + d.id;
            }).attr("x", function (d) {
                var result1 = tool.dbToWindow(d.leftXaxis, d.downYaxis);
                var result2 = tool.dbToWindow(d.rightXaxis, d.upYaxis);
                var arr = getLocation(result1[0], result2[0], result1[1], result2[1]);
                return arr.x;
            }).attr("y", function (d) {
                var result1 = tool.dbToWindow(d.leftXaxis, d.downYaxis);
                var result2 = tool.dbToWindow(d.rightXaxis, d.upYaxis);
                var arr = getLocation(result1[0], result2[0], result1[1], result2[1]);
                return arr.y;
            })
            .attr("fill", "green")
            .attr("stroke", "green")
            .attr("font-size", "10px")
            .attr("font-family", "sans-serif")
            .text(function (d) {
                return d.side == 2 ? "右" : "左";
            });
    },
    updateDragPoint(id, xx, yy) {
        d3.select("#pathTextHome").selectAll("text")
            .filter(function (e) { return e && e.from == id; })
            .attr("x", function (d) {
                var result2 = tool.dbToWindow(d.rightXaxis, d.upYaxis);
                var arr = getLocation(xx, result2[0], yy, result2[1]);
                return arr.x;
            })
            .attr("y", function (d) {
                var result2 = tool.dbToWindow(d.rightXaxis, d.upYaxis);
                var arr = getLocation(xx, result2[0], yy, result2[1]);
                return arr.y;
            });
        d3.select("#pathTextHome").selectAll("text")
            .filter(function (e) { return e && e.to == id; })
            .attr("x", function (d) {
                var result1 = tool.dbToWindow(d.leftXaxis, d.downYaxis);
                var arr = getLocation(result1[0], xx, result1[1], yy);
                return arr.x;
            })
            .attr("y", function (d) {
                var result1 = tool.dbToWindow(d.leftXaxis, d.downYaxis);
                var arr = getLocation(result1[0], xx, result1[1], yy);
                return arr.y;
            })
    },
    updateDragPath(id, x1, x2, y1, y2) {
        var arr = getLocation(x1, x2, y1, y2);
        d3.select("#tpath" + id).attr('x', arr.x).attr('y', arr.y);
    }
}


var getLocation = function (x1, x2, y1, y2) {
    let x, y;
    var xx = Math.abs(x1 - x2), yy = Math.abs(y1 - y2);
    if (xx >= 50 && yy >= 50) {
        x = x2 > x1 ? x2 - 20 : x2 + 20, y = y1 > y2 ? y1 - 20 : y1 + 20;
    } else if (xx <= 50 && yy <= 50) {
        x = x2, y = y1;
    } else if (xx >= 50 && yy < 50) {
        x = (x1 + x2) / 2, y = y1;
    } else if (xx < 50 && yy >= 50) {
        x = x2, y = (y1 + y2) / 2;
    };
    return { "x": x, "y": y };
}