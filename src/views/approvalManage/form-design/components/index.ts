import type { Component } from 'vue';
import { ComponentType } from '/@/components/Form/src/types';
import { IconPicker } from '/@/components/Icon/index';
import { BasicModal } from '/@/components/Modal';
/**
 * Component list, register here to setting it in the form
 */
//ant-desing本身的Form控件库

// import {
//   Input,
//   Button,
//   Select,
//   Radio,
//   Checkbox,
//   AutoComplete,
//   Cascader,
//   DatePicker,
//   InputNumber,
//   Switch,
//   TimePicker,
//   // ColorPicker,
//   TreeSelect,
//   Slider,
//   Rate,
//   Divider,
//   Calendar,
//   Transfer,
// } from 'ant-design-vue';

// 引入vant
import {
  Field,
  Divider,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Calendar,
  Uploader,
  TextEllipsis,
  Cell,
  Picker,
  Popup,
} from 'vant';

const componentMap = new Map<string, Component>();
// componentMap.set('Radio', Radio);
// componentMap.set('Calendar', Calendar);
componentMap.set('VanCell', Cell);
componentMap.set('BasicModal', BasicModal);
componentMap.set('VanInput', Field);
componentMap.set('VanDivider', Divider);
componentMap.set('VanRadio', Radio);
componentMap.set('VanRadioGroup', RadioGroup);
componentMap.set('VanCheckbox', Checkbox);
componentMap.set('VanCheckboxGroup', CheckboxGroup);
componentMap.set('VanCalendar', Calendar);
componentMap.set('VanUploader', Uploader);
componentMap.set('VanTextEllipsis', TextEllipsis);
componentMap.set('VanPicker', Picker);
componentMap.set('VanPopup', Popup);
// componentMap.set('InputGroup', Input.Group);
// componentMap.set('InputPassword', Input.Password);
// componentMap.set('InputSearch', Input.Search);
// componentMap.set('InputTextArea', Input.TextArea);
// componentMap.set('InputNumber', InputNumber);
// componentMap.set('AutoComplete', AutoComplete);

// componentMap.set('Select', Select);
// componentMap.set('TreeSelect', TreeSelect);
// componentMap.set('Switch', Switch);
// componentMap.set('RadioGroup', Radio.Group);
// componentMap.set('Checkbox', Checkbox);
// componentMap.set('CheckboxGroup', Checkbox.Group);
// componentMap.set('Cascader', Cascader);
// componentMap.set('Slider', Slider);
// componentMap.set('Rate', Rate);
// componentMap.set('Transfer', Transfer);
// componentMap.set('DatePicker', DatePicker);
// componentMap.set('MonthPicker', DatePicker.MonthPicker);
// componentMap.set('RangePicker', DatePicker.RangePicker);
// componentMap.set('WeekPicker', DatePicker.WeekPicker);
// componentMap.set('TimePicker', TimePicker);

// componentMap.set('IconPicker', IconPicker);
// componentMap.set('Divider', Divider);

export function add(compName : ComponentType, component : Component) {
  componentMap.set(compName, component);
}

export function del(compName : ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
