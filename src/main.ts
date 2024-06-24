import 'uno.css';
import '@/design/index.less';
import '@/components/VxeTable/src/css/index.scss';
import 'ant-design-vue/dist/reset.css';

// Register icon sprite
import 'virtual:svg-icons-register';
import 'vant/lib/index.css';
import { createApp } from 'vue';

import { setupI18n } from '@/locales/setupI18n';
import { registerGlobComp } from '@/components/registerGlobComp';
import { setupGlobDirectives } from '@/directives';
import { setupErrorHandle } from '@/logics/error-handle';
import { initAppConfigStore } from '@/logics/initAppConfig';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { setupStore } from '@/store';
//全局引入ant
import Antd from 'ant-design-vue';
import App from './App.vue';


function bootstrap() {
  const app = createApp(App);
  // Multilingual configuration
  // 多语言配置
  // Asynchronous case: language files may be obtained from the server side
  // 异步案例：语言文件可能从服务器端获取

  //目前取消异步引入了
  setupI18n(app);

  // Configure store
  // 配置 store
  setupStore(app);

  // Initialize internal system configuration
  // 初始化内部系统配置
  initAppConfigStore();

  // Register global components
  // 注册全局组件
  registerGlobComp(app);


  // Configure routing
  // 配置路由
  setupRouter(app);

  // router-guard
  // 路由守卫
  setupRouterGuard(router);

  // Register global directive
  // 注册全局指令
  setupGlobDirectives(app);

  // Configure global error handling
  // 配置全局错误处理
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();

  app.use(Antd);

  app.mount('#app');
  // app.use(ElementPlus)



  app.directive('focus', {
    mounted(el) {
      el.focus();
    }
  });

  // let debounce = (fn, delay) => {
  //   var delay = delay || 100;
  //   var timer;
  //   return function () {
  //     var th = this;
  //     var args = arguments;
  //     if (timer) {
  //       clearTimeout(timer);
  //     }
  //     timer = setTimeout(function () {
  //       timer = null;
  //       fn.apply(th, args);
  //     }, delay);
  //   };
  // }

  // app.directive('enterNumber', {
  //   mounted(el, { value = 100 }, vnode) {
  //     el = el.nodeName == "INPUT" ? el : el.children[0]
  //     var RegStr = value == 0 ? `^[\\+\\-]?\\d+\\d{0,0}` : `^[\\+\\-]?\\d+\\.?\\d{0,${value}}`;
  //     el.addEventListener('input', debounce(() => {
  //       el.value = el.value.match(new RegExp(RegStr, 'g'));
  //       el.dispatchEvent(new Event('input'))
  //     }));
  //   }
  // });
}









bootstrap();
