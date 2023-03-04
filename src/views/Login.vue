<template>
    <div class="login">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">请登录</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <div class="body">
            <van-cell-group inset>
                <van-icon name="contact" size="200" style="text-align: center;display: block;" />
                <van-form @submit="onSubmit">
                    <van-field v-model="login.username" name="username" label="用户名" placeholder="用户名"
                        :rules="[{ required: true, message: '请填写用户名' }]" />
                    <van-field v-model="login.password" type="password" name="password" label="密码" placeholder="密码"
                        :rules="[{ required: true, message: '请填写密码' }]" />
                    <div style="margin: 16px;">
                        <van-button round block type="info" native-type="submit">登录</van-button>
                    </div>
                </van-form>
            </van-cell-group>
        </div>
    </div>
</template>
<style scoped>
.van-button {
    width: 50%;
    margin: auto;
}

.body {
    padding: 10% 0;
}

.van-cell-group {
    padding: 20% 0;
}
</style>
<script>
import Header from "@/components/Header.vue"
import { postJsonRequest } from "@/api/axios"
import { Toast } from "vant"
import md5 from 'js-md5';

export default {
    name: 'Login',
    data: function () {
        return {
            login: {
                username: '',
                password: '',
            },
        }
    },
    components: {
        Header,
    },
    methods: {
        onSubmit: function (values) {
            postJsonRequest('/user/userLogin', { username: this.login.username, password: md5(md5(this.login.password)) })
                .then((response) => {
                    this.$store.commit("changeLogin", { token: response.data.data.token });
                    this.$router.push('/');
                    Toast('登录成功');
                }).catch((error) => {
                    Toast('登录失败,账号或密码错误');
                    console.log(error);
                })
        },
    },
}
</script>
  