<template>
  <header id="header" class="container mb-4">
    <nav class="navbar navbar-light">
      <a class="navbar-brand" href="index.html">
        <img src="img/header/logo.png" alt="">
      </a>
      <div class="form-inline">
        <div class="input-group">
          <input type="text" class="form-control p-0" placeholder="请输入你要搜索的内容" aria-label="Recipient's username" aria-describedby="basic-addon2" v-model="kw" @keydown.13="search">
          <div class="input-group-append h-75" @click="search">
            <img class="btn p-0" src="img/header/search.png">
          </div>
        </div>
      </div>
      <nav id="signout" class="my-2 my-md-0 mr-md-3 small">
        <a class="p-1 text-muted" href="register.html">注册</a>
        <b class="p-1 text-muted" >|</b>
        <a class="p-1 text-muted" id="btnLogin" href="#">登录</a>
      </nav>
      <!--<nav id="signin" class="my-2 my-md-0 mr-md-3 small">
        <a class="p-1" href="#" title="我的收藏">
          <img src="img/header/care.png">
        </a>
        <b class="p-1">|</b>
        <a class="p-1" href="#" title="我的订单">
          <img src="img/header/order.png">
        </a>
        <b class="p-1">|</b>
        <a class="p-1" href="cart.html" title="我的购物车">
          <img src="img/header/shop_car.png" alt="">
        </a>
        <a class="p-1 text-muted" href="#">Welcome <span id="uname">dangdang</span></a>
        <a class="p-1 text-muted" id="btnSignout" href="javascript:;">注销</a>
      </nav>-->
    </nav>
    <ul class="nav nav-pills">
      <li class="nav-item">
        <a class="nav-link text-muted active" href="index.html">首页</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-muted" href="#">学习用品</a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-muted" href="#">私人定制</a>
      </li>
    </ul>
  </header>
</template>
<script>
export default {
  data(){
    return {
      kw:""//利用双向绑定获得搜索文本框中用户输入的关键词
    }
  },
  methods:{
    //点击查询按钮或在文本框上按回车，都可以跳转到/products页面，并把输入的关键词传过去。
    search(){
      this.$router.push("/products/"+this.kw)
    }
  },
  //如果地址栏中已经有用户输入的关键词参数kw，则自动获取到搜索文本框中保持同步
  created(){
    this.kw=this.$route.params.kw;
  },
  watch:{
    //如果地址栏中已经有用户输入的关键词参数kw，则自动获取到搜索文本框中保持同步
    $route(){
      this.kw=this.$route.params.kw;
    }
  }
}
</script>
<style scoped>
  /*定制搜索框的大小*/
  #header>.navbar>.form-inline>.input-group>input{
    width:300px;
  }
  /*定制主导航当前导航项的字体颜色*/
  #header>.nav .nav-link.active,
  #header>.nav .nav-link:hover{
    background:none;
    font-weight:bold;
  }
</style>