/**
 * Created by wurui on 22/04/2017.
 */
define(['require','oxjs'],function(require,OXJS){

    var renderSelect=function(sel,data){
        sel.options.length=0;
        var val=sel.getAttribute('data-value');
        for(var k in data){
            var txt=data[k],
                opt=new Option(txt)
            opt.code=k;
            sel.options[sel.options.length]=opt;
            if(val && val ==txt){
                opt.selected=true;
            }
        }
    };
    return {
        init:function(conf){

            var provinceEl=conf.provinceEl,
                cityEl=conf.cityEl,
                districtEl=conf.districtEl,
                Distdata,
                onProvinceChanged=function(){
                    if(/台湾|香港|澳门/.test(provinceEl.value)){
                        provinceEl.selectedIndex=0;
                        OXJS.toast('暂不支持配送到该地区')
                    }
                    renderSelect(cityEl,Distdata[provinceEl.options[provinceEl.selectedIndex].code]);
                    onCityChanged();
                },
                onCityChanged=function(){
                    renderSelect(districtEl,Distdata[cityEl.options[cityEl.selectedIndex].code])

                };
            if(provinceEl.getAttribute('data-distpicker')){
                return //console.log('sss')
            }

            provinceEl.setAttribute('data-distpicker',1)
            provinceEl.addEventListener('change',onProvinceChanged,false)
            cityEl.addEventListener('change',onCityChanged,false)
            //districtEl.addEventListener('change',function(){},false);

            require(['./distdata'],function(distdata){
                Distdata=distdata;
                var province=distdata[100000];
                renderSelect(provinceEl,province);
                onProvinceChanged();

            })

        }
    }
})