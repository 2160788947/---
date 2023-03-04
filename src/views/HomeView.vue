<template>
  <div class="home">
    <Header>
      <van-search v-model="search" placeholder="商品搜索" @search="onSearch" />
    </Header>
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
    <van-grid :column-num="3" :gutter="10">
      <van-grid-item v-for="(category, index) in categorys" :key="index" icon="orders-o" :text="category.name"
        @click="selected = category.id" />
    </van-grid>
    <List :category="selected" :key="selected"></List>
  </div>
</template>
<style scoped>
img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.van-swipe {
  text-align: center;
}
</style>
<script>
// @ is an alias to /src
import Header from "@/components/Header.vue"
import List from "@/components/BookList.vue"
import { getRequest } from "@/api/axios"
export default {
  name: 'HomeView',
  data: function () {
    return {
      search: "",
      images: [
        "/resources/slider/1.jpg",
        "/resources/slider/2.jpg",
        "/resources/slider/3.jpg",
        "/resources/slider/4.jpg",
        "/resources/slider/5.jpg",
      ],
      categorys: [{ id: 0, name: "全部" }],
      selected: 0,
    }
  },
  components: {
    Header,
    List,
  },
  methods: {
    onSearch: function (key) {
      this.$router.push({ path: '/search?key=' + key })
    },
  },
  created: function () {
    getRequest("/category/list").then((response) => {
      this.categorys.push(...response.data.data);
    })
  }
}
</script>
