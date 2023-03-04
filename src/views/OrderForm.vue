<template>
    <div class="OrderForm">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">填写订单</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <van-cell>
            <template #title>
                <div class="tip" @click="">新增</div>
                <van-address-list :list="addresslist" v-model="chosenAddressId" @edit="onEdit" @select="onSelect" />
            </template>
        </van-cell>

        <van-cell-group>
            <van-cell title="当前订单" />
            <van-card v-for="(item, index) in list" :key="index" :price="item.etc.info.price"
                :desc="item.etc.info.author" :title="item.etc.info.name" :thumb="'/resources/' + item.etc.info.img">
                <template #footer>
                    <van-stepper v-model="item.num" theme="round" button-size="22" disab le-input
                        @change="changenum(index)" />
                </template>
            </van-card>
            <van-field v-model="ps" label="订单备注" placeholder="无备注" input-align="right" />

        </van-cell-group>
        <van-submit-bar :price="Cost" button-text="提交订单" @submit="onSubmit" text-align="left" label=" "
            :suffix-label="'共' + Count + '件'" />
    </div>
</template>
<style scoped>
.van-cell h2 {
    word-wrap: break-word;
    width: 100%;
}

.van-card {
    text-align: left;
    background-color: white;
}

.van-cell-group {
    margin: 20px 0;
    padding: 10px;
}

.van-submit-bar__price {
    font-size: 30px;
    font-weight: 700;
}

.van-address-list__bottom {
    display: none;
}

.tip {
    font-size: 24px;
    color: grey;
    text-align: center;
}

.van-address-list {
    padding-bottom: 15px;
}
</style>
<script>
import Header from "@/components/Header.vue"
import { getRequest, postRequest } from "@/api/axios";

export default {
    name: 'OrderForm',
    data: function () {
        return {
            list: [],
            ps: null,
            Cost: 0,
            Count: 0,
            addresslist: [],
            address: {},
            chosenAddressId: null,
        }
    },
    components: {
        Header,
    },
    methods: {
        onSubmit: function () {
            var cartIds = []
            var bookIds = []
            var nums = []
            for (var item of this.list) {
                cartIds.push(item.id)
                bookIds.push(item.etc.info.id)
                nums.push(item.num)
            }
            postRequest("/order/create", { cartIds: cartIds.join(","), totalprice: this.Cost / 100, bookIds: bookIds.join(","), nums: nums.join(","), ps: this.ps, ...this.address }).then((response) => {
                this.$router.replace({ name: 'order' });
            })
        },
        onEdit: function (item) {
            this.$router.push({ name: 'editaddress', params: { address: item } });
        },
        onSelect: function (item) {
            this.address = item
        },
        changenum: function (index) {
            this.updateCost()
        },
        updateCost: function () {
            var cost = 0
            var count = 0
            for (var item of this.list) {
                cost += item.etc.info.price * item.num
                count += item.num
            }
            this.Cost = cost * 100
            this.Count = count
        },
    },
    created: function () {
        getRequest("/cart/getselected").then((response) => {
            this.list = response.data.data
            console.log(response.data.data)
            this.updateCost()
        }).catch((error) => {
        })
        getRequest("/address/list").then((response) => {
            this.addresslist = response.data.data
            this.chosenAddressId = this.addresslist[0].id
            this.address = this.addresslist[0]
        })
    }

}
</script>
  
         