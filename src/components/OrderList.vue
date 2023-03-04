<template>
    <div class="orderlist" :key="update">
        <div v-if="list.length == 0" class="tip">您还没有相关的订单</div>
        <van-cell-group v-for="(order, order_index) in list" :key="order_index">
            <van-cell>
                <template #title>
                    订单编号:{{ order.no }}
                </template>
                <template #label>
                    <van-card v-for="(book, book_index) in order.etc.book" :key="book_index" :price="book.price"
                        :desc="book.author" :title="book.name" :thumb="'/resources/' + book.img"
                        :num="order.etc.nums[book_index]">
                    </van-card>
                    <van-cell title="需付款">
                        <template #default>
                            <div>￥{{ order.totalprice }}</div>
                        </template>
                    </van-cell>
                    <div v-if="order.status == 1">
                        <van-button color="#f9422e" plain round size="small" @click="pay(order)">继续付款</van-button>
                        <van-button plain round size="small" @click="selectReason(order)">取消订单</van-button>
                    </div>
                    <div v-if="order.status == 2" style="text-align:right;font-size: 14px;">
                        正在等待商家发货
                    </div>
                    <div v-if="order.status == 3">
                        <van-button color="#f9422e" plain round size="small" @click="receipt(order)">确认收货
                        </van-button>
                    </div>
                    <div v-if="order.status == 4">
                        <van-button color="#f9422e" plain round size="small" @click="comment1(order)">填写评价
                        </van-button>
                        <van-button plain round size="small" @click="del(order)">删除订单</van-button>
                    </div>
                    <div v-if="order.status == 5" style="text-align:right;font-size: 16px; margin-right: 1rem;">
                        已完成
                    </div>
                    <div v-if="order.status == 6" style="text-align:right;font-size: 16px; margin-right: 1rem;">
                        已取消
                    </div>
                </template>
            </van-cell>
        </van-cell-group>
        <van-popup v-model="isCancel" round closeable position="bottom" :style="{ height: '50%' }"
            @close="Order = null">
            <h2 style="color: black;font-weight: 500;text-align: center;">取消订单</h2>
            <h4 style="color: black;font-weight: 500;margin-left: 10px;">请选择取消订单的原因(必选):</h4>
            <van-radio-group v-model="reasonIndex">
                <van-radio v-for="(reason, index) in reason" :name="index" :key="index">{{ reason }}</van-radio>
            </van-radio-group>
            <van-button type="danger" round block :disabled="reasonIndex == -1"
                style="width:90%;margin: 0 auto; position: absolute; bottom: 2%;left: 5%;" @click="abolish">提交
            </van-button>
        </van-popup>
        <van-popup v-model="isComment" round closeable position="bottom" :style="{ height: '50%' }"
            @close="commentcheck()">
            <div class="book" v-if="Order != null" :key="update">
                <h2 style="color: black;font-weight: 500;text-align: center;">请选择需要评价的书籍</h2>
                <van-card :class="Order.etc.isComment[index] ? 'noclick' : ''" v-for="(book, index) in Order.etc.book"
                    @click="comment2(index)" :key="index" :desc="book.author" :title="book.name"
                    :thumb="'/resources/' + book.img">
                    <template #tags>
                        <van-tag v-if="Order.etc.isComment[index]" plain type="danger">已评价</van-tag>
                    </template>
                </van-card>
                <van-button type="danger" round block
                    style="width:90%;margin: 0 auto; position: absolute; bottom: 2%;left: 5%;" @click="finish">已完成评价
                </van-button>
            </div>
            <div v-if="commentBook != null">
                <van-popup class="comment" v-model="submit" @close="commentBook = null" closeable>
                    <van-card :desc="commentBook.author" :title="commentBook.name"
                        :thumb="'/resources/' + commentBook.img">
                    </van-card>
                    <div class="text">
                        <span>商品评分:</span>
                        <van-rate v-model="Comment.level" allow-half void-icon="star" void-color="#eee" />
                        <br>
                        <span>评价:</span>
                        <van-field v-model="Comment.comment" rows="5" autosize label="" type="textarea" maxlength="50"
                            placeholder="请输入评价" show-word-limit />
                        <van-button type="danger" round block :disabled="Comment.level == 0"
                            style="width:90%;margin: 0 auto; position: absolute; bottom: 2%;left: 5%;"
                            @click="comment3">
                            提交
                        </van-button>
                    </div>

                </van-popup>
            </div>

        </van-popup>
    </div>
</template>
  
<style scoped>
.tip {
    font-size: 24px;
    color: grey;
    line-height: 1000%;
    text-align: center;
}

.van-cell__value {
    color: red;
    font-weight: 500;
    font-size: 24px;
}

.van-cell-group {
    margin: 10px;
}


.van-cell .van-button {
    margin-top: 5px;
    float: right;
    margin-right: 10px;
}

.van-radio {
    margin: 20px 15px;
}

.book {
    margin: 10px;
}

.comment {
    width: 80%;
    padding: 40px 20px;
}

.text {
    margin: 10px 10px;
}

.text>span {
    display: inline-block;
    margin-top: 10px;
    margin-right: 10px;
}

.noclick {
    pointer-events: none;
}
</style>
  
<script>
import { getRequest, postJsonRequest, postRequest } from "@/api/axios";
import { Dialog, Toast } from "vant";

export default {
    name: 'Order',
    data: function () {
        return {
            list: [],
            isCancel: false,
            isComment: false,
            submit: false,
            Order: null,
            bookIndex: null,
            commentBook: null,
            reason: ["不想要了", "商品错选/多选", "地址填写信息有误", "其他"],
            reasonIndex: -1,
            update: false,
            Comment: {
                bookId: null,
                level: 0,
                comment: null,
            }
        }
    },
    props: ["status"],
    methods: {
        del: function (order) {
            Dialog.confirm({
                message: '确定删除吗？',
            }).then(() => {
                postRequest("/order/delete", { id: order.id }).then((response) => {
                    Toast.success({
                        message: "已删除",
                        forbidClick: true,
                        duration: 500,
                        onClose: function () {
                            location.reload()
                        }
                    })
                }).catch((error) => {
                    Toast(error.data)
                })
            })
        },
        selectReason: function (order) {
            Dialog.alert({
                message: '确定取消订单吗?',
                showCancelButton: true,
                confirmButtonText: "取消订单",
                cancelButtonText: "我再想想"
            }).then(() => {
                this.isCancel = true
                this.reasonIndex = -1
                this.Order = order
            })
        },
        abolish: function () {
            this.isCancel = false
            postRequest("/order/cancel", { id: this.Order.id, reason: this.reason[this.reasonIndex] }).then((response) => {
                Toast.success({
                    message: "已取消",
                    forbidClick: true,
                    duration: 500,
                    onClose: function () {
                        location.reload()
                    }
                })
            }).catch((error) => {
                console.log(error)
            })
        },
        pay: function (order) {
            postRequest("/order/pay", { id: order.id }).then((response) => {
                Toast.loading({
                    message: "付款中",
                    forbidClick: true,
                    duration: 500,
                    onClose: function () {
                        location.reload()
                    }
                })
            }).catch((error) => {
            })
        },
        receipt: function (order) {
            postRequest("/order/receipt", { id: order.id }).then((response) => {
                Toast.success({
                    message: "已收货",
                    forbidClick: true,
                    duration: 500,
                    onClose: function () {
                        location.reload()
                    }
                })
            }).catch((error) => {
            })
        },
        finish: function () {
            postRequest("/order/finish", { id: this.Order.id }).then((response) => {
                Toast.success({
                    message: "已评价",
                    forbidClick: true,
                    duration: 500,
                    onClose: function () {
                        location.reload()
                    }
                })
                this.Order = null
            }).catch((error) => {
            })
        },
        comment1: function (order) {
            this.isComment = true
            this.Order = order
            this.update = !this.update
        },
        comment2: function (index) {
            this.submit = true
            this.commentBook = this.Order.etc.book[index]
            this.bookIndex = index
            this.Comment.bookId = this.commentBook.id
        },
        comment3: function () {
            postJsonRequest("/evaluation/add", this.Comment).then((response) => {
                postRequest("/orderitem/updateIsComment", { orderId: this.Order.id, bookId: this.Comment.bookId, isComment: true }).then((response) => {
                    Toast.success({
                        message: "提交成功",
                        forbidClick: true,
                        duration: 500,
                    })
                    this.Comment = {
                        bookId: null,
                        level: 0,
                        comment: null,
                    }
                    this.submit = false
                    this.Order.etc.isComment[this.bookIndex] = true
                })
            }).catch((error) => {
            })
        },
        commentcheck: function () {
            var flag = true
            for (var isComment of this.Order.etc.isComment) {
                if (isComment == false)
                    flag = false
            }
            if (flag) {
                this.finish()
            }
        },
        getByStatus: function () {
            getRequest("/order/userOrder", { status: this.status }).then((response) => {
                this.list = response.data.data
            }).catch((error) => {

            })
        }
    },
    mounted: function () {
        this.getByStatus()
    }
}
</script>
  
