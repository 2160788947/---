<template>
    <div class="Favorite">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">我的地址</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <div v-if="list.length == 0" class="tip">没有任何地址,请添加</div>
        <van-address-list :list="list" @add="onAdd" @edit="onEdit" :switchable="false" />
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

.tip {
    font-size: 24px;
    color: grey;
    line-height: 1000%;
    text-align: center;
}
</style>
<script>
// @ is an alias to /src
import { getRequest, postRequest } from "@/api/axios"
import Header from "@/components/Header.vue"
import { Dialog, Toast } from "vant";



export default {
    name: 'Address',
    data: function () {
        return {
            list: [],
        }
    },
    components: {
        Header,
    },
    methods: {
        onAdd: function () {
            this.$router.push({ name: 'addaddress' });
        },
        onEdit: function (item) {
            this.$router.push({ name: 'editaddress', params: {address:item} });
        }
    },
    created: function () {
        getRequest("/address/list").then((response) => {
            this.list = response.data.data
        })
    }
}
</script>
  