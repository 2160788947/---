<template>
    <div class="Order">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">我的订单</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <van-tabs v-model="active">
            <van-tab title="全部" to="/order?active=0" replace />
            <van-tab title="待付款" to="/order?active=1" replace />
            <van-tab title="待发货" to="/order?active=2" replace />
            <van-tab title="待收货" to="/order?active=3" replace />
            <van-tab title="待评价" to="/order?active=4" replace />
        </van-tabs>
        <OrderList :status="active" :key="active"></OrderList>
    </div>
</template>
<style scoped>
.van-card {
    text-align: left;
    margin-top: 10px;
    background-color: white;
}

.delete-button {
    height: 100%;
}
</style>
<script>
// @ is an alias to /src
import { getRequest } from "@/api/axios"
import Header from "@/components/Header.vue"
import OrderList from "@/components/OrderList.vue"

export default {
    name: 'Order',
    data: function () {
        return {
            active: this.$route.query.active != null ? parseInt(this.$route.query.active) : 0,
        }
    },
    components: {
        Header,
        OrderList
    },
    methods: {

    }
}
</script>
  