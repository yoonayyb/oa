<!--
 * @Description: logo component
-->
<template>
  <!-- :class="getAppLogoClass" -->
  <div v-if="['mix', 'sidebar'].includes(getMenuType) && props.showTitle" class="user_header cursor-pointer"
    @click="handleEdit" :title="'修改信息'">
    <!-- <Avatar class="avatar" :size="64">
      <template #icon><img :src="getUserInfo.avatar || headerImg" /></template>
    </Avatar> -->
    <HeadImg class="pt-3" :userInfo="getUserInfo" :size='64'> </HeadImg>
    <div :class="getTitleClass" v-show="showTitle">
      <!-- {{ title }} -->
      <div class="title_name title_position">{{ getUserInfo.name }}</div>
    </div>
    <AccountModal :name="'account2'" :type="'account'" @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { HeadImg } from '/@/components/Business';
  import { computed, unref } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useUserStore } from '/@/store/modules/user';
  import { Avatar } from 'ant-design-vue';
  import { useAppStore } from '/@/store/modules/app';
  import { useModal } from '/@/components/Modal';
  import headerImg from '/@/assets/images/header.jpg';
  import AccountModal from '/@/views/demo/system/account/AccountModal.vue';
  const props = defineProps({
    /**
     * The theme of the current parent component
     */
    theme: { type: String, validator: (v : string) => ['light', 'dark'].includes(v) },
    /**
     * Whether to show title
     */
    showTitle: { type: Boolean, default: true },
    /**
     * The title is also displayed when the menu is collapsed
     */
    alwaysShowTitle: { type: Boolean },
  });
  const appStore = useAppStore();
  const userStore = useUserStore();
  const [registerModal, { openModal }] = useModal();
  const getUserInfo = computed(() => {
    return userStore.getUserInfo;
  });

  const getMenuType = computed(() => appStore.getMenuSetting.type);

  const { prefixCls } = useDesign('app-logo');
  const { getCollapsedShowTitle } = useMenuSetting();
  const { title } = useGlobSetting();

  const handleEdit = () => {
    openModal(true, {
      record: getUserInfo.value,
      isUpdate: true,
      is_me: true,
    });
  };
  // userStore.setUserInfo()
  const handleSuccess = (obj) => {
    console.log(1111, obj.values);
    userStore.setUserInfo({ ...getUserInfo.value, ...obj.values });
  };

  const getAppLogoClass = computed(() => [prefixCls, props.theme, { 'collapsed-show-title': unref(getCollapsedShowTitle) }]);

  const getTitleClass = computed(() => [
    `${prefixCls}__title`,
    {
      'xs:opacity-0': !props.alwaysShowTitle,
    },
  ]);
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .user_header {
    text-align: center;
    color: #fff;
  }

  .avatar {
    margin-top: 8px;
  }

  .title_name {
    font-size: 14px;
    margin: 8px 0;
  }

  .title_position {
    font-size: 12px;
    margin-bottom: 8px;
  }
</style>
