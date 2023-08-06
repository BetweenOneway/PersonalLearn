Vue.component("my-header",{
    template:`<header>
        <h1 style="text-align:center;"></h1>
        <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/login">登录</router-link></li>
        </ul>
        <hr>
    </header>`
});