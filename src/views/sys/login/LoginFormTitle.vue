<template>
  <!-- <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">
    {{ getFormTitle }}
  </h2> -->
  <div class="login_Form_title">
    <AppLogo :style="{ width: '350px' }" />
    <div class="info">
      NB内部系统<span class="info_line">|</span>欢迎回来！
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { AppLogo } from '/@/components/Application';

  import { computed, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { LoginStateEnum, useLoginState } from './useLogin';
  import { useGlobSetting } from '/@/hooks/setting';
  const globSetting = useGlobSetting();
  const title = computed(() => globSetting?.title ?? '');

  const { t } = useI18n();

  const { getLoginState } = useLoginState();

  const getFormTitle = computed(() => {
    const titleObj = {
      [LoginStateEnum.RESET_PASSWORD]: t('sys.login.forgetFormTitle'),
      [LoginStateEnum.LOGIN]: t('sys.login.signInFormTitle'),
      [LoginStateEnum.REGISTER]: t('sys.login.signUpFormTitle'),
      [LoginStateEnum.MOBILE]: t('sys.login.mobileSignInFormTitle'),
      [LoginStateEnum.QR_CODE]: t('sys.login.qrSignInFormTitle'),
    };
    return titleObj[unref(getLoginState)];
  });
</script>
<style lang="less" scoped>
  @color: rgba(177, 177, 177, 1);
  .login_Form_title {
    text-align: center;

    .logo {
      img {
        height: 38px;
      }
    }
    .info {
      padding: 20px 0 40px;
      color: @color;
      font-size: 15px;
      margin-left: 33px;
      .info_line {
        padding: 0 12px;
      }
    }
  }
</style>
