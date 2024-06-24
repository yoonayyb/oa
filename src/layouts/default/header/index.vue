<template>
  <Layout.Header :class="getHeaderClass">
    <!-- left start -->
    <div :class="`${prefixCls}-left`">
      <!-- logo -->
      <AppLogo v-if="getShowHeaderLogo && !getIsMobile" :class="`${prefixCls}-logo`" :theme="getHeaderTheme" :style="getLogoWidth" />
      <LayoutTrigger
        v-if="(getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile"
        :theme="getHeaderTheme"
        :sider="false"
      />
      <!-- <LayoutBreadcrumb v-if="getShowContent && getShowBread" :theme="getHeaderTheme" /> -->
      <a-select
        ref="select"
        v-model:value="mainVal"
        style="width: 150px; margin: 0 6px"
        :options="mainOptions"
        @change="handleMainChange"
        :label-in-value="true"
        :field-names="{ label: 'title', value: 'id' }"
      >
      </a-select>
      <a-select
        v-if="myRoles"
        ref="select"
        v-model:value="warehouseId"
        style="width: 150px"
        :options="warehouseOptions"
        @change="handleWarehouseChange"
        :field-names="{ label: 'name', value: 'id' }"
      >
      </a-select>
    </div>
    <!-- left end -->
    <!-- menu start -->
    <div v-if="getShowTopMenu && !getIsMobile" :class="`${prefixCls}-menu`">
      <LayoutMenu :isHorizontal="true" :theme="getHeaderTheme" :splitType="getSplitType" :menuMode="getMenuMode" />
    </div>
    <!-- menu-end -->
    <!-- action  -->
    <div :class="`${prefixCls}-action`">
      <AppSearch v-if="getShowSearch" :class="`${prefixCls}-action__item `" />
      <ErrorAction v-if="getUseErrorHandle" :class="`${prefixCls}-action__item error-action`" />
      <Notify v-if="getShowNotice" :class="`${prefixCls}-action__item notify-item`" />
      <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`" />
      <AppLocalePicker v-if="getShowLocalePicker" :reload="true" :showText="false" :class="`${prefixCls}-action__item`" />
      <UserDropDown :theme="getHeaderTheme" />
      <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" />
    </div>
  </Layout.Header>
</template>
<script lang="ts" setup>
  import { Layout } from 'ant-design-vue';

  import { nextTick, computed, unref } from 'vue';

  import { AppLocalePicker, AppLogo, AppSearch } from '@/components/Application';
  import { SettingButtonPositionEnum } from '@/enums/appEnum';
  import { MenuModeEnum, MenuSplitTyeEnum } from '@/enums/menuEnum';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useConfigStoreWithOut } from '/@/store/modules/config';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useLocale } from '@/locales/useLocale';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { propTypes } from '@/utils/propTypes';
  import { useUserStore } from '/@/store/modules/user';
  import LayoutMenu from '../menu/index.vue';
  import LayoutTrigger from '../trigger/index.vue';
  import { ErrorAction, FullScreen, LayoutBreadcrumb, Notify, UserDropDown } from './components';
  const userStore = useUserStore();
  const configStore = useConfigStoreWithOut();

  const SettingDrawer = createAsyncComponent(() => import('@/layouts/default/setting/index.vue'), {
    loading: true,
  });
  defineOptions({ name: 'LayoutHeader' });

  const props = defineProps({
    fixed: propTypes.bool,
  });

  const { prefixCls } = useDesign('layout-header');
  const { getShowTopMenu, getShowHeaderTrigger, getSplit, getIsMixMode, getMenuWidth, getIsMixSidebar } = useMenuSetting();
  const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } = useRootSetting();

  const {
    getHeaderTheme,
    getShowFullScreen,
    getShowNotice,
    getShowContent,
    getShowBread,
    getShowHeaderLogo,
    getShowHeader,
    getShowSearch,
  } = useHeaderSetting();

  const { getShowLocalePicker } = useLocale();

  const { getIsMobile } = useAppInject();

  const getHeaderClass = computed(() => {
    const theme = unref(getHeaderTheme);
    return [
      prefixCls,
      {
        [`${prefixCls}--fixed`]: props.fixed,
        [`${prefixCls}--mobile`]: unref(getIsMobile),
        [`${prefixCls}--${theme}`]: theme,
      },
    ];
  });

  const getShowSetting = computed(() => {
    if (!unref(getShowSettingButton)) {
      return false;
    }
    const settingButtonPosition = unref(getSettingButtonPosition);

    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return unref(getShowHeader);
    }
    return settingButtonPosition === SettingButtonPositionEnum.HEADER;
  });

  const getLogoWidth = computed(() => {
    if (!unref(getIsMixMode) || unref(getIsMobile)) {
      return {};
    }
    const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
    return { width: `${width}px` };
  });

  const getSplitType = computed(() => {
    return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
  });

  const getMenuMode = computed(() => {
    return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
  });

  const mainVal = computed(() => {
    return {
      value: +configStore.getCurrentMainId,
    };
  });
  console.log('[ configStore.getCurrentMainId ]-145', configStore.getMainOptions, configStore.getCurrentMainId);

  //只有发货员和超管 有仓库
  const roles = ['IDENTIFY_SHIPPER', 'IDENTIFY_ADMIN'];
  const myRoles = userStore.getUserInfo?.roles?.some((v) => roles.includes(v.identify));

  const handleMainChange = async (e) => {
    console.log('[ handleMainChange ]-154');
    const { label, value } = e;
    configStore.setCurrentMainId(value);
    configStore.setCurrentMainLabel(label);


    if (myRoles) {
      warehouseOptions.value = await getWarehouseOptions(userStore.getUserInfo.id);
      getCurrentInfo('getCurrentWarehouseId', 'setCurrentWarehouseId', warehouseOptions);
    }

    nextTick(() => {
      window.location.reload();
    });
  };
  const handleWarehouseChange = (e) => {
    configStore.setCurrentWarehouseId(e);
    nextTick(() => {
      window.location.reload();
    });
  };
  //主体信息数组
  const mainOptions = ref(configStore.getMainOptions);

  const warehouseId = computed(() => {
    console.log('configStore.getCurrentWarehouseId: ', configStore.getCurrentWarehouseId)
    return configStore.getCurrentWarehouseId || '';
  });
  //仓库信息数组
  const warehouseOptions = ref(configStore.getWarehouseOptions);
  console.log('[ warehouseOptions ]-181', warehouseOptions, configStore.getCurrentWarehouseId);
  const getWarehouseOptions = async (user_id) => {
    const data = await window.http.post({
      url: '/erp-ware/warehouse/shipperWarehouseList',
    });
    configStore.setWarehouseOptions(data);
    return data;
  };

  const initWarehouse = () => {
    warehouseOptions.value = [];
    configStore.setWarehouseOptions([]);
    configStore.setCurrentWarehouseId('');
  };
  const invalidConditions = [null, undefined, ''];
  const getCurrentInfo = (getKey, setKey, options) => {
    //上次登录存在本地的id
    let currentId = configStore[getKey];
    // 获取 options中第一个item
    let findVal = options.value.find((v) => v.id)?.id || '';
    // // 如果id为假值 则使用能找到的第一个item
    if (invalidConditions.includes(currentId)) {
      configStore[setKey](findVal);
    } else {
      //有id 而且能在账号的options里找到相关item 则直接选中该数据 否则渲染能找到的第一个item
      let { id: currCompanyVal } = options.value.find((v) => v.id == currentId) || {};
      configStore[setKey](currCompanyVal || findVal);
    }
  };

  onMounted(() => {});
</script>
<style lang="less">
  @import url('./index.less');
</style>
<style lang="less" scoped>
  .ant-layout-header {
    overflow-x: auto;
    overflow-y: hidden;
  }
</style>
