<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:oxm="https://www.openxsl.com">
    <xsl:template match="/root" name="wurui.smct-shopcart">
        <!--
        <xsl:param name="submitaction">http://localhost:8000/smct/submitorderform?client=h5&amp;redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fsmct%2Fworks.html</xsl:param>
        -->
        <xsl:param name="buildurl"/>
        <xsl:param name="payurl"/>
        <!-- className 'J_OXMod' required  -->
        <div class="J_OXMod oxmod-smct-shopcart" ox-mod="smct-shopcart" data-payurl="{$payurl}" data-buildurl="{$buildurl}" data-uid="{login/uid}">
            <xsl:variable select="data/product-list/i" name="products"/>
            <xsl:variable select="data/customize/i" name="customize"/>
            <xsl:variable select="data/addressbook/i" name="addressbook" />
            
            <div class="J_list list">
                <div class="J_render">
                      <table class="order-table" cellpadding="0" cellspacing="0">
                        <thead>
                            <tr>
                                <th align="left">
                                    &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;
                                    预览
                                </th>
                                <th>数量</th>
                                <th>价格</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        <xsl:for-each select="$customize">
                            <xsl:variable select="tid" name="product_id"/>
                            <xsl:variable select="$products[id = $product_id]" name="product"/>
                            
                            <tr data-id="{_id}" data-product-id="{tid}" data-product-title="{$product/title}" data-product-owner="{$product/owner}">
                                <td width="160">
                                    <span class="J_customize_props">
                                        <xsl:for-each select="props/i">
                                            <input type="hidden" name="{key}" value="{value}"/>
                                        </xsl:for-each>
                                    </span>
                                    <div class="snapshot" data-id="{_id}" title="点击可选中">
                             
                                        <div class="preview bgcolor-{props/i[key='bgcolor']/value}">
                                            <div class="card-header">
                                                <xsl:value-of select="props/i[key='text1']/value"/>
                                            </div>
                                            <div class="card-body tpl tpl-{props/i[key='tpl']/value}">
                                                <div class="central">
                                                    <img src="http://v.oxm1.cc/cars/{props/i[key='carlogo']/value}.png"/>
                                                </div>
                                                <img src="http://i.oxm1.cc/uploads/git/wurui/img/2ahkwkkveTj1rgh0ueRlcquA5vz-1000.png" class="qrcode"/>

                                            </div>
                                            <div class="card-footer">
                                                <span>
                                                    <xsl:value-of select="props/i[key='text2']/value"/>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button type="button" class="J_amountUp amount-up"></button>
                                    <br/>
                                    <input type="number" data-price="{$product/price}" class="J_number amount-input" value="1" min="0" size="1"/>
                                    <br/>
                                    <button type="button" class="J_amountDown amount-down"></button>
                                </td>
                                <td>
                                    <span class="price">
                                        <xsl:value-of select="$product/price"/>
                                    </span>
                                </td>
                            </tr>
                        </xsl:for-each>
                            
                        </tbody>
                    </table>


                    <hr/>
                    <div class="lrbar">
                        <span>
                            商品总计: <span class="J_totalcount"><xsl:value-of select="count($customize)"/></span>张
                        </span>
                        <span>
                           
                            商品总价: <span class="J_totalfee price">--.--</span>
                        </span>
                    </div>

                    <div class="formbar">
                        <label>收货地址:</label>
                        <span class="J_address address" ox-refresh="html">
                            <xsl:choose>
                                <xsl:when test="count($addressbook) = 0">
                                    <b class="bt-address">添加地址</b>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:variable select="$addressbook[selected]" name="defaultaddress"/>
                                    <xsl:value-of select="$defaultaddress/name"/>
                                    (<xsl:value-of select="$defaultaddress/phone"/>)
                                    <xsl:value-of select="$defaultaddress/province"/>
                                    <xsl:value-of select="$defaultaddress/city"/>
                                    <xsl:value-of select="$defaultaddress/district"/>
                                    <xsl:value-of select="$defaultaddress/detail"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </span>
                    </div>
                    <div class="lrbar" style="display:none;">
                        <span>发货城市:杭州</span>
                        <span>
                            运费: <span class="J_delieryfee price">包邮</span>
                        </span>
                    </div>
                </div>
                <hr/>
                <div class="lrbar">
                    <span>
                    
                    </span>
                    <span>
                        实付金额: <big class="J_totalsum price">--.--</big>
                    </span>
                </div>
                <div class="lrbar">
                    <span></span>
                    <span>
                        
                        <em class="err-tip J_errtip"><!--
                            请添加收货地址&#160;&#160;&#160;&#160;<br/>-->
                        </em>

                        <button class="bt-order J_btpay">提交订单</button>
                    </span>
                </div>
            </div>


            <form class="J_mainform" method="post"></form>
            <!--
            <div class="J_popup fullpopup">
                <h3 class="title">
                    <button type="button" class="rightbtn J_close">关闭</button>
                    地址管理
                </h3>
                <div class="content">

                    <div class="address-form">
                        <xsl:for-each select="$addressbook">
                        <div class="formitem">
                            <label>
                                <xsl:value-of select="name"/>
                                (<xsl:value-of select="phone"/>)<br/>
                                <xsl:value-of select="province"/>
                                <xsl:value-of select="city"/>
                                <xsl:value-of select="district"/>
                                <xsl:value-of select="detail"/>

                            </label>
                        </div>
                        </xsl:for-each>
                        <div class="formitem">
                            <button class="J_confirm">确认</button>
                        </div>
                    </div>
                </div>
            </div>-->

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
