
import Vue from 'vue'
import App from './app'
import router from './router'
import element from './element/index'
Vue.use(element)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')