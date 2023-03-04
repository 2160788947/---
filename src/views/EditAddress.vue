<template>
    <div class="Favorite">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">编辑地址</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <van-address-edit show-delete :show-area="false" @save="onSave" @delete="onDelete"
            :address-info="address" />

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
import { Toast } from "vant"

export default {
    name: 'editAddress',
    data: function () {
        return {
            address: {
                ...this.$route.params.address,
                addressDetail: this.$route.params.address.address
            }
        }
    },
    components: {
        Header,
    },
    methods: {
        onSave: function (content) {
            postJsonRequest("/address/update", { id: content.id, name: content.name, address: content.addressDetail, tel: content.tel}).then((response) => {
                Toast("更新成功")
                this.$router.go(-1)
            })
        },
        onDelete: function () {
            console.log(this.address.id)
            postRequest("/address/delete", { addressId: this.address.id }).then((response) => {
                Toast("删除成功")
                this.$router.go(-1)
            })
        }
    },
}
</script>
  