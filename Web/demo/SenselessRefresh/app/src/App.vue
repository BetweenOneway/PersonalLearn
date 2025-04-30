<script setup>
import { login, getList } from "./apis/login"
import { setAccessToken, setRefershToken } from "./config/storage"
const getToken = () => {
  login().then(res => {
    setAccessToken(res.data.accessToken)
    setRefershToken(res.data.refershToken)
  })
}

const getData = () => {
  getList()
}
</script>

<template>
  <button @click="getToken">登录</button>
  <button @click="getData">请求数据</button>
</template>

<style scoped></style>
