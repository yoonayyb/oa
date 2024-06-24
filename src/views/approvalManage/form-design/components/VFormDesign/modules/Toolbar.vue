<!--
 * @Description: 工具栏
-->
<template>
  <div class="operating-area">
    <!-- 头部操作按钮区域 start -->
    <!-- 操作左侧区域 start -->
    <div class="left-btn-box">
      <Tooltip v-for="item in toolbarsConfigs" :title="item.title" :key="item.icon">
        <a @click="$emit(item.event,item.val)" class="toolbar-text">
          <Icon :icon="item.icon" />
        </a>
      </Tooltip>
      <a-button type="primary" @click="$emit('handlePreview','preview')">预览</a-button>
      <a-button type="primary" @click="$emit('handleFormSave','release')">保存</a-button>
      <!-- <Divider type="vertical" />
      <Tooltip title="撤销">
        <a :class="{ disabled: !canUndo }" :disabled="!canUndo" @click="undo">
          <Icon icon="ant-design:undo-outlined" />
        </a>
      </Tooltip>
      <Tooltip title="重做">
        <a :class="{ disabled: !canRedo }" :disabled="!canRedo" @click="redo">
          <Icon icon="ant-design:redo-outlined" />
        </a>
      </Tooltip> -->
      <!-- <Divider type="vertical" /> -->
    </div>
  </div>
  <!-- 操作区域 start -->
</template>
<script lang="ts">
  import { defineComponent, inject, reactive, toRefs } from 'vue';
  import { UseRefHistoryReturn } from '@vueuse/core';
  import { IFormConfig } from '../../../typings/v-form-component';
  import { Tooltip, Divider } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';

  interface IToolbarsConfig {
    type: string;
    title: string;
    icon: string;
    event: string;
  }

  export default defineComponent({
    name: 'OperatingArea',
    components: {
      Tooltip,
      Icon,
      Divider,
    },
    setup() {
      const state = reactive<{
        toolbarsConfigs: IToolbarsConfig[];
      }>({
        toolbarsConfigs: [
          // {
          //   title: '预览',
          //   type: 'preview',
          //   event: 'handlePreview',
          //   icon: 'ant-design:chrome-filled',
          // },
          // {
          //   title: '预览-不支持布局',
          //   type: 'preview',
          //   event: 'handlePreview2',
          //   icon: 'ant-design:chrome-filled',
          // },
          // {
          //   title: '导入JSON',
          //   type: 'importJson',
          //   event: 'handleOpenImportJsonModal',
          //   icon: 'ant-design:import-outlined',
          // },
          {
            title: '生成JSON',
            type: 'exportJson',
            event: 'handleOpenJsonModal',
            icon: 'ant-design:export-outlined',
          },
          {
            title: '生成代码',
            type: 'exportCode',
            event: 'handleOpenCodeModal',
            icon: 'ant-design:code-filled',
          },
          {
            title: '清空',
            type: 'reset',
            event: 'handleClearFormItems',
            icon: 'ant-design:clear-outlined',
          },
          {
            title: '电脑端',
            val: 'computer',
            event: 'handleChangeLayoutContent',
            icon: 'ant-design:fund-projection-screen-outlined',
          },
          {
            title: '手机端',
            val: 'phone',
            event: 'handleChangeLayoutContent',
            icon: 'ant-design:mobile-outlined',
          },
        ],
      });
      const historyRef = inject('historyReturn') as UseRefHistoryReturn<IFormConfig, IFormConfig>;

      const { undo, redo, canUndo, canRedo } = historyRef;
      return { ...toRefs(state), undo, redo, canUndo, canRedo };
    },
  });
</script>

<style lang="less" scoped>
  //noinspection CssUnknownTarget
  @import url('../styles/variable.less');

  .operating-area {
    display: flex;
    align-content: center;
    justify-content: space-between;
    height: @operating-area-height;
    padding: 0 12px;
    padding-left: 45px;
    border-bottom: 2px solid @border-color;
    font-size: 16px;
    line-height: @operating-area-height;
    text-align: left;
    background-color: #fff;

    a {
      margin: 0 5px;
      color: #666;

      &.disabled,
      &.disabled:hover {
        color: #ccc;
      }

      &:hover {
        color: @primary-color;
      }

      > span {
        padding-left: 2px;
        font-size: 14px;
      }
    }
  }
  .left-btn-box {
    display: flex;
    align-items: center;
  }
</style>
