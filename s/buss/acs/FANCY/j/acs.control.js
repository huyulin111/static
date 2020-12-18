import { taskexe } from "/s/buss/acs/g/j/agv.taskexe.add.js";
import { initAgvList } from "/s/buss/acs/FANCY/j/agv.list.js";
import { addMsg } from "/s/buss/acs/g/j/agv.msg.js";
import { allAgvsInfo } from "/s/buss/acs/g/j/agv.msg.json.js";
import { refreshAcsInfo } from "/s/buss/acs/FANCY/j/acs.info.js";
import { agvRunningLogs } from "/s/buss/acs/FANCY/j/agv.running.logs.js";
import { gf } from "/s/buss/g/j/g.f.js";
import { renderModel } from "/s/buss/g/j/g.banner.control.js";

let taskReady = () => {
	let taskContainer = $(`<div id="taskContainer" class="fixed"></div>`);
	$(taskContainer).append("<iframe id='taskFrame'></iframe>");
	let url = "/s/buss/sys/conf/h/agv.cache.html";
	$(taskContainer).css("height", "50%").css("width", "80%");
	$(taskContainer).find("iframe#taskFrame").css("height", "100%").css("width", "100%").attr("src", url).attr("frameborder", "no");
	$("body").append(taskContainer);
}

let loginMiniReady = () => {
	let loginContainer = $(`<div id="loginContainer" class="fixed"></div>`);
	$(loginContainer).append("<iframe id='LOGIN'></iframe>");
	let url = "/s/buss/g/h/loginSuccess.html";
	$(loginContainer).css("height", "450px").css("width", "300px");
	$(loginContainer).find("iframe#LOGIN").css("height", "100%").css("width", "100%").attr("src", url).attr("frameborder", "no");
	$("body").append(loginContainer);
}

let renderAllModels = () => {
	let confs = [];
	if (localStorage.projectKey != 'LAO_FOXCONN') {
		confs.push({ key: 'agvs', target: 'div#agvDiv' });
	}
	if (![''].includes(localStorage.projectKey))
		confs.push({ key: 'setup', target: 'div#controlContainer' });
	if (localStorage.projectKey == 'LAO_FOXCONN') {
		confs.push(
			{ key: 'lift', target: 'div#liftContainer' },
			{ key: 'door', target: 'div#autodoorContainer' },
			{ key: 'msg', target: 'div#msgContainer' },
			{ init: loginMiniReady, key: 'login', target: 'div#loginContainer' }
		);
	} else if (localStorage.projectKey == 'TAIKAI_JY') {
		confs.push({ key: 'msg', target: 'div#msgContainer' });
	} else if (localStorage.projectKey == 'CSY_DAJ') {
		confs.push(
			{ key: 'charge', target: 'div#chargeContainer' },
			{ key: 'windowCenter', target: 'div#windowCenterContainer' },
			{ key: 'window', target: 'div#windowContainer' },
			{ key: 'wms', target: 'div#wmsContainer' },
			{ key: 'msg', target: 'div#msgContainer' }
		);
	} else if (localStorage.projectKey == 'CSY_CDBP') {
		confs.push({ init: taskReady, key: 'task', target: 'div#taskContainer' });
		confs.push({ key: 'msg', target: 'div#msgContainer' });
	} else if (localStorage.projectKey == 'HONGFU_ZHENMU') {
		confs.push({ key: 'msg', target: 'div#msgContainer' });
	} else if (localStorage.projectKey == 'YZBD_NRDW') {
		// confs.push({key:'tongji',target: 'div#tongjiContainer'});
		confs.push({ key: 'search', target: 'div#searchContainer' },
			{ key: 'shipment', target: 'div#shipmentContainer' },
			{ key: 'receipt', target: 'div#receiptContainer' },
			{
				key: 'POS', target: "none", click: function () {
					let value = $(this).hasClass("close");
					gf.ajax("/de/acs/toggleCargoPos.shtml", { value: value }, 'json', (data) => { gf.layer().msg((value ? "显示" : "隐藏") + "坐标"); });
				}
			},
			{ key: 'PDA', target: 'div#PDAContainer' },
			{ type: 'LINK', key: 'manager', url: '/s/buss/g/h/manager.html', self: true });
	} else if (localStorage.projectKey == 'YZBD_QSKJ') {
		confs.push({ init: taskReady, key: 'task', target: 'div#taskContainer' },
			{ init: loginMiniReady, key: 'login', target: 'div#loginContainer' });
	} else if (localStorage.projectKey == 'QDTY_SELF') {
		confs.push({ key: 'msg', target: 'div#msgContainer' });
	}
	if (confs.length > 0) {
		renderModel(confs);
	}
};

var container = function () {
	if ($("#allCtrlTable").length == 0) {
		$("#controlContainer").append("<div><table id='allCtrlTable' class='task'></table></div>");
		renderAllModels();
	}
	return $("#allCtrlTable");
}

export var initAcsControl = function () {
	var initBtns = jQuery.parseJSON(localStorage.acsControl);
	for (var btn of initBtns) {
		if (!btn.hide)
			container().append("<tr><td><div><button id='" + btn.id + "'>" + btn.name + "</button></div></td></tr>");
	}
	delegateEvent();

	initAgvList();
	let refreshAgvsInfo = function (data) {
		$.each(data, function (n, value) {
			if (value.systemWarning) addMsg(value.systemWarning, 1, n);
			if (n > 0) {
				if (value.currentTask != null && value.currentTask.length > 0) {
					var msg = (value.currentTask[0].opflag == "OVER" ? "执行结束：" : "正在执行：") + value.currentTask[0].taskText;
					addMsg(msg, 3, n);
				}
			}
		});
	};
	allAgvsInfo(refreshAgvsInfo);
	setInterval(() => {
		refreshAcsInfo(renderCtrlBtns);
		allAgvsInfo(refreshAgvsInfo);
	}, 2000);

	setInterval(() => {
		agvRunningLogs((datas) => {
			if (!datas) { return; }
			for (let data of datas) {
				let title;
				if ($.isNumeric(data.key)) {
					title = data.key + "号车辆";
					if (data.key == '0') title = "系统消息";
				} else {
					title = data.key;
				}
				gf.layerMsg(title + ':' + data.value, null, { offset: 'b', shade: 0.0, });
			}
		});
	}, 5000);
}

var delegateEvent = () => {
	container().delegate("button#togglePiBtn", "click", function () {
		var tips = "交通管制";
		var opType = "PI";
		taskexe.addCtrlTaskFromBtn(this, tips, opType);
	});
	container().delegate("button#autoChargeBtn", "click", function () {
		var tips = "自动充电功能";
		var opType = "AutoCharge";
		taskexe.addCtrlTaskFromBtn(this, tips, opType);
	});
	container().delegate("button#errBackBtn", "click", function () {
		var tips = "脱轨重新规划功能";
		var opType = "ErrBack";
		taskexe.addCtrlTaskFromBtn(this, tips, opType);
	});
	container().delegate("button#autoTaskBtn", "click", function () {
		var tips = "自动任务功能";
		var opType = "AutoTask";
		taskexe.addCtrlTaskFromBtn(this, tips, opType);
	});
	container().delegate("button#udfConfirmBtn", "click", function () {
		var tips = "确认信号";
		var opType = "UdfConfirm";
		taskexe.addCtrlTaskFromBtn(this, tips, opType);
	});
	container().delegate("button#PAUSE_USER", "click", function () {
		taskexe.addCtrlTask(0, "PAUSE_USER");
	});
	container().delegate("button#manager", "click", function () {
		window.open('/s/buss/g/h/manager.html');
	});
	container().delegate("button#CONTINUE", "click", function () {
		taskexe.addCtrlTask(0, "CONTINUE");
	});
	container().delegate("button#sysLocation", "click", function () {
		window.open("/s/buss/acs/location/" + localStorage.projectKey + "/location.html");
	});
	container().delegate("button#taskQuantityBtn", "click", function () {
		window.open("/s/buss/acs/" + localStorage.projectKey + "/h/task.quantity.html");
	});
	container().delegate("button#callFromLathe", "click", function () {
		layer.prompt({ title: '输入磨床号码（1、2、3、4）', formType: 0 }, function (key, index) {
			if (!["1", "2", "3", "4"].includes(key)) {
				layer.msg("错误的磨床编号！");
				return;
			}
			layer.close(index);
			if (window.confirm(`确定呼叫AGV？磨床编号：${key}`)) {
				taskexe.addCtrlTask(0, "UDF_COMMAND", key);
			}
		});
	});
}

export var renderCtrlBtns = (value) => {
	$("button#togglePiBtn").data("open", value.isOpenPi).html("交通管制" + gf.htmlPiece(value.isOpenPi));
	$("button#autoTaskBtn").data('open', value.isAutoTask).html("自动任务" + gf.htmlPiece(value.isAutoTask));
	$("button#udfConfirmBtn").data('open', value.IS_UDF_CONFIRM).html("用户确认" + gf.htmlPiece(value.IS_UDF_CONFIRM));
	$("button#autoChargeBtn").data('open', value.isAutoCharge).html("自动充电" + gf.htmlPiece(value.isAutoCharge));
	$("button#errBackBtn").data('open', value.isErrBack).html("脱轨重新规划" + gf.htmlPiece(value.isErrBack));
}