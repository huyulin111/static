let taskSiteLocationData = null;
let taskSiteLogicData = null;

export var taskSiteLogic = function (callback) {
    let call = (data) => {
        if (callback) {
            callback(data);
        };
    };
    if (taskSiteLogicData) {
        call(taskSiteLogicData);
        return;
    };
    $.ajax({
        url: "/s/jsons/" + localStorage.projectKey + "/sites/taskSiteLogic.json",
        type: "get",
        async: false,
        cache: false,
        dataType: "json",
        success: function (data) {
            taskSiteLogicData = data;
            call(data);
        },
        complete: function (data) {
        },
    });
}

export var taskSiteLocation = function (callback) {
    let call = (data) => {
        if (callback) {
            callback(data);
        }
    };
    if (taskSiteLocationData) {
        call(taskSiteLocationData);
        return;
    }
    $.ajax({
        url: "/s/jsons/" + localStorage.projectKey + "/sites/taskSiteLocation.json",
        type: "get",
        async: false,
        cache: false,
        dataType: "json",
        success: function (data) {
            taskSiteLocationData = data;
            call(data);
        },
        complete: function (data) {
        },
    });
}

export var updatetaskSiteLogic = function (id, data) {
    var flag = true;
    if (!taskSiteLogicData) return;
    taskSiteLogicData.forEach((e, i) => {
        if (e.id == id) {
            flag = false;
            return taskSiteLogicData[i] = data;
        }
    });
    if (flag) {
        return taskSiteLogicData.push(data)
    }
}

export var updateTaskSiteLocation = function (id, data) {
    var flag = true;
    if (!taskSiteLocationData) return;
    taskSiteLocationData.forEach((e, i) => {
        if (e.id == id) {
            flag = false;
            return taskSiteLocationData[i] = data;
        }
    });
    if (flag) {
        return taskSiteLocationData.push(data)
    }
}
