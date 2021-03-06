import "/s/j/vue/vue.min.js";
import { initRows } from "/s/buss/g/j/dynamic.rows.init.js";
import { submitForm } from "/s/buss/g/j/dynamic.rows.add.js";
import { dicdata } from "/s/buss/sys/dic/dic.data.info.js";
import { gf } from "/s/buss/g/j/g.f.js";

var vm = new Vue({
    data: {
        dicdatas: [],
        dictype: {}
    },
    el: "#container",
    created: function () {
    },
    mounted: function () {
        $("#sub").on("click", function () {
            submitForm();
        });
        $.ajax({
            url: '/sys/dic/type/findByPage.shtml?sysDicTypeFormMap.dictype=' + gf.urlParam("dictype"),
            async: true,
            type: 'GET',
            dataType: 'json',
            timeout: 5000,
            cache: false,
            success: (data) => {
                this.dealType(data);
            },
            error: function () {
                layer.msg("获取数据失败，请检查网络连接……");
            }
        });
    },
    methods: {
        dealType: function (datas) {
            if (!datas || !datas.records[0]) {
                layer.msg("获取的字典类型数据为空，请检查数据……");
                return;
            }
            this.dictype = datas.records[0];

            let newDatas = [];
            let newData = [{
                key: "dickey",
                name: "键",
                notnull: true
            }, {
                key: "dicvalue",
                name: "值",
                notnull: true
            }];
            if (this.dictype.json) {
                var json = JSON.parse(this.dictype.json);
                if (json && json.items) {
                    for (let item of json.items) {
                        newData = newData.concat({
                            key: item.key,
                            name: item.name,
                            notnull: item.notnull
                        });
                    }
                }
            }
            this.dicdatas = this.dicdatas.concat({ newData });
            newDatas = newDatas.concat(newData);
            var _conf = {
                container: "div#rows",
                targetClass: "item-group",
                addBtn: "div.addOne",
                subBtn: "#sub",
                dellogic: true,
                serial: 0,
                max: 20,
                model: gf.urlParam("model"),
                items: [{
                    key: "key",
                    name: "键",
                    notnull: true,
                }, {
                    key: "name",
                    name: "名称",
                    notnull: true,
                }, {
                    key: "notnull",
                    name: "非空",
                    type: "select",
                    dic: "TRUE_OR_FALSE",
                    notnull: true,
                },]
            }
            _conf.items = newDatas;
            this.doInit(_conf);
        },
        doInit: function (_conf) {
            var doInitRows = (dicdatainfos) => {
                $(_conf.addBtn).removeClass("hidden");
                if (dicdatainfos) {
                    for (let dicdatainfo of dicdatainfos) {
                        if (dicdatainfo.json) {
                            var json = JSON.parse(dicdatainfo.json);
                            Object.assign(dicdatainfo, json);
                            console.log(dicdatainfo);
                        }
                    }
                    initRows(_conf, dicdatainfos);
                }
            }

            if (gf.urlParam("dictype")) {
                dicdata(gf.urlParam("dictype"), doInitRows);
            }
        }
    },
    computed: {
    }
});