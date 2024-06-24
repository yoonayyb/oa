/**
 * @description：表单配置
 */
import { IVFormComponent } from '../typings/v-form-component';
import { isArray } from 'lodash-es';
import { componentMap as VbenCmp, add } from '/@/components/Form/src/componentMap';
import { ComponentType } from '/@/components/Form/src/types';

import { componentMap as Cmp } from '../components';
import { Component } from 'vue';

const componentMap = new Map<string, Component>();

//如果有其它控件，可以在这里初始化

//注册Ant控件库
Cmp.forEach((value, key) => {
  componentMap.set(key, value);
  if (VbenCmp[key] == null) {
    add(key as ComponentType, value);
  }
});
//注册vben控件库
VbenCmp.forEach((value, key) => {
  componentMap.set(key, value);
});



export { componentMap };



/**
 * 设置自定义表单控件
 * @param {IVFormComponent | IVFormComponent[]} config
 */
// export function setFormDesignComponents(config: IVFormComponent | IVFormComponent[]) {
//   if (isArray(config)) {
//     config.forEach((item) => {
//       const { componentInstance: component, ...rest } = item;
//       componentMap[item.component] = component;
//       customComponents.push(Object.assign({ props: {} }, rest));
//     });
//   } else {
//     const { componentInstance: component, ...rest } = config;
//     componentMap[config.component] = component;
//     customComponents.push(Object.assign({ props: {} }, rest));
//   }
// }

// 左侧控件列表与初始化的控件属性
// props.slotName,会在formitem级别生成一个slot,并绑定当前record值
// 属性props，类型为对象，不能为undefined或是null。
export const baseComponents : IVFormComponent[] = [
  {
    component: 'VanInput',
    label: '单行输入框',
    icon: 'antOutline-font-colors|svg',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      type: 'text',
      placeholder: '请输入',
      customProps: {},
    },
  },
  {
    component: 'VanInput',
    label: '多行输入框',
    icon: 'antOutline-bars|svg',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      type: 'textarea',
      placeholder: '请输入',
      customProps: {},
    },
  },
  {
    component: 'VanInput',
    label: '数字输入框',
    icon: 'antOutline-number|svg',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      type: 'number',
      placeholder: '请输入',
      customProps: {},
    },
  },
  {
    component: 'VanDivider',
    label: '分割线',
    icon: 'antOutline-swap-right|svg',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      type: 'number',
    },
  },
  {
    component: 'VanRadio',
    label: '单选框',
    icon: 'antOutline-radio|svg',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      customProps: {
        shape: 'round', //square 方形 | round 圆形
      },
    },
  },

  {
    component: 'VanRadioGroup',
    label: '单选框-组',
    icon: 'carbon:radio-button-checked',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      customProps: {
        direction: 'horizontal', //vertical 垂直 | horizontal 水平
        shape: 'round', //square 方形 | round 圆形
      },
      customChildrenComponent: {
        component: 'VanRadio',
        componentProps: {
          style: {
            'margin-top': '5px',
          },
          options: [
            {
              label: '选项1',
              value: '1',
            },
            {
              label: '选项2',
              value: '2',
            },
          ],
        },
      },
    },
  },
  {
    component: 'VanCheckbox',
    label: '多选框',
    icon: 'antOutline-check-circle|svg',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      customProps: {
        // direction: 'horizontal', //vertical 垂直 | horizontal 水平
        shape: 'square', //square 方形 | round 圆形
      },
    },
  },
  {
    component: 'VanCheckboxGroup',
    label: '多选框-组',
    icon: 'ant-design:check-circle-filled',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      customProps: {
        direction: 'horizontal', //vertical 垂直 | horizontal 水平
        shape: 'square', //square 方形 | round 圆形
      },
      customChildrenComponent: {
        component: 'VanCheckbox',
        field: '',
        componentProps: {
          style: {
            'margin-top': '5px',
          },
          options: [
            {
              label: '选项1',
              value: '1',
            },
            {
              label: '选项2',
              value: '2',
            },
          ],
        },
      },
    },
  },
  {
    component: 'VanInput',
    label: '选择器',
    icon: 'ant-design:check-circle-filled',
    field: '',
    colProps: { span: 24 },
    hiddenLabel: true, //隐藏formlabel
    componentProps: {

      customProps: {
        label: '选择器', //使用vantinput自带的label
      },
      fn: {
        click: (props, field) => {
          console.log(props, field, 'props, field')
          //传入需要显示弹出框所绑定的field
          props[field] = true;
        },
      },
    },
  },
  {
    component: 'VanPopup',
    label: '选择器弹出框',
    icon: 'ant-design:check-circle-filled',
    field: '',
    colProps: { span: 24 },
    // hidden: true,
    componentProps: {
      customChildrenComponent: {
        component: 'VanPicker',
        field: '',
        componentProps: {
          columns: [
            { text: '温州', value: 'Wenzhou' },
            { text: '绍兴', value: 'Shaoxing' },
            { text: '湖州', value: 'Huzhou' },
          ],
          onConfirm: () => {
            console.log('[ onConfirm ]-218');
          },
          onCancel: () => {
            console.log('[ onCancel ]-218');
          },
          onChange: () => {
            console.log('[ onChange ]-218');
          },
        },
      },
    },
  },
  {
    component: 'VanCell',
    label: '日期',
    icon: 'antOutline-calendar|svg',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      customChildrenComponent: {
        component: 'VanCheckbox',
      },
    },
  },
  {
    component: 'VanCalendar',
    label: '日期区间',
    icon: 'iconPark-list-view|svg',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'VanUploader',
    label: '附件',
    icon: 'antOutline-paper-clip|svg',
    field: '',
    hiddenLabel: true,
    colProps: { span: 24 },
    componentProps: {
      class: {
        block: true,
        van_uploader_block: true,
      },
      customChildrenComponent: {
        component: 'VanCell',
        componentProps: {
          title: '附件',
          value: '点击上传',
        },
      },
    },
  },
  {
    component: 'VanTextEllipsis',
    label: '说明文字',
    icon: 'antOutline-question-circle|svg',
    field: '',
    colProps: { span: 24 },
    hiddenLabel: true,
    componentProps: {
      hiddenLabel: true,
      customProps: {
        content: '请在右侧组件属性中“展示的文本”中输入文本',
        rows: 1,
      },
    },
  },
];

//外部设置的自定义控件
export const customComponents : IVFormComponent[] = [
  {
    component: 'Input',
    label: '单行输入框',
    icon: 'bi:input-cursor-text',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      type: 'text',
      placeholder: '请输入',
    },
  },

  {
    component: 'InputTextArea',
    label: '文本域',
    icon: 'ant-design:file-text-filled',
    field: '',
    colProps: { span: 24 },
    componentProps: { placeholder: '请输入' },
  },
  {
    component: 'InputNumber',
    label: '数字输入框',
    icon: 'ant-design:field-number-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: { placeholder: '请输入' },
  },
  // {
  //   component: 'InputCountDown',
  //   label: '倒计时输入',
  //   icon: 'line-md:iconify2',
  //   colProps: { span: 24 },
  //   field: '',
  //   componentProps: {},
  // },
  // {
  //   component: 'IconPicker',
  //   label: '图标选择器',
  //   icon: 'line-md:iconify2',
  //   colProps: { span: 24 },
  //   field: '',
  //   componentProps: {},
  // },
  // {
  //   component: 'StrengthMeter',
  //   label: '密码强度',
  //   icon: 'wpf:password1',
  //   colProps: { span: 24 },
  //   field: '',
  //   componentProps: {},
  // },
  // {
  //   component: 'AutoComplete',
  //   label: '自动完成',
  //   icon: 'wpf:password1',
  //   colProps: { span: 24 },
  //   field: '',
  //   componentProps: {
  //     placeholder: '请输入正则表达式',
  //     options: [
  //       {
  //         value: '/^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/',
  //         label: '手机号码',
  //       },
  //       {
  //         value: '/^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/',
  //         label: '网址带端口号',
  //       },
  //     ],
  //   },
  // },
  {
    component: 'Divider',
    label: '分割线',
    icon: 'radix-icons:divider-horizontal',
    colProps: { span: 24 },
    field: '',
    componentProps: {
      orientation: 'center',
      dashed: true,
    },
  },
  // {
  //   component: 'Radio',
  //   label: '单选框',
  //   icon: 'ant-design:check-circle-outlined',
  //   field: '',
  //   colProps: { span: 24 },
  //   componentProps: {},
  // },
  {
    component: 'RadioGroup',
    label: '单选框-组',
    icon: 'carbon:radio-button-checked',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      labelInValue: true,
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  // {
  //   component: 'Checkbox',
  //   label: '多选框',
  //   icon: 'ant-design:check-circle-outlined',
  //   colProps: { span: 24 },
  //   field: '',
  // },
  {
    component: 'CheckboxGroup',
    label: '多选框-组',
    icon: 'ant-design:check-circle-filled',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      labelInValue: true,
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },


  {
    component: 'Select',
    label: '下拉选择',
    icon: 'gg:select',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },

  {
    component: 'ApiSelect',
    label: 'api下拉选择',
    icon: 'gg:select',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },


  {
    component: 'DatePicker',
    label: '日期选择',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'RangePicker',
    label: '日期范围',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      placeholder: ['开始日期', '结束日期'],
    },
  },
  {
    component: 'MonthPicker',
    label: '月份选择',
    icon: 'healthicons:i-schedule-school-date-time-outline',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      placeholder: '请选择月份',
    },
  },
  {
    component: 'TimePicker',
    label: '时间选择',
    icon: 'healthicons:i-schedule-school-date-time',
    field: '',
    colProps: { span: 24 },
    componentProps: {},
  },
  {
    component: 'ApiTreeSelect',
    label: '部门',
    icon: 'gg:select',
    field: 'company_department_ids',
    colProps: { span: 24 },
    contactsType: 'form_department',
    componentProps: {
      labelInValue: true,
      labelField: 'title',
      valueField: 'id',
      api: () => {
        return new Promise((resolve, reject) => {
          window.http.get({
            url: '/company_center/department_api/select',
            params: { company_id: localStorage.getItem('companyId') },
          }).then(res => (resolve(res)))
        })
      }
    },
  },
  {
    component: 'ApiSelect',
    label: '联系人',
    icon: 'gg:select',
    field: '',
    colProps: { span: 24 },
    contactsType: 'contactsOptions',
    slot: 'contactsOptions',
    rules: [{ required: true, message: '请选择', type: 'array', trigger: ['blur'] }],
    componentProps: {
    },
  },
  // {
  //   component: 'Slider',
  //   label: '滑动输入条',
  //   icon: 'vaadin:slider',
  //   field: '',
  //   colProps: { span: 24 },
  //   componentProps: {},
  // },
  // {
  //   component: 'Rate',
  //   label: '评分',
  //   icon: 'ic:outline-star-rate',
  //   field: '',
  //   colProps: { span: 24 },
  //   componentProps: {},
  // },
  // {
  //   component: 'Switch',
  //   label: '开关',
  //   icon: 'entypo:switch',
  //   field: '',
  //   colProps: { span: 24 },
  //   componentProps: {},
  // },
  // {
  //   component: 'TreeSelect',
  //   label: '树形选择',
  //   icon: 'clarity:tree-view-line',
  //   field: '',
  //   colProps: { span: 24 },
  //   componentProps: {
  //     treeData: [
  //       {
  //         label: '选项1',
  //         value: '1',
  //         children: [
  //           {
  //             label: '选项三',
  //             value: '1-1',
  //           },
  //         ],
  //       },
  //       {
  //         label: '选项2',
  //         value: '2',
  //       },
  //     ],
  //   },
  // },
  {
    component: 'Aupload',
    label: '图片上传',
    icon: 'ant-design:upload-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      limitNum: 5,
    },
  },
  {
    component: 'Upload',
    label: '附件',
    icon: 'ant-design:upload-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {
      limitNum: 5,
    },
  },
  {
    component: 'BasicModal',
    label: '对话框',
    icon: 'ant-design:upload-outlined',
    field: '',
    colProps: { span: 24 },
    componentProps: {

    },
  },
  // {
  //   component: 'Cascader',
  //   label: '级联选择',
  //   icon: 'ant-design:check-outlined',
  //   field: '',
  //   colProps: { span: 24 },
  //   componentProps: {
  //     options: [
  //       {
  //         label: '选项1',
  //         value: '1',
  //         children: [
  //           {
  //             label: '选项三',
  //             value: '1-1',
  //           },
  //         ],
  //       },
  //       {
  //         label: '选项2',
  //         value: '2',
  //       },
  //     ],
  //   },
  // },
  // {
  //   component: 'Button',
  //   label: '按钮',
  //   icon: 'dashicons:button',
  //   field: '',
  //   colProps: { span: 24 },
  //   hiddenLabel: true,
  //   componentProps: {},
  // },
  // {
  //   component: 'ColorPicker',
  //   label: '颜色选择器',
  //   icon: 'carbon:color-palette',
  //   field: '',
  //   colProps: { span: 24 },
  //   componentProps: {
  //     defaultValue: '',
  //     value: '',
  //   },
  // },

  // {
  //   component: 'slot',
  //   label: '插槽',
  //   icon: 'vs:timeslot-question',
  //   field: '',
  //   colProps: { span: 24 },
  //   componentProps: {
  //     slotName: 'slotName',
  //   },
  // },
];
// https://next.antdv.com/components/transfer-cn
const transferControl = {
  component: 'Transfer',
  label: '穿梭框',
  icon: 'bx:bx-transfer-alt',
  field: '',
  colProps: { span: 24 },
  componentProps: {
    render: (item) => item.title,
    dataSource: [
      {
        key: 'key-1',
        title: '标题1',
        description: '描述',
        disabled: false,
        chosen: true,
      },
      {
        key: 'key-2',
        title: 'title2',
        description: 'description2',
        disabled: true,
      },
      {
        key: 'key-3',
        title: '标题3',
        description: '描述3',
        disabled: false,
        chosen: true,
      },
    ],
  },
};

customComponents.push(transferControl);
export const layoutComponents : IVFormComponent[] = [
  {
    field: '',
    component: 'Grid',
    label: '栅格布局',
    icon: 'icon-grid',
    componentProps: {},
    columns: [
      {
        span: 12,
        children: [],
      },
      {
        span: 12,
        children: [],
      },
    ],
    colProps: { span: 24 },
    options: {
      gutter: 0,
    },
  },
];
