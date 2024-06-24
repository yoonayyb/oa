<template>
  <BasicModal width='600px' v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './index.js';

  import { getDeptList } from '/@/api/demo/system';

  export default defineComponent({
    name: 'DeptModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const saveApi = async (data) => {
        let result = await window.http.post({
          url: '/company_center/staff_api/save',
          data,
        });
        return result;
      };
      const rowId = ref('');
      const isUpdate = ref(true);
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 80,
        // labelCol: 24,
        baseColProps: { span: 11, style: { marginRight: '10px' } },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {

        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          console.log('[ data ]-34', data);
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
          //赋值角色 company_role_ids
          setFieldsValue({
            company_role_ids: data.record.roles.map(v => v.company_role_id)
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增成员' : '编辑成员'));
      const submit = async (values) => {
        let data = {
          ...values,
          company_id: localStorage.getItem('companyId'),
          id: unref(isUpdate) ? rowId.value : '',
        };
        if (unref(isUpdate)) {
          data = { ...data };
          delete data.roles;
        }
        let result = await saveApi(data);
        return result;
      };
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          let result = await submit(values);
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
