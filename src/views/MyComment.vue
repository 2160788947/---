<template>
    <div class="Favorite">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">我的评论</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <div v-if="list.length == 0" class="tip">暂时没有任何评论,快去评论吧</div>
        <van-swipe-cell v-for="(item, index) in list" :key="index">
            <van-card @click="gotoBook(item.etc.book)" :title="item.etc.book.name"
                :thumb="'resources/' + item.etc.book.img">
                <template #desc>
                    <div>评论:{{ item.comment }}</div>
                </template>
                <template #price>
                    <div v-if="item.additional">追评:{{ item.additional }}</div>
                    <div v-if="!item.additional">追评:无</div>
                </template>
                <template #footer>
                    <van-button v-if="!item.additional" size="mini" plain type="primary" round
                        @click.stop="isCancel = true; Comment = item">追评
                    </van-button>
                </template>
                <template #num>
                    <div>{{ item.createTime }}</div>
                </template>
            </van-card>
            <template #right>
                <van-button square text="删除" type="danger" class="delete-button" @click="del(index)" />
            </template>
        </van-swipe-cell>
        <van-popup v-model="isCancel" round closeable position="bottom" :style="{ height: '50%' }"
            @close="Comment = null; this.additional = null">
            <div v-if="Comment != null">
                <h2 style="color: black;font-weight: 500;text-align: center;">追评</h2>
                <van-card :title="Comment.etc.book.name" :thumb="'/resources/' + Comment.etc.book.img">
                    <template #desc>
                        <van-rate :value="Comment.level" allow-half void-icon="star" void-color="#eee" />
                    </template>
                    <template #price>评论:{{ Comment.comment }}</template>
                </van-card>
                <div class="text">
                    <span>追评:</span>
                    <van-field v-model="additional" rows="5" autosize label="" type="textarea" maxlength="50"
                        placeholder="请输入追评" show-word-limit />
                    <van-button type="danger" round block
                        style="width:90%;margin: 0 auto; position: absolute; bottom: 2%;left: 5%;"
                        :disabled="!additional" @click="submit(Comment.id)">提交
                    </van-button>
                </div>

            </div>
        </van-popup>
    </div>
</template>reason
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

.text {
    margin: 10px 10px;
}

.text>span {
    display: inline-block;
    margin-top: 10px;
    margin-right: 10px;
}
</style>
<script>
// @ is an alias to /src
import { getRequest, postRequest } from "@/api/axios"
import Header from "@/components/Header.vue"
import { Dialog, Toast } from "vant";



export default {
    name: 'Favorite',
    data: function () {
        return {
            list: [],
            isCancel: false,
            Comment: null,
            additional: null,
        }
    },
    components: {
        Header,
    },
    methods: {
        gotoBook: function (book) {
            this.$router.push({ name: 'detail', params: { book } });
        },
        del: function (index) {
            Dialog.confirm({
                message: '确定删除吗？',
            }).then(() => {
                postRequest("/evaluation/delete", { ids: this.list[index].id }).then((response) => {
                    Toast("删除成功")
                    this.list.splice(index, 1)
                }).catch((error) => {
                    Toast("删除失败")
                })
            })
        },
        submit: function (id) {
            postRequest("/evaluation/setAdditional", { id: id, additional: this.additional }).then((response) => {
                Toast.success({
                    message: "追评成功",
                    forbidClick: true,
                    duration: 500,
                    onClose: function () {
                        location.reload()
                    }
                })
                this.isCancel = false
            }).catch((error) => {
            })
        }
    },
    created: function () {
        getRequest("/evaluation/getByUserId").then((response) => {
            console.log(response.data)
            this.list = response.data.data
        })

    }
}
</script>
  