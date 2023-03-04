<template>
    <div class="Login">
        <Header>
            <van-icon @click="$router.go(-1)" class="left-icon" name="arrow-left" color="blue" />
            <div class="title">请注册</div>
            <van-icon name="ellipsis" class="right-icon" color="blue" />
        </Header>
        <div class="body">
            <van-cell-group inset>
                <van-icon name="contact" size="200" style="text-align: center;display: block;" />
                <van-form @submit="onSubmit">
                    <van-field v-model="register.username" name="用户名" label="用户名" placeholder="用户名"
                        :rules="[{ required: true, message: '请填写用户名' }]" />
                    <van-field v-model="register.nickname" name="昵称" label="昵称" placeholder="昵称"
                        :rules="[{ required: true, message: '请填写昵称' }]" />
                    <van-field v-model="register.password" type="password" name="密码" label="密码" placeholder="密码"
                        :rules="[{ required: true, message: '请填写密码' }]" />
                    <van-field v-model="re_password" type="password" name="密码" label="重复密码" placeholder="重复密码"
                        :rules="[{ validator, message: '与密码不符' }]" />
                    <div style="margin: 16px;">
                        <van-button round block type="info" native-type="submit">注册</van-button>
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
import List from "@/components/BookList.vue"
import { postJsonRequest } from "@/api/axios"
import md5 from 'js-md5'

export default {
    name: 'Register',
    data: function () {
        return {
            register: {
                username: '',
                password: '',
                nickname: ''
            },
            re_password: "",
        }
    },
    components: {
        Header,
        List,
    },
    methods: {
        validator(val) {
            return val==this.register.password
        },
        onSubmit: function (values) {
            postJsonRequest('/user/register', {username:this.register.username,password:md5(md5(this.register.password)),nickname:this.register.nickname})
                .then((response) => {
                    this.$store.commit("changeLogin", { token: response.data.data.token });
                    this.$router.push('/');
                    alert('注册成功');
                }).catch((error) => {
                    alert('注册失败,用户名重复');
                    console.log(error);
                })
        },
    },
}
</script>
  