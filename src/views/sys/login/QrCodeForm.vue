<template>
  <div v-if="getShow">
    <LoginFormTitle class="enter-x" />
    
    <div class="enter-x min-w-64 min-h-64 text-center">
      <a-spin v-if="!qrCodeUrl" tip="Loading..." />
      <QrCode
        
        :value="qrCodeUrl"
        :logo="qrcodeStatus === 1?'/imgs/qrcode_scan.png':qrcodeStatus === -1?'/imgs/qrcode_expire.png':''"
        class="enter-x flex justify-center justify-start"
        @click="updateQrCode"
        :width="280"
      />
      <!-- <img class="enter-x flex justify-center justify-start" v-if="qrcodeStatus === 1" style="width: 17.5rem;height:17.5rem"  :src='`/imgs/qrcode_scan.png`'> -->
      <Divider class="enter-x">{{ t('sys.login.scanSign') }}</Divider>
      <Button size="large" block class="mt-4 enter-x !w-96/100" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </div>
    <BasicModal destroyOnClose  title="登录" @register="register" width="500px">
      <Form class="p-4 login-form enter-x" :model="formData" :rules="getFormRules" ref="formRef" v-show="getShow"
        @keypress.enter="handleLogin">
        <template v-if="!users.length">
        <FormItem name="username" class="enter-x">
          <Input size="large" v-model:value="formData.username" :placeholder="t('sys.login.userName')"
            class="fix-auto-fill login_input" />
        </FormItem>
        <FormItem name="password" class="enter-x">
          <InputPassword autocomplete="current-password" class="login_input" size="large" visibilityToggle v-model:value="formData.password"
            :placeholder="t('sys.login.password')" />
        </FormItem>
        
        </template>
        <template v-else>
          <FormItem  label="用户" name="user_id" class="enter-x">
            <a-radio-group class="flex flex-col"  v-model:value="formData.user_id">
              <a-radio  v-for="item in users"  :value="item.id">
                <div class="flex justify-center items-center">
                  <a-avatar class="mr-1" :size="26" :src="item.avatar"></a-avatar>
                  {{item.name}}
                </div>
              </a-radio>
            </a-radio-group>  
          <!-- <a-select
              v-model:value="formData.user_id"
              show-search
              placeholder="请选择用户"
              :options="users"
              :fieldNames="{label:'name',value:'id'}"
              optionFilterProp="name"
            ></a-select> -->
            </FormItem>
        </template>
      </Form>
      <template #footer>
        <FormItem class="enter-x text-center">
          <Button type="primary" class="!w-92/100 " size="large" block @click="handleLogin" :loading="loading">
            {{users.length?'登录':'绑定' }}
          </Button>
          <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
          {{ t('sys.login.registerButton') }}
        </Button> -->
        </FormItem>
      </template>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  
  import { computed, unref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Button, Divider,Form,Input, Row, Col, } from 'ant-design-vue';
  import BasicModal from '/@/components/Modal/src/BasicModal.vue';
  import { useModal } from '/@/components/Modal';
  import { QrCode } from '/@/components/Qrcode/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';
  import { useLoginState, LoginStateEnum,useFormRules, useFormValid } from './useLogin';
  import { useMessage } from '/@/hooks/web/useMessage';
  const user_id = ref()
  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
 const { notification, createErrorModal } = useMessage();
 const [register, { openModal, closeModal }] = useModal();
   const { getFormRules } = useFormRules();
  const formData = reactive({
    username: '',
    password: '',
  });
  const userStore = useUserStore();
  const qrCodeUrl = ref('') ;
  const key = ref()
  const users = ref([])
  const timer = ref()
  const qrcodeStatus = ref(0)
  const loading = ref(false)
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const formRef = ref();
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE);
  const { validForm } = useFormValid(formRef);
  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      if(!users.value.length){
        const userInfo = await userStore.login({
          ...formData,
          mode: 'none', //不要默认的错误提示
        });
        
        if (userInfo) {
          console.log('[ userInfo ]-149', userInfo);
          bindWx()
          notification.success({
            message: t('sys.login.loginSuccessTitle'),
            description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.name}`,
            duration: 3,
          });
        }
      }else{
        wxLogin()
      }
      
    } catch (error) {
      console.log('[ error ]-155', error)
      // createErrorModal({
      //   title: 1111,
      //   content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      //   getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      // });
    } finally {
      loading.value = false;
    }
  }
  const wxLogin =  ()=>{
    
    window.http.post({
      url:'/user_center/wechat_auth/official_account_login',
      data:{
        _k:key.value,
        uid:users.value[0].id
      }
    }).then(async res=>{
       console.log('微信登录获取token',res.token)
      userStore.wxlogin({
        token:res.token
      });
     
      
    })
  }
  const bindWx = ()=>{
    window.http.post({
      url:'/user_center/wechat_auth/official_account_bind',
      data:{
        _k:key.value
      }
    }).then(res=>{
      console.log('绑定成功',res)
      
    })
  }
  onBeforeUnmount(()=>{
    
      
      if(timer.value) clearInterval(timer.value)
    
  })
  const updateQrCode = ()=>{
    if(qrcodeStatus.value !== 0){
      getQrCode()
    }
  }
  const getQrCode =  ()=>{
    qrcodeStatus.value = 0//重置一下二维码状态 让二维码立即刷新
    window.http.post({
      url:'/user_center/wechat_auth/official_account_code'
    }).then(res=>{
      qrCodeUrl.value  = res.url
      key.value = res.key
      
        getQrcodeStatus()
      
    })
  }
  watch(getShow,val=>{
    console.log('val: ', val)
    if(timer.value) clearInterval(timer.value)
    if(val){
      getQrCode()
    }
  })
  //轮询查询二维码状态
  const getQrcodeStatus = ()=>{
    
    timer.value = setInterval(()=>{
     
      window.http.post({
        url:'/user_center/wechat_auth/official_account_status',
        data:{
          _k:key.value
        }
      }).then(res=>{
        qrcodeStatus.value = res.status //-1已过期  0未扫码 1已扫码
        
        if(res.status === 1){
          users.value = res.users
          if(users.value.length){
            wxLogin()
          }else{
             openModal()
          }
         
        }
        if(qrcodeStatus.value !== 0 && timer.value){
         
           clearInterval(timer.value)
        }
      })
    },2000)
    
  }
</script>
