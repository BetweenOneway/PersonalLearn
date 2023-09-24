<template>
  <div>
    <my-header></my-header>
    <main id="main" class="container">
        <div class="carousel" id="demo" data-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img class="w-100" src="img/index/banner1.png" alt="">
                </div>
                <div class="carousel-item">
                    <img class="w-100" src="img/index/banner2.png" alt="">
                </div>
                <div class="carousel-item ">
                    <img class="w-100" src="img/index/banner3.png" alt="">
                </div>
                <div class="carousel-item ">
                    <img class="w-100" src="img/index/banner4.png" alt="">
                </div>
            </div>
            <!---->
            <ul class="carousel-indicators">
                <li data-slide-to="0" data-target="#demo" class="active"></li>
                <li data-slide-to="1" data-target="#demo" class=""></li>
                <li data-slide-to="2" data-target="#demo" class=""></li>
                <li data-slide-to="3" data-target="#demo" class=""></li>
            </ul>
            <!---->
            <a href="#demo" data-slide="prev" class="carousel-control-prev">
                <span class="carousel-control-prev-icon"></span>
            </a>
            <a href="#demo" data-slide="next" class="carousel-control-next">
                <span class="carousel-control-next-icon"></span>
            </a>
        </div>
      <div>
        <h3 class="pb-3">
            <div class="border-bottom">
                <img src="img/index/computer_icon.png" class="title_img_size" alt="">
                <span class="title_font text-muted ml-2">首页推荐/1F</span>
            </div>
            <div class="row mx-0 mt-2">
                <div class="col-lg-7 col-sm-12 px-0">
                    <div class="top_height bg_L mr-lg-1 mb-1 before_margin">
                        <div class="card border-0 w-40 mt-4 ml-5 bg-transparent">
                            <h3 v-text="p1.title"></h3>
                            <h6 class="text-muted my_small mb-3" v-text="p1.details"></h6>
                            <span class="text-primary font24">¥{{p1.price.toFixed(2)}}</span>
                            <router-link class="btn btn-primary" :to="`/details/${p1.href.split('=')[1]}`">查看详情</router-link>
                        </div>
                        <img class="float-right my_img_position" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" :src="p1.pic" >
                    </div>
                </div>
                <div class="col-lg-5 col-sm-12 px-0">
                    <div class="top_height bg_L mb-1 before_margin">
                        <div class="card border-0 w-40 mt-4 ml-5 bg-transparent">
                            <h3 v-text="p2.title"></h3>
                            <h6 class="text-muted my_small mb-3" v-text="p2.details"></h6>
                            <span class="text-primary font24">¥{{p2.price.toFixed(2)}}</span>
                            <router-link class="btn btn-primary mt-3 w-75" :to="`/details/${p2.href.split('=')[1]}`">查看详情</router-link>
                        </div>
                        <img class="float-right my_img_position"  alt="Thumbnail [200x250]" :src="p2.pic">
                    </div>
                </div>
                <div class="col-lg-5 col-sm-12 px-0">
                    <div class="bottom_height bg_L mr-lg-1 mb-sm-1 mb-lg-0"></div>
                </div>
                <div class="col-lg-7 col-sm-12 px-0">
                    <div class="row mx-0">
                        <div class="col-4 px-0">
                            <div class="bottom_height bg_L mr-1"></div>
                        </div>
                        <div class="col-4 px-0">
                            <div class="bottom_height bg_L mr-1"></div>
                        </div>
                        <div class="col-4 px-0">
                            <div class="bottom_height bg_L"></div>
                        </div>
                    </div>
                </div>
            </div>
        </h3>
      </div>
    </main>
    <my-footer></my-footer>
  </div>
</template>
<script>
export default {
  data(){
    return {
      p1:{price:0, href:""},
      p2:{price:0, href:""},
      p3:{price:0, href:""},
      others:[]
    }
  },
  props:[],
  methods:{},
  watch:{},
  computed:{},
  //当这个组件对象创建后，自动执行！
  mounted(){//created(){
    this.axios.get(
      "/index"
    ).then(result=>{
      console.log(result.data);
      this.p1=result.data[0];
      this.p2=result.data[1];
      this.p3=result.data[2];
      this.others=result.data.slice(3);
    })
  }
}
</script>
<style>
  @import url("../assets/css/index.css");
</style>


