<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './dept.data';

  export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const saveApi = async (data) => {
        let result = await window.http.post({
          url: '/company_center/department_api/save',
          data,
        });
        return result;
      };
      const getDepartmentDetail = async (params) => {
        let result = await window.http.get({
          url: '/company_center/department_api/detail',
          params,
        });
        return result;
      };
      const isUpdate = ref(true);
      const rowId = ref('');
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          let departmentDetail = await getDepartmentDetail({ id: data.record.id });
          setFieldsValue(departmentDetail);
        }
        updateStaffSchema(isUpdate.value, data.record?.id);
      });

      const updateStaffSchema = async (isUpdate, staffId) => {
        let companySchema = {
          field: 'manager_ids',
          ifShow: isUpdate, //如果是新增部门 则不展示设定主管 编辑时才展示设定主管的select
        };
        if (isUpdate) {
          let options = await getStaffList(staffId);
          companySchema = {
            ...companySchema,
            componentProps: {
              mode: 'multiple',
              options,
            },
          };
        }
        updateSchema(companySchema);
      };
      const getStaffList = async (staffId) => {
        let data = await window.http.get({
          url: '/company_center/staff_api/select',
          params: {
            company_id: localStorage.getItem('companyId'),
            company_department_ids: staffId,
          },
        });

        return data.records.map(({ id, name }) => ({ value: id, label: name }));
      };

      const getTitle = computed(() => (!unref(isUpdate) ? '新增部门' : '编辑部门'));
      const submit = async (values) => {
        let data = {
          ...values,
          company_id: localStorage.getItem('companyId'),
          id: unref(isUpdate) ? rowId.value : '',
        };
        let result = await saveApi(data);
        return result;
      };

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });

          // TODO custom api
          const result = await submit(values);
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...result } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
