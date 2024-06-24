<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm :name='formName' @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema, permissionFormSchema } from './account.data';
  import { saveUserList, saveMeUserList, saveUserRole, getUserRole } from '/@/api/demo/system';
  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(props, { emit, attrs }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const formName = attrs.name;
      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate, getFieldsValue }] =
        useForm({
          labelWidth: 100,
          baseColProps: { span: 24 },
          //type为account时为修改账号信息框  为permission时是权限框 //attrs.type === 'account'
          schemas: attrs.type === 'account' ? accountFormSchema : permissionFormSchema,
          showActionButtonGroup: false,
          actionColOptions: {
            span: 23,
          },
        });
      let is_me;
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        is_me = data.is_me
        if (unref(isUpdate)) {
          //获取用户角色权限
          const result =
            attrs.type === 'permission' ? await getUserRole({ user_id: data.record.id }) : [];
          console.log('result', result);
          data.record.user_role_ids = result;

          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
          updateSchema({
            field: 'avatar',
            componentProps: {
              defaultImageList: [data.record.avatar],
            },
          });
        } else {
          updateSchema({
            field: 'avatar',
            componentProps: {
              defaultImageList: [],
            },
          });
        }
        console.log('open', data.record);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));
      const requestApi = (values) => {
        const { user_role_ids, ...obj } = values;
        return new Promise(async (resolve, reject) => {
          try {
            let data;
            if (attrs.type === 'account') {
              console.log('[ obj?.avatar ]-73', obj.avatar);
              let params = { ...obj, avatar: obj.avatar && obj.avatar[0] };
              if (obj.password === '') {
                delete params.password;
              }

              if (is_me) {
                data = await saveMeUserList(params);
              } else {
                data = await saveUserList(params);
              }

            } else {
              data = await saveUserRole({ user_id: values.id, user_role_ids });
            }
            resolve(data);
          } catch (error) {
            reject(error);
          }
        });
      };
      async function handleSubmit() {
        try {
          console.log('getFieldsValue()', getFieldsValue());
          const values = await validate();

          setModalProps({ confirmLoading: true });
          // TODO custom api
          console.log('values', values);
          let result = await requestApi(values);
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...result, id: rowId.value } });
        } catch (error) {
          console.log('[  ]-91', error);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, formName };
    },
  });
</script>
