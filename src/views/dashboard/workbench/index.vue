<template>
  <PageWrapper :loading="loading">
    <!-- <template #headerContent>
      <WorkbenchHeader />
    </template>
    <div class="lg:flex">
      <div class="lg:w-7/10 w-full !mr-4 enter-y">
        <ProjectCard :loading="loading" class="enter-y" />
        <DynamicInfo :loading="loading" class="!my-4 enter-y" />
      </div>
      <div class="lg:w-3/10 w-full enter-y">
        <QuickNav :loading="loading" class="enter-y" />

        <Card class="!my-4 enter-y" :loading="loading">
          <img class="xl:h-50 h-30 mx-auto" src="../../../assets/svg/illustration.svg" />
        </Card>

        <SaleRadar :loading="loading" class="enter-y" />
      </div>
    </div> -->
  </PageWrapper>
</template>
<script setup>
  import { ref } from 'vue';
  import { Card } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import ProjectCard from './components/ProjectCard.vue';
  import QuickNav from './components/QuickNav.vue';
  import DynamicInfo from './components/DynamicInfo.vue';
  import SaleRadar from './components/SaleRadar.vue';
  import { useGo } from '/@/hooks/web/usePage';

  import { usePermissionStore } from '/@/store/modules/permission';

  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();

  const loading = ref(false);

  // setTimeout(() => {
  //   loading.value = false;
  // }, 1500);

  const go = useGo();
  //跳转到有权限第一个页面

  onMounted(async () => {
    let path = userStore.getUserInfo.homePath;
    if (!path) {
      //获取有权限的第一个菜单路由
      const permissionStore = usePermissionStore();
      const routes = await permissionStore.buildRoutesAction();
      const firstRoute = router
        .getRoutes()
        .find((v) => !['/login', '/', '/main-out', '/redirect', '/dashboard', '/share'].includes(v.path));
      path = firstRoute?.path;
      //  userStore.setUserInfo
    }
    go(path);
    loading.value = false;
  });
  // console.log('[ userStore.getUserInfo ]-46', userStore.getUserInfo)
</script>
