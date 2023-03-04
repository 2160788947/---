<template>
  <div class="detail">
    <Header>
      <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
      <div class="title">{{ detail.name }}</div>
      <van-icon name="ellipsis" class="right-icon" color="blue" />
    </Header>
    <van-tabs scrollspy sticky>
      <van-tab title="商品">
        <van-image fit="contain" :src="'/resources/' + detail.img" v-if="detail.img" style="" />
        <van-cell-group>
          <van-cell>
            <template #title>
              <div class="price">￥{{ detail.price }}</div>
            </template>
            <template #label>
              <div class="name">{{ detail.name }}</div>
              <van-tag type="danger" v-if="detail.etc">{{ detail.etc.category }}</van-tag>
            </template>
            <template #default>

              <div v-if="!isFavor" class="favor" @click="addfavor">
                <van-icon name="like-o" size="25" />
                <div>收藏</div>
              </div>
              <div v-if="isFavor" class="favor" @click="del">
                <van-icon name="like" size="25" color="red" />
                <div>已收藏</div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group>
          <van-cell is-link :url="'/search?key=' + detail.author">
            <template #title>
              <div>作者</div>
              <div class="author">{{ detail.author }}</div>
            </template>
          </van-cell>
          <van-cell is-link :url="'/search?key=' + detail.publisher">
            <template #title>
              <div>出版社</div>
              <div class="publisher">{{ detail.publisher }}</div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="详情">
        <van-cell>
          <h2 style="text-align:center">内容简介</h2>
          <div class="description" v-html="detail.description">
          </div>
        </van-cell>
      </van-tab>
      <van-tab title="评价">
        <van-cell is-link :to="'/comment?bookId=' + detail.id">
          <div>用户评论( {{ evaluation.length }} )</div>
        </van-cell>
        <van-cell v-for="(item, index) in evaluation" :key="index" v-if="index <= 1">
          <div class="evaluation">
            <van-image round width="3rem" height="3rem" src="https://img01.yzcdn.cn/vant/cat.jpeg" fit="cover" />
            <div class="info">
              <div class="time">{{ item.createTime }}</div>
              <div class="nickname">{{ item.etc.nickname }}</div>
              <div class="level">
                <van-rate v-model="item.level" allow-half void-icon="star" void-color="#eee" />
              </div>
            </div>
            <div v-if="item.comment" class="comment">
              {{ item.comment }}
            </div>
            <div v-if="!item.comment" class="comment">
              该用户无评价..
            </div>
          </div>
        </van-cell>
      </van-tab>
    </van-tabs>
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" color="#ee0a24" />
      <van-goods-action-icon icon="cart-o" text="购物车" to="/cart" />
      <van-goods-action-button type="warning" text="加入购物车" @click="additem(detail.id)" />
    </van-goods-action>
  </div>
</template>
<style scoped>
.evaluation {
  text-align: left;
  height: 8rem;
}

.evaluation>.van-image {
  float: left;
  margin: 0.5rem;
  width: 100%;
  height: 100%;
}

.evaluation>.info {
  padding-top: 0.5rem;
}

.info>.time {
  font-size: 13px;
  color: grey;
  float: right;
}

.evaluation>.comment {
  margin-top: 0.7rem;
  font-size: 14px;
  padding: 0.5rem;
  color: grey;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.van-card {
  font-size: 16px;
}

.description {
  white-space: pre-wrap;
  margin: 1em;
  text-align: left;
  font-size: 18px;
  font-weight: 500;
}

.van-image {
  display: block;
  width: 75%;
  margin: 0 auto;
}

.author,
.publisher {
  color: rgb(153, 153, 153)
}

.price {
  color: rgb(224, 5, 5);
  font-size: 24px;
}

.name {
  width: 150%;
  font-size: 18px;
  line-height: 30px;
  color: black;
}

.favor {
  text-align: center;
  margin-left: 70%;
}
</style>
<script>
// @ is an alias to /src
import { getRequest, postRequest } from "@/api/axios"
import Header from "@/components/Header.vue"
import { Toast } from "vant"

export default {
  name: 'BookDetail',
  data: function () {
    return {
      detail: this.$route.params.book,
      isFavor: false,
      evaluation: [],
    }
  },
  components: {
    Header,
  },
  methods: {
    del: function () {
      postRequest("/favor/delete", { bookId: this.detail.id }).then((response) => {
        this.isFavor = false
        Toast("取消收藏")
      })
    },
    addfavor: function () {
      postRequest("/favor/add", { bookId: this.detail.id }).then((response) => {
        this.isFavor = true
        Toast("收藏成功")
      }).catch((error) => {
        this.isFavor = false
        Toast("收藏失败,尚未登录")
      })
    },
    additem: function (bookId) {
      console.log("token:" + localStorage.getItem("token"))
      if (localStorage.getItem("token")) {
        getRequest("/cart/add", { bookId: bookId }).then((response) => {
          console.log(response)
          Toast(response.data.data)
        }).catch((error) => {
          console.log(error)
        })
      } else {
        Dialog.confirm({
          title: '无法加入购物车',
          message: '尚未登录,请前往登录',
        }).then(() => {
          this.$router.push({ name: 'login' });
        })
      }
    }
  },
  mounted: function () {
    getRequest("/favor/isFavor", { bookId: this.detail.id }).then((response) => {
      this.isFavor = true
    }).catch((error) => {
      this.isFavor = false
    })
    getRequest("/evaluation/list", { bookId: this.detail.id }).then((response) => {
      console.log(response.data.data)
      this.evaluation = response.data.data
    })
  }
}
</script>
  