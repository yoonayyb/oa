<template>
  <PageWrapper class="PageWrapper" dense contentFullHeight fixedHeight>
    <template #headerContent>
      <!-- <a-segmented class="segmented" v-model:value="segmentedVal" :options="segmentedArr" size="large" :block='true'>
        <template #label="{ payload }">
          <div>{{ payload.title }}</div>
        </template>
      </a-segmented> -->
      <div class="tabs flex_aic_jcc">
        <a-tabs class="a_tabs" v-model:activeKey="activeKey" @change="tabChange" size="Large" centered :tabBarGutter="100">
          <a-tab-pane key="basicSettings">
            <template #tab>
              <span class="a_tabs_title flex_aic_jcc">
                <span class="round rounded-full flex_aic_jcc">1</span>
                基础设置
              </span>
            </template>
          </a-tab-pane>
          <a-tab-pane key="formDesign" :disabled="nextStep2">
            <template #tab>
              <span class="a_tabs_title flex_aic_jcc" :class="{ greyBorder: nextStep2 }">
                <span class="round rounded-full flex_aic_jcc">2</span>
                表单设计
              </span>
            </template>
          </a-tab-pane>
          <a-tab-pane key="workflow" :disabled="nextStep3">
            <template #tab>
              <span class="a_tabs_title flex_aic_jcc" :class="{ greyBorder: nextStep3 }">
                <span class="round rounded-full flex_aic_jcc">3</span>
                流程设计
              </span>
            </template>
          </a-tab-pane>
          <!-- <a-tab-pane key="4">
            <template #tab>
              <span class="a_tabs_title flex_aic_jcc">
                <span class="round rounded-full flex_aic_jcc">4</span>
                高级设置
              </span>
            </template>
          </a-tab-pane> -->
        </a-tabs>
      </div>
    </template>

    <div class="page flex_aic_jcc">
      <KeepAlive>
        <component ref="compRef" :is="currentComponent" :configRes="configRes" @handleFormSave="handleFormSave"> </component>
      </KeepAlive>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { PageWrapper } from '/@/components/Page';
  import FormDesign from '../form-design/index.vue';
  import BasicSettings from '../basicSettings/index.vue';
  import Workflow from '../workflow/setting.vue';

  const activeKey = ref('basicSettings');
  const componentMap = new Map([
    ['basicSettings', BasicSettings],
    ['formDesign', FormDesign],
    ['workflow', Workflow],
  ]);
  const compRef = ref();
  const formConfig = ref();
  // let formConfig = {};
  provide('formConfig', formConfig);
  const currentComponent = computed(() => componentMap.get(activeKey.value as string));

  const tabChange = (e) => {
    // nextTick(() => {
    //   if (activeKey.value === 'basicSettings') {
    //     console.log('[  ]-75', compRef.value, compRef.value.getFieldsValue());
    //   }
    // });
    console.log('formConfig', formConfig);
  };
  const formId = ref();
  const stepNumArr = reactive([1]);
  const nextStep2 = computed(() => !stepNumArr.includes(2));
  const nextStep3 = computed(() => !stepNumArr.includes(3));

  const handleFormSave = async (formConfig) => {
    // emit('handleFormSave', formConfig);
    const { stepNum } = formConfig;
    stepNumArr.push(stepNum);
    await submitFormFn(formConfig);
    if (stepNum === 4) router.go(-1);
    activeKey.value = stepNum == 2 ? 'formDesign' : 'workflow';
    // stepNum == 3 && activeKey.value = 'workflow'
    console.log('保存', stepNum, activeKey);
  };
  let initForm = ref({});
  let configRes = ref({});
  let queryId = router.currentRoute.value.query?.id || localStorage.getItem('queryId');
  const getDetail = async () => {
    let data = await window.http.get({
      url: '/work_center/form_tpl_api/detail',
      params: {
        id: queryId,
      },
    });

    analysisFN(data);

    console.log('[ data ]-122', data);
    return data;
  };

  /*
   *将api字符串转成fn
   *
   */
  // const analysisFN = (data, type) => {
  //   if (data.payload?.schemas) {
  //     data.payload.schemas = data.payload.schemas.map((v) => {
  //       return {
  //         ...v,
  //         componentProps: {
  //           ...v.componentProps,
  //           api: type === 'toStr' ?
  //             v.componentProps?.api + '' : new Function(
  //               `return ${v.componentProps.api}`)(),
  //         },
  //       };
  //     });
  //   }
  // };
  const analysisFN = (data, type) => {
    if (data.payload?.schemas) {
      data.payload.schemas = data.payload.schemas.map((v) => {
        return {
          ...v,
          componentProps: {
            ...v.componentProps,
            api: type === 'toStr' ? v.componentProps.api?.toString() : new Function(`return ${v.componentProps.api}`)(),
          },
        };
      });
    }
  };
  const submitFormFn = async (values) => {
    console.log('[ values ]-111', values);

    let data = cloneDeep({
      ...configRes.value,
      ...values,
      is_enable: stepNumArr.includes(4) ? 1 : 0,
    });

    analysisFN(data, 'toStr');

    if (formId.value) data.id = formId.value;
    let res = await window.http.post(
      {
        url: '/work_center/form_tpl_api/save',
        data,
      },
      { successMessageMode: 'msg' },
    );

    formId.value = res.id;
    if (!queryId) {
      localStorage.setItem('queryId', res.id);
    }

    // localStorage.setItem('queryId', res.id)
    console.log('[ res ]-161', res);
    formConfig.value = { ...res };
    configRes.value = { ...res };

    return res;
  };
  const cloneObj = (form) => {
    // initForm.value = cloneDeep(form);
  };
  onMounted(async () => {
    if (queryId) {
      configRes.value = await getDetail();
      console.log('configRes.value', configRes.value);
      stepNumArr.push(2);
      if (Object.keys(configRes.value?.payload || {}).length) {
        stepNumArr.push(3);
      }
      // Object.keys(configRes.value?.payload || {}).length ? stepNumArr.push(2) & stepNumArr.push(3) :stepNumArr.push(3)
      formConfig.value = configRes.value;
    }
    cloneObj(configRes.value);
  });

  watch(
    () => configRes.value,
    (newVal) => {
      console.log('[ newVal ]-122', newVal);
    },
  );
</script>
<style lang="less" scoped>
  .PageWrapper {
    :deep(.ant-page-header) {
      padding: 0;
    }
  }

  .page {
    // background-color: #fff;
    // padding: 16px;
    transition: 0.7s all;
  }

  .tabs {
    .a_tabs {
      width: 80%;
    }

    :deep(.ant-tabs-tab-btn) {
      font-size: 16px;
    }

    :deep(.ant-tabs-tab-active) {
      .round {
        border: 1px solid #0079ff;
      }
    }
  }

  .a_tabs_title {
    .round {
      width: 25px;
      height: 25px;
      // text-align: center;
      border: 1px solid #000;
      margin-right: 5px;
    }

    &:hover {
      .round {
        border: 1px solid #0079ff;
      }
    }
  }

  .greyBorder {
    .round {
      width: 25px;
      height: 25px;
      border: 1px solid darkgrey;
      margin-right: 5px;
    }

    &:hover {
      .round {
        border: 1px solid darkgrey;
      }
    }
  }
</style>
