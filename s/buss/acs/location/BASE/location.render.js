import { conf } from "/s/buss/acs/location/BASE/location.conf.js";
import { tool } from "/s/buss/acs/location/BASE/location.tool.js";
import { datas } from "/s/buss/acs/location/BASE/location.data.js";
import { drawPath } from "/s/buss/acs/location/BASE/path/draw.path.js";
import { drawRect } from "/s/buss/acs/location/BASE/rect/draw.rect.js";

//绘制坐标轴  
function drawAxis() {
    var xAxis = d3.svg.axis().scale(conf.xScale).orient("bottom").ticks(5);
    var yAxis = d3.svg.axis().scale(conf.yScale).orient("left").ticks(5);
    conf.yScale.range([conf.yAxisWidth, 0]);

    //绘制x轴  
    var svggx;
    var svggy;
    if (conf.svg.selectAll("g").size() > 0) {
        svggx = conf.svg.selectAll("g.xaxis");
        svggy = conf.svg.selectAll("g.yaxis");
    } else {
        svggx = conf.svg.append("g").attr("class", "xaxis");
        svggy = conf.svg.append("g").attr("class", "yaxis");
    }
    svggx.attr("transform", "translate(" + conf.padding.left + "," + (conf.height - conf.padding.bottom) + ")").call(xAxis);
    svggy.attr("transform", "translate(" + conf.padding.left + "," + (conf.height - conf.padding.bottom - conf.yAxisWidth) + ")").call(yAxis);

    //绘制完坐标轴将值域变回去  
    conf.yScale.range([0, conf.yAxisWidth]);
}

function drawPoints(data) {
    var circleUpdate = conf.pointHome.selectAll("circle").data(data);
    var circleEnter = circleUpdate.enter();
    var circleExit = circleUpdate.exit();

    //update部分的处理方法
    circleUpdate.transition()//更新数据时启动过渡  
        .duration(500).attr("r", 6.5);

    circleEnter.append("circle")
        .transition().duration(800)
        .attr("id", function (d) {
            return d[0];
        }).attr("class", function (d) {
            return tool.inAgv(d, 1) ? "agv1" : "agv2";
        }).attr("cx", function (d) {
            return conf.padding.left + conf.xScale(d[1]);
        }).attr("cy", function (d) {
            return conf.height - conf.padding.bottom - conf.yScale(d[2]);
        }).attr("r", 3)
        .attr("fill", tool.getPointColor());

    circleExit.transition().duration(500).attr("fill", "white").remove();
}

var render = function () {
    drawPoints(datas.udfPoints);
    setTimeout(() => drawPoints(datas.udfPoints), 3000);
    drawPath(datas.path);
    drawRect(datas.rect);
    if (conf.withAxis) { drawAxis(); }
}

var isRunning = false;
var renderSvgFunc = function (callback) {
    if (isRunning) { return; }
    isRunning = true;
    var datasss = [];
    for (var i in datas.datasetMap) {
        if (i != 9999) {
            if ((i != 9999 && datas.datasetMap[i] && datas.datasetMap[i].length > 5000) || conf.svg.selectAll("circle").size() == 0) {
                datasss = [].concat(datas.udfPoints);
                conf.datasetDetaMap = {};
                datas.datasetMap[i] = [];
            }
        }
    }

    for (var currentAgvNum in datas.datasetMap) {
        if (currentAgvNum == 9999) {
            datas.lastTaskPath = datas.datasetMap[9999];
        } else {
            if (conf.datasetDetaMap[currentAgvNum] && conf.datasetDetaMap[currentAgvNum].length > 0) {
                datasss = datasss.concat(conf.datasetDetaMap[currentAgvNum]);
                conf.datasetDetaMap[currentAgvNum] = [];
            }
        }
    }
    render();
    if (callback) callback();
    isRunning = false;
}

export var renderSvg = function (callback) {
    datas.init();
    if (document.hidden) { return; }
    renderSvgFunc(callback);
};