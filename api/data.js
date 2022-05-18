import axios from "./axios";

export const getMemu = (param) => {
    return axios.request({
        url: '/permission/getMenu',
        method: 'post',
        data: param
    })
}

export const getData = (param) => {
    return axios.request({
        url: '/home/getData',
    })
}

export const getUser = (params) => {
    return axios.request({
        url: '/user/getUser',
        method: "get",
        params
    })
}