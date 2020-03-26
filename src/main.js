import Vue from 'vue'
import App from './app'
import './css/style.css'
new Vue({
    el:'#app',
    render: h=>{
        return h(App)
    }
});
