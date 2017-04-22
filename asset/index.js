define(['zepto','mustache'],function(undef,Mustache){

    var tpl;
    var queryString= function (query) {
        var search = window.location.search + '';
        if (search.charAt(0) != '?') {
            return '';
        }
        else {
            search = search.replace('?', '').split('&');
            for (var i = 0; i < search.length; i++) {
                if (search[i].split('=')[0] == query) {
                    return decodeURI(search[i].split('=')[1]);
                }
            }
            return '';
        }
    };
    var bids = queryString('bids');

    var OrderModel = {};
    var Settings = {};

    var syncCode = function (fn) {
        var totalcount = 0;
        var renderConf = {};
        $('tr[data-id]').each(function (i, n) {
            var $n = $(n),
                bid = $n.attr('data-id'),
                $number = $('.J_number', $n),
                count = $number.val() * 1;
            totalcount += count;
            var setting = Settings[bid];
            //console.log('Settings',Settings[bid])
            renderConf[bid] = {
                count: count,
                tplcolor: $('.preview', $n).css('backgroundColor'),
                text1: setting.text1,
                text2: setting.text2,
                carlogo: setting.carlogo ? 'http://www.shaomachetie.com/static/smct/img/carlogo/' + setting.carlogo + '.jpg' : null
            }
            //OrderModel.totalfee+=$number.val() * $number.attr('data-price');

        });
        //console.log(renderConf)

        var cb_count = 0;
        var gencodes = [];

        var cb = function () {
            cb_count++;
            if (cb_count == totalcount) {
                //console.log('OK');
                fn(gencodes)
            }

        };

        $.getJSON('http://www.shaomachetie.com/smct/gencode', {count: totalcount}, function (r) {
            var codes = r.data;
            gencodes = [].concat(codes);

            for (var k in renderConf) {
                var count = renderConf[k].count;
                var i = 0;
                while (i < count) {


                    renderPaper(codes.shift(), renderConf[k], function (dataURL, code) {
                        //console.log(code);
                        //console.log(dataURL);

                        $.post('http://www.shaomachetie.com/smct/uploadpaper', {
                            code: code,
                            base64: dataURL
                        }, cb);
                        //cb();
                    });
                    i++;
                }
            }


        });


    };

    var syncView = function (trigger) {
        switch (trigger) {
            case 'amount':
                var totalcount = 0;
                OrderModel.totalfee = 0;

                $('tr[data-id]').each(function (i, n) {
                    var $n = $(n),
                        $number = $('.J_number', $n);
                    totalcount += $number.val() * 1;
                    OrderModel.totalfee += $number.val() * $number.attr('data-price');

                });
                $('#totalcount').html(totalcount)


                $('#totalfee').html(OrderModel.totalfee.toFixed(2));
                if (OrderModel.deliveryfee) {
                    OrderModel.totalsum = OrderModel.totalfee - -OrderModel.deliveryfee;
                    $('#totalsum').html(OrderModel.totalsum.toFixed(2));
                }


                break
            case 'address':
                OrderModel.totalsum = OrderModel.totalfee - -OrderModel.deliveryfee;

                $('#totalsum').html(OrderModel.totalsum.toFixed(2));
                $('#btpay').attr('disabled', false)
                break
            case 'material':
                break
        }
    };


    var DeliveryAdmin = {
        showDialog: function () {
            $('#deliveryDialog').dialog({
                title: '管理收货地址',
                width: 600,
                modal: true,
                buttons: [
                    {
                        text: "确定",
                        icons: {
                            primary: "ui-icon-check"
                        },
                        click: function () {
                            DeliveryAdmin.addAddress();
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: "取消",
                        icons: {
                            primary: "ui-icon-closethick"
                        },
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        },
        addAddress: function () {
            var $f = $('#deliveryDialog>form'),
                f = $f[0],
                fields = 'name,phone,province,city,district,detail'.split(','),
                addrObj = {},
                addrToString = function () {
                    if (/北京|天津|上海|重庆|/.test(this.province)) {
                        this.city = '';
                    }
                    return [this.name, '(' + this.phone + ')', this.province, this.city, this.district, this.detail].join(' ')
                };
            for (var i = 0, field; field = fields[i++];) {
                addrObj[field] = f[field].value;
            }
            //console.log(addrObj);
            $('#delivery').html(addrToString.call(addrObj));
            OrderModel.address = addrObj;
            DeliveryAdmin.getDeliveryFee(addrObj, function (r) {
                $('#deliveryfee').html(OrderModel.deliveryfee = (r - 0).toFixed(2));
                syncView('address');
            });


        },
        getDeliveryFee: function (addrObj, fn) {
            $.getJSON('http://www.shaomachetie.com/smct/getdeliveryfee', addrObj, function (r) {
                fn(r.data)
            })
        }
    };


    function render(r) {
        if (r && r.data && r.data.length) {
            var list = r.data;
            var totalfee = 0;
            for (var i = 0, n; n = list[i++];) {
                totalfee += n.price;
                Settings[n._id] = n.setting;
            }debugger
            $('#list').html(Mustache.render(tpl, {
                data: list,
                totalfee: totalfee.toFixed(2)
            }));
            OrderModel.totalfee = totalfee;

           // $('[data-toggle="distpicker"]').distpicker({});
        } else {
            $('#list').html('<i class="iconfont">&#xe631;</i>&nbsp;&nbsp;<br/>购物车是空的,赶紧去定制一个你喜欢的车贴吧~<br/><a href="builder.html">开始定制</a>').addClass('empty-order');
        }
    };

    return {
    init:function($mod){
        tpl=$('.J_tpl',$mod).html();
        var $list=$('.J_list',$mod);
        $.getJSON('http://www.shaomachetie.com/smct/getbuilds?bids='+bids+'&callback=?', function render(r) {
            if (r && r.data && r.data.length) {
                var list = r.data;
                var totalfee = 0;
                for (var i = 0, n; n = list[i++];) {
                    totalfee += n.price;
                    Settings[n._id] = n.setting;
                }
                $list.html(Mustache.render(tpl, {
                    data: list,
                    totalfee: totalfee.toFixed(2)
                }));
                OrderModel.totalfee = totalfee;

                // $('[data-toggle="distpicker"]').distpicker({});
            } else {
                $list.html('<i class="iconfont">&#xe631;</i>&nbsp;&nbsp;<br/>购物车是空的,赶紧去定制一个你喜欢的车贴吧~<br/><a href="builder.html">开始定制</a>').addClass('empty-order');
            }
        });

        $list.on('change', function (e) {
            var $tar = $(e.target);
            switch (true) {
                case $tar.hasClass('J_number'):
                    syncView('amount');
                    break
            }
        })

        //var f = document.getElementById('orderform');
        var loading = false,
            btpay = $('#btpay').on('click', function () {
                if (loading) {
                    btpay.addClass('loading')
                    return false
                }
                loading=true;
                var pack = [];
                $('tr[data-id]').each(function (i, n) {
                    var $n = $(n);
                    pack.push({
                        bid: $n.attr('data-id'),
                        amount: $('.J_number', $n).val(),
                        material: $('.J_material', $n).val()
                    })
                });
                syncCode(function (codes) {
                    $.post('/smct/submitorder', {
                        pack: JSON.stringify(pack),
                        delivery: JSON.stringify(OrderModel.address),
                        codes: JSON.stringify(codes),
                        totalcount: $('#totalcount').html() - 0,
                        totalfee: $('#totalfee').html() - 0,
                        deliveryfee: OrderModel.deliveryfee,
                        totalsum: OrderModel.totalsum
                    }, function (r) {
                        loading=false;
                        btpay.removeClass('loading')
                        if (r.error) {
                            alert(r.error)
                        } else {
                            // alert('支付去吧~~')
                            location.href = '/alipay/pay?from=smct&oid=' + r.data;
                        }

                    });
                });

                return false;
            });

    }
  }
})
