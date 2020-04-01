// import Vue from 'vue';
import { 
    Button,
    Collapse,
    CollapseItem,
} from 'element-ui';


const element = {
    install: function (Vue) {
        Vue.use(Button);
        Vue.use(Collapse);
        Vue.use(CollapseItem);
    }
   }
   export default element