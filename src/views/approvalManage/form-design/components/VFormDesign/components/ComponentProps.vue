<!--
 * @Description: 控件组件属性
-->
<template>
  <div class="properties-content">
    <div class="properties-body" v-if="formConfig.currentItem">
      <Empty class="hint-box" v-if="!formConfig.currentItem.field" description="未选择组件" />

      <Form label-align="left" layout="vertical">
        <!-- vant组件属性 -->

        <div v-if="formConfig.currentItem && formConfig.currentItem.component.includes('Van')">
          <!--    循环遍历渲染组件属性      -->
          <FormItem v-for="item in vantCompOptions" :key="item.name" :label="item.label">
            <RadioGroup v-if="item.componentProps && item.componentProps.options"
              v-model:value="formConfig.currentItem.componentProps.customProps[item.name]">
              <Radio v-for="val in item.componentProps.options" :key="val.label" :value="val.value">
                {{ val.label }}
              </Radio>
            </RadioGroup>
            <div v-else>
              <component :is="item.component"
                v-model:value="formConfig.currentItem.componentProps.customProps[item.name]" />
            </div>
          </FormItem>

          <!-- 非控制属性 -->
          <FormItem v-for="item in inputOptions" :key="item.name" :label="item.label">
            <!--     处理数组属性，placeholder       -->
            <div v-if="item.children">
              <component v-for="(child, index) of item.children" :key="index" v-bind="child.componentProps"
                :is="child.component" v-model:value="formConfig.currentItem.componentProps[item.name][index]" />
            </div>
            <!--     如果不是数组，则正常处理属性值       -->
            <component v-else class="component-prop" v-bind="item.componentProps" :is="item.component"
              v-model:value="formConfig.currentItem.componentProps[item.name]" />
          </FormItem>
          <FormItem label="控制属性">
            <Col v-for="item in controlOptions" :key="item.name">
            <Checkbox v-if="showControlAttrs(item.includes)" v-bind="item.componentProps"
              v-model:checked="formConfig.currentItem.componentProps[item.name]">
              {{ item.label }}
            </Checkbox>
            </Col>
          </FormItem>
        </div>
        <FormItem label="关联字段">
          <Select @change="linkChange" mode="multiple" v-model:value="formConfig.currentItem['link']"
            :options="linkOptions" />
        </FormItem>
        <FormItem label="传参方法">
         <Input :style="{ width: '100%' }" v-model:value="formConfig.currentItem.applay" />
        </FormItem>
        <FormItem label="api接口配置">
          
           <FormItem label="labelInValue">
          <RadioGroup 
            v-model:value="formConfig.currentItem.componentProps.labelInValue">
            <Radio v-for="val in [{value:true,label:'是'},{value:false,label:'否'}]" :key="val.label" :value="val.value">
              {{ val.label }}
            </Radio>
          </RadioGroup>
           </FormItem>
          <FormItem label="api">
           <Input :style="{ width: '100%' }" v-model:value="formConfig.currentItem.componentProps.apiy" />
          </FormItem>
          <FormItem label="api参数配置">
           <FormItem label="api的labelField">
            <Input :style="{ width: '100%' }" v-model:value="formConfig.currentItem.componentProps.labelField" />
           </FormItem>
           <FormItem label="api的valueField">
            <Input :style="{ width: '100%' }" v-model:value="formConfig.currentItem.componentProps.valueField" />
           </FormItem>
           
           <FormItem label="传参">
            <Input :style="{ width: '100%' }" v-model:value="formConfig.currentItem.componentProps.params" />
           </FormItem>
          </FormItem>
          
         
        </FormItem>
        <template v-if="componentOption.includes(formConfig.currentItem.component)">
          <FormItem label="选项">
            <FormOptions />
          </FormItem>
        </template>

        <FormItem label="栅格" v-if="['Grid'].includes(formConfig.currentItem.component)">
          <FormOptions />
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script lang="ts">
  import {
    Empty,
    Input,
    Form,
    FormItem,
    Switch,
    Checkbox,
    Select,
    SelectOption,
    InputNumber,
    Radio,
    RadioGroup,
    Col,
    Row,
  } from 'ant-design-vue';
  import RadioButtonGroup from '/@/components/Form/src/components/RadioButtonGroup.vue';
  import { computed, defineComponent, ref, watch } from 'vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import {
    baseComponentControlAttrs,
    baseComponentAttrs,
    baseComponentCommonAttrs,
    componentPropsFuncs,
    baseVantComponentAttrs,
  } from '../../VFormDesign/config/componentPropsConfig';
  import FormOptions from './FormOptions.vue';
  import { formItemsForEach, remove } from '../../../utils';
  import { IBaseFormAttrs } from '../config/formItemPropsConfig';

  export default defineComponent({
    name: 'ComponentProps',
    components: {
      FormOptions,
      Empty,
      Input,
      Form,
      FormItem,
      Switch,
      Checkbox,
      Select,
      SelectOption,
      InputNumber,
      Radio,
      RadioGroup,
      RadioButtonGroup,
      Col,
      Row,
    },
    setup() {
      const selectValue = ref({
        label: '',
        key: '',
      });
      const componentOption = [
        'VanCheckboxGroup',
        'VanRadioGroup',
        'Select',
        'CheckboxGroup',
        'RadioGroup',
        'TreeSelect',
        'Cascader',
        'AutoComplete',
      ];
      // 让compuated属性自动更新

      const allOptions = ref([] as Omit<IBaseFormAttrs, 'tag'>[]);
      const showControlAttrs = (includes : string[] | undefined) => {
        if (!includes) return true;
        return includes.includes(formConfig.value.currentItem!.component);
      };

      const { formConfig } = useFormDesignState();

      if (formConfig.value.currentItem) {
        
        formConfig.value.currentItem.componentProps =
          formConfig.value.currentItem.componentProps  ||{};
      }

      // watch(
      //   () => formConfig.value.currentItem?.field,
      //   (_newValue, oldValue) => {
      //     formConfig.value.schemas &&
      //       formItemsForEach(formConfig.value.schemas, (item) => {
      //         if (item?.link) {
      //           const index = item.link.findIndex((linkItem) => linkItem === oldValue);
      //           index !== -1 && remove(item.link, index);
      //         }
      //       });
      //   },
      // );
      // watch(()=> formConfig.value.currentItem && formConfig.value.currentItem.componentProps,(val)=>{
      //   console.log('val: ', val)
        
      // })
      watch(
        () => formConfig.value.currentItem && formConfig.value.currentItem.component,
        () => {
          allOptions.value = [];
          baseComponentControlAttrs.forEach((item) => {
            item.category = 'control';
            if (!item.includes) {
              // 如果属性没有include，所有的控件都适用
              allOptions.value.push(item);
            } else if (item.includes.includes(formConfig.value.currentItem!.component)) {
              // 如果有include，检查是否包含了当前控件类型
              allOptions.value.push(item);
            }
          });

          baseComponentCommonAttrs.forEach((item) => {
            item.category = 'input';
            if (item.includes) {
              if (item.includes.includes(formConfig.value.currentItem!.component)) {
                allOptions.value.push(item);
              }
            } else if (item.exclude) {
              if (!item.exclude.includes(formConfig.value.currentItem!.component)) {
                allOptions.value.push(item);
              }
            } else {
              allOptions.value.push(item);
            }
          });

          baseVantComponentAttrs.forEach((item) => {
            item.category = 'vant';
            if (!item.includes) {
              // 如果属性没有include，所有的控件都适用
              allOptions.value.push(item);
            } else if (item.includes.includes(formConfig.value.currentItem!.component)) {
              // 如果有include，检查是否包含了当前控件类型
              allOptions.value.push(item);
            }
          });

          baseComponentAttrs[formConfig.value.currentItem!.component] &&
            baseComponentAttrs[formConfig.value.currentItem!.component].forEach(async (item) => {
              if (item.component) {
                if (['Switch', 'Checkbox', 'Radio'].includes(item.component)) {
                  item.category = 'control';
                  allOptions.value.push(item);
                } else {
                  item.category = 'input';
                  allOptions.value.push(item);
                }
              }
            });
        },
        {
          immediate: true,
        },
      );
      // 控制性的选项
      const controlOptions = computed(() => {
        return allOptions.value.filter((item) => {
          return item.category == 'control';
        });
      });

      // 非控制性选择
      const inputOptions = computed(() => {
        return allOptions.value.filter((item) => {
          return item.category == 'input';
        });
      });
      // vant组件
      const vantCompOptions = computed(() => {
        return allOptions.value.filter((item) => {
          return item.category == 'vant';
        });
      });
      console.log('[ inputOptions ]-233', vantCompOptions);

      watch(
        () => formConfig.value.currentItem!.componentProps,
        () => {
          const func = componentPropsFuncs[formConfig.value.currentItem!.component];
          if (func) {
            func(formConfig.value.currentItem!.componentProps, allOptions.value);
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      const linkOptions = computed(() => {
        return (
          formConfig.value.schemas &&
          formConfig.value.schemas
            .filter((item) => item.field !== formConfig.value.currentItem!.field)
            .map(({ label, field }) => {
              return { label: label + '/' + field, value: field };
            })
        );
      });
      const linkChange = (val) => {
        // formConfig.value.currentItem.field;
      };
      return {
        linkChange,
        vantCompOptions,
        formConfig,
        showControlAttrs,
        linkOptions,
        controlOptions,
        inputOptions,
        componentOption,
      };
    },
  });
</script>
