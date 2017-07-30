define(['require', 'zepto', 'mustache'], function (require, undef, Mustache) {
    var apiHost = '//www.shaomachetie.com';
    var isInWeixin=/MicroMessenger/i.test(navigator.userAgent);
    var isInQQ=/QQ/.test(navigator.userAgent);

    //手机QQ,腾读新闻 QQNews/5.3.6 (iPhone; iOS 10.3.2; Scale/2.00)
    //return document.body.innerHTML=navigator.userAgent
    if(document.documentElement.getAttribute('env')=='local') {
        //apiHost = 'http://192.168.1.103:8000'
    }

    var tpl, $delivery, $deliveryfee, $totalcount, $totalfee, $btpay, $totalsum,$paymethod;
    var queryString = function (query) {
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
                $totalcount.html(totalcount)


                $totalfee.html(OrderModel.totalfee.toFixed(2));
                OrderModel.deliveryfee=OrderModel.deliveryfee||0;

                OrderModel.totalsum = Math.max(0,OrderModel.totalfee -OrderModel.hongbao - -OrderModel.deliveryfee);
                $totalsum.html(OrderModel.totalsum.toFixed(2));

                break
            case 'address':
                OrderModel.totalsum = OrderModel.totalfee-OrderModel.hongbao - -OrderModel.deliveryfee;

                $totalsum.html(OrderModel.totalsum.toFixed(2));
                $btpay.removeAttr('disabled').siblings('.J_errtip').remove();
                break
            case 'material':
                break
        }
    };


    var DeliveryAdmin = {
        fillAddress:function(addrObj){
            var addrToString = function () {
                if (/北京|天津|上海|重庆/.test(this.province)) {
                    this.city = '';
                }
                return [this.name, '(' + this.phone + ')', this.province, this.city, this.district, this.detail].join(' ')
            };
            $delivery.html(addrToString.call(addrObj)).removeClass('noaddress');
            OrderModel.address = addrObj;
            DeliveryAdmin.getDeliveryFee(addrObj, function (r) {
                OrderModel.deliveryfee = r - 0;
                if(OrderModel.deliveryfee>0){
                    $deliveryfee.html(OrderModel.deliveryfee.toFixed(2)).parent().parent().show();
                }else{
                    $deliveryfee.html('包邮').parent().parent().hide()
                }

                syncView('address');
            });
        },
        addAddress: function ($popup) {
            var $f = $('form', $popup),
                f = $f[0],
                fields = 'name,phone,province,city,district,detail'.split(','),
                addrObj = {};
            for (var i = 0, field; field = fields[i++];) {
                addrObj[field] = f[field].value;
            }
            //console.log(addrObj);
            this.fillAddress(addrObj);



        },
        getDeliveryFee: function (addrObj, fn) {
            var p = []
            for (var k in addrObj) {
                p.push(k + '=' + addrObj[k])
            }
            $.getJSON(apiHost+'/smct/getdeliveryfee?' + p.join('&') + '&callback=?', function (r) {
                fn(r.data)
            })
        },
        renderLastAddress:function(){
            //目前绝大多数都是新来用户,唉~
            $.getJSON(apiHost+'/smct/getlastaddress?&callback=?', function (r) {

                r && r.data && DeliveryAdmin.fillAddress(r.data);
            })
        }
    };

    var renderPaymethod=function(){
        $.getJSON(apiHost+'/smct/getpaymethods?&callback=?', function (r) {
            var paymethods=(r && r.data)||[{value:'alipay',text:'支付宝'}]
            var sel = $paymethod[0];
            sel.options.length = 0;
            for (var i = 0, n; n = paymethods[i++];) {
                sel.options[sel.options.length] = new Option(n.text, n.value)
            }
        })
    };



    return {
        init: function ($mod) {
            var hongbao=function(str){
                if(!str){
                    OrderModel.hongbao=0;
                    return
                }
                var split=str.split('#');
                OrderModel.hongbao=split[1]-0;
                return {
                    title:split[0],
                    amount:split[1]
                }
            }(localStorage.getItem('hongbao'));


            var buildurl=$mod.attr('data-buildurl');
            tpl = $('.J_tpl', $mod).html();

            var $list = $('.J_list', $mod);
            var $popup = $('.J_popup', $mod).on('click', function (e) {
                var $tar = $(e.target);
                switch (true) {
                    case $tar.hasClass('J_close'):
                        $popup.removeClass('show')
                        break
                    case $tar.hasClass('J_confirm'):
                        $popup.removeClass('show');
                        DeliveryAdmin.addAddress($popup);
                        break
                }
            });
            $.getJSON(apiHost+'/smct/getbuilds?bids=' + bids + '&callback=?', function(r) {
                if (r && r.data && r.data.length) {
                    var list = r.data;
                    var totalfee = 0;
                    for (var i = 0, n; n = list[i++];) {
                        totalfee += n.price;
                        Settings[n._id] = n.setting;
                    }
                    $list.html(Mustache.render(tpl, {
                        data: list,
                        totalfee: totalfee.toFixed(2),
                       // paymethod:renderPaymethod(),
                        hongbao:hongbao
                    }));
                    OrderModel.totalfee = totalfee;
                    $delivery = $('.J_address', $list);
                    $deliveryfee = $('.J_delieryfee', $list);
                    $totalsum = $('.J_totalsum', $list)
                    $totalcount = $('.J_totalcount', $list)
                    $totalfee = $('.J_totalfee', $list);
                    $paymethod=$('.J_paymethod',$list);
                    renderPaymethod();

                    var loading = false;
                    $btpay = $('.J_btpay', $list).on('click', function () {
                        if (loading ||this.disabled) {

                            return false
                        }

                        if ($totalcount.html() == 0) {
                            return alert('请至少添加一个商品')
                        }
                        if(!OrderModel.address){
                            return alert('请填写地址')
                        }
                        if(!OrderModel.address.detail){
                            return alert('请填写详细地址')
                        }
                        if(!OrderModel.address.name){
                            return alert('请填写收货人姓名')
                        }
                        if(!/^(1\d{10}|(\d{3,4}\-)?\d{7,8}(\-\d+)?)$/.test(OrderModel.address.phone)){
                            return alert('请填写收货人电话')
                        }
                        loading = true;
                        $btpay.addClass('loading')
                        var pack = [];
                        $('tr[data-id]').each(function (i, n) {
                            var $n = $(n);
                            pack.push({
                                bid: $n.attr('data-id'),
                                amount: $('.J_number', $n).val(),
                                material: $('.J_material', $n).val()
                            })
                        });

                        var mainform = $('.J_mainform', $mod)[0];
                        var smtData = {
                            pack: JSON.stringify(pack),
                            delivery: JSON.stringify(OrderModel.address),
                            //codes: JSON.stringify(codes),
                            totalcount: $totalcount.html() - 0,
                            totalfee: $totalfee.html() - 0,
                            deliveryfee: OrderModel.deliveryfee,
                            totalsum: OrderModel.totalsum.toFixed(2) -0,
                            hongbao: OrderModel.hongbao.toFixed(2) -0,
                            paymethod:$paymethod.val()
                            //encoded_codes:encoded_codes
                        };
                        for (var k in smtData) {
                            var hid = document.createElement('input')
                            hid.type = 'hidden';
                            hid.name = k;
                            hid.value = smtData[k];
                            mainform.appendChild(hid);
                        }

                        mainform.submit();


                        return false;
                    });
                    DeliveryAdmin.renderLastAddress();
                    //$('[data-toggle="distpicker"]').distpicker({});

                    // $('[data-toggle="distpicker"]').distpicker({});
                } else {
                    $list.html('<i class="iconfont">&#xe631;</i>&nbsp;&nbsp;<br/>购物车是空的,赶紧去定制一个你喜欢的车贴吧~<br/><a href="'+buildurl+'">开始定制</a>').addClass('empty-order');
                }
            });

            $list.on('change', function (e) {
                var $tar = $(e.target);
                switch (true) {
                    case $tar.hasClass('J_number'):
                        syncView('amount');
                        break
                }
            }).on('click', function (e) {
                var $tar = $(e.target);
                switch (true) {
                    case $tar.hasClass('J_amountUp'):
                        var $input = $tar.siblings('.J_number');
                        $input.val($input.val() - -1)
                        syncView('amount');
                        break
                    case $tar.hasClass('J_amountDown'):
                        var $input = $tar.siblings('.J_number');
                        $input.val(Math.max($input.val() - 1, 0))
                        syncView('amount');
                        return false
                        break
                    case $tar.hasClass('J_address'):

                        $popup.addClass('show');
                        //alert($popup[0].className)

                        require(['./distpicker'], function (distpicker) {
                            distpicker.init({
                                provinceEl: $('.J_province', $popup)[0],
                                cityEl: $('.J_city', $popup)[0],
                                districtEl: $('.J_district', $popup)[0]
                            });

                        })
                        return false
                        break
                }

            });



            //var f = document.getElementById('orderform');

        }
    }
})
