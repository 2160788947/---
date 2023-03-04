<template>
  <div id="app">
    <router-view />
    <nav>
      <van-tabbar route v-if="$route.meta.isShow">
        <van-tabbar-item replace to="/" icon="home-o">主页</van-tabbar-item>
        <van-tabbar-item replace to="/cart" icon="cart-o">购物车</van-tabbar-item>
        <van-tabbar-item replace to="/my" icon="manager">我的信息</van-tabbar-item>
      </van-tabbar>
    </nav>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

</style>
