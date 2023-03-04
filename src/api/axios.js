import axios from 'axios'


axios.defaults.timeout = 5000;

const base_url="http://localhost:8090/bookstore"

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers.token = localStorage.getItem('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });

axios.interceptors.response.use(
    config => {
        if (localStorage.getItem('token') && config.data.statusCode == 600) {
            localStorage.removeItem('token')
            return config;
        }
        if (config.data.statusCode != 200)
            return Promise.reject(config.data);
        return config;
    },
    error => {
        return Promise.reject(error);
    });

export function getRequest(url, params) {
    let token = localStorage.getItem('token')
    return axios({
        method: "get",
        url: base_url + url,
        params: params,
    })
}
export function postRequest(url, params) {
    let token = localStorage.getItem('token')
    return axios({
        method: "post",
        url: base_url + url,
        params: params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
}
export function postJsonRequest(url, params) {
    let token = localStorage.getItem('token')
    return axios({
        method: "post",
        url: base_url + url,
        data: params,
        headers: {
            "Content-Type": "application/json",
        }
    })
}