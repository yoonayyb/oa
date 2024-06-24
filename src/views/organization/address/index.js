import { useConfigStore } from '@/store/modules/config';
let { staffTypeOption, staffStatusOption } = useConfigStore();
import { formatToDate } from '/@/utils/dateUtil';

const schemas = [
  {
    field: 'name',
    label: '名字',
    placeholder: '请输入',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'mobile',
    label: '手机号',
    placeholder: '请输入',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'type',
    label: '类型',
    placeholder: '请输入',
    component: 'Select',
    componentProps: {
      options: staffTypeOption,
    },
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '员工状态',
    placeholder: '请输入',
    component: 'Select',
    componentProps: {
      options: staffStatusOption,
    },
    colProps: { span: 6 },
  },
];

const columns = [
  {
    align: 'center',
    title: '工号',
    dataIndex: 'no',
    width: '40px',
  },
  {
    align: 'center',
    title: '姓名',
    dataIndex: 'name',
    width: '70px',
  },
  {
    align: 'center',
    title: '手机号',
    dataIndex: 'mobile',
    width: '80px',
  },
  {
    align: 'center',
    title: '邮箱',
    dataIndex: 'email',
    width: '100px',
  },
  {
    align: 'center',
    title: '角色',
    dataIndex: 'roles',
    customRender: ({ record }) => {
      const roles = record.roles.map((v) => v.title) || [];
      return roles.join(',');
    },
    width: '100px',
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'company_department_name',
    customRender: ({ record }) => {
      const departNames = record.departments.map((v) => v?.title);
      return departNames.join(',');
    },
    width: '100px',
  },
  {
    align: 'center',
    title: '职位',
    dataIndex: 'company_job',
    width: '80px',
  },
  {
    align: 'center',
    title: '入职日期',
    dataIndex: 'entry_time',
    customRender: ({ record }) => {
      return record.entry_time ? formatToDate(record.entry_time) : '';
    },
    width: '80px',
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark',
    width: '100px',
  },
  {
    align: 'center',
    title: '类型',
    dataIndex: 'type',
    customRender: ({ record }) => {
      return staffTypeOption.find((v) => v.value === record.type)?.label;
    },
    width: '60px',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '60px',
    customRender: ({ record }) => {
      return staffStatusOption.find((v) => v.value === record.status)?.label;
    },
  },
];
const formSchema = [
  {
    field: 'name',
    label: '姓名',
    component: 'Input',

    required: true,
  },
  {
    field: 'company_role_ids',
    label: '角色',
    component: 'ApiSelect',
    componentProps: {
      mode: 'multiple',
      labelField: 'title',
      valueField: 'id',
      api: async () => {
        let data = await window.http.get({
          url: '/company_center/company_role_api/select',
        });
        return data;
      },
    },
  },
  {
    field: 'company_department_ids',
    label: '部门',
    component: 'ApiTreeSelect',
    required: true,
    componentProps: {
      'max-tag-count': 'responsive',
      multiple: true,
      // labelField: 'title',
      valueField: 'id',
      api: async () => {
        console.log('[ async ]-144');
        let data = await window.http.get({
          url: '/company_center/department_api/select',
          params: { company_id: localStorage.getItem('companyId') },
        });
        return data;
      },
    },
  },
  {
    field: 'no',
    label: '工号',
    component: 'Input',
    // required: true,
  },
  {
    field: 'company_job',
    label: '职位',
    component: 'Input',
  },
  {
    field: 'mobile',
    label: '手机号',
    component: 'Input',
    required: true,
  },
  {
    field: 'entry_time',
    label: '入职日期',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      style: {
        width: '100%',
      },
    },
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    // required: true,
  },
  {
    field: 'type',
    label: '员工类型',
    component: 'Select',
    componentProps: {
      options: staffTypeOption,
    },
  },

  {
    field: 'status',
    label: '员工状态',
    component: 'Select',
    componentProps: {
      options: staffStatusOption,
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

export { columns, schemas, formSchema };
