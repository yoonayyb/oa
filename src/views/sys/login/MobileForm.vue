<template>
  <div v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="mobile" class="enter-x">
        <Input size="large" v-model:value="formData.mobile" :placeholder="t('sys.login.mobile')" class="fix-auto-fill" />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <InputPassword
          class="login_input"
          size="large"
          visibilityToggle
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
          {{ t('sys.login.loginButton') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  const { notification, createErrorModal } = useMessage();
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();
  const userStore = useUserStore();
  const formRef = ref();
  const loading = ref(false);
  const { prefixCls } = useDesign('login');
  const formData = reactive({
    mobile: '',
    password: '',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE);
  async function handleLogin() {
    console.log('[ handleLogin ]-53');
    const data = await validForm();
    console.log('[ data ]-123', data);
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.mobileLogin({
        ...formData,
        mode: 'none', //不要默认的错误提示
      });

      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
          duration: 3,
        });
      }
    } catch (error) {
      console.log('[ error ]-71', error);
      // createErrorModal({
      //   title: t('sys.api.errorTip'),
      //   content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      //   getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      // });
    } finally {
      loading.value = false;
    }
  }
  // async function handleLogin() {
  //   const data = await validForm();
  //   if (!data) return;
  //   console.log(data);
  // }
</script>
