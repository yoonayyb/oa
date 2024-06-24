<template>

  <div class="page flex_aic_jcc">
    <BasicDrawer rootClassName="yybBasicDrawer" v-bind="$attrs" title="审核" @register="registerDrawer"
      :bodyStyle="{background:'#ededed',padding:0,zIndex:1050}" :width="getIsMobile?'90%':'600'">
      <!-- <div class="form" style="max-width:800px;">

        <BasicForm @register="register">
          <template #contactsOptions></template>

        </BasicForm>

      </div> -->

      <a-row class="bg-white p-4">
        <a-col span="24" v-for="item in formConfig?.schemas?.filter(v=>v.defaultValue)">
          <a-flex vertical="vertical" style="font-size: 14px;">
            <div class="text-gray-400">{{item.label}}</div>
            <div style="min-height: 20px;margin:4px 0 8px 0" v-if=" isArray(item.defaultValue)">
              <span v-for="(v,i) of item.defaultValue" class="inline-block">
                <template v-if="item.component === 'RangePicker'">
                  {{dayjs(v).format('YYYY-MM-DD') + (i===item.defaultValue?.length -1? '  ':' ~ ')}}
                </template>
                <template v-else-if="item.component === 'Aupload'">
                  <a-image class="mr-2 mb-2" :src="v" style="width:120px;height:120px;object-fit:contain" alt="" />


                </template>
                <template v-if="item.component === 'Upload'">
                  <div class="flex flex-col">
                    
                    <a-image v-if="checkFileType(v.type).file_type === 'IMG'"  :src="v.response.url" :width="80" />
                    <a-image v-else  :src="checkFileType(v.type).url" :width="80" />
                    
                    <a-button style="width:80px;margin:0" @click="handleDownload(v)"  size="mini" type="link">下载</a-button>
                  </div>
                 
                </template>
                <template v-else>
                  {{(v.label || v)  + (i===item.defaultValue?.length -1? '  ':' 、')}}
                </template>
              </span>
            </div>
            <div style="min-height: 20px;margin:4px 0 8px 0" v-else>
              
              <template v-if="item.component === 'TimePicker'">
                {{dayjs(item?.defaultValue).format('HH:mm:ss') }}
              </template>
              <template v-else-if="item.component === 'DatePicker'">
                {{ dayjs(item?.defaultValue).format('YYYY-MM-DD') }}
              </template>
              <template v-else-if="item.component === 'MonthPicker'">
                {{ dayjs(item?.defaultValue).format('YYYY-MM') }}
              </template>

              <template v-else>
                {{item?.defaultValue?.label || item?.defaultValue }}
              </template>
            </div>
          </a-flex>
        </a-col>
        <!-- 出库发货人 -->
        <a-col span="24" v-if="configDetail.form_type === 1">
          
          
          <productTable :list="configDetail.form_type_value.products" style="margin: 20px;" ></productTable>
        </a-col>
      </a-row>
      <div style="height: 20px;"></div>
      <a-timeline class=" detailapprover p-4 bg-white">
        <div style="font-size: 14px;" class="text-gray-400 mb-6">流程

          <span :class="[approveStatusClass(configDetail.status)]"
            class="ml-2">{{ approveStatus(configDetail.status) }}</span>

        </div>
        <!-- 头部固定发起人 -->
        <a-timeline-item>
          <template #dot>
            <!-- 自己发的肯定 审核通过approve = approved  -->
            <HeadImg approve="approved"
              :userInfo="{avatar:configDetail?.apply_man?.avatar,name:configDetail?.apply_man?.name}" :size='40'>

            </HeadImg>
            <!-- <img style="width: 40px;height: 40px;" :src="configDetail?.apply_man?.avatar"> -->
          </template>
          <div class="flex ">

            <div class="flex flex-col justify-center items-center ml-2">
              <div>发起申请</div>
              <div style="width:100%" class="text-gray-400  truncate">
                {{ is_me?'我': configDetail?.apply_man?.name}}
              </div>
            </div>
            <div class="text-gray-400 absolute right-2">
              {{configDetail?.created_at}}
            </div>
          </div>
        </a-timeline-item>
        <a-timeline-item v-for="item in configDetail?.operate_line">

          <template #dot>
            <!-- 审批（流程）data_type=APPROVE  -->
            <template v-if="item.data_type === 'APPROVE'">
              <!-- 只有一个人的时候  -->
              <HeadImg v-if="item.approve_mans && item.approve_mans.length == 1"
                :userInfo="{name:item.approve_mans[0]?.staff?.name}" :approve="setApproveImg(item.status)" :size='40'>
              </HeadImg>
              <!-- 多个人的时候-->
              <template v-else>
                <img v-if="item.action_type" style="width: 40px;height: 40px;" src="@/assets/images/icon_role.png">
                <img v-else style="width: 40px;height: 40px;" src="/imgs/icon_horn.png">
                <img v-if="setApproveImg(item.status)" class="approve_img"
                  :src='`/imgs/icon_${setApproveImg(item.status)}.png`' />
              </template>
            </template>
            <!-- 审批（评论） -->
            <template v-else>

              <HeadImg :userInfo="{name:item.staff?.name,avatar:item.staff?.avatar}" comment="comment" :size='40'>
              </HeadImg>

            </template>


          </template>
          <!-- 审批（流程） -->
          <template v-if="item.data_type === 'APPROVE'">
            <a-collapse expand-icon-position="end" v-model:activeKey="activeKey" ghost>
              <!-- 多条数据的时候 才有展开 -->
              <a-collapse-panel v-if="item.approve_mans && item.approve_mans.length > 1" :key="item.id">
                <!-- 头部-->
                <template #header>
                  <div class="flex items-start" style="min-height: 50px;">
                    <!-- <img style="width: 40px;height: 40px;" src="@/assets/images/icon_role.png"> -->
                    <div class="flex flex-col  justify-center ml-2">
                      <div class="flex" v-if="item.approve_mans.find(v=>v.status > -1)">
                        {{'已抄送' + item.approve_mans.filter(v=>v.status > -1).length + '人'}}
                        <!-- 展示已读 -->
                        <div class="ml-2 text-sky-500" v-if="read(item.approve_mans)">
                          已读{{read(item.approve_mans)}}人
                        </div>
                      </div>
                      <div class="flex" v-else>
                        {{(item.action_type?'审核':'抄送') + item.approve_mans.length + '人'}}
                        <!-- 展示已读 -->
                        <div class="ml-2 text-sky-500" v-if="read(item.approve_mans)">
                          已读{{read(item.approve_mans)}}人
                        </div>
                      </div>
                      <div style="width:100%" class="text-gray-400  truncate">
                        {{item.action_type?'审核人':'抄送人'}}
                        {{ moreApproveStatus(item.status,item.approve_mans,item.action_type)}}
                      </div>

                    </div>

                  </div>
                </template>
                <!-- 折叠面板内 -->
                <div class="flex flex-wrap">
                  <div v-for="v in item.approve_mans" style="width:3rem"
                    class="flex flex-col justify-center items-center">
                    <!-- <img style="width: 32px;height: 32px;" src="@/assets/images/icon_role.png"> -->
                    <HeadImg :userInfo="{name:v?.staff?.name}" :read="setReadImg(v.is_read)"
                      :approve="setApproveImg(v.status)" :size='32'> </HeadImg>
                    <div style="width:100%" class="text-gray-400 text-center truncate">
                      {{v?.staff?.name}}
                    </div>
                  </div>

                </div>
              </a-collapse-panel>
              <!-- 只有一条数据 -->
              <div v-else style="min-height: 50px;">
                <div class="flex items-center">
                  <!-- <img style="width: 40px;height: 40px;" src="@/assets/images/icon_role.png"> -->
                  <div class="flex flex-col justify-center ml-2">
                    <div>{{item.action_type?'审核人':'抄送人'}}</div>
                    <div style="width:100%" class="text-gray-400  truncate">
                      {{item.approve_mans[0]?.staff?.name}}{{ approveStatus(item.status,item.action_type)}}
                    </div>
                    <!-- 只有一条数据的时候才展示时间 -->
                    <div class="text-gray-400 absolute right-2 top-0">
                      {{item.time_at}}
                    </div>
                  </div>

                </div>

              </div>
            </a-collapse>

          </template>
          <!-- 审批（评论） -->
          <template v-else>

            <div style="min-height: 50px;">
              <div class="flex items-center w-full">
                <!-- <img style="width: 40px;height: 40px;" src="@/assets/images/icon_role.png"> -->
                <div class="flex flex-col   ml-2 w-full">
                  <div class="text-sky-500 ">
                    {{ is_me?'我': item?.staff?.name}}
                    <span class="ml-1 text-black"> 添加了评论</span>

                  </div>
                  <div class="comment">
                    {{item.operate_text || '无'}}
                    <a-popconfirm :get-popup-container="getPopupContainer" placement="top" ok-text="撤销" cancel-text="取消"
                      @confirm="comment_rollback(item.id)">
                      <template #title>
                        <p> 是否确定撤销该评论? </p>
                    
                      </template>
                     <span  v-if="item.operate_text && item.staff.id === configDetail.me.id" class="text-gray-300 ml-4">｜<a-button
                         :style="{color:'rgb(9, 117, 233)'}" type="link">撤回</a-button>
                     </span>
                    
                    </a-popconfirm>
                    
                  </div>
                  <div class="text-gray-400 absolute right-2 top-0">
                    {{item.time_at}}
                  </div>
                </div>

              </div>

            </div>

          </template>
        </a-timeline-item>

      </a-timeline>
      <!-- 评论输入框 -->
      <div :class="{comment_show_box:commentShow} " class="comment_hide_box">
        <a-textarea :maxlength="200" allowClear showCount v-model:value="textarea" placeholder="请输入评论" :rows="4" />
        <a-button @click="submitComment" :disabled="!textarea.trim()" class="mt-2 absolute bottom-0 right-5"
          type="primary">提交评论</a-button>
      </div>
      <div class="submit_btn">
        <a-space wrap :size="getIsMobile?'middle':30">
          <div v-for="item in button" @click="item.fn" class="flex flex-col align-center justify-center">
            <img style="width: 24px;height: 24px;" :src="`/imgs/icon_${item.imgUrl}.png`">
            <div class="mt-1">{{item.name}}</div>
          </div>
          <a-popconfirm :get-popup-container="getPopupContainer" placement="top" ok-text="撤回" cancel-text="取消"
            @confirm="remoke()">
            <template #title>
              <p> 是否确定撤回该审批流程? </p>

            </template>
            <div v-if="revoke_button_show" class="flex flex-col align-center justify-center">
              <img style="width: 24px;height: 24px;" :src="`/imgs/icon_revoke.png`">
              <div class="mt-1">撤销</div>
            </div>

          </a-popconfirm>

          <template v-if="button_show">

            <a-button :style="{height:'2rem',width:'5rem'}" @click="push(2)">拒绝</a-button>
            <a-button :style="{height:'2rem',width:'5rem'}" type="primary" @click="push(1)">同意</a-button>
          </template>

        </a-space>

      </div>

    </BasicDrawer>

  </div>

</template>

<script lang='ts' setup>
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { HeadImg } from '/@/components/Business';
  import { useUserStore } from '/@/store/modules/user';
  import dayjs from 'dayjs';
  import { isArray } from '@/utils/is';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { downloadByUrl } from '@/utils/file/download';
  import { checkFileType } from '@/utils/common.js';
  
  import {
    message
  }
  from 'ant-design-vue'
  import  productTable  from '/@/components/Business/src/productTable/index.vue';
  

  // import { BasicForm, useForm } from '/@/components/Form/index';
  const { getIsMobile } = useAppInject();
  const userStore = useUserStore();
  const is_me = computed(() => (configDetail.value?.apply_man?.id === configDetail.value?.me?.id))
  const button_show = computed(() => { //如果当前流转到的人中是该登录的账号 才能操作

    const { operate_line = [], me } = configDetail.value

    const status0 = operate_line.filter(v => v.status === 0).map(v => v.approve_mans.map(e => e.status === 0 && e
      ?.staff?.id)) //当前流转

    if (!status0.length) return

    return status0[0].includes(me.id)
  })
  const getPopupContainer = (trigger: HTMLElement) => {
    return trigger.parentElement;
  };
  const revoke_button_show = computed(() => { //如果当前流转到步骤是审核中 status为0 才允许撤销

    console.log('is_me.value: ', is_me.value)
    return is_me.value && configDetail.value.status === 0
  })
  console.log('userStore', userStore.getUserInfo)
  const emits = defineEmits(['success','register'])
  const department_id = ref()
  const errorMessage = ref([])
  const button = ref([
    // {
    //   name: '修改',
    //   imgUrl: 'edit'
    // },
    // {
    //   name: '撤销',
    //   imgUrl: 'revoke',
    //   option: 3
    // },
    {
      name: '评论',
      imgUrl: 'comment1',
      fn: () => {
        commentShow.value = !commentShow.value
        console.log('commentShow: ', commentShow)
        console.log('评论')
      }
    },
  ])
  const commentShow = ref(false)
  const textarea = ref('')
  const submitComment = () => {
    console.log('textarea: ', textarea.value)
    window.http.post({
      url: '/work_center/form_api/comment',
      data: {
        "form_id": query.value.form_id,
        "operate_text": textarea.value
      }
    }).then(res => {
      message.success('评论成功')
      textarea.value = ''
      setMadalView()
    })
  }
  const comment_rollback = (id)=>{
    window.http.post({
      url: '/work_center/form_api/comment_rollback',
      data: {
        form_id: query.value.form_id,
        id
      }
    }).then(res => {
      message.success('撤销成功')
      setMadalView()
    })
  }
  const formConfig = reactive({
    showResetButton: false,
    showSubmitButton: false,
    bordered: false,
    // layout: 'horizontal',
    // labelLayout: 'flex',
    // labelWidth: 100,
    // labelCol: {},
    // wrapperCol: {},
  });
  const activeKey = ref()
  const approve = ref()
  const setReadImg = (status) => {
    let imgUrl = ''
    if (status === 1) imgUrl = 'read'
    return imgUrl

  }
  const setApproveImg = (status) => {
    let imgUrl = ''
    if (status === 0) imgUrl = 'approvering'
    if (status === 1) imgUrl = 'approved'
    if (status === 2) imgUrl = 'notapprove'
    if (status === 3) imgUrl = 'revokeapprove'

    return imgUrl

  }
  const read = (item) => {
    return item.filter(v => v.is_read).length
  }

  const moreApproveStatus = (e, item, action_type = 1) => {
    let flag = ''
    if (e === 0) flag = '(待审核)'
    if (e === 1) flag = action_type ? '(已同意)' : '(已抄送)'
    if (e === 2) flag = '(已驳回)'
    if (e === 3) flag = '(已撤销)'
    const statusArr = item.map(v => v.status)
    const approveProcess = statusArr.filter(v => v === 1)
    if (approveProcess.length) {
      flag = `已同意${approveProcess.length}人`
    }
    return flag

  }
  const approveStatus = (e, action_type = 1) => {
    let flag = ''
    if (e === 0) flag = '(待审核)'
    if (e === 1) flag = action_type ? '(已同意)' : '(已抄送)'
    if (e === 2) flag = '(已驳回)'
    if (e === 3) flag = '(已撤销)'
    return flag
  }
  const approveStatusClass = (e, action_type = 1) => {
    let flag = ''
    if (e === 0) flag = 'text-amber-400'
    if (e === 1) flag = 'text-sky-400'
    if (e === 2) flag = 'text-red-400'
    if (e === 3) flag = 'text-red-400'
    return flag
  }
  const [register, { setProps, appendSchemaByField, submit, getSchema, validate, resetFields }] = useForm({
    schemas: [],
  });
  const query = ref({})
  const [registerDrawer, { closeDrawer, setModalProps, changeLoading }] = useDrawerInner(async data => {
    // const { company_id,form_id} = data
    query.value = data
    changeLoading(true)
    await setMadalView()
    changeLoading(false)
    // configDetail.value = await getDetail(data);
    // changeLoading(false)
    // commentShow.value = false
    // Object.assign(formConfig, configDetail.value.payload);
    // const { schemas = [] } = formConfig
    // schemas.forEach(v => {
    //   v.dynamicDisabled = true
    //   v.dynamicReadonly = true

    // })
    // console.log('configDetail: ', configDetail.value)
    // dynamicDisabled
    // setProps(formConfig);

    // changeLoading(true);

  });
  const setMadalView = async () => {
    configDetail.value = await getDetail(query.value);
    commentShow.value = false
    Object.assign(formConfig, configDetail.value.payload);
    const { schemas = [] } = formConfig
    schemas.forEach(v => {
      v.dynamicDisabled = true
      v.dynamicReadonly = true

    })
  }
  const getDetail = async (params) => {
    let data = await window.http.get({
      url: '/work_center/form_api/detail',
      params
    });
    return data
  }
  const childRef = ref()
  const remoke = () => {
    changeLoading(true);
    window.http
      .post({
        url: '/work_center/form_api/cancel',
        data: { form_id: configDetail.value.id, },
      })
      .then((res) => {
        message.success('成功')
        // emits('update')
        closeDrawer()
      }).finally(() => {
        changeLoading(false);
      })
  }
  // 下载
  function handleDownload(item) {
    const { response:{url} } = item;
    downloadByUrl({ url });
  }
  const push = async (option) => {


    if (!option) return
    changeLoading(true);
    const data = {
      form_id: configDetail.value.id,
      option
    }

    window.http
      .post({
        url: '/work_center/form_api/approve',
        data: data,
      })
      .then((res) => {
        message.success('成功')
        emits('success')
        closeDrawer()
      }).finally(() => {
        changeLoading(false);
      })



  };



  const configDetail = ref({});
  const approveData = ref();
  const arr = (val) => {
    approveData.value = val;

    // buildArr(approveData.value)
  };
  /* 构造需要上传的数据*/
  const buildArr = (arr) => {

  };
  const changeType = (settype) => {
    let type = '指定成员'; // 指定成员
    if (settype == 4) type = '直属主管'; //直属主管
    if (settype == 5) type = '部门主管'; //部门主管
    if (settype == 2) type = '发起人自选'; //发起人自选
    if (settype == 1) type = '发起人自己'; //发起人自己
    if (settype == 6) type = '连续多级主管'; //连续多级主管
    if (settype == 3) type = '角色'; //角色
    if (settype == 7) type = '表单内联系人'; //表单内联系人
    return type;
  };
  const getApprove = (department_id = '') => {

  };

  onMounted(async () => {

  });
</script>

<style lang="less">
  .yybBasicDrawer {
    z-index: 1050;
  }

  // @prefix-cls: ~'@{namespace}-basic-drawer';
</style>
<style lang='less' scoped>
  .page {
    flex-wrap: wrap;
    background-color: #fff;

    .form {
      width: 80%;
      padding: 20px;
    }



  }



  .submit_btn {
    width: 100%;
    padding: 20px;
  }

  .approve_img {
    width: 14px;
    height: 14px;
    position: absolute;
    bottom: -3px;
    right: -3px
  }

  .comment {
    background-color: #ebebeb;
    border-radius: 8px;
    width: 100%;
    min-height: 30px;
    padding: 8px;
    margin-top: 6px;
    color: #5f5f5f
  }

  .comment_hide_box {
    position: relative;
    width: 100%;
    height: 0;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }

  .comment_show_box {
    width: 100%;
    height: 10rem;
    /* background-color: #c7c7c7; */
    padding: 1rem;
    transition: all 0.3s ease-in;
  }

  .detailapprover {
    :deep(.ant-collapse-header) {
      padding: 0 !important;
    }

    :deep(.ant-timeline-item-tail) {
      inset-inline-start: 25px;
    }

    :deep(.ant-timeline-item-content) {
      margin-inline-start: 50px;
    }

    :deep(.ant-collapse-content-box) {
      padding: 0;
      padding-block: 0 !important
    }

    :deep(.ant-timeline-item-head-custom) {
      transform: translate(0%, -35%) !important;
    }
  }
</style>
