export var allocData = function (callback, condition) {
    if (callback) {
        $(".black_overlay").show();
        $("table.alloc").html("");
    }
    let serach = { "allocItemFormMap.text": $("#kw").val() };
    if (condition) { serach = Object.assign(serach, condition); }
    jQuery.ajax({
        url: "/alloc/item/findByPage.shtml",
        data: serach,
        type: "POST",
        dataType: "json",
        success: function (data) {
            if (callback) {
                callback(data.records);
            }
        },
        complete: function (data) {
            setTimeout(function () {
                $(".black_overlay").hide();
            }, 100);
        },
        timeout: 5000
    });
}