$(function(){
	SlidePlay("tab","tab1","tab2");		//列表文字自动滚动
	SlidePlay("tab3","tab4","tab5");		//列表文字自动滚动
	SlidePlay("tab6","tab7","tab8");		//列表文字自动滚动
	toggledate();			//切换月季年
	// paging.init({
	// 	url: '',
	// 	pageRows: 6,
	// 	defaultPage: 1,
	// 	getPageData: function(data) {

	// 	}
	// });

	inputSelect.init();		//下拉输入文本框
});

//列表自动滚动轮播
function SlidePlay(tab,tab1,tab2){
	var speed = 30;
	var scroll_con = document.getElementById(tab);
	var scroll_con1 = document.getElementById(tab1);
	var scroll_con2 = document.getElementById(tab2);
	if(document.getElementById(tab2)){
		scroll_con2.innerHTML = scroll_con1.innerHTML;
		scroll_con2.style.display = "none";

		function Marquee() {
			if(scroll_con2.offsetHeight - scroll_con.scrollTop < 0){
				scroll_con.scrollTop -= scroll_con1.offsetHeight;
				scroll_con2.style.display = "block";
			}else if(scroll_con2.offsetHeight - scroll_con.scrollTop > 0){
				scroll_con.scrollTop++;
				scroll_con2.style.display = "block";
			}else{
				scroll_con.scrollTop++;
			}
		}

		var MyMar = setInterval(Marquee, speed);
		scroll_con.onmouseover = function() {
			clearInterval(MyMar);
		}
		scroll_con.onmouseout = function() {
			MyMar = setInterval(Marquee, speed);
		}
	}	
}

//列表分页
var paging = {

	url: '',
	pageRows: 6,
	currentPage: 1,
	pageData: [],

	init: function(obj) {
		this.url = obj.url ? obj.url: this.url;
		this.pageRows = obj.pageRows ? obj.pageRows: this.pageRows;
		this.currentPage = obj.defaultPage ? obj.defaultPage: this.currentPage;
		this.getPageData = obj.getPageData;
		this.param = obj.param? obj.param : [];
		this.setData();
	},

	setData: function() {
		var that = this;
		var data = {'pageRows': that.pageRows, 'currnetPage': that.currentPage};
		for(var i = 0 ; i < this.param.length; i++) {
			data[this.param[i].key] = this.param[i].value;
		}
		$.ajax({
			type : 'post',
			url :that.url,
			data: data,
			dataType : 'json',
			success : function(data) {
				that.pageData = data;
		        that.totalPage = that.pageData.totol%that.pageRows >0 ? parseInt(that.pageData.totol/that.pageRows)+1 : parseInt(that.pageData.totol/that.pageRows);
			    that.renderList();
			}
		});
	},
	bindEvent: function() {
		var that = this;

		$(".list-paging-01").on("click", ".jump-paging", function() {
			var cn = parseInt($(".page-num-input").text());
			if (cn>0 && cn<that.totalPage) {
				that.currentPage = cn;
				that.setData();
			}
		});

		$(".list-paging-01").on("click", ".prev-btn", function() {
			if (that.currentPage>1) {
				that.currentPage--;
				that.setData();
			}
			else {
				return false;
			}
		});

		$(".list-paging-01").on("click", ".next-btn", function() {
			if (that.currentPage < that.totalPage) {
				that.currentPage++;
				that.setData();
			}
			else {
				return false;
			}
		});

	},

	renderList: function() { //渲染分页
		$(".paging-total").html(this.currentPage+'/'+this.totalPage);
		this.getPageData(this.pageData);
	}
}

//下拉输入文本框
var inputSelect = {
	init: function() {
		var that = this;
		$(".input-block input").focus(function() {
			that.showNav($(this));
		});

		$(".input-block input").blur(function() {
			that.hideNav($(this));
		});

		$(".input-block .select-nav li").click(function() {
			that.setInputVal($(this));
		});
	},

	showNav: function($ele) {
		$ele.parent(".input-block").find(".input-icon").css({"background": 'url("../images/arrow_up2.png") no-repeat'});
		$ele.parent(".input-block").find("ul.select-nav").show();
	},

	hideNav: function($ele) {
		setTimeout(function() {
			$ele.parent(".input-block").find(".input-icon").css({"background": 'url("../images/arrow_lower2.png") no-repeat'});
			$ele.parent(".input-block").find("ul.select-nav").hide();
		}, 200)
	},

	setInputVal: function($ele) {
		var inputText = $ele.text();
		var inputVal = $ele.attr("_value");
		$ele.parent("ul").prev("span").prev("input").val(inputText);
		$ele.parent("ul").prev("span").prev("input").attr("_value", inputVal);
	}
}

//右下角消息弹窗
function MsgPop(obj) {
	this.text = obj.text ? obj.text: '';
	this.sure = obj.sure;
	this.cancel = obj.cancel;
	this.title = obj.title ? obj.title: '消息提醒';
	this.timeOut = (obj.timeOut != undefined) ? obj.timeOut : 5;
};
MsgPop.prototype.showPop = function(popHtml) {
	$(this.popDiv).animate({"bottom": '0px'}, 800);
	this.time = 0;
	if (this.timeOut) {
		this.timer();
	}
}
MsgPop.prototype.hidePop = function() {
	$(this.popDiv).animate({"bottom": '-190px'}, 800, function() {
		$(this).remove();
	});
};
MsgPop.prototype.getDiv = function() {
	this.popDiv = document.createElement('div');
	this.popDiv.className = "msg-pop";
	var popHtml	='<h2>'+this.title+'</h2>';
		popHtml	+=	 '<p>'+ this.text +'</p>';
		popHtml	+=	 '<div class = "pop-btn clearfix">';
		popHtml	+=	     '<a class = "pop-sure-btn" href = "javascript: void(0);"></a>';
		popHtml	+=	     '<a class = "pop-cancal-btn" href = "javascript: void(0);"></a>';
		popHtml	+='</div>';

	$(this.popDiv).append(popHtml);
	$("body").append($(this.popDiv));
	this.showPop();
	this.events();
};
MsgPop.prototype.timer = function() {
	var that = this;
	var t = setInterval(function() {
		that.time++;
		if (that.time == that.timeOut) {
			that.hidePop();
			clearInterval(t);
		}
	}, 1000);
};
MsgPop.prototype.events = function() {
	var that = this;
	$(this.popDiv).find(".pop-cancal-btn").click(function() {
		that.hidePop();
		that.cancel();
	});

	$(this.popDiv).find(".pop-sure-btn, p").click(function() {
		that.hidePop();
		that.sure();
	})
}


//中间消息提示小弹窗
/**
**type:提示类型；1温馨提示，2警告提示，3信息提示
**text:提示内容；
**cancel：点击关闭和取消按钮执行事件
**sure:点击确定按钮执行事件
**/
function MsgPop2(obj) {
	this.type = obj.type ? obj.type : "";
	this.text = obj.text ? obj.text : "";
	this.sure = obj.sure ? obj.sure : "";
	this.cancel = obj.cancel ? obj.cancel : "";
}
MsgPop2.prototype.init = function() {
	this.createDiv();
}
MsgPop2.prototype.createDiv = function() {
	var h2Text, imgUrl;
	this.popDiv2 = document.createElement("div");
	if (this.type == 1) {
		h2Text = "温馨提示";
		imgUrl = "../images/voice_icon.png";
	}
	else if(this.type == 2) {
		h2Text = "警告提示";
		imgUrl = "../images/notice_icon.png";
	}
	else if(this.type == 3) {
		h2Text = "信息提示";
		imgUrl = "../images/interrogation_icon.png";
	}
	this.popDiv2.className = "msg-pop2";
	var popHtml = '<div class="msg-pop2-bg"></div>';
		popHtml += '<div class="msg-pop2-container">'
		    popHtml += '<h2>'+h2Text+'<img src="../images/close6.png" alt="关闭" /></h2>';
			popHtml += '<p class = "msg-mid-content">';
				popHtml += '<img src="'+imgUrl+'">'+this.text;
			popHtml += '</p>';
			popHtml += '<div class = "msg-pop-btn">';
				popHtml += '<a class = "blue-small2-btn" href = "javascript:void(0);">确定</a>';
				if (this.type == 3) {
					popHtml += '<a class = "org-small2-btn mal20" href = "javascript:void(0);">取消</a>';
				}
			popHtml += '</div>';
		popHtml += '</div>';

	$(this.popDiv2).html(popHtml);
	$("body").append($(this.popDiv2));
	this.events();
}
MsgPop2.prototype.events = function() {
	var that = this;
	$(this.popDiv2).find(".org-small2-btn, .msg-pop2-container h2 img").click(function() {
		that.hidePop();
		that.cancel();
	});

	$(this.popDiv2).find(".blue-small2-btn").click(function() {
		that.hidePop();
		that.sure();
	})
}
MsgPop2.prototype.showPop = function(popHtml) {
	$(this.popDiv2).slideDown();
}
MsgPop2.prototype.hidePop = function() {
	$(this.popDiv2).remove();
};

//切换月、季、年
function toggledate() {
	$("ul.toggle-date li").click(function() {
		$(this).addClass("date-active").siblings("li").removeClass("date-active");
	})
}