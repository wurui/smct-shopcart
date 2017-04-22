/**
 * Created by wurui on 22/04/2017.
 */
define(['require'],function(require){

    var renderSelect=function(sel,data){
        sel.options.length=0;
        for(var k in data){
            var opt=new Option(data[k])
            opt.code=k;
            sel.options[sel.options.length]=opt;
        }
    };
    return {
        init:function(conf){

            var provinceEl=conf.provinceEl,
                cityEl=conf.cityEl,
                districtEl=conf.districtEl,
                Distdata,
                onProvinceChanged=function(){
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