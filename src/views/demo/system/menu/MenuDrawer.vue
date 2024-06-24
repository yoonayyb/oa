<template>
  <BasicDrawer :showOkBtn="hasPermission('menuxz')" v-bind="$attrs" @register="registerDrawer" showFooter
    :title="getTitle" :width="getIsMobile?'100%':'50%'" @ok="handleSubmit">
    <BasicForm @register="registerForm">
    </BasicForm>


  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, emitFn } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { saveMenuList, getMenuList } from '/@/api/sys/menu';

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const { getIsMobile } = useAppInject();
      const { hasPermission } = usePermission()

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }

        const { tree } = await getMenuList();

        updateSchema({
          field: 'parent_id',
          componentProps: {
            treeData: tree
          },
        });

      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api
          console.log(values);

          await saveMenuList(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { hasPermission, registerDrawer, registerForm, getTitle, handleSubmit, getIsMobile, };
    },
  });
</script>
