<template>
  <ConfigProvider :locale="getAntdLocale" :theme="themeParams" :component-size="globalSize">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>
<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '@/components/Application';
  import { useTitle } from '@/hooks/web/useTitle';
  import { useLocale } from '@/locales/useLocale';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRouter } from 'vue-router';
  import { defHttp } from '/@/utils/http/axios';
  import { useAppStore } from '/@/store/modules/app';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import 'dayjs/locale/zh-cn';
  const appStore = useAppStore();
  window.go = useGo();
  window.router = useRouter();
  window.http = defHttp;

  console.log('projectConfig', appStore.projectConfig);
  const { getGlobalSize } = useRootSetting();
  const globalSize = computed(() => {
    return unref(getGlobalSize);
  });
  const { setMenuSetting } = useMenuSetting();
  setMenuSetting({ theme: 'dark' });
  let sizeObj = {
    large: 14,
    middle: 13,
    small: 12,
  };
  const { getAntdLocale } = useLocale();

  const themeParams = {
    token: {
      colorPrimary: '#0079ff',
      fontSize: +sizeObj[globalSize.value] || 12,
    },
    // components: {
    //   Radio: {
    //     colorPrimary: '#00b96b',
    //   },
    // },
  };

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>
<style lang="less" scoped>
  :global(.ant-table-thead > tr > th) {
    text-align: center !important;
  }
</style>
