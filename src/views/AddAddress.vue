<template>
    <div class="Favorite">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">新增地址</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <van-address-edit :show-area="false" @save="onSave" />

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
import { getRequest, postJsonRequest, postRequest } from "@/api/axios"
import Header from "@/components/Header.vue"
import { Dialog, Toast } from "vant";



export default {
    name: 'addAddress',
    data: function () {
        return {
        }
    },
    components: {
        Header,
    },
    methods: {
        onSave: function (content) {
            console.log(content)
            postJsonRequest("/address/add", { name: content.name, address: content.addressDetail, tel: content.tel }).then((response) => {
                this.$router.go(-1)
                Toast("新增成功")
            })
        }
    },
}
</script>
  