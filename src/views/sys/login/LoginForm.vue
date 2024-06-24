<template>
  <div v-show="getShow">
    <LoginFormTitle v-show="getShow" class="enter-x" />
    <Form
      class="p-4 login-form enter-x"
      :model="formData"
      :rules="getFormRules"
      ref="formRef"
      v-show="getShow"
      @keypress.enter="handleLogin"
    >
      <FormItem name="username" class="enter-x">
        <Input size="large" v-model:value="formData.username" :placeholder="t('sys.login.userName')" class="fix-auto-fill login_input" />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <InputPassword
          class="fix-auto-fill login_input"
          size="large"
          visibilityToggle
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <ARow class="enter-x">
        <ACol :span="12">
          <FormItem class="tal">
            <!-- No logic, you need to deal with it yourself -->
            <Checkbox v-model:checked="rememberMe" size="small">
              {{ t('sys.login.rememberMe') }}
            </Checkbox>
          </FormItem>
        </ACol>
        <ACol :span="12">
          <FormItem :style="{ 'text-align': 'right' }">
            <!-- No logic, you need to deal with it yourself -->
            <!-- <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
              {{ t('sys.login.forgetPassword') }}
            </Button> -->
          </FormItem>
        </ACol>
      </ARow>
      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
          {{ t('sys.login.loginButton') }}
        </Button>
        <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
      </FormItem>
      <ARow class="enter-x" :gutter="[16, 16]">
        <ACol :md="24" :xs="24">
          <Button class="!bg-green-600 !text-white" size="large" block @click="setLoginState(LoginStateEnum.MOBILE)">
            {{ t('sys.login.mobileSignInFormTitle') }}
          </Button>
        </ACol>
        <!-- <ACol :md="8" :xs="24">
          <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
            {{ t('sys.login.qrSignInFormTitle') }}
          </Button>
        </ACol>
        <ACol :md="8" :xs="24">
          <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
            {{ t('sys.login.registerButton') }}
          </Button>
        </ACol> -->
      </ARow>
      <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>

      <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
        <!-- <GithubFilled /> -->
        <WechatFilled @click="setLoginState(LoginStateEnum.QR_CODE)" />
        <!-- <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled /> -->
      </div>
    </Form>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';

  import { Checkbox, Form, Input, Row, Col, Button, Divider } from 'ant-design-vue';

  import { GithubFilled, WechatFilled, AlipayCircleFilled, GoogleCircleFilled, TwitterCircleFilled } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  //import { onKeyStroke } from '@vueuse/core';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();
  const WechatLoginType = ref(false);

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = localStorage.getItem('rememberMe') ? ref(JSON.parse(localStorage.getItem('rememberMe'))) : ref(false);
  console.log('111111rememberMe.value', rememberMe.value);
  watch(rememberMe, (newVal) => {
    console.log('rememberMe.value', rememberMe.value);
    if (rememberMe.value) {
      saveLocalStore();
    } else {
      localStorage.removeItem('userformData');
      localStorage.removeItem('rememberMe');
    }
  });
  const saveLocalStore = () => {
    localStorage.setItem('userformData', JSON.stringify(formData));
    localStorage.setItem('rememberMe', rememberMe.value);
  };
  const formData = reactive({
    username: '',
    password: '',
  });
  if (localStorage.getItem('userformData')) {
    const obj = JSON.parse(localStorage.getItem('userformData'));
    formData.username = obj.username;
    formData.password = obj.password;
  }

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);
  import { defHttp } from '/@/utils/http/axios';
  async function handleLogin() {
    console.log('[ handleLogin ]-142');
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        ...formData,
        mode: 'none', //不要默认的错误提示
      });
      if (rememberMe.value) saveLocalStore();
      if (userInfo) {
        console.log('[ userInfo ]-149', userInfo);
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
          duration: 3,
        });
      }
    } catch (error) {
      console.log('[ error ]-155', error);
      // createErrorModal({
      //   title: 1111,
      //   content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      //   getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      // });
    } finally {
      loading.value = false;
    }
  }
</script>
<style lang="less" scoped>
  @input_bgc: #eeeeee;

  .login_input {
    :deep(.ant-input-group-addon) {
      width: 65px;
      background-color: @input_bgc;
    }

    :deep(.ant-input) {
      // background-color: @input_bgc;
    }

    :deep(.ant-input-affix-wrapper) {
      // background-color: @input_bgc;
    }
  }

  :deep(.ant-form-item-explain-error) {
    text-align: left;
  }
</style>
