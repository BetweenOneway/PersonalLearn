const likeApi = {
    toggleLike: {
        name: '点赞/取消点赞',
        url: '/like/toggle',
        method: 'POST',
        userAuth: true,
        dataParam: false,
        successMessage: false
    },
    checkLike: {
        name: '检查是否已点赞',
        url: '/like/checkLike',
        method: 'GET',
        //需携带登录用户身份才能查询"当前用户"的点赞状态，未登录则不发起此请求
        userAuth: true,
        dataParam: false,
        successMessage: false
    },
    getLikeCount: {
        name: '获取点赞数',
        url: '/like/getLikeCount',
        method: 'GET',
        userAuth: false,
        dataParam: false,
        successMessage: false
    }
}

const collectApi = {
    toggleCollect: {
        name: '收藏/取消收藏',
        url: '/favorite/toggle',
        method: 'POST',
        userAuth: true,
        dataParam: false,
        successMessage: false
    },
    checkFavourite: {
        name: '检查是否已收藏',
        url: '/favorite/checkFavorite',
        method: 'GET',
        //需携带登录用户身份才能查询"当前用户"的收藏状态，未登录则不发起此请求
        userAuth: true,
        dataParam: false,
        successMessage: false
    },
    getCollectCount: {
        name: '获取收藏数',
        url: '/favorite/getCollectCount',
        method: 'GET',
        userAuth: false,
        dataParam: false,
        successMessage: false
    }
}

const commentApi = {
    getCommentCount: {
        name: '获取评论数',
        url: '/comment/getCommentCount',
        method: 'GET',
        userAuth: false,
        dataParam: false,
        successMessage: false
    },
    getCommentList: {
        name: '获取评论列表',
        url: '/comment/getCommentList',
        method: 'GET',
        userAuth: false,
        dataParam: false,
        successMessage: false
    },
    addComment: {
        name: '发表评论',
        url: '/comment/addComment',
        method: 'POST',
        userAuth: true,
        dataParam: false,
        successMessage: false
    }
}

const subscribeApi = {
    toggleSubscribe: {
        name: '订阅/取消订阅',
        url: '/subscribe/toggle',
        method: 'POST',
        userAuth: true,
        dataParam: false,
        successMessage: false
    },
    checkSubscribe: {
        name: '检查是否已订阅',
        url: '/subscribe/checkSubscribe',
        method: 'GET',
        // 需携带登录用户身份才能查询"当前用户"的订阅状态，未登录则不发起此请求
        userAuth: true,
        dataParam: false,
        successMessage: false
    },
    getSubscribeCount: {
        name: '获取订阅数（粉丝数）',
        url: '/subscribe/getSubscribeCount',
        method: 'GET',
        userAuth: false,
        dataParam: false,
        successMessage: false
    }
}

export { likeApi, collectApi, commentApi, subscribeApi }
export default { likeApi, collectApi, commentApi, subscribeApi }