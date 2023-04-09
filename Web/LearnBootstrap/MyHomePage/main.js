"use strict";
$('#mobile-menu-active').metisMenu();
$('#mobile-menu-active .has-dropdown > a').on('click',function(e){
    e.preventDefault();
});

//点击菜单栏按钮显示菜单栏
$("#hamburger-menu > a").on("click",
function(e){
    e.preventDefault();
    $(".slide-bar").toggleClass("show");
    $("body").addClass("on-side");
    $('.body-overlay').addClass('active');
    $(this).addClass('active');
});
//点击关闭按钮关闭菜单栏
$(".close-mobile-menu > a").on("click",
function(e){
    e.preventDefault();
    $(".slide-bar").removeClass("show");
    $("body").removeClass("on-side");
    $('.body-overlay').removeClass('active');
    $('.hamburger-menu > a').removeClass('active');
});
//点击空白处关闭菜单栏
$('.body-overlay').on('click',
function(){
    $(this).removeClass('active');
    $(".slide-bar").removeClass("show");
    $("body").removeClass("on-side");
    $('.hamburger-menu > a').removeClass('active');
});