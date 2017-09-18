var toolsObj = {
	ajaxUrl:'../../common/warmUp.do',
	share:{//属性可有可无  无则不分享
		isShare:'1',//0不需分享，1需要分享
		url: window.location.origin+'/scratchCard/scratchCard_index.html?shopid=20001',
		title: '送祝福抽手机+100元话费',
		content:'我在这里拿福利，你也一起来吧',
		imgurl:'http://image2.chinatelecom-ec.com/client/wap/scratchCard/images/scratch_share.png'
	}
}
sessionStorage.setItem('toolsObj',JSON.stringify(toolsObj));

var scratchCard = {
	data:{

	},
	setData:function(){
		sessionStorage[this.conf.seName] = JSON.stringify(this.data);
	},
	conf:{
		ajaxUrl:'',
		seName:'scratchCard'
	},
	errTip : {
		e000:{code:'H_000',tip:'系统繁忙，请稍后再试'},
		e001:{code:'H_001',tip:'截取路径参数失败'},
		e002:{code:'H_002',tip:'路径参数失败不满足要求'},
		e003:{code:'H_003',tip:'sessionStrage值丢失'},
		e004:{code:'H_004',tip:'网络繁忙，请稍后再试'},
		e005:{code:'H_028',tip:'亲，手机号不能为空'},
		e006:{code:'H_029',tip:'亲，请输入正确的手机号'},
		e007:{code:'H_030',tip:'亲，验证码不能为空'},
		e008:{code:'H_031',tip:'亲，验证码发送成功'},
		e009:{code:'H_033',tip:'已发送验证码到您的手机，请注意查收'},
		e010:{code:'H_034',tip:'亲，您输的不是电信号码'},
		e011:{code:'H_038',tip:'亲，请输入短信随机码'},

		i_001:{code:'i_001',tip:'您唯一的刮奖机会已用完'},
		i_002:{code:'i_002',tip:'邀朋友来领福利'},
		i_003:{code:'i_003',tip:'中大奖啦～炫耀一下！'},
		i_004:{code:'i_004',tip:'请输入正确的姓名'},
		i_005:{code:'i_005',tip:'请填写收货人身份证号'},
		i_006:{code:'i_006',tip:'请输入正确的收货地址'},
		i_007:{code:'i_007',tip:'亲，姓名不能为空'},
		i_008:{code:'i_008',tip:'亲，请输入正确的身份证号码'},
		i_009:{code:'i_009',tip:'亲，详细地址不能为空'}
	}
}

/**
 * 跳转404页面 入参shopid
 * @param shpoid
 */
function to404(shopid){
	location.href = 'http://diy.189.cn/client/wap/common/page/error_404.html?errorCode='+(shopid || '20001');
}

/*
 * 微信分享
 * type ==9  限时购 func  wxShareFunc
 */
//微信分享
function weiXinShare(type,func,mydata){
	var url=window.location.href;
    var params={
            'url' : url,
            'activityType': type
    }
    tools.doAjax('warmUpWeiXinShare',params,function(data){
		if(data.headerInfo.code == 'W_0000' && data.responseContent.serviceCode == '0'){
			var data = data.responseContent;
			wx.config({
			       debug: false, 
			       appId: data.appId,           // 必填，公众号的唯一标识
			       timestamp: data.timestamp,   // 必填，生成签名的时间戳
			       nonceStr: data.nonceStr,     // 必填，生成签名的随机串
			       signature: data.signature,   // 必填，签名，见附录1
			       jsApiList: [
			           'onMenuShareTimeline',
			           'onMenuShareAppMessage',
					   'hideOptionMenu',
					   'showOptionMenu'
			       ]                            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function(){
				wx.showOptionMenu();//显示右上角菜单接口
				func(data,mydata);
			});
		}else{
			
		}
	},function(data){
	},function(data){
	},true,true);       
}

/**
 * 微信分享
 * @param data
 */
function wxShareFuncToge(data,mydata){
	var shareTitle = data.title;
	var desc = data.content;
	if(!$.isEmptyObject(mydata)){
		desc = teleStoryObj.tip.s_000.msg.replace('hh',mydata.callSum)
				.replace('%%',mydata.callRanking).replace('un',mydata.callSumUnit);
	}
	var shareImg = data.icon;
	var shareLink = data.linkUrl.replace('#storyid#',(mydata.storyId || '123'));
	wx.onMenuShareTimeline({
		title: shareTitle,  //分享标题
		link: shareLink,    //分享链接
		imgUrl: shareImg,
		success: function () {
			
		}
	});
	wx.onMenuShareAppMessage({
		title: shareTitle,  // 分享标题
		link: shareLink,    // 分享链接
		imgUrl: shareImg,
		desc: desc,        // 分享描述
		success: function () {
			
		}
	});
}
(function () {
	var param = {
		"sessionid": JSON.parse(sessionStorage.getItem('data.sessionid'))||'',
	};
	tools.doAjax('aggrBlogroll', param, function (data) {
		if (data.headerInfo.code === 'W_0000' && data.responseContent.serviceCode === '0') {
			var arr=data.responseContent.blogRoolList;
			if(!tools.isNull(arr)){
				var cont='';
				for(var i=0;i<arr.length;i++){
					cont+='<li style=" background-color: #fff;width:100%; height:6rem;border: 1px solid #d7dce1; margin-top: 0.55rem;"><img style="width: 100%;height: 100%;" src='+arr[i].imageUrl+' alt=""/></li>';
				}
				var html = '<div class=" clerafix" style="margin-top: 1.8rem;">\
							<h3  style="font-size: 0.85rem;height:1rem; line-height: 1rem;color:#9b8315; text-align: center;font-weight: normal"> <span style="width:6.9rem; height:0; border-top:1px solid #506174; display: inline-block; margin-top: 0.5rem; border-top:1px solid #9b8315;float:left;"></span> 精彩推荐 <span style="width:6.9rem; height:0; border-top:1px solid #506174; display: inline-block; margin-top: 0.5rem; border-top:1px solid #9b8315;float:right;"></span></h3>\
							<div class="scratchCardIndex_rcMenu clerafix" style="padding:0.7rem 1.2rem;">\
								<ul class="clerafix">'+cont+'</ul>\
							</div>\
						</div>';
				$('.scratchCardIndex_box').append(html);
				$('.scratchCardIndex_rcMenu ul li').bind('click', function () {
					var index=$(this).index();
					if(!tools.isNull(arr[index].linkUrl)){
						window.location.href=arr[index].linkUrl;
					}
				})
			}

		} else {
		}
	}, function (data) {
	}, function (data) {
	}, true, true);


})();
(function () {
	var content='活动时间：<br/>' +
		'11月14日-12月30日<br/>' +
		'活动奖品：<br/>' +
		'iphone6S（16G）手机+100元话费<br/>' +
		'三星G9300手机+ 100元话费<br/>' +
		'活动规则：<br/>' +
		'1）所有登录活动页面用户均可参与；<br/>' +
		'2）活动期间，用户完成点赞送祝福即可获得一次刮奖机会；<br/>' +
		'3）活动期间，每位用户限送一次祝福和获得一次刮奖机会。<br/>' +
		'4）中奖用户需提交收货人电话（收货人电话为中奖和登录号码）、通信地址、姓名、身份证件等信息验证，信息验证通过后才能获得相应奖品；在活动结束前，未提交身份信息验证的，刮中的奖品自动作废。<br/>' +
		'5）身份证号码须与收货人姓名一致，如不一致则无法验证通过，验证不通过超过3次（含3次）的用户，请拨打4008167189人工电话核对身份。<br/>' +
		'6）中奖用户填写的身份证信息将用于中国电信为用户的奖品缴纳个人所得税，不另做他用。<br/>' +
		'7）获得的手机奖品，将在活动结束后次月月底前寄送；用户需填写正确的配送信息，若因配送信息填写不准确导致配送失败或丢件，由用户自行承担，中国电信不再补发奖品。<br/>' +
		'8）用户收到奖品后，需向物流人员提供有效身份证件进行查验。<br/>' +
		'9）获得的100元话费将于活动结束次月月底前充入用户填写的电信手机号码中。<br/>' +
		'10）活动时间、规则、奖品的临时变更，将不再另行告知。<br/>' +
		'11）凡参与本活动的用户视为自愿同意本活动所有规则，本活动最终解释权归中国电信所有。<br/>' +
		'客服电话：4008167189（9：00-21：00）<br/>';
	var html='<div class="scratchCardIndex_actMaskCon" style=" width:100%; position:absolute; left:0; bottom:0; background:#fff;height: 41%;padding: 0.66rem 1.56rem; box-sizing:border-box; ">\
		<div class="scratchCardIndex_actMaskInfoCon" id="scratchCardIndex_actMaskInfoCon" style="height: 100%;">\
		<h3 class="scratchCardIndex_actMes" style="width: 100%;height:1.25rem; text-align:center;font-size: 0.7rem;margin: 0;padding: 0;">活动说明</h3>\
		<div class="scratchCardIndex_actMaskInfoMe" style="height:90%;overflow: scroll; position:relative;">\
		<p class="" style=" line-height:1.125rem;font-size: 0.6rem">'+content+'</p>\
		</div>\
		</div>\
		<span class="scratchCardIndex_goDown" style="width:1.05rem; height:0.7rem; position:absolute; bottom:0.8rem; right:0.4rem;"><img src="http://image2.chinatelecom-ec.com/client/wap/redBagRain/images/go_down.png" style=" width:1.05rem; height:0.7rem;"></span>\
		</div>\
		<div class="scratchCardIndex_actOther" style="height: 59%"></div>';
	$('.scratchCardIndex_actMask').html(html)

})();
