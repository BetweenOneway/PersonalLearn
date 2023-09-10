<template>
  <div>
    <my-header></my-header>
    <main id="main" class="container">
      <div class="pb-2 text-center">
        <img class="d-block mx-auto mb-4 w-100" src="img/index/index_guild.png">
      </div>
      <div class="row">
        <div class="col-md-9">
          <h5 class="mb-3 p-2 text-muted">笔记本电脑</h5>
          <div id="plist" class="row bg-white ml-1 mr-1 pt-2 pl-2">
            <div v-for="(p,i) of products" :key="i" class="col-md-4 p-1">
              <div class="card mb-4 box-shadow pr-2 pl-2">
                <router-link :to="`/details/${p.lid}`">
                  <img class="card-img-top" :src="p.md">
                </router-link>
                <div class="card-body p-0">
                  <h5 class="text-primary">￥{{p.price.toFixed(2)}}</h5>
                  <p class="card-text">
                    <router-link :to="`/details/${p.lid}`" class="text-muted small" v-text="p.title"></router-link>
                  </p>
                  <div class="d-flex justify-content-between align-items-center p-2 pt-0">
                    <button class="btn btn-outline-secondary p-0 border-0" type="button">-</button>
                    <input type="text" class="form-control p-1" value="10">
                    <button class="btn btn-outline-secondary p-0 border-0" type="button">+</button>
                    <a class="btn btn-primary float-right ml-1 pl-1 pr-1" href="cart.html">加入购物车</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h6 class="mb-3 p-2 text-muted small">
            <nav aria-label="Page navigation example">
              <ul class="pagination mb-0 justify-content-end">
                <li class="page-item" :class="{disabled:pno==0}"><a class="page-link bg-transparent" href="javascript:;" @click="change(-1, $event)">上一页</a></li>
                <li v-for="i of pcount" :key="i" class="page-item" :class="{active:i-1==pno}"><a class="page-link" :class="i-1==pno?'border':'bg-transparent'" href="javascript:;" v-text="i" @click="changepage(i-1)"></a></li>
                <li class="page-item" :class="{disabled:pno==pcount-1}"><a class="page-link bg-transparent" href="javascript:;" @click="change(+1, $event)">下一页</a></li>
              </ul>
            </nav>
          </h6>
        </div>
        <div class="col-md-3 pl-0">
          <h5 class="justify-content-between align-items-center mb-1 text-muted p-2">
            <img src="img/foodstore/foodstore_icon2.png" alt=""> 商家公告
          </h5>
          <div class="bg-white small p-4 text-muted mb-3">
            <p>本店推出全网最低价套餐，保证比其他平台的价格要低！</p>
            <p>不要葱、姜、蒜等这些忌口暂时无法坐不了，敬请谅解！</p>
            <p>晚上10点以后订餐需另加送餐费2元！谢谢合作！</p>
          </div>
          <ul id="cart" class="list-group mb-3">
          <!-- <ul id="cart" class="list-group mb-3 position-fixed"> -->
            <li class="p-0 list-group-item d-flex justify-content-between lh-condensed">
              <h6 class="w-100 d-flex justify-content-between align-items-center mb-0 text-muted p-2 "> 购物车<a class="btn btn-link text-muted" href="#">清空</a>
              </h6>
            </li>
            <li class="p-0 list-group-item d-flex justify-content-between lh-condensed">
              <div class="input-group input-group-sm mt-1 mb-1">
                <div class="input-group-prepend">
                  <span class="input-group-text text-truncate bg-white p-1 border-0 d-inline-block" title="戴尔DELL灵越游匣15PR-5645B 15.6英寸游戏笔记本电脑(i5-7300HQ 8G 128GSSD+1T GTX1050 4G独显 FHD)黑">戴尔DELL灵越游匣15PR-5645B 15.6英寸游戏笔记本电脑(i5-7300HQ 8G 128GSSD+1T GTX1050 4G独显 FHD)黑</span>
                  <button class="btn btn-outline-secondary p-0 border-0" type="button">-</button>
                </div>
                <input type="text" class="form-control p-1" aria-label="Small" value="10" aria-describedby="inputGroup-sizing-sm">
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary p-0 border-0" type="button">+</button>
                  <span class="input-group-text bg-white border-0 p-0 pl-1">¥59990.00</span>
                </div>
              </div>
            </li>
            <li class="p-0 list-group-item d-flex justify-content-between lh-condensed">
              <div class="input-group input-group-sm mt-1 mb-1">
                <div class="input-group-prepend">
                  <span class="input-group-text text-truncate bg-white p-1 border-0 d-inline-block" title="Apple MacBook Air 13.3英寸笔记本 银色(Core i5 处理器/8GB内存/256GB SSD闪存 MMGG2CH/A)">Apple MacBook Air 13.3英寸笔记本 银色(Core i5 处理器/8GB内存/256GB SSD闪存 MMGG2CH/A)</span>
                  <button class="btn btn-outline-secondary p-0 border-0" type="button">-</button>
                </div>
                <input type="text" class="form-control p-1" aria-label="Small" value="10" aria-describedby="inputGroup-sizing-sm">
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary p-0 border-0" type="button">+</button>
                  <span class="input-group-text bg-white border-0 p-0 pl-1">¥69880.00</span>
                </div>
              </div>
            </li>
            <li class="p-0 list-group-item bg-secondary text-right">
              <img class="mb-2" src="img/foodstore/foodstore_car_2.png" alt="">
              <h4 class="d-inline-block text-white pt-2 m-0">￥129870.00</h4>
              <a class="btn btn-lg btn-primary float-right ml-1 pl-0 pr-0" href="cart.html">去结算</a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data(){
    return {
      pno:0, //当前第几页
      pcount:0, //共几页
      products:[] //本次返回的商品列表
    }
  },
  props:["kw"], //自动接收地址栏关键词参数kw作为查询条件
  methods:{
    //点击上一页或下一页按钮，获得-1或+1，和事件对象
    change(n,e){
      //如果当前按钮上没有class disabled
      if(e.target.className.indexOf("disabled")==-1){
        //才调用翻页的函数，传入当前页面+1或-1后的新页码
        this.changepage(parseInt(this.pno)+parseInt(n));
      }
    },
    //专门翻页到指定页码i，然后重新ajax请求服务端指定页码的数据
    changepage(i){
      console.log(i);
      this.load(i);//重新请求第i页的数据
    },
    //重新用查询条件kw查询第i页的数据，如果没给页码，默认查询第0页
    load(pno=0){//今后，无论做什么前端程序(PC端网页， 移动端app，小程序，都要先封装调用服务端接口获取数据的函数)
      this.axios.get(
        "/products",
        {
          params:{//服务端接口需要两个参数
            kw:this.kw, //查询关键词
            pno//pno:pno //要查询第几页
          }
        }
      ).then(result=>{
        console.log(result.data);
        //服务端返回页码，包含多个商品对象的数组和总页数，保存到data中用于绑定。
        this.pno=result.data.pno;
        this.products=result.data.data;
        this.pcount=result.data.pageCount;
      })
    }
  },
  created(){//当前组件创建完，立刻自动发送ajax请求，请求第一页的查询结果
    this.load()
  },
  watch:{
    kw(){//监控地址栏变化，只要地址栏关键词发生变化，就自动重新查找。
      this.load();
    }
  }
}
</script>
<style scoped>
  /*定制小购物车部分样式*/
  #main>div.row>div>h5, #main>div.row>div>h6, #cart>li:first-child>h6{
    background:linear-gradient(to bottom,#f0f0f0,#e0e0e0);
  }
  #cart .input-group-text{
    width:90px;
  }
  #cart input.form-control{
    width:25px!important;
    flex:none;
  }
  #cart .input-group .btn, #plist button.btn{
    width:20px;
    background:linear-gradient(to bottom,#f0f0f0,#e0e0e0);
  }
  #cart .input-group-append>.input-group-text{
    width:80px;
  }
  #cart.position-fixed{
    top:100px; right:100px
  }

  /*定制商品列表部分的样式*/
  /*#plist button.btn{
  }*/
  #plist input.form-control{
    width:30px;
  }
  #plist+h6 .page-link{
    border-color:#bbb
  }
  #plist+h6 .page-link:hover{
    border-color:#007bff;
  }
  #plist+h6 .page-item.disabled{
    opacity:0.5;
  }
</style>