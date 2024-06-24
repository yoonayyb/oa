<template>
  <Layout class="Layout">
    <LayoutSider :class="` left ${prefixCls}-sider`" collapsible collapsedWidth="0" width="300" :zeroWidthTriggerStyle="{
        'margin-top': '-70px',
        'background-color': 'gray',
      }" breakpoint="md">
      <div class="layout_sider_title">组件库</div>
      <!--      <CollapseContainer title="基础控件">
        <CollapseItem :list="baseComponents" :handleListPush="handleListPushDrag" @add-attrs="handleAddAttrs"
          @handle-list-push="handleListPush" />
      </CollapseContainer> -->
      <CollapseContainer title="自定义控件">
        <CollapseItem :list="customComponents" @add-attrs="handleAddAttrs" :handleListPush="handleListPushDrag"
          @handle-list-push="handleListPush" />
      </CollapseContainer>
      <CollapseContainer title="布局控件">
        <CollapseItem :list="layoutComponents" :handleListPush="handleListPushDrag" @add-attrs="handleAddAttrs"
          @handle-list-push="handleListPush" />
      </CollapseContainer>
    </LayoutSider>
    <LayoutContent class="LayoutContent" :class="{ layout_phone: formLayout === 'phone' }">
      <Toolbar @handle-open-json-modal="handleOpenModal(jsonModal!)"
        @handle-open-import-json-modal="handleOpenModal(importJsonModal!)"
        @handle-preview="handleOpenModal(eFormPreview!)" @handle-preview2="handleOpenModal(eFormPreview2!)"
        @handle-open-code-modal="handleOpenModal(codeModal!)" @handle-change-layout-content="changeLayoutContent"
        @handle-clear-form-items="handleClearFormItems" @handle-form-save="handleFormSave" />
      <FormComponentPanel style="transition: all 1s" :current-item="formConfig.currentItem" :data="formConfig"
        @handle-set-select-item="handleSetSelectItem" />
    </LayoutContent>
    <LayoutSider v-if="formConfig.schemas?.length" class="overflow-auto" :class="`right ${prefixCls}-sider`" collapsible
      :reverseArrow="true" collapsedWidth="0" width="270"
      :zeroWidthTriggerStyle="{ 'margin-top': '-70px', 'background-color': 'gray' }" breakpoint="lg">
      <div class="layout_sider_title"> 
        <Icon class="layout_sider_title_icon" :icon="formConfig.currentItem.icon" />{{
          formConfig.currentItem.label
        }}
      </div>
      <PropsPanel ref="propsPanel" :activeKey="formConfig.activeKey">
        <template v-for="item of formConfig.schemas" #[`${item.component}Props`]="data">
          <slot :name="`${item.component}Props`" v-bind="{ formItem: data, props: data.componentProps }">
          </slot>
        </template>
      </PropsPanel>
    </LayoutSider>
  </Layout>

  <JsonModal ref="jsonModal" />
  <CodeModal ref="codeModal" />
  <ImportJsonModal ref="importJsonModal" />
  <VFormPreview ref="eFormPreview" :formConfig="formConfig" />
  <VFormPreview2 ref="eFormPreview2" :formConfig="formConfig" />
</template>

<script lang="ts" setup>
  import CollapseItem from './modules/CollapseItem.vue';
  import FormComponentPanel from './modules/FormComponentPanel.vue';
  import JsonModal from './components/JsonModal.vue';
  import VFormPreview from '../VFormPreview/index.vue';
  import VFormPreview2 from '../VFormPreview/useForm.vue';

  import Toolbar from './modules/Toolbar.vue';
  import PropsPanel from './modules/PropsPanel.vue';
  import ImportJsonModal from './components/ImportJsonModal.vue';
  import CodeModal from './components/CodeModal.vue';

  import 'codemirror/mode/javascript/javascript';

  import { ref, provide, Ref, watch } from 'vue';
  import { Layout, LayoutContent, LayoutSider, message } from 'ant-design-vue';

  import { IVFormComponent, IFormConfig, PropsTabKey } from '../../typings/v-form-component';
  import { formItemsForEach, generateKey } from '../../utils';
  import { cloneDeep } from 'lodash-es';
  import { baseComponents, customComponents, layoutComponents } from '../../core/formItemConfig';
  import { useRefHistory, UseRefHistoryReturn } from '@vueuse/core';
  import { globalConfigState } from './config/formItemPropsConfig';
  import { IFormDesignMethods, IPropsPanel, IToolbarMethods } from '../../typings/form-type';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { CollapseContainer } from '/@/components/Container/index';
  import Icon from '@/components/Icon/Icon.vue';

  const props = defineProps({
    title: {
      type: String,
      default: 'v-form-antd表单设计器',
    },
    configRes: {
      type: Object,
      default: {},
    },
  });
  watch(
    () => props.configRes,
    (newVal) => {
      
    },
  );


  const emit = defineEmits(['handleFormSave']);
  const { prefixCls } = useDesign('form-design');
  // 子组件实例
  const propsPanel = ref<null | IPropsPanel>(null);
  const jsonModal = ref<null | IToolbarMethods>(null);
  const importJsonModal = ref<null | IToolbarMethods>(null);
  const eFormPreview = ref<null | IToolbarMethods>(null);
  const eFormPreview2 = ref<null | IToolbarMethods>(null);

  const codeModal = ref<null | IToolbarMethods>(null);

  const formModel = ref({});
  // endregion
  const commonFormConfig = inject('formConfig')
  const formConfig = ref<IFormConfig>({
    // 表单配置
    schemas: [],
    layout: 'vertical',
    labelLayout: 'flex',
    labelWidth: 100,
    labelCol: {},
    wrapperCol: {},
    currentItem: {
      component: '',
      componentProps: {},
    },
    activeKey: 1,
  });

  const setFormConfig = (config : IFormConfig) => {
    //外部导入时，可能会缺少必要的信息。
    config.schemas = config.schemas || [];
    config.schemas.forEach((item) => {
      item.colProps = item.colProps || { span: 24 };
      item.componentProps = item.componentProps || {};
      item.itemProps = item.itemProps || {};
    });
    formConfig.value = config;
  };
  onMounted(() => {
    
    if (props.configRes.payload) {
      
      setFormConfig(props.configRes.payload);
    }
  });
  // 获取历史记录，用于撤销和重构
  const historyReturn = useRefHistory(formConfig, {
    deep: true,
    capacity: 20,
    parse: (val : IFormConfig) => {
      // 使用lodash.cloneDeep重新拷贝数据，把currentItem指向选中项
      const formConfig = cloneDeep(val);
      const { currentItem, schemas } = formConfig;
      // 从formItems中查找选中项

      const item = schemas && schemas.find((item) => item.field === currentItem?.field);
      // 如果有，则赋值给当前项，如果没有，则切换属性面板
      if (item) {
        formConfig.currentItem = item;
      }
      return formConfig;
    },
  });

  /**
   * 选中表单项
   * @param schema 当前选中的表单项
   */
  const handleSetSelectItem = (schema : IVFormComponent) => {
    try {
      formConfig.value.currentItem = schema;
      handleChangePropsTabs(
        schema.field ? (formConfig.value.activeKey! === 1 ? 2 : formConfig.value.activeKey!) : 1,
      );
    } catch (error) {
      
    }
  };

  const setGlobalConfigState = (formItem : IVFormComponent) => {
    formItem.colProps = formItem.colProps || {};
    formItem.colProps.span = globalConfigState.span;
    // 
  };

  /**
   * 添加属性
   * @param schemas
   * @param index
   */
  const handleAddAttrs = (_formItems : IVFormComponent[], _index : number) => { 
     console.log('_formItems: ', _formItems)
  };

  const handleListPushDrag = (item : IVFormComponent) => {
   
    const formItem = cloneDeep(item);
    setGlobalConfigState(formItem);
    generateKey(formItem);

    return formItem;
  };
  /**
   * 单击控件时添加到面板中
   * @param item {IVFormComponent} 当前点击的组件
   */
  const handleListPush = (item : IVFormComponent) => {
   
    const formItem = cloneDeep(item);
    console.log('formItem: ', formItem)
    //添加默认值
    formItem.componentProps = {
      ...formConfig.componentProps,
      labelInValue:true,
      labelField:'name',
      valueField:'id'
    }
    setGlobalConfigState(formItem);
    generateKey(formItem);

    if (!formConfig.value.currentItem?.key) {
      handleSetSelectItem(formItem);
      formConfig.value.schemas && formConfig.value.schemas.push(formItem);
      return;
    }
    handleCopy(formItem, false);
  };

  /**
   * 复制表单项，如果表单项为栅格布局，则遍历所有自表单项重新生成key
   * @param {IVFormComponent} formItem
   * @return {IVFormComponent}
   */
  const copyFormItem = (formItem : IVFormComponent) => {
    const newFormItem = cloneDeep(formItem);
    if (newFormItem.component === 'Grid') {
      formItemsForEach([formItem], (item) => {
        generateKey(item);
      });
    }
    return newFormItem;
  };
  /**
   * 复制或者添加表单，isCopy为true时则复制表单
   * @param item {IVFormComponent} 当前点击的组件
   * @param isCopy {boolean} 是否复制
   */
  const handleCopy = (
    item : IVFormComponent = formConfig.value.currentItem as IVFormComponent,
    isCopy = true,
  ) => {
    const field = formConfig.value.currentItem?.field;
    /**
     * 遍历当表单项配置，如果是复制，则复制一份表单项，如果不是复制，则直接添加到表单项中
     * @param schemas
     */
    const traverse = (schemas : IVFormComponent[]) => {
      // 使用some遍历，找到目标后停止遍历
      schemas.some((formItem : IVFormComponent, index : number) => {
        if (formItem.field === field) {
          // 判断是不是复制
          isCopy
            ? schemas.splice(index, 0, copyFormItem(formItem))
            : schemas.splice(index + 1, 0, item);
          const event = {
            newIndex: index + 1,
          };
          // 添加到表单项中
          handleBeforeColAdd(event, schemas, isCopy);
          return true;
        }
        if (['Grid', 'Tabs'].includes(formItem.component)) {
          // 栅格布局
          formItem.columns?.forEach((item) => {
            traverse(item.children);
          });
        }
      });
    };
    if (formConfig.value.schemas) {
      traverse(formConfig.value.schemas);
    }
  };

  /**
   * 添加到表单中
   * @param newIndex {object} 事件对象
   * @param schemas {IVFormComponent[]} 表单项列表
   * @param isCopy {boolean} 是否复制
   */
  const handleBeforeColAdd = ({ newIndex } : any, schemas : IVFormComponent[], isCopy = false) => {
    const item = schemas[newIndex];
    isCopy && generateKey(item);
    handleSetSelectItem(item);
  };

  /**
   * 打开模态框
   * @param Modal {IToolbarMethods}
   */
  const handleOpenModal = (Modal : IToolbarMethods) => {
    const config = cloneDeep(formConfig.value);
    Modal?.showModal(config);
  };
  /**
   * 改变表单布局
   * @param layout
   */
  let formLayout = ref('phone');
  const changeLayoutContent = (layout) => {
    formLayout.value = layout;
  };
  /**
   * 切换属性面板
   * @param key
   */
  const handleChangePropsTabs = (key : PropsTabKey) => {
    formConfig.value.activeKey = key;
  };
  /**
   * 清空表单项列表
   */
  const handleClearFormItems = () => {
    formConfig.value.schemas = [];
    handleSetSelectItem({ component: '' });
  };
  /*
   * 发布表单
   */
  const handleFormSave = () => {
    if (formConfig.value.schemas.length) {


      const { payload: { schemas: yybschemas } } = commonFormConfig.value
      
      

      const options = yybschemas?.find(v => v.contactsType === "contactsOptions")
      

      const { schemas } = formConfig.value

      schemas.find(v => {
        if (v.contactsType === "contactsOptions") {

          return v.componentProps.options = options ? options?.componentProps?.options : v.componentProps.options
        }
      })
      emit('handleFormSave', formConfig);
    } else {
      message.error('请保证表单至少有一项');
    }
  };

  const setFormModel = (key, value) => {
    formModel.value[key] = value;
  };
  provide('formModel', formModel);
  // 把祖先组件的方法项注入到子组件中，子组件可通过inject获取
  provide<(key : String, value : any) => void>('setFormModelMethod', setFormModel);
  // region 注入给子组件的属性
  // provide('currentItem', formConfig.value.currentItem)

  
  // 把表单配置项注入到子组件中，子组件可通过inject获取，获取到的数据为响应式
  provide<Ref<IFormConfig>>('formConfig', formConfig);

  // 注入历史记录
  provide<UseRefHistoryReturn<any, any>>('historyReturn', historyReturn);

  // 把祖先组件的方法项注入到子组件中，子组件可通过inject获取
  provide<IFormDesignMethods>('formDesignMethods', {
    handleBeforeColAdd,
    handleCopy,
    handleListPush,
    handleSetSelectItem,
    handleAddAttrs,
    setFormConfig,
  });

  // endregion
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-form-design';

  [data-theme='dark'] {
    .@{prefix-cls}-sider {
      background-color: #1f1f1f;
    }
  }

  [data-theme='light'] {
    .@{prefix-cls}-sider {
      background-color: #fff;
    }
  }

  .layout_sider_title {
    // padding: 5px;
    height: 45px;
    padding-left: 5px;
    border-bottom: 2px solid #ccc;
    font-size: 14px;
    font-weight: 700;
    line-height: 45px;

    .layout_sider_title_icon {
      padding-right: 5px;
    }
  }

  .Layout {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;

    .LayoutContent {
      height: 100%;
    }
  }

  :deep(.ant-form-item){
    margin-bottom: 0;
    background-color: #fff;
    // padding: 0 0.5rem;
    // padding-bottom: 20px;
  }

  .layout_phone {
    :deep(.form-panel) {
      display: flex;
      justify-content: center;
      padding-top: 50px;
      transition: all 1.5s;

      .draggable_form {
        width: 545px;
        height: 800px;
        border: 14px solid rgb(255 255 255 / 100%);
        border-radius: 45px;
        box-shadow: 0 2px 40px 0 rgb(190 190 190 / 10%);
      }
    }
  }
</style>
