<!--
 * @Description: logo component
-->
<template>
  <div :class="getAppLogoClass" class="anticon" @click="goHome">
    <!-- <img class="logo" :src='getLogoSrc()' />
    <span v-if="showTitle" class="login_title" :style="{...style}">
      {{title}}
    </span> -->
    <!-- {{ getIsMobile }} -->

    <!-- 1.sidebar 2.mix 3.top-menu 4.mix-sidebar -->

    <!-- v-if="!['sidebar'].includes(getMenuType) || !getCollapsed" -->
    <img class="logo" :class="{ 'mix-sidebar-logo': ['mix-sidebar'].includes(getMenuType) }" :src="logoSrc" :style="{ ...style }" />
  </div>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useUserStore } from '/@/store/modules/user';
  import NBlogo1 from '../../../assets/images/NBlogo1.png';
  import NBlogo2 from '../../../assets/images/NBlogo2.png';
  import NBlogo3 from '../../../assets/images/NBlogo3.png';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  const { getIsMobile } = useAppInject();

  import { useAppStore } from '/@/store/modules/app';
  const appStore = useAppStore();
  const getMenuType = computed(() => appStore.getMenuSetting.type);
  const getDarkMode = computed(() => appStore.getDarkMode);

  const props = defineProps({
    /**
     * The theme of the current parent component
     */
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    /**
     * Whether to show title
     */
    showTitle: { type: Boolean, default: true },
    /**
     * The title is also displayed when the menu is collapsed
     */
    alwaysShowTitle: { type: Boolean },
    useType: { type: String, default: '' },
    style: {
      type: Object,
      default: {},
    },
    imgName: {
      type: String,
      default: 'logo2',
    },
  });

  const imgObj = {
    NBlogo1,
    NBlogo2,
    NBlogo3,
  };
  const { getCollapsedShowTitle, getCollapsed } = useMenuSetting();

  const logoSrc = computed(() => {
    //  1.sidebar 2.mix 3.top-menu 4.mix-sidebar
    const lightStatus = getDarkMode.value === 'light';
    if (getMenuType.value === 'mix-sidebar') {
      return NBlogo3;
    } else if (props.useType === 'menu') {
      return NBlogo2;
    } else if (['mix', 'top-menu'].includes(getMenuType.value) && lightStatus) {
      return NBlogo1;
    } else {
      return lightStatus ? NBlogo1 : NBlogo2;
    }
  });
  const { prefixCls } = useDesign('app-logo');
  const userStore = useUserStore();
  const { title } = useGlobSetting();
  const go = useGo();

  const getAppLogoClass = computed(() => [prefixCls, props.theme, { 'collapsed-show-title': unref(getCollapsedShowTitle) }]);

  const getTitleClass = computed(() => [
    `${prefixCls}__title`,
    {
      'xs:opacity-0': !props.alwaysShowTitle,
    },
  ]);

  function goHome() {
    console.log('[ userStore.getUserInfo.homePath ]-76', userStore.getUserInfo.homePath);
    go(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
  }

  const getLogoSrc = () => {
    return imgObj[props.imgName];
  };
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    justify-content: center;
    align-items: center;
    // padding-left: 5px;
    transition: all 0.2s ease;
    cursor: pointer;
    &.light {
      border-bottom: 1px solid @border-color-base;
    }

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.light &__title {
      color: @primary-color;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
      transition: all 0.5s;
      font-size: 16px;
      font-weight: 700;
      line-height: normal;
    }
  }

  .login_title {
    vertical-align: middle;
    font-weight: 700;
    font-style: italic;
    font-size: 30px;
    color: #0079ff;
  }
  .mix-sidebar-logo {
    width: 48px !important;
    height: 48px !important;
  }
  // .logo {
  //   // height: 180px !important;
  // }
</style>
