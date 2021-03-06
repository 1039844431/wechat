$(function (){

initContainer();

addSwiperSlide();
putAppDetailByID();
erweiImg();

pageNumDiveAct();
});
//项目根路径
var parentPath = window.document.location.href;
var rootPath = parentPath.substring(0,parentPath.indexOf("WeChat")) + "WeChat/";
//添加图片模块
var imgDiv = "<div class='item ajaxItem'> "	+					        	
				"<img src='"+ rootPath+ "APPIMGPATH' class='item_img'>		"	+					        	
				"<div class='li_detail'>  "	+	
				    "<h3 class='li_title'>APPNAME</h3> "	+	
				     "<div class='li_title_saosao'>扫码</div> "	+	
				     "<div class='erwei_container'> " +
						 "	<img src='"+ rootPath+ "APPERWEIIMG' class='erwei_img'>" +
						 "	<div class='erwei_message'>微信扫描体验</div> " +
					  " </div>" +
					  " <div class='li_intro li_time'>发布时间：APPEISSUETIME</div> " +
				     "<div class='li_intro'>功能：APPINRO</div> "	+	
				"  </div> "	+	
				"  <div class='li_category_container'> "	+	
				"    <div class='li_category'>APPCATEGORY</div>			 "	+				             
				"    <div class='people_number'>APPLOOKNUM</div> "	+	
				"    <div class='li_eye'></div> "	+	
				"  </div> "	+	
			 " </div> "  +
			"<input type='hidden' value='APPDETAILID'> ";

//添加滑动模块
var add_slide_div = "<div class='swiper-slide'> " +
					"	<div class='mycategory_container'>" +
					"		<div class='title_container'>" +
					"			<div class='video_container'>" +
					"				<div class='video_name'>MAINAPPCATEGORY</div> " +
					"			</div>" +
					"			<div class='category_img_li'>" +
					"			      <section id='work'> " +
					"			    	 <div id='ADDCURRENTPAGE'></div>" +
					"                    <input type='hidden' id='ISADDIMGDIV'> " +
					"			      </section>     " +
					"	      </div>" +
					"		</div>" +
					"	</div>" +
				   " </div>";

//每个滑动模块id前缀
var swiper_id = "ADD_DIV_SWIPER_SLIDE_";
//是否已经加载判断字id前缀,如果加载了value就存当前的页码
var isAdd = "IS_AddImgDiv_";
function erweiImg(){
	$(document).on("mouseover",".li_title_saosao",function(){
		$(this).css("color","#FF9900");
		$(this).next().css("display","block");
	});
	$(document).on("mouseout",".li_title_saosao",function(){
		$(this).next().css("display","none");
		$(this).css("color","#828282");
	});	
}
function putAppDetailByID(){
	$(document).on("click",".ajaxItem",function (){
		var appID = $(this).next().val();
//		alert(appID);
		window.location.href = "appDetail_" + appID + ".html";
//		window.location.href = "system/AppDetailAction_detail.do?appID=" + appID;
	});
}


function addImgDiv(clickPage){
	
	var isAddImg =  $("#" + isAdd + clickPage).val();
	if(isAddImg == null || isAddImg == ""){
		$.ajax({
			url:"system/AppDetailAction_findCategoryAppDetail.do",
			type:"post",
			data:{
				CategoryKey:$("#CategoryKey").val(),
				CategoryValue:$("#CategoryValue").val(),
				pageNO:clickPage
				},
			dataType:"json",
			success:function(data){
				$("#currentPage").val(data.currentPageNo);
				
				$("#" + isAdd + clickPage).val(data.currentPageNo);
				$(data.appDetailFromList).each(function (i,category){
					$("#" + swiper_id + clickPage).after(imgDiv.replace("APPIMGPATH", category.appImg)
							                  .replace("APPNAME", category.appName)
							                  .replace("APPERWEIIMG", category.erweiImg)
							                  .replace("APPINRO", category.intro)
							                  .replace("APPCATEGORY", category.category)
							                  .replace("APPLOOKNUM", category.peopleLookNum)
							                  .replace("APPEISSUETIME", category.issueTime)
							                  .replace("APPDETAILID", category.ID)
					);
				});
			},
			error:function (){}
		});
	}	
}
function addSwiperSlide(){

	$.ajax({
		url:"system/AppDetailAction_findCategoryAppDetail.do",
		type:"post",
		data:{
			CategoryKey:$("#CategoryKey").val(),
			CategoryValue:$("#CategoryValue").val()
			},
		dataType:"json",
		success:function(data){	 
			$("#totalPage").val(data.totalPage);
			for(var i = data.totalPage ; i >= 2; i --){
				var addSwiperSlideID = swiper_id + i;
				var isAddImgDiv = isAdd + i;
				$("#add_slide").after(add_slide_div.replace("MAINAPPCATEGORY", data.category)
					                               .replace("ADDCURRENTPAGE", addSwiperSlideID)
					                               .replace("ISADDIMGDIV", isAddImgDiv)
													);
			}
			initCategory();
//			$("#" + isAdd + "1").val(1);
//			$(data.appDetailFromList).each(function (i,category){
//				$("#" + swiper_id + "1").after(imgDiv.replace("APPIMGPATH", category.appImg)
//						                  .replace("APPNAME", category.appName)
//						                  .replace("APPERWEIIMG", category.erweiImg)
//						                  .replace("APPINRO", category.intro)
//						                  .replace("APPCATEGORY", category.category)
//						                  .replace("APPLOOKNUM", category.peopleLookNum)
//						                  .replace("APPEISSUETIME", category.issueTime)
//						                  .replace("APPDETAILID", category.ID)
//				);
//			});
		},
		error:function (){}
	});
}


function pageNumDiveAct(){
	var currentPage = $("#currentPage").val();
	$.each($("a[name='pageNum']"),function(i){		
		if(currentPage == $(this).text()){
			$(this).css("background-color","#FF8C00");
			$(this).css("color","white");
		}else{
			$(this).css("background-color"," #CFCFCF");
			$(this).css("color","black");
		}
		
	});
}



function initCategory(){
	 var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next',
        onSlideChangeStart: function(swiper){
        	addImgDiv(swiper.activeIndex + 1);       	
          },
        paginationBulletRender: function (index, className) {        	
	       return '<span id="pageClick" name="pageClick" class="morePagenoact ' + className + '">' + (index + 1) + '</span>';	    			       		
        	}            
    });
//	 $.each($("span[name='pageClick']"),function(i){
//		 
//		 });
}



function initContainer(){
	
	$(document).on("mouseover",".item",function (){
		$(this).addClass("item_hover");
		$(this).find("h3").css("color","#FF9900");
		$(this).find("img").css("opacity",1);
	});
	$(document).on("mouseout",".item",function (){
		$(this).removeClass("item_hover");
		$(this).find("h3").css("color","#000");
		$(this).find("img").css("opacity",0.8);
	});
}