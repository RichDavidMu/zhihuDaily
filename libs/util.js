import axios from 'axios';

const Util = {
    imgPath: 'http://127.0.0.1:8011/img/',
    apiPath: 'http://127.0.0.1:8010/',
    sectionPath:'http://127.0.0.1:8012/',
    storiesPath:'http://127.0.0.1:8013/'
};

// 获取今天时间戳
Util.getTodayTime = function () {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
};

// 获取上一天日期
Util.prevDay = function (timestamp = (new Date()).getTime()) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const day = date.getDate() < 10
        ? '0' + date.getDate()
        : date.getDate();
    return year + '' + month + '' + day;
};

// Ajax 通用配置
Util.ajaxDaily = axios.create({
    baseURL: Util.apiPath
});
Util.ajaxSection = axios.create({
    baseURL: Util.sectionPath
});
Util.ajaxStories = axios.create({
    baseURL:Util.storiesPath
})

// 添加响应拦截器
Util.ajaxDaily.interceptors.response.use(res => {
    return res.data;
});
Util.ajaxSection.interceptors.response.use(res => {
    return res.data;
});
Util.ajaxStories.interceptors.response.use(res => {
    return res.data;
});
export default Util;
