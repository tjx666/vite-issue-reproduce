import Vue from 'vue';
import App from './App.vue';
// @ts-expect-error
import zepto from './zepto';

console.log(zepto);

new Vue({
    render: (h) => h(App),
}).$mount('#app');
