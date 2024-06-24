<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div class="absolute flex items-center right-4 top-4">
      <AppDarkModeToggle class="mr-2 enter-x" v-if="!sessionTimeout" />
      <AppLocalePicker class="text-white enter-x xl:text-gray-600" :show-text="false" v-if="!sessionTimeout && showLocale" />
    </div>
    <!-- <span class="-enter-x xl:hidden">
    </span> -->

    <AppLogo class="AppLogo" :alwaysShowTitle="true" :style="{ width: '220px' }" :imgName="'logoGrey'" />
    <div class="container relative h-full py-2 mx-auto sm:px-10">
      <div class="flex w-full h-full py-5 xl:h-auto xl:py-0 xl:my-0">
        <div
          :class="`${prefixCls}-form`"
          class="relative flex w-full mx-auto my-auto rounded-md shadow-md xl:bg-transparent xl:shadow-none enter-x"
        >
          <div :class="`${prefixCls}-form_left`">
            <LoginForm class="login_form" />
            <!-- <ForgetPasswordForm /> -->
            <MobileForm class="login_form" />
            <QrCodeForm class="login_form" />
            <!-- <RegisterForm />
            <QrCodeForm /> -->
          </div>
          <div :class="`${prefixCls}-form_right`">
            <div :class="`${prefixCls}-form_right_top`">
              <img src="../../../assets/images/financial-analyst-two-color.png" />
            </div>
            <AppLogo :style="{ width: '350px' }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, getCurrentInstance } from 'vue';
  import { AppLogo, AppLocalePicker, AppDarkModeToggle } from '/@/components/Application';
  import LoginForm from './LoginForm.vue';
  import ForgetPasswordForm from './ForgetPasswordForm.vue';
  import RegisterForm from './RegisterForm.vue';
  import MobileForm from './MobileForm.vue';
  import QrCodeForm from './QrCodeForm.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLocaleStore } from '/@/store/modules/locale';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });
  const instance = getCurrentInstance();

  const globSetting = useGlobSetting();
  const { prefixCls } = useDesign('login');
  const { t } = useI18n();
  const localeStore = useLocaleStore();
  const showLocale = localeStore.getShowPicker;
  const title = computed(() => globSetting?.title ?? '');
  console.log('globSetting', globSetting);
  console.log('prefixCls', prefixCls);
  console.log('localeStore', localeStore);
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;

      &::before {
        background-image: url('/@/assets/svg/login-bg-dark.svg');
      }

      .ant-input,
      .ant-input-password {
        background-color: #232a3b;
      }

      .ant-btn:not(.ant-btn-link, .ant-btn-primary) {
        border: 1px solid #4a5569;
      }

      &-form {
        background: transparent !important;
      }

      .app-iconify {
        color: #fff;
      }
    }

    input.fix-auto-fill,
    .fix-auto-fill input {
      -webkit-text-fill-color: #c9d1d9 !important;
      // box-shadow: inherit !important;
    }
  }

  .@{prefix-cls} {
    min-height: 100%;
    overflow: hidden;
    background-color: #f9f9f9;

    @media (max-width: @screen-xl) {
      background-color: #f9f9f9;

      .@{prefix-cls}-form {
        background-color: #fff;
      }
    }

    &::before {
      // content: '';
      // position: absolute;
      // top: 0;
      // left: 0;
      // width: 100%;
      // height: 100%;
      // margin-left: -48%;
      // // background-image: url('/@/assets/svg/login-bg.svg');
      // background-repeat: no-repeat;
      // background-position: 100%;
      // background-size: auto 100%;
      // @media (max-width: @screen-xl) {
      //   display: none;
      // }
    }

    .AppLogo {
      position: absolute;
      top: 12px;
      height: 30px;
    }

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 1400px;

      .@{logo-prefix-cls} {
        // display: flex;
        // width: 60%;
        // height: 80px;
        &__title {
          color: #fff;
          font-size: 24px;
        }

        img {
          width: 48px;
        }
      }

      .@{prefix-cls}-form {
        min-width: 300px;
        overflow: hidden;
        border-radius: 62px;
        box-shadow: 0 0.1em 0.5em #00000047;

        &_left {
          flex: 1;
          background-color: #0079ff;
          padding: 65px 100px 65px 0;

          .login_form {
            padding: 60px 0;
            background-color: #fff;
            border-radius: 0 62px 62px 0;

            .ant-form {
              max-width: 430px;
              text-align: center;
              margin: auto;
            }
          }
        }

        &_right {
          flex: 1;
          background-color: #fff;
          text-align: center;

          &_top {
            img {
              margin-top: 110px;
              margin-bottom: 34px;
              height: 350px;
            }
          }

          &_bottom {
            img {
              height: 64px;
            }
          }
        }
      }
    }

    &-sign-in-way {
      .anticon {
        color: #888;
        font-size: 22px;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }

    input:not([type='checkbox']) {
      // min-width: 360px;
      @media (max-width: @screen-xl) {
        // min-width: 320px;
      }

      @media (max-width: @screen-lg) {
        min-width: 260px;
      }

      @media (max-width: @screen-md) {
        min-width: 240px;
      }

      @media (max-width: @screen-sm) {
        min-width: 160px;
      }
    }

    .@{countdown-prefix-cls} input {
      min-width: unset;
    }

    .ant-divider-inner-text {
      color: @text-color-secondary;
      font-size: 12px;
    }
  }

  // 小屏幕样式
  @media (max-width: 850px) {
    .@{prefix-cls}-form_left {
      width: 100% !important;
      padding: 0 !important;
    }

    .@{prefix-cls}-form_right {
      width: 0 !important;
      display: none;
    }
  }
</style>
