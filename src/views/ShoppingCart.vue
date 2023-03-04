<template>
  <div class="cart">
    <Header>
      <div class="title">购物车</div>
      <div class="right-icon">管理</div>
    </Header>
    <van-notice-bar mode="closeable" v-if="!token">当前未登录<a href="/login">点击此处进行登录</a></van-notice-bar>
    <div v-if="list.length == 0" class="tip">当前购物车为空,快去添加商品吧</div>
    <van-checkbox-group ref="checkboxGroup" v-model="result" :key="change">
      <van-card v-for="(item, index) in list" :key="index" :price="item.etc.info.price" :desc="item.etc.info.author"
        :title="item.etc.info.name" :thumb="'/resources/' + item.etc.info.img">
        <template #tags>
          <van-icon class="delete" name="delete-o" size="20px" @click="deleteitem(index)" />
        </template>
        <template #footer>
          <van-stepper v-model="item.num" theme="round" button-size="22" disab le-input @change="changenum(index)" />
        </template>
        <template #tag>
          <van-checkbox :name="index" @click="updateSelected(index), updateCost" />
        </template>
      </van-card>
    </van-checkbox-group>
    <van-submit-bar button-text="去结算" :price="Cost" @submit="onSubmit">
      <van-checkbox v-model="selectall" @click="toggleAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>
<style scoped>
.van-card {
  text-align: left;
  padding-left: 3em;
  background-color: white;
  margin-top: 10px;
}

.right-icon{
  line-height: 24px;
}

.delete {
  position: absolute;
  right: 0;
  top: 20%;
}

.van-submit-bar {
  position: fixed;
  height: 50px;
  bottom: 50px;
  z-index: 1;
}

.van-card__tag {
  position: absolute;
  left: -20%;
  margin-top: 30%;
}

.tip {
  font-size: 24px;
  color: grey;
  line-height: 1000%;
  text-align: center;
}
</style>
<script>

import { getRequest, postRequest } from "@/api/axios";
import Header from "@/components/Header.vue"
import { Toast } from "vant";

export default {
  name: 'ShoppingCart',
  data: function () {
    return {
      list: [],
      result: [],
      Cost: 0,
      selectall: false,
      change: false,
      token: null,
    }
  },
  components: {
    Header,
  },
  methods: {
    onSubmit: function () {
      if (this.list.length == 0) {
        Toast("当前购物车为空,快去添加商品吧")
      }
      else if (this.result.length == 0) {
        Toast("当前未选中任何商品,请选择")
      } else {
        this.$router.push({ name: 'orderform' });
      }
    },
    deleteitem: function (index) {
      postRequest("/cart/deleteById", { id: this.list[index].id }).then((response) => {
      })
      var result_index = this.result.findIndex(item => item == index)
      for (var i in this.result) {
        if (this.result[i] > index)
          this.result[i]--
      }
      if (result_index != -1)
        this.result.splice(result_index, 1)
      this.change = !this.change
      this.list.splice(index, 1)
      this.updateCost()
    },
    changenum: function (index) {
      getRequest("/cart/updateNum", { id: this.list[index].id, num: this.list[index].num }).then((response) => {
      })
      this.updateCost()
    },
    updateCost: function () {
      var cost = 0
      for (var index of this.result) {
        cost += this.list[index].etc.info.price * this.list[index].num
      }
      this.Cost = cost * 100
    },
    updateSelected: function (index) {
      this.list[index].selected = !this.list[index].selected
      getRequest("/cart/updateSelectedById", { id: this.list[index].id, selected: this.list[index].selected }).then((response) => {
      })
      this.updateCost()
    },
    toggleAll() {
      this.$refs.checkboxGroup.toggleAll(this.selectall);
      var arr = []
      for (var item of this.list) {
        arr.push(item.id)
      }
      getRequest("/cart/updateSelectedByIds", { ids: arr.join(","), selected: this.selectall }).then((response) => {
      })
      this.updateCost()
    },
  },
  created: function () {
    this.token = localStorage.getItem('token')
    getRequest("/cart/list").then((response) => {
      this.list = response.data.data
      for (var index in this.list) {
        if (this.list[index].selected) {
          this.result.push(parseInt(index))
        }
      }
      this.updateCost()
    }).catch((error) => {
    })
  }
}
</script>
    