<template>
    <div class="list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-card v-for="(book, index) in list" @click="gotoBook(book)" :key="index" :price="book.price"
                :desc="book.author" :title="book.name" :thumb="'/resources/' + book.img">
                <template #tags>
                    <van-tag type="danger">{{ book.etc.category }}</van-tag>
                </template>
                <template #footer>
                    <van-button size="danger">
                        <van-icon name="cart" @click.stop="additem(book.id)" />
                    </van-button>
                </template>
            </van-card>
        </van-list>
        <!-- <van-card v-for="(book, index) in list" @click="gotoBook(book)" :key="index" :price="book.price"
            :desc="book.author" :title="book.name" :thumb="'/resources/' + book.img">
            <template #tags>
                <van-tag type="danger">{{ book.etc.category }}</van-tag>
            </template>
            <template #footer>
                <van-button size="danger">
                    <van-icon name="cart" @click.stop="additem(book.id)" />
                </van-button>
            </template>
        </van-card> -->
    </div>
</template>
  
<script>
import { getRequest } from '@/api/axios'
import { Dialog, Toast } from 'vant';

export default {
    name: 'booklist',
    data: function () {
        return {
            list: [],
            loading: false,
            finished: false,
            pageNum: 0,
            pageSize: 7,
            total: 0
        }
    },
    props: ["category", "search"],
    methods: {
        onLoad: function () {
            this.pageNum++;
            getRequest("/book/page", { pageNum: this.pageNum, pageSize: this.pageSize, CategoryId: this.category, key: this.search }).then((response) => {
                this.list.push(...response.data.data)
                this.loading = false
                this.total = response.data.etc.total
                if (this.list.length >= this.total) {
                    this.finished = true;
                }
            }).catch((error) => {
                this.finished = true;
            })
        },
        gotoBook: function (book) {
            this.$router.push({ name: 'detail', params: { book } });
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
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.van-button {
    height: 25px;
    width: 25px;
}

.van-card {
    text-align: left;
    margin-top: 10px;
    background-color: white;
}
</style>
  