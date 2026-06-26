$(function(){
    $(".privacyBtn").click(function(){
       $("#privacy").fadeIn(200);
       $("#privacy").addClass('blur');
       $("body").addClass('overflow');
   });

   // 팝업닫기
   $("#privacy .closeBtn").click(function(){
       $("#privacy").fadeOut(200);
       $("#privacy").removeClass('blur');
       $(".overflow").removeClass('overflow');

   });

   $(".privacyBtn1").click(function(){
    $("#privacy1").fadeIn(200);
    $("#privacy1").addClass('blur');
    $("body").addClass('overflow');
});

// 팝업닫기
$("#privacy1 .closeBtn").click(function(){
    $("#privacy1").fadeOut(200);
    $("#privacy1").removeClass('blur');
    $(".overflow").removeClass('overflow');

});
})