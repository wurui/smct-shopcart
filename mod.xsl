<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:oxm="https://www.openxsl.com">
    <xsl:template match="/root" name="wurui.smct-shopcart">
        <xsl:param name="submitaction">http://localhost:8000/smct/submitorderform?client=h5&amp;redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fsmct%2Fworks.html</xsl:param>
        <xsl:param name="buildurl"/>
        <!-- className 'J_OXMod' required  -->
        <div class="J_OXMod oxmod-smct-shopcart" ox-mod="smct-shopcart" data-buildurl="{$buildurl}">
            <div class="J_list list">
                订单加载中...
            </div>
            <form class="J_mainform" action="{$submitaction}" method="post"></form>


            <script type="text/tpl" class="J_tpl"><![CDATA[
            <table class="order-table" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        <th>预览</th>
                        <th>数量</th>
                        <th>价格</th>
                    </tr>
                </thead>
                <tbody>
                    {{#data}}
                    <tr data-id="{{_id}}">
                        <td width=160>
                        <div class="snapshot">
                            <div class="preview bgcolor-{{setting.bgcolor}}"">
                            <div class="card-header">{{setting.text1}}</div>
                            <div class="card-body tpl tpl-{{setting.tpl}}">
                                <div class="central">
                                    {{#setting.carlogo}}<img src="{{fullcarlogo}}"/>{{/setting.carlogo}}
                                </div>
                                <img src="http://i.oxm1.cc/uploads/git/wurui/img/2ahkwkkveTj1rgh0ueRlcquA5vz-1000.png" class="qrcode"/>

                            </div>
                            <div class="card-footer">
                                <span>{{setting.text2}}</span>
                            </div>
                        </div>

                    </div>
                </td>
                <td>
                    <button type="button" class="J_amountUp amount-up"></button>
                    <br/>
                    <input type="number" data-price="{{price}}" class="J_number amount-input" value="1" min="0" size="1"/>
                    <br/>
                    <button type="button" class="J_amountDown amount-down"></button>
                </td>
                <td>
                    <span class="price">{{price}}</span>
                </td>
            </tr>
            {{/data}}


        </tbody>

    </table>

    <hr/>
    <div class="lrbar">
        <span>
            商品总计: <span class="J_totalcount">{{data.length}}</span>张
        </span>
        <span>
            商品总价: <span class="J_totalfee price">{{totalfee}}</span>
        </span>
    </div>
    <div class="formbar">
                <label>收货地址:</label><span class="J_address address">添加地址</span>
            </div>
            <div class="lrbar" style="display:none;">
                <span>发货城市:杭州</span>
                <span>
                    运费: <span class="J_delieryfee price">包邮</span>
                </span>
            </div>
            <hr/>
            <div class="lrbar">
                <span>支付方式:
                    <select>
                        <option>{{paymethod}}</option>
                    </select>
                </span>
                <span>
                    实付金额: <big class="J_totalsum price">--.--</big>
                </span>
            </div>
            <div class="lrbar">
                <span></span>
                <span>
                    <button class="bt-order J_btpay" disabled="disabled">提交订单</button>
                </span>
            </div>
]]>
            </script>
            <div class="J_popup fullpopup">
                <h3 class="title">
                    <button type="button" class="rightbtn J_close">关闭</button>
                    地址管理
                </h3>
                <div class="content">

                    <div class="address-form">
                        <form onsubmit="return false">
                            <div class="formitem">
                                <input type="text" name="name" placeholder="姓名"/>
                            </div>
                            <div class="formitem">
                                <input type="tel" name="phone" placeholder="电话"/>
                            </div>
                            <div class="formitem">
                                <div class="select-group" data-toggle="distpicker" data-autoselect="3">
                                    <select class="J_province" name="province" data-value="{data/address/province}">
                                        <option>省</option>
                                    </select>
                                    <select class="J_city" name="city" data-value="{data/address/city}">
                                        <option>市</option>
                                    </select>
                                    <select class="J_district" name="district">
                                        <option>区/省</option>
                                    </select>
                                </div>
                            </div>
                            <div class="formitem">
                                <input type="text" name="detail" placeholder="详细地址"/>
                            </div>
                        </form>
                        <div class="formitem">
                            <button class="J_confirm">确认</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>
