import axios from 'axios'

const noteBaseRequest = axios.create({
    baseURL:'/note'
})