<template>
    <div class="Favorite">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">我的收藏</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <div v-if="list.length == 0" class="tip">没有收藏任何书籍,再去逛逛吧</div>
        <van-swipe-cell v-for="(book, index) in list" :key="index">
            <van-card @click="gotoBook(book)" :price="book.price" :desc="book.author" :title="book.name"
                :thumb="'resources/' + book.img">
                <template #tags>
                    <van-tag type="danger">{{ book.etc.category }}</van-tag>
                </template>
            </van-card>
            <template #right>
                <van-button square text="删除" type="danger" class="delete-button" @click="del(index)" />
            </template>
        </van-swipe-cell>

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
    name: 'Favorite',
    data: function () {
        return {
            list: [],

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
                postRequest("/favor/delete", { bookId: this.list[index].id }).then((response) => {
                    Toast("删除成功")
                    this.list.splice(index, 1)
                }).catch((error) => {
                    Toast("删除失败")
                })
            })
        }
    },
    created: function () {
        getRequest("/favor/list").then((response) => {
            this.list = response.data.data
        })

    }
}
</script>
  