/**
 * Created by wurui on 14/04/2017.
 */

define(['./qrcode'],function (undef) {



    var radius = 40;
    var rectWidth = 500;
    var bgcolor = '#fff';

    var headHeight = 120;
    var bodyHeight = 340;
    var footHeight = Math.max(radius, rectWidth - headHeight - bodyHeight);


    var qrcodeRect = 280;
    var qrcodePadding = 5;
    var qrcodeWrapper = qrcodeRect + qrcodePadding * 2;
    var qrcodeMarginTop = 40;


    var carlogRect = 78;



    //document.body.appendChild(canvas)

    var drawImage = function (src, x, y, fn) {
        var ctx=this;
        if (src.tagName && src.tagName.toLowerCase() == 'img') {
            var img = src;
        } else {
            var img = new Image();
            img.src = src;
        }
        img.crossOrigin = "anonymous";

        img.onload = function () {//console.log('load')
            ctx.drawImage(img, x, y);
            fn && fn();
        };
        // console.log(img.complete)
        // document.body.appendChild(img)
    };
    var drawSquareWithRadius = function (x, y, width, radius) {
        var ctx=this;

        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + width - radius);
        ctx.arcTo(x, y + width, x + radius, y + width, radius);
        ctx.lineTo(x + width - radius, y + width)
        ctx.arcTo(x + width, y + width, x + width, y + width - radius, radius);
        ctx.lineTo(x + width, y + radius)
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.lineTo(x + radius, y)
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.closePath();

    };
    var fillTextWithSpacing = function (txt, x, y, spacing) {
        //先只考虑textAlign center吧
        var ctx=this;
        if (!spacing) {
            ctx.fillText(txt, x, y);
        } else {
            var i = 0, startX = x, measureWidth = ctx.measureText(txt).width,
                originTextalign = ctx.textAlign;
            switch (originTextalign) {
                case 'center':

                    startX = x - (measureWidth + txt.length * spacing) / 2;
                    //console.log('cccc',measureWidth,startX,x)
                    break
                case 'left':
                    startX = x;
                    break
                case 'right':
                    startX = x - (measureWidth + txt.length * spacing);
                    break
                default :
                    break
            }


            ctx.textAlign = 'left';
            while (i < txt.length) {
                var letter = txt[i++],
                    startX = i ? startX + spacing : startX;
                //measureWidth+=ctx.measureText(letter).width
                ctx.fillText(letter, startX, y);
                startX += ctx.measureText(letter).width
            }
            ctx.textAlign = originTextalign;
        }


        //ctx.fillText(txt,x,y);
    };


//qrcode

    var drawQRCode = function (qrcodeSrc, logoSrc,fn) {
        var ctx=this;
        drawImage.call(ctx,qrcodeSrc, (rectWidth - qrcodeRect) / 2, headHeight + qrcodeMarginTop + qrcodePadding, function () {

            if (logoSrc) {
                var imgx = (rectWidth - carlogRect) / 2,
                    imgy = headHeight + qrcodeMarginTop + qrcodePadding + (qrcodeRect - carlogRect) / 2;
                drawSquareWithRadius.call(ctx,imgx, imgy, carlogRect, 10);
                //ctx.fillStyle='red';
                ctx.save();
                ctx.clip();


                drawImage.call(ctx,logoSrc, imgx, imgy, function () {

                    ctx.restore();

                    fn && fn();
                })

            }else{
                fn && fn();
            }
        });
    };

// drawQRCode('img/testqrcode.png',carlogo);

    function renderPaper(code, settings,fn) {
        var canvas = document.createElement('canvas');

        canvas.height=canvas.width=rectWidth;

        var ctx = canvas.getContext("2d");
        drawSquareWithRadius.call(ctx,0, 0, rectWidth, radius);

        var tplcolor=settings.tplcolor,
            text1=settings.text1,
            text2=settings.text2,
            carlogo=settings.carlogo;


        ctx.strokeStyle = '#eee';
        ctx.stroke();
        ctx.fillStyle = tplcolor;
        ctx.fill();

        ctx.fillStyle = bgcolor;
        ctx.fillRect(0, headHeight, rectWidth, bodyHeight);//body


//draw footer
        ctx.beginPath();
        ctx.moveTo(0, rectWidth - radius)
        ctx.arcTo(0, rectWidth, radius, rectWidth, radius);
        ctx.lineTo(rectWidth - radius, rectWidth)
        ctx.arcTo(rectWidth, rectWidth, rectWidth, rectWidth - radius, radius);
        ctx.lineTo(0, rectWidth - radius)
        ctx.closePath();
        ctx.fillStyle = bgcolor;
// ctx.strokeStyle='red';
        ctx.fill();


        if(text1) {
//文案
            ctx.font = "bold 55px '黑体', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle'
            fillTextWithSpacing.call(ctx,text1, rectWidth / 2, headHeight / 2, 6);
        }

        if(text2){
            ctx.font = "18px '黑体', sans-serif";
            ctx.fillStyle = '#666';
            ctx.textBaseline = 'middle'
//ctx.fillText(text2,rectWidth/2,headHeight+bodyHeight+footHeight/2);
            fillTextWithSpacing.call(ctx,text2, rectWidth / 2, headHeight + bodyHeight + footHeight / 2, 1)
        }


//qrcode wrapper
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;//add .5 make 1px line
        ctx.strokeRect((rectWidth - qrcodeWrapper) / 2 + .5, headHeight + qrcodeMarginTop + .5, qrcodeWrapper, qrcodeWrapper);


        var qrcodeContainer = document.createElement("div");
        new QRCode(qrcodeContainer,
            {
                text: "http://www.shaomachetie.com/carnotify/entry?_id=" + code,
                width: 280,
                height: 280,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

        drawQRCode.call(ctx,qrcodeContainer.getElementsByTagName('img')[0], carlogo,function(){
            fn && fn(canvas.toDataURL(),code);
        });

    }


    return renderPaper
});

/*
!function (renderPaper) {

    var code = '12345'
    renderPaper(code, {
        tplcolor:'#0b97c4',
        text1:'扫码通知车主',
        text2: 'www.shaomachetie.com',
        carlogo: 'img/carlogo/宝马.jpg'
    },function(dataURL){
        console.log(code);
        console.log(dataURL);
        $.post('uploadpaper',{code:code,base64:dataURL},function(r){
            console.log('result',r)
        })
    });
}(render);
*/


