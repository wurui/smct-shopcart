<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:oxm="https://www.openxsl.com">
    <xsl:template match="/root" name="wurui.smct-shopcart">
        <!-- className 'J_OXMod' required  -->
        <div class="J_OXMod oxmod-smct-shopcart" ox-mod="smct-shopcart">
            <div class="J_list list"></div>


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
                                    {{#setting.carlogo}}<img src="http://www.shaomachetie.com/static/smct/img/carlogo/{{setting.carlogo}}.jpg"/>{{/setting.carlogo}}
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
            商品总计: <span id="totalcount">{{data.length}}</span>张
        </span>
        <span>
            商品总价: <span id="totalfee" class="price">{{totalfee}}</span>
        </span>
    </div>
    <div class="formbar">
                <label>收货地址:</label><span class="J_address address">吴瑞(18106568448)浙江省杭州市余杭区同城印象西区10-1-301</span>
            </div>
            <div class="lrbar">
                <span>发货城市:杭州</span>
                <span>
                    运费: <span class="J_delieryfee price">--.--</span>
                </span>
            </div>
            <hr/>
            <div class="lrbar">
                <span>支付方式:
                    <select>
                        <option>支付宝</option>
                    </select>
                </span>
                <span>
                    实付金额: <big class="J_totalfee price">--.--</big>
                </span>
            </div>
            <div class="lrbar">
                <span></span>
                <span>
                    <button class="bt-order">提交订单</button>
                </span>
            </div>
]]>
            </script>
            <div class="J_popup fullpopup">
                <h3 class="title">
                    <span class="rightbtn J_close">关闭</span>
                    地址管理
                </h3>
                <div class="content">
                    <div class="address-form">
                        <div class="formitem">
                            <input type="text" placeholder="姓名"/>
                        </div>
                        <div class="formitem">
                            <input type="telephone" placeholder="电话"/>
                        </div>
                        <div class="formitem">
                            <div class="select-group">
                                <select>
                                    <option>省</option>
                                    <option>新疆维吾尔自治区</option>
                                </select>
                                <select>
                                    <option>市</option>
                                </select>
                                <select>
                                    <option>区/省</option>
                                </select>
                            </div>
                        </div>
                        <div class="formitem">
                            <input type="text" placeholder="详细地址"/>
                        </div>
                        <div class="formitem">
                            <button class="J_confirm">确认</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>
