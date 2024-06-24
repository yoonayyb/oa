<!--
 * @Description: 右侧属性配置面板
-->
<template>
  <div class="props-panel">
    <Tabs class="props-panel-tabs" v-model:activeKey="formConfig.activeKey" :tabBarStyle="{ margin: 0 }">
      <TabPane :key="1" tab="表单">
        <FormProps />
      </TabPane>
      <TabPane :key="2" tab="控件">
        <FormItemProps />
      </TabPane>
      <!-- <TabPane :key="3" tab="栅格">
        <ComponentColumnProps />
      </TabPane> -->
      <TabPane :key="4" tab="组件">
        <slot v-if="slotProps" :name="slotProps.component + 'Props'"></slot>
        <ComponentProps />
      </TabPane>
    </Tabs>
    <!-- <div class="form_item_props">
      <FormItemProps />
    </div> -->
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import FormProps from '../components/FormProps.vue';
  import FormItemProps from '../components/FormItemProps.vue';
  import ComponentProps from '../components/ComponentProps.vue';
  import ComponentColumnProps from '../components/FormItemColumnProps.vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { customComponents } from '../../../core/formItemConfig';
  import { TabPane, Tabs } from 'ant-design-vue';

  type ChangeTabKey = 1 | 2;
  export interface IPropsPanel {
    changeTab : (key : ChangeTabKey) => void;
  }
  export default defineComponent({
    name: 'PropsPanel',
    components: {
      FormProps,
      FormItemProps,
      ComponentProps,
      ComponentColumnProps,
      Tabs,
      TabPane,
    },
    setup() {
      const { formConfig } = useFormDesignState();
      
      formConfig.value.currentItem.componentProps = {
        ...formConfig.value.currentItem.componentProps,
        labelInValue:true,
        labelField:'name',
        valueField:'id'
      }
      // console.log('formConfigformConfig: ', formConfig.value.currentItem.componentProps)
      // labelInValue:true,labelField:'name',valueField:'id'
      const slotProps = computed(() => {
        
        return customComponents.find(
          (item) => item.component === formConfig.value.currentItem?.component,
        );
      });
      console.log('[ slotProps ]-53', slotProps);
      return { formConfig, customComponents, slotProps };
    },
  });
</script>

<style lang="less" scoped>
  @import url('../styles/variable.less');

  // 修复控件不显示问题
  .props-panel {
    height: 100%;

    .props-panel-tabs {
      height: 100%;
      padding-left: 0.5rem;

      :deep(.ant-tabs-content-holder) {
        height: 100%;
      }

      :deep(.ant-tabs-content) {
        height: 100%;
      }
    }
  }

  :deep(.ant-tabs) {
    box-sizing: border-box;

    form {
      // position: absolute;
      width: 100%;
      // height: calc(100% - 50px);
      margin-right: 10px;
      // overflow-x: hidden;
      // overflow-y: auto;
    }

    .hint-box {
      margin-top: 200px;
    }

    .ant-form-item,
    .ant-slider-with-marks {
      margin-right: 20px;
      margin-bottom: 0;
      margin-left: 10px;
    }

    .ant-form-item {
      // width: 100%;
      margin-bottom: 0;

      .ant-form-item-label {
        line-height: 2;
        vertical-align: text-top;
      }
    }

    .ant-input-number {
      width: 100%;
    }
  }

  .form_item_props {
    // padding: 0.5rem;
  }
</style>
