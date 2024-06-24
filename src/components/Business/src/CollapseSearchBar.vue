<template>
  <a-form :model="formState" ref="searchFromRef" :label-col="labelCol" :colon="false">
    <a-collapse
      class="reverse"
      :class="{ header_trends_style: headerSchema?.length > 0 }"
      v-model:activeKey="activeKey"
      expandIconPosition="end"
      collapsible="icon"
    >
      <template #expandIcon="{ isActive }">
        <!-- 只为隐藏收缩图标 -->
        <span v-if="hiddenIocn || contentSchema.length === 0"> </span>
        <span class="expandIcon" v-else-if="isActive"> 收起 <caret-right-outlined :rotate="90" /> </span>
        <span class="expandIcon" v-else> 筛选 <caret-right-outlined :rotate="270" /> </span>
      </template>
      <a-collapsePanel key="1" :style="customStyle">
        <template #header>
          <div class="form_item_box">
            <CollapseSearchBarItem v-for="(item, index) in headerSchema" :key="index" :item="item" :formState="formState" />
            <div class="form_item_box">
              <CollapseSearchBarItem
                v-for="(item, index) in [...defaultBtnSchema, ...btnSchema]"
                :key="index"
                :item="item"
                :formState="formState"
              />
            </div>
          </div>
        </template>
        <slot name="content">
          <div class="form_item_box">
            <CollapseSearchBarItem v-for="(item, index) in contentSchema" :key="index" :item="item" :formState="formState" />
          </div>
        </slot>
      </a-collapsePanel>
    </a-collapse>
  </a-form>
</template>
<script lang="ts" setup>
  import { CaretRightOutlined } from '@ant-design/icons-vue';
  import CollapseSearchBarItem from './CollapseSearchBarItem.vue';
  interface schemaItem {
    field: string; //绑定的字段
    label?: string; //显示的label
    component: string; // 组件
    bind?: object; //需要绑定的参数  如:format: 'YYYY-MM-DD'; :type='primary'  :onChange=()=>{}
    text?: string; // 文本 比如按钮中间的文字
    width?: number; // 宽度
  }
  const props = defineProps({
    formState: {
      type: Object,
      default: {},
    },
    initForm: {
      //初始化时的form
      type: Function,
      default: null,
    },
    hiddenIocn: {
      type: Boolean,
      default: false,
    },
    btnSchema: {
      type: Array as () => Array<SchemaItem>,
      default: [],
    },
    headerSchema: {
      type: Array as () => Array<SchemaItem>,
      default: [],
    },
    contentSchema: {
      type: Array as () => Array<SchemaItem>,
      default: [],
    },
    formLabelColStyle: {
      type: Object,
      default: {},
    },
  });
  const emit = defineEmits(['reset']);
  // let currentComp = {};
  // const clickComp = (item) => {
  //   currentComp = item;
  // };
  // const bindObj = {
  //   'onUpdate:value': (e) => {
  //     props.formState[currentComp.field] = e;
  //   },
  // };
  const activeKey = ref([]);
  const searchFromRef = ref();
  const labelCol = {
    style: {
      minWidth: '90px',
      ...props.formLabelColStyle,
    },
  };
  const customStyle = 'background: #fff;border-radius: 4px;margin-bottom: 24px;';
  const defaultBtnSchema =
    props.initForm === null
      ? [] //如果没用initForm 就不默认重置按钮
      : [
          {
            component: 'Button',
            text: '重置',
            bind: {
              // type: 'primary',
              onClick: () => {
                // searchFromRef.value.resetFields()
                const newFormState = props.initForm();
                Object.keys(props.formState).forEach((key) => {
                  props.formState[key] = newFormState[key];
                });
                emit('reset');
              },
            },
          },
        ];
</script>
<style lang="less" scoped>
  .reverse {
    border: 0;

    // 让折叠面板向上展开
    :deep(.ant-collapse-item) {
      display: flex;
      flex-direction: column-reverse;
      // align-items: baseline;
    }

    :deep(.ant-collapse-content-box) {
      padding-bottom: 0;
    }

    :deep(.ant-collapse-item-active) {
      .ant-collapse-header {
        padding-top: 0;
        // padding-bottom: 0;
      }
    }
  }

  .header_trends_style {
    :deep(.ant-collapse-header) {
      padding-top: 24px;
      padding-bottom: 0;
    }
  }

  .form_item_box {
    display: flex;
    flex-wrap: wrap;

    .form_item {
      // padding: 0 8px;
      // margin-right: 28px;
    }
  }

  :deep(.ant-picker) {
    width: 100%;
  }

  .expandIcon {
    display: inline-block;
    // padding-top: 50px;
    width: 70px;
    font-size: 14px !important;
  }
</style>
