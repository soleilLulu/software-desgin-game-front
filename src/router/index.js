import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/create',
      name: 'CreateCharacter',
      component: () => import('@/views/createCharacter.vue'),
    },
    {
      path: '/home',
      name: 'HOME',
      component: () => import('@/views/homePage.vue'),
    },
  ],
});
