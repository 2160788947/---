<template>
    <div class="Comment">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">评论</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <van-cell v-for="(item, index) in evaluation" :key="index">
            <div class="evaluation">
                <van-image round width="3rem" height="3rem" src="https://img01.yzcdn.cn/vant/cat.jpeg" fit="cover" />
                <div class="info">
                    <div class="time">{{ item.createTime }}</div>
                    <div class="nickname">{{ item.etc.nickname }}</div>
                    <div class="level">
                        <van-rate v-model="item.level" allow-half void-icon="star" void-color="#eee" />
                    </div>
                </div>
                <div v-if="item.comment" class="comment">
                    {{ item.comment }}
                </div>
                <div v-if="!item.comment" class="comment">
                    该用户无评价..
                </div>
            </div>
        </van-cell>
    </div>
</template>
<style scoped>
.evaluation {
    text-align: left;
    height: 8rem;
}

.evaluation>.van-image {
    float: left;
    margin: 0.5rem;
    width: 100%;
    height: 100%;
}

.evaluation>.info {
    padding-top: 0.5rem;
}

.info>.time {
    font-size: 13px;
    color: grey;
    float: right;
}

.evaluation>.comment {
    margin-top: 0.7rem;
    font-size: 14px;
    padding: 0.5rem;
    color: grey;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.van-card {
    font-size: 16px;
}
</style>
<script>
// @ is an alias to /src
import { getRequest, postRequest } from "@/api/axios"
import Header from "@/components/Header.vue"
import { Toast } from "vant"

export default {
    name: 'Comment',
    data: function () {
        return {
            evaluation: [],
        }
    },
    components: {
        Header,
    },
    methods: {

    },
    mounted: function () {
        getRequest("/evaluation/list", { bookId: this.$route.query.bookId }).then((response) => {
            console.log(response.data.data)
            this.evaluation = response.data.data
        })
    }
}
</script>
    