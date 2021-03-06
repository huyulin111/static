import { pathTool } from "/s/buss/acs/location/path/path.tool.js";
import { saveLogic } from "/s/buss/acs/location/url/logic.url.js";
import { deleteLogic } from "/s/buss/acs/location/url/logic.url.js";
import { datas } from "/s/buss/acs/location/location.data.js";
import { markerDef } from "/s/buss/acs/location/path/path.marker.js";
import { editDrawPath } from "/s/buss/acs/location/path/path.draw.js";
import { dragPath, rightClickPath } from "/s/buss/acs/location/location.event.js";


export var pathFunc = {};

pathFunc.undoPathDel = function (pop) {
    let x1 = $('#' + pop.siteid).attr('cx'), y1 = $('#' + pop.siteid).attr('cy');
    let x2 = $('#' + pop.nextid).attr('cx'), y2 = $('#' + pop.nextid).attr('cy');
    var side = pathTool.getSide(x1, x2, y1, y2);
    saveLogic(side, pop.siteid, pop.nextid, '', () => {
        markerDef(false);
        editDrawPath(datas.path);
        dragPath(true);
        rightClickPath(true);
    });
}

pathFunc.redoPathDel = function (value) {
    d3.select('#p' + value.siteid + value.nextid).remove();
    d3.select('#w' + value.siteid + value.nextid).remove();
    d3.select('#mar' + value.siteid + value.nextid).remove();
    deleteLogic(value, true);
}

pathFunc.undoPathAdd = function (path) {
    d3.select('#p' + path.id).remove();
    d3.select('#w' + path.id).remove();
    d3.select('#mar' + path.id).remove();
    var value = { 'siteid': path.from, 'nextid': path.to };
    deleteLogic(value, true);
}

pathFunc.redoPathAdd = function (path) {
    var side = path.side;
    if (!side) {
        let x1 = path.leftXaxis,
            y1 = path.downYaxis,
            x2 = path.rightXaxis,
            y2 = path.upYaxis;
        side = pathTool.getSide(x1, x2, y1, y2);
    }
    let siteid = path.from,
        nextid = path.to;
    saveLogic(side, siteid, nextid, '', () => {
        markerDef(false);
        editDrawPath(datas.path);
        dragPath(true);
        rightClickPath(true);
    });
}

pathFunc.undoPathChangeSize = function (pop) {
    localStorage.pathwidth = pop.size;
    d3.select('#numPathWidth').text(localStorage.pathwidth + 'px');
    d3.selectAll('path').attr('stroke-width', function () { return localStorage.pathwidth });
}

pathFunc.redoPathChangeSize = function (pop) {
    localStorage.pathwidth = pop.size2;
    d3.select('#numPathWidth').text(localStorage.pathwidth + 'px');
    d3.selectAll('path').attr('stroke-width', function () { return localStorage.pathwidth });
}

pathFunc.undoPathDrag = function (pop) {
    let side = pop.path.side2,
        oldnext = pop.path.oldnext,
        siteid = pop.path.siteid,
        nextid = pop.path.nextid,
        x1 = pop.x1,
        y1 = pop.y1;
    let x2 = $('#' + oldnext).attr('cx'),
        y2 = $('#' + oldnext).attr('cy');
    saveLogic(side, siteid, oldnext, nextid, () => {
        d3.select('#p' + siteid + nextid)
            .attr('id', 'p' + siteid + oldnext)
            .attr('to', oldnext)
            .attr('d', function (d) {
                d.to = oldnext;
                d.id = siteid + oldnext;
                return pathTool.dPath(x1, x2, y1, y2);
            })
        d3.select("#mar" + siteid + nextid)
            .attr('id', 'p' + siteid + oldnext)
            .attr("orient", function (d) {
                d.to = oldnext;
                d.id = siteid + oldnext;
                return pathTool.markerRadian(x1, x2, y1, y2);
            });
    })
}

pathFunc.redoPathDrag = function (pop) {
    let side = pop.path.side1,
        oldnext = pop.path.oldnext,
        siteid = pop.path.siteid,
        nextid = pop.path.nextid,
        x1 = pop.x1,
        y1 = pop.y1;
    let x2 = $('#' + nextid).attr('cx'),
        y2 = $('#' + nextid).attr('cy');
    saveLogic(side, siteid, nextid, oldnext, () => {
        d3.select('#p' + siteid + oldnext)
            .attr('id', 'p' + siteid + nextid)
            .attr('to', nextid)
            .attr('d', function (d) {
                d.to = nextid;
                d.id = siteid + nextid;
                return pathTool.dPath(x1, x2, y1, y2);
            })
        d3.select("#mar" + siteid + nextid)
            .attr('id', 'p' + siteid + nextid)
            .attr("orient", function (d) {
                d.to = nextid;
                d.id = siteid + nextid;
                return pathTool.markerRadian(x1, x2, y1, y2);
            });
    })
}

