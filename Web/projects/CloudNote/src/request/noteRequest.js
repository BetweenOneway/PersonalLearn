import axios from 'axios'
import qs from 'qs'

export const noteBaseRequest = axios.create({
    baseURL:'/note-server',
    transformRequest:[(data,headers)=>{
        return qs.stringify(data)
    }]
})