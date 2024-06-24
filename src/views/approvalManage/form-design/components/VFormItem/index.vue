<!--
 * @Description:
-->
<template>
  <Col v-bind="colPropsComputed">
  <FormItem v-bind="{ ...formItemProps }">
    <template #label v-if="!formItemProps.hiddenLabel && schema.component !== 'Divider'">
      <Tooltip>
        <span>{{ schema.label }}</span>
        <template #title v-if="schema.helpMessage"><span>{{ schema.helpMessage }}</span></template>
        <Icon v-if="schema.helpMessage" class="ml-5" icon="ant-design:question-circle-outlined" />
      </Tooltip>
    </template>
    <slot v-if="schema.componentProps && schema.componentProps?.slotName" :name="schema.componentProps.slotName"
      v-bind="schema"></slot>
    <Divider v-else-if="schema.component == 'Divider' && schema.label && !formItemProps.hiddenLabel">{{ schema.label }}
    </Divider>
    <!-- 部分控件需要一个空div -->
    <div>
      <!--       v-bind="{ ...vModalProps,...cmpProps, ...asyncProps,...customProps }" :schema="schema"
        :style="schema.width ? { width: schema.width } : {}" @change="handleChange"
        @click="handleClick(schema,formConfig)"  -->

      <component class="v-form-item-wrapper" :is="componentItem" v-bind="getVModelBindings" v-model="getVModel"
        v-model:open="getVModel" v-model:show="getVModel">
        <template v-if="customChildrenComponent && customChildrenProps?.options">
          <!-- 多选框子选项 -->
          <component v-bind="getChildVModelBindings" :is="getCustomChildrenComponent"
            v-for="(item, index) in customChildrenProps.options" :key="item.value + index" :name="item.value">
            {{ item.label }}
          </component>
        </template>
        <template v-else-if="customChildrenComponent && customChildrenProps">
          <component v-bind="getChildVModelBindings" :is="getCustomChildrenComponent">
            {{}}
          </component>
        </template>
      </component>
    </div>
    <span v-if="['Button'].includes(schema.component)">{{ schema.label }}</span>
  </FormItem>
  </Col>
</template>
<script lang="ts">
  import { type Recordable } from '@vben/types';
  import { defineComponent, reactive, toRefs, computed, PropType, unref, watch, ref } from 'vue';
  import { componentMap } from '../../core/formItemConfig';
  import { IVFormComponent, IFormConfig } from '../../typings/v-form-component';
  import { asyncComputed } from '@vueuse/core';
  import { handleAsyncOptions } from '../../utils';
  import { omit } from 'lodash-es';
  import { Tooltip, FormItem, Divider, Col } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useFormModelState } from '../../hooks/useFormDesignState';
  export default defineComponent({
    name: 'VFormItem',
    components: {
      Tooltip,
      Icon,
      FormItem,
      Divider,
      Col,
    },

    props: {
      formData: {
        type: Object,
        default: () => ({}),
      },
      schema: {
        type: Object as PropType<IVFormComponent>,
        required: true,
      },
      formConfig: {
        type: Object as PropType<IFormConfig>,
        required: true,
      },
    },
    emits: ['update:form-data', 'change'],
    setup(props, { emit }) {
      const state = reactive({
        componentMap,
      });

      const { formModel: formData1, setFormModel } = useFormModelState();
      const colPropsComputed = computed(() => {
        const { colProps = {} } = props.schema;
        return colProps;
      });

      const formItemProps = computed(() => {
        const { formConfig } = unref(props);
        let { field, required, rules, labelCol, wrapperCol } = unref(props.schema);
        const { colon } = props.formConfig;

        const { itemProps, hiddenLabel } = unref(props.schema);

        //<editor-fold desc="布局属性">
        labelCol = labelCol
          ? labelCol
          : formConfig.layout === 'horizontal'
            ? formConfig.labelLayout === 'flex'
              ? { style: `width:${formConfig.labelWidth}px` }
              : formConfig.labelCol
            : {};

        wrapperCol = wrapperCol
          ? wrapperCol
          : formConfig.layout === 'horizontal'
            ? formConfig.labelLayout === 'flex'
              ? { style: 'width:auto;flex:1' }
              : formConfig.wrapperCol
            : {};

        const style =
          formConfig.layout === 'horizontal' && formConfig.labelLayout === 'flex'
            ? { display: 'flex' }
            : {};

        /**
         * 将字符串正则格式化成正则表达式
         */

        const newConfig = Object.assign(
          {},
          {
            name: field,
            style: { ...style },
            colon,
            required,
            rules,
            labelCol,
            wrapperCol,
            hiddenLabel,
          },
          itemProps,
        );
        if (!itemProps?.labelCol?.span) {
          newConfig.labelCol = labelCol;
        }
        if (!itemProps?.wrapperCol?.span) {
          newConfig.wrapperCol = wrapperCol;
        }
        if (!itemProps?.rules) {
          newConfig.rules = rules;
        }
        return newConfig;
      }) as Recordable<any>;

      function getOrSetPropertyValue(schema, formItemProps, newValue) {
        const { componentProps } = schema;
        const propName = formItemProps.value.name;
        if (newValue !== undefined) {//赋值
          componentProps ? (componentProps[propName] = newValue) : (schema[propName] = newValue);
        } else {
          return componentProps ? componentProps[propName] : schema[propName];
        }
      }
      const getVModel = computed({
        get() {
          return getOrSetPropertyValue(props.schema, formItemProps);
        },
        set(newValue) {
          getOrSetPropertyValue(props.schema, formItemProps, newValue);
        },
      });
      let componentItem = computed(() => componentMap.get(props.schema.component as string));
      console.log('componentItem', componentItem)
      /**
       * 处理异步属性，异步属性会导致一些属性渲染错误，如defaultValue异步加载会导致渲染不出来，故而此处只处理options，treeData，同步属性在cmpProps中处理
       */
      const asyncProps = asyncComputed(async () => {
        let { options, treeData } = props.schema.componentProps ?? {};
        if (options) options = await handleAsyncOptions(options);
        if (treeData) treeData = await handleAsyncOptions(treeData);
        return {
          options,
          treeData,
        };
      });

      /**
       * 处理同步属性
       */
      const cmpProps = computed(() => {
        const isCheck =
          props.schema && ['Switch', 'Checkbox', 'Radio'].includes(props.schema.component);
        let { field } = props.schema;
        let { disabled, customProps, ...attrs } =
          omit(props.schema.componentProps, ['options', 'treeData']) ?? {};
        disabled = props.formConfig.disabled || disabled;
        console.log('[ attrs ]-190', attrs);
        // let customProps = props.schema.componentProps?.customProps;
        return {
          ...attrs,
          ...customProps,
          disabled,
          [isCheck ? 'checked' : 'value']: formData1.value[field!],
        };
      });

      const customChildrenComponent = cmpProps.value.customChildrenComponent;
      const customChildrenComponentName = customChildrenComponent?.component;
      const getCustomChildrenComponent = computed(() =>
        componentMap.get(customChildrenComponentName as string),
      );
      console.log('[ getCustomChildrenComponent ]-222', getCustomChildrenComponent);

      //获取子组件的配置
      const customChildrenProps = computed(() => {
        return {
          ...props.schema.componentProps?.customChildrenComponent?.componentProps,
          onConfirm: () => { },
          onCancel: () => { },
          onChange: () => { },
        };
      });
      const handleChange = function (e) {
        const isCheck = ['Switch', 'Checkbox', 'Radio'].includes(props.schema.component);
        const target = e ? e.target : null;
        const value = target ? (isCheck ? target.checked : target.value) : e;
        setFormModel(props.schema.field!, value);
        emit('change', value);
      };
      const handleUpdate = function (event) { };

      const handleClick = (schema : IVFormComponent, formConfig) => {
        try {
          if (schema.componentProps?.fn?.click && schema?.link) {
            let findSchema;
            //根据关联字段 获取所关联的组件
            schema.link.forEach((val) => {
              findSchema = formConfig.schemas.find((item) => {
                return item.field === val;
              });
            });
            schema.componentProps.fn.click(findSchema.componentProps, findSchema.field);
            // findSchema.componentProps[findSchema.field] = true;
            return;
          }

          if (schema.component === 'Button' && schema.componentProps?.handle)
            emit(schema.componentProps?.handle);
        } catch (error) { }
      };

      const handleInput = (e, componentProps, name) => {
        componentProps[name] = e.target.value;
      };
      const getVModelBindings = computed(() => {
        // console.log('[ cmpProps.value ]-251', cmpProps.value.style);
        return {
          ...cmpProps.value,
          ...asyncProps.value,
          schema: props.schema,
          style: props.schema.width
            ? { ...cmpProps.value.style, width: props.schema.width }
            : { ...cmpProps.value.style },
          // modelValue: props.schema.componentProps[formItemProps.value.name],
          onChange: handleChange,
          // onInput: (event) =>
          //   handleInput(event, props.schema.componentProps, formItemProps.value.name),
          onClick: () => handleClick(props.schema, props.formConfig),
        };
      });
      const getChildVModelBindings = computed(() => {
        try {
          let { ...attrs } = omit(customChildrenProps.value, ['options']) ?? {};
          return {
            ...attrs,
          };
        } catch (error) {
          console.log('[ error ]-274', error);
        }
      });

      return {
        ...toRefs(state),
        handleInput,
        componentItem,
        getVModelBindings,
        getVModel,
        getChildVModelBindings,
        customChildrenProps,
        // customProps,
        // styleProps,
        formItemProps,
        handleClick,
        // asyncProps,
        // cmpProps,
        handleChange,
        colPropsComputed,
        customChildrenComponent,
        getCustomChildrenComponent,
      };
    },
  });
</script>
<style lang="less" scoped>
  .ml-5 {
    margin-left: 5px;
  }

  // form字段中的标签有ant-col，不能使用width:100%
  :deep(.ant-col) {
    width: auto;
  }

  .ant-form-item:not(.ant-form-item-with-help) {
    margin-bottom: 20px;
  }

  @media screen and (max-width: 500px) {
    :deep(.ant-form-item-control) {
      flex: 0 0 100% !important
    }
  }

  // .w-full {
  //   width: 100% !important;
  // }
</style>
