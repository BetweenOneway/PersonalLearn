<template>
    <header id="header" class="container">
        <!--上部分-->
        <div class="row">
            <div class="col-lg-3 col-md-12">
                <a href="" class="navbar-brand">
                    <img src="img/header/logo.png" alt="" />
                </a>
            </div>
            <div class="col-lg-6 col-md-12 mt-2">
                <div class="input-group">
                    <input class="form-control my_small py-0" type="text" placeholder="请输入您要搜索的内容" v-model="kw" @keydown.13="search"/>
                    <div @click="search">
                        <img src="img/header/search.png" alt="" />
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-12 p-lg-0 mt-2">
                <ul class="breadcrumb p-0">
                    <li class="breadcrumb-item">
                        <a href="">
                            <img src="img/header/care.png" alt="">
                        </a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="">
                            <img src="img/header/order.png" alt="">
                        </a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="">
                            <img src="img/header/shop_car.png" alt="">
                        </a>
                    </li>
                    <li class="breadcrumb-item">
                        <a class="text-muted" href="register.html">注册</a>
                    </li>
                    <li class="breadcrumb-item">
                        <a class="text-muted" href="register.html">登陆</a>
                    </li>
                </ul>
            </div>
            </div>
            <!--下部分 主导航-->
            <ul class="nav">
                <li class="nav-item">
                    <a href="" class="nav-link text-muted pl-md-0">首页</a>
                </li>
                <li class="nav-item">
                    <a href="" class="nav-link text-muted">学习用品</a>
                </li>
                <li class="nav-item">
                    <a href="" class="nav-link text-muted">私人订制</a>
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
  @import url("../assets/css/header.css");
</style>