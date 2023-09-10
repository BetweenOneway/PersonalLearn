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
          <nav class="navbar navbar-light border-bottom border-secondary pb-0 mb-2">
            <a class="navbar-brand" href="#">
              <img src="img/index/computer_icon.png" class="d-inline-block align-top" alt="">
              首页推荐 / 1F
            </a>
          </nav>
          <div class="row mb-2">
            <div id="p1" class="col-md-7">
              <div class="card border-0 flex-md-row box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <h5 class="d-inline-block mb-2" v-text="p1.title"></h5>
                  <h6 class="mb-5">
                    <a class="text-dark" href="javascript:;" v-text="p1.details"></a>
                  </h6>
                  <span class="text-primary">¥{{p2.price.toFixed(2)}}</span>
                  <router-link class="btn btn-primary" :to="`/details/${p1.href.split('=')[1]}`">查看详情</router-link>
                </div>
                <img class="card-img-right flex-auto d-none d-md-block" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" :src="p1.pic" data-holder-rendered="true">
              </div>
            </div>
            <div class="col-md-5 pl-0">
              <div class="card border-0 flex-md-row box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <h5 class="d-inline-block mb-2" v-text="p2.title"></h5>
                  <h6 class="mb-5">
                    <a class="text-dark" href="javascript:;" v-text="p2.details"></a>
                  </h6>
                  <span class="text-primary">¥{{p2.price.toFixed(2)}}</span>
                  <router-link class="btn btn-primary" :to="`/details/${p2.href.split('=')[1]}`">查看详情</router-link>
                </div>
                <img class="card-img-right flex-auto d-none d-md-block mt-5" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" :src="p2.pic" data-holder-rendered="true">
              </div>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-5">
              <div class="card border-0 flex-md-row box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <h5 class="d-inline-block mb-3" v-text="p3.title"></h5>
                  <span class="text-primary">¥{{p3.price.toFixed(2)}}</span>
                  <router-link class="btn btn-primary" :to="`/details/${p3.href.split('=')[1]}`">查看详情</router-link>
                </div>
                <img class="card-img-right flex-auto d-none d-md-block mt-5" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" :src="p3.pic" data-holder-rendered="true">
              </div>
            </div>
            <div class="col-md-7 pl-0">
              <div id="others" class="row pr-3">
                <div v-for="(p,i) of others" :key="i" class="col-md-4 p-0 pl-2">
                  <div class="card border-0 text-center">
                    <img class="card-img-top" :src="p.pic" alt="Card image cap">
                    <div class="card-body p-0 pr-1 pl-1">
                      <span class="d-inline-block" v-text="p.title"></span>
                      <span class="text-primary small">¥{{p.price.toFixed(2)}}</span>
                      <router-link class="btn btn-sm btn-primary" :to="`/details/${p.href.split('=')[1]}`">查看详情</router-link>
                    </div>
                  </div>
                </div>
                <!--删除后两个片段-->
              </div>
            </div>
          </div>
        </h3>
        <h3 class="pb-3">
          <nav class="navbar navbar-light border-bottom border-secondary pb-0 mb-2">
            <a class="navbar-brand" href="#">
              <img src="img/index/computer_icon.png" class="d-inline-block align-top" alt="">
              最新上架 / 2F
            </a>
          </nav>
          <div class="row mb-2">
            <div class="col-md-7">
              <div class="card border-0 flex-md-row box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <h5 class="d-inline-block mb-2">Apple MacBook Air系列</h5>
                  <h6 class="mb-5">
                    <a class="text-dark" href="javascript:;">酷睿双核i5处理器|256GB SSD|8GB内存|英特尔HD显卡620含共享显卡内存</a>
                  </h6>
                  <span class="text-primary">¥6988.00</span>
                  <a class="btn btn-primary" href="product_details.html?lid=1">查看详情</a>
                </div>
                <img class="card-img-right flex-auto d-none d-md-block" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" src="img/index/study_computer_img1.png" data-holder-rendered="true">
              </div>
            </div>
            <div class="col-md-5">
              <div class="card border-0 flex-md-row box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <h5 class="d-inline-block mb-2">小米Air 金属超轻薄</h5>
                  <h6 class="mb-5">
                    <a class="text-dark" href="javascript:;">酷睿双核i5处理器|512GB SSD|2GB内存|英特尔HD独立显卡</a>
                  </h6>
                  <span class="text-primary">¥3488.00</span>
                  <a class="btn btn-primary" href="product_details.html?lid=5">查看详情</a>
                </div>
                <img class="card-img-right flex-auto d-none d-md-block mt-5" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" src="img/index/study_computer_img2.png" data-holder-rendered="true">
              </div>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-5">
              <div class="card border-0 flex-md-row box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <h5 class="d-inline-block mb-3">联想E480C 轻薄系列</h5>
                  <span class="text-primary">¥5399.00</span>
                  <a class="btn btn-primary" href="product_details.html?lid=9">查看详情</a>
                </div>
                <img class="card-img-right flex-auto d-none d-md-block mt-5" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" src="img/index/study_computer_img3.png" data-holder-rendered="true">
              </div>
            </div>
            <div class="col-md-7">
              <div class="row pr-3">
                <div class="col-md-4 p-0 pl-2">
                  <div class="card border-0 text-center">
                    <img class="card-img-top" src="img/index/study_computer_img4.png" alt="Card image cap">
                    <div class="card-body p-0 pr-1 pl-1">
                      <span class="d-inline-block">华硕RX310 金属超极本</span>
                      <span class="text-primary small">¥4966.00</span>
                      <a class="btn btn-sm btn-primary" href="product_details.html?lid=13">查看详情</a>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 p-0 pl-2">
                  <div class="card border-0 text-center">
                    <img class="card-img-top" src="img/index/study_computer_img5.png" alt="Card image cap">
                    <div class="card-body p-0 pr-1 pl-1">
                      <span class="d-inline-block">联想小新700 电竞版游戏本</span>
                      <span class="text-primary small">¥6299.00</span>
                      <a class="btn btn-sm btn-primary" href="product_details.html?lid=17">查看详情</a>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 p-0 pl-2">
                  <div class="card border-0 text-center">
                    <img class="card-img-top" src="img/index/study_computer_img3.png" alt="Card image cap">
                    <div class="card-body p-0 pr-1 pl-1">
                      <span class="d-inline-block">戴尔灵越燃7000 轻薄窄边</span>
                      <span class="text-primary small">¥5199.00</span>
                      <a class="btn btn-sm btn-primary" href="product_details.html?lid=19">查看详情</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </h3>
        <h3 class="pb-3">
          <nav class="navbar navbar-light border-bottom border-secondary pb-0 mb-2">
            <a class="navbar-brand" href="#">
              <img src="img/index/computer_icon.png" class="d-inline-block align-top" alt="">
              热销单品 / 3F
            </a>
          </nav>
          <div class="row mb-2">
            <div class="col-md-7">
              <div class="card border-0 flex-md-row box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <h5 class="d-inline-block mb-2">Apple MacBook Air系列</h5>
                  <h6 class="mb-5">
                    <a class="text-dark" href="javascript:;">酷睿双核i5处理器|256GB SSD|8GB内存|英特尔HD显卡620含共享显卡内存</a>
                  </h6>
                  <span class="text-primary">¥6988.00</span>
                  <a class="btn btn-primary" href="product_details.html?lid=1">查看详情</a>
                </div>
                <img class="card-img-right flex-auto d-none d-md-block" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" src="img/index/study_computer_img1.png" data-holder-rendered="true">
              </div>
            </div>
            <div class="col-md-5">
              <div class="card border-0 flex-md-row box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <h5 class="d-inline-block mb-2">小米Air 金属超轻薄</h5>
                  <h6 class="mb-5">
                    <a class="text-dark" href="javascript:;">酷睿双核i5处理器|512GB SSD|2GB内存|英特尔HD独立显卡</a>
                  </h6>
                  <span class="text-primary">¥3488.00</span>
                  <a class="btn btn-primary" href="product_details.html?lid=5">查看详情</a>
                </div>
                <img class="card-img-right flex-auto d-none d-md-block mt-5" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" src="img/index/study_computer_img2.png" data-holder-rendered="true">
              </div>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-5">
              <div class="card border-0 flex-md-row box-shadow h-md-250">
                <div class="card-body d-flex flex-column align-items-start">
                  <h5 class="d-inline-block mb-3">联想E480C 轻薄系列</h5>
                  <span class="text-primary">¥5399.00</span>
                  <a class="btn btn-primary" href="product_details.html?lid=9">查看详情</a>
                </div>
                <img class="card-img-right flex-auto d-none d-md-block mt-5" data-src="holder.js/200x250?theme=thumb" alt="Thumbnail [200x250]" src="img/index/study_computer_img3.png" data-holder-rendered="true">
              </div>
            </div>
            <div class="col-md-7">
              <div class="row pr-3">
                <div class="col-md-4 p-0 pl-2">
                  <div class="card border-0 text-center">
                    <img class="card-img-top" src="img/index/study_computer_img4.png" alt="Card image cap">
                    <div class="card-body p-0 pr-1 pl-1">
                      <span class="d-inline-block">华硕RX310 金属超极本</span>
                      <span class="text-primary small">¥4966.00</span>
                      <a class="btn btn-sm btn-primary" href="product_details.html?lid=13">查看详情</a>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 p-0 pl-2">
                  <div class="card border-0 text-center">
                    <img class="card-img-top" src="img/index/study_computer_img5.png" alt="Card image cap">
                    <div class="card-body p-0 pr-1 pl-1">
                      <span class="d-inline-block">联想小新700 电竞版游戏本</span>
                      <span class="text-primary small">¥6299.00</span>
                      <a class="btn btn-sm btn-primary" href="product_details.html?lid=17">查看详情</a>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 p-0 pl-2">
                  <div class="card border-0 text-center">
                    <img class="card-img-top" src="img/index/study_computer_img3.png" alt="Card image cap">
                    <div class="card-body p-0 pr-1 pl-1">
                      <span class="d-inline-block">戴尔灵越燃7000 轻薄窄边</span>
                      <span class="text-primary small">¥5199.00</span>
                      <a class="btn btn-sm btn-primary" href="product_details.html?lid=19">查看详情</a>
                    </div>
                  </div>
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
  @import url("../assets/css/comm.css");
  @import url("../assets/css/index.css");
</style>


