import type { PropType } from 'vue';
import { FileBasicColumn } from './types/typing';

import type { Options } from 'sortablejs';

import { Merge } from '@/utils/types';
  import {  get_upload_params } from '/@/api/upload/upload';
type SortableOptions = Merge<
  Omit<Options, 'onEnd'>,
  {
    onAfterEnd?: <T = any, R = any>(params: T) => R;
    // ...可扩展
  }
>;

type ListType = 'text' | 'picture' | 'picture-card';

export const basicProps = {
  listType: {
    type: String as PropType<ListType>,
    default: 'picture-card',
  },
  helpText: {
    type: String as PropType<string>,
    default: '',
  },
  // 文件最大多少MB
  maxSize: {
    type: Number as PropType<number>,
    default: 100,
  },
  // 最大数量的文件，Infinity不限制
  maxNumber: {
    type: Number as PropType<number>,
    default: 10,
  },
  // 根据后缀，或者其他
  accept: {
    type: Array as PropType<string[]>,
    default: () => ['png','jpg','jpeg','png','gif','webp','mp4','pdf','doc','docx','xlsx','ppt','pptx'],
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  uploadParams: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  api: {
    type: Function as PropType<PromiseFn>,
    default: get_upload_params,
    required: true,
  },
  name: {
    type: String as PropType<string>,
    default: 'file',
  },
  filename: {
    type: String as PropType<string>,
    default: null,
  },
  fileListOpenDrag: {
    type: Boolean,
    default: true,
  },

  fileListDragOptions: {
    type: Object as PropType<SortableOptions>,
    default: () => ({}),
  },
  is_netdisk: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  parent_id:{
   type: Array as PropType<string[]>,
   default: () => [0],
  },
};

export const uploadContainerProps = {
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  ...basicProps,
  showPreviewNumber: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  emptyHidePreview: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  is_netdisk: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  parent_id:{
   type: Array as PropType<string[]>,
   default: () => [0],
  },
};

export const previewProps = {
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
};

export const fileListProps = {
  columns: {
    type: Array as PropType<FileBasicColumn[]>,
    default: null,
  },
  actionColumn: {
    type: Object as PropType<FileBasicColumn>,
    default: null,
  },
  dataSource: {
    type: Array as PropType<any[]>,
    default: null,
  },
  openDrag: {
    type: Boolean,
    default: false,
  },
  dragOptions: {
    type: Object as PropType<SortableOptions>,
    default: () => ({}),
  },
};
