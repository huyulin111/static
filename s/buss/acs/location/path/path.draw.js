import { conf } from "/s/buss/acs/location/location.conf.js";
import { tool } from "/s/buss/acs/location/location.tool.js";
import { pathTool } from "/s/buss/acs/location/path/path.tool.js";
import pathtext from "/s/buss/acs/location/path/path.text.js";

var getP = function (data) {
    var p = conf.pathHome1.selectAll("path").data(data)
        .enter().append("path")
        .attr("id", function (d) {
            return 'p' + d.id;
        })
        .attr("class", "clashLine")
        .attr("from", function (d) {
            return d.from;
        }).attr("to", function (d) {
            return d.to;
        })
        .attr("fill", "none")
        .attr("stroke", function (d) {
            return d.side == 2 ? "#113a7394" : "#1b81d6b3";
        })
        .attr("stroke-width", function () {
            return localStorage.pathwidth;
        }).attr("style", function (d) {
            return "marker-end:url(#mar" + d.id + ");";
        });
    return p;
}

export var editDrawPath = function (data) {
    conf.pathHome1.selectAll("path").remove();
    var p = getP(data);
    p.attr("d", function (d) {
        var result1 = tool.dbToWindow(d.leftXaxis, d.downYaxis);
        var result2 = tool.dbToWindow(d.rightXaxis, d.upYaxis);
        return pathTool.dPath(result1[0], result2[0], result1[1], result2[1]);
    });
    pathtext.drawPathTexts(data);
}

export var drawPath = function (data) {
    conf.pathHome1.selectAll("path").remove();
    var p = getP(data);
    p.attr("d", function (d) {
        var result1 = tool.dbToWindow(d.leftXaxis, d.downYaxis);
        var result2 = tool.dbToWindow(d.rightXaxis, d.upYaxis);
        if (!d.isDouble) {
            return pathTool.dPath(result1[0], result2[0], result1[1], result2[1]);
        } else {
            return pathTool.dDoublePath(result1[0], result2[0], result1[1], result2[1]);
        }
    });
}