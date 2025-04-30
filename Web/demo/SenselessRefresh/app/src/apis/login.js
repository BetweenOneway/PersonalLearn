import server from "../utils/server";

export const login = () => {

    return server({
        url: '/login',
        method: 'get'
    })

}

export const getList = () => {

    return server({
        url: '/getList',
        method: 'get'

    })

}