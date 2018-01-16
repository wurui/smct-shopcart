define(['require', 'zepto', 'mustache','oxjs'], function (require, undef, Mustache,OXJS) {
    //var apiHost = '//www.shaomachetie.com';
    var $mod, $delivery, $deliveryfee, $totalcount, $totalfee, $btpay, $totalsum,$paymethod;

    var OrderModel = {};
    var syncView = function (trigger) {
        OrderModel.hongbao=OrderModel.hongbao||0;
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
               // $btpay.removeAttr('disabled').siblings('.J_errtip').remove();
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
            /*
            DeliveryAdmin.getDeliveryFee(addrObj, function (r) {
                OrderModel.deliveryfee = r - 0;
                if(OrderModel.deliveryfee>0){
                    $deliveryfee.html(OrderModel.deliveryfee.toFixed(2)).parent().parent().show();
                }else{
                    $deliveryfee.html('包邮').parent().parent().hide()
                }

                syncView('address');
            });*/
        },
        addAddress: function ($popup) {
            var $f = $('form', $popup),
                f = $f[0],
                fields = 'name,phone,province,city,district,detail'.split(','),
                addrObj = {};
            for (var i = 0, field; field = fields[i++];) {
                addrObj[field] = f[field].value;
            }
            //console.log(addrObj,$mod);
            this.fillAddress(addrObj);
            $mod.OXPost({
                addressbook:addrObj
            })

        },
        getDeliveryFee: function (addrObj, fn) {
            /*
            var p = []
            for (var k in addrObj) {
                p.push(k + '=' + addrObj[k])
            }

            $.getJSON(apiHost+'/smct/getdeliveryfee?' + p.join('&') + '&callback=?', function (r) {
                fn(r.data)
            })
            */
        },
        renderLastAddress:function(){
            //目前绝大多数都是新来用户,唉~
            /*
            $.getJSON(apiHost+'/smct/getlastaddress?&callback=?', function (r) {

                r && r.data && DeliveryAdmin.fillAddress(r.data);
            })*/
        }
    };


    var data2order=function(data){
        var bill=[];
        if(data.deliveryfee) {
            bill.push({
                item: 'deliveryfee',
                value: data.deliveryfee
            });
        }
        if(data.hongbao) {
            bill.push({
                item: 'hongbao',
                value: -data.hongbao
            })
        }
        var order={
            title:'定制版扫码车贴'+data.totalcount+'张',
            pack:data.pack,
            delivery:data.delivery,
            totalcount:data.totalcount,
            totalfee:data.totalsum,
            bill:JSON.stringify(bill)
            //seller:
        };

        return order;
    }



    return {
        init: function ($_mod) {
            $mod=$_mod;
            var payurl=$mod.attr('data-payurl');
            var buildurl=$mod.attr('data-buildurl');
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
       
            //$list.html('<i class="iconfont">&#xe631;</i>&nbsp;&nbsp;<br/>购物车是空的,赶紧去定制一个你喜欢的车贴吧~<br/><a href="'+buildurl+'">开始定制</a>').addClass('empty-order');

            
            var totalfee = 0;
           
            OrderModel.totalfee = totalfee;
            $delivery = $('.J_address', $list);
            $deliveryfee = $('.J_delieryfee', $list);
            $totalsum = $('.J_totalsum', $list)
            $totalcount = $('.J_totalcount', $list)
            $totalfee = $('.J_totalfee', $list);
            $paymethod=$('.J_paymethod',$list);
            

            //DeliveryAdmin.renderLastAddress();

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
                    case $tar.parent().hasClass('J_address'):

                        $popup.addClass('show');
                        

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
            syncView('amount');


            var loading = false;
            $btpay = $('.J_btpay', $list).on('click', function () {
                if (loading ||this.disabled) {

                    return false
                }

                if ($totalcount.html() == 0) {
                    return alert('请至少添加一个商品')
                }
                /*
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
                }*/
                loading = true;
                $btpay.addClass('loading')
                var pack = [];
                var seller;
                $('tr[data-id]').each(function (i, n) {
                    var $n = $(n);
                    seller=$n.attr('data-product-owner');
                    var customize=[];
                    $('.J_customize_props>input',$n).each(function(i,n){
                        customize.push({
                            name:this.name,
                            value:this.value
                        })
                    });
                    pack.push({
                        name:$n.attr('data-product-title'),
                        amount:$('.J_number', $n).val() - 0,
                        price:$('.J_number', $n).attr('data-price')-0,
                        id:$n.attr('data-product-id'),
                        customize:customize
/*
                        item: $n.attr('data-product-id'),
                        amount: $('.J_number', $n).val(),
                        customize:$n.attr('data-id')
                        */
                        //material: $('.J_material', $n).val()
                        /**再多个性化定制,后面再考虑,要和商品价格打通
                        不行的话,此处再根据不同的如材质这样的特性来关联购买的商品,但事先肯定也必有一个更抽象的商品在,不然定制对象是什么呢?
                         还是通盘考虑先定制再生成商品这种状态,就像吃麻辣烫下单过程一样
                         不然就得再新生成一个定制表,然后购买最新这个
                         */
                    })
                });

                //var mainform = $('.J_mainform', $mod)[0];
                /*
                var smtData = {
                    pack: JSON.stringify(pack),
                    //detail: JSON.stringify(pack),
                    delivery: JSON.stringify(OrderModel.address),
                    //codes: JSON.stringify(codes),
                    totalcount: $totalcount.html() - 0,
                    totalfee: $totalfee.html() - 0,
                    deliveryfee: OrderModel.deliveryfee,
                    totalsum: OrderModel.totalsum.toFixed(2) -0,
                    hongbao: OrderModel.hongbao.toFixed(2) -0,
                };*/
               
                try {
                    $mod.OXPost({
                        orders:{
                            title:'扫码车贴'+$totalcount.html()+'张',
                            totalfee:OrderModel.totalsum.toFixed(2) -0,
                            time:Date.now(),
                            totalcount:$totalcount.html() - 0,
                            status:0,
                            seller:seller,
                            buyer:OXJS.getUID(),
                            delivery:$delivery.html().replace(/\s/g,''),//JSON.stringify(OrderModel.address),
                            bill:[
                                {                                    
                                    item: 'deliveryfee',
                                    value: OrderModel.deliveryfee
                                },
                                {
                                    item: 'product',
                                    value: $totalfee.html() - 0
                                }
                            ],
                            content:pack
                        }
                    },function (r) {

                        if(r.code==0){
                            var new_id= r.message;
                            //todo: 去支付
                            location.href=payurl.replace(/\{oid\}/g,new_id).replace(/\{paymethod\}/g,smtData.paymethod);//+'?oid='+new_id
                        }else{
                            OXJS.toast('ERROR['+ r.message +']')
                        }
                        //console.log(r)

                    })

                }catch(e){
                    OXJS.toast('Catch Error:'+e.toString())
                }

                return false;

            });




            //var f = document.getElementById('orderform');

        }
    }
})
