<template>
    <div class="my">
        <Header>
            <div class="title">我的信息</div>
        </Header>
        <div>
            <div v-if="user">
                <div class="info">
                    <van-image width="80" height="80" src="https://img01.yzcdn.cn/vant/cat.jpeg" fit="cover"
                        class="avatar" />
                    <div class="name">
                        <h1>{{ user.nickname }}</h1>
                        <span>账号:{{ user.username }}</span>
                    </div>
                </div>
                <van-cell-group inset>
                    <van-cell title="我的订单" is-link to="/order">
                        全部
                    </van-cell>
                    <van-grid :column-num="5">
                        <van-grid-item icon="credit-pay" text="待付款" to="/order?active=0"/>
                        <van-grid-item icon="send-gift-o" text="待发货" to="/order?active=1"/>
                        <van-grid-item icon="logistics" text="待收货" to="/order?active=3"/>
                        <van-grid-item icon="chat-o" text="待评价" to="/order?active=4"/>
                        <van-grid-item icon="after-sale" text="退款" />
                    </van-grid>
                </van-cell-group>
                <van-divider />
                <van-cell-group inset>
                    <van-cell title="我的地址" is-link to="/myaddress" />
                </van-cell-group>
                <van-cell-group inset>
                    <van-cell title="我的收藏" is-link to="/myfavorite" />
                </van-cell-group>
                <van-cell-group inset>
                    <van-cell title="我的评论" is-link to="/mycomment" />
                </van-cell-group>
                <van-divider />
                <van-cell-group inset>
                    <van-cell title="退出" center @click="quit" />
                </van-cell-group>
            </div>
            <div v-if="!user">
                <div class="info">
                    <van-image width="80" height="80" src="" fit="cover" class="avatar" />
                    <div class="name">
                        <h1>未登录</h1>
                        <span>&nbsp;</span>
                    </div>
                </div>
                <van-cell-group inset>
                    <van-cell title="点击登录" center to="/login" />
                    <van-cell title="注册账号" center to="/register" />
                </van-cell-group>

            </div>
        </div>
    </div>
</template>
<style scoped>
.info {
    height: 80%;
    padding: 20px 40px;
    background-color: white;
    text-align: left;
    margin-bottom: 20px;
}

.avatar {
    display: inline-block;
}

.avatar img {
    border-radius: 5px;
}


.name {
    margin-left: 20px;
    text-align: left;
    display: inline-block;
}

.name h1 {
    margin-top: 0;
}
</style>
<script>
import Header from "@/components/Header.vue"
import List from "@/components/BookList.vue"
import { getRequest } from "@/api/axios"


export default {
    name: 'MyDetail',
    data: function () {
        return {
            user: null
        }
    },
    components: {
        Header,
        List,
    },
    methods: {
        quit: function () {
            localStorage.removeItem('token');
            this.user = null
            // this.$route.go(0)
        }
    },
    mounted: function () {
        var token = localStorage.getItem('token')
        if (token) {
            getRequest("/user/person").then((response) => {
                this.user = response.data.data
                console.log(this.user)
            })
        }
    }
}
</script>
  