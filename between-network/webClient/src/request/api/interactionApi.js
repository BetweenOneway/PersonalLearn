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
        //点赞不要求强制登录，未登录则默认显示未点赞
        userAuth: false,
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
        userAuth: false,
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
    }
}

export { likeApi, collectApi, commentApi }
export default { likeApi, collectApi, commentApi }