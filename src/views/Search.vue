<template>
    <div class="search">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">搜索</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <h2 style="text-align: center"><span style="color:red">{{ key }}</span>的搜索结果:</h2>
        <List :category="selected" :search="key" :key="selected"></List>
    </div>
</template>
<script>
import Header from "@/components/Header.vue"
import List from "@/components/BookList.vue"

export default {
    name: 'Search',
    data: function () {
        return {
            selected:0,
            key:this.$route.query.key,
        }
    },
    components: {
        Header,
        List,
    },
}
</script>
  