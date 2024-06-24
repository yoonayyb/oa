<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree v-model:value="model[field]" checkStrictly :treeData="treeData"
          :fieldNames="{ title: 'title', key: 'id' }" checkable toolbar title="菜单分配">
          <template v-slot:treeNode="{treeNode}">
            <span>{{ treeNode.title + treeNode.key }}</span>
          </template>
        </BasicTree>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchemay } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  import { getMenuList, getRoleInfo, saveRoleInfo, addRoleInfo } from '/@/api/demo/system';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const treeData = ref<TreeItem[]>([]);

  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 0,
    baseColProps: { span: 24 },
    schemas: formSchemay,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
    if (unref(treeData).length === 0) {
      treeData.value = (await getMenuList()).tree
      console.log('treeData', treeData)
    }
    isUpdate.value = !!data?.isUpdate;
    //获取角色分配的权限菜单

    let menus = []
    if (data?.record?.id) {
      menus = (await getRoleInfo({ role_id: data.record.id })).menus
    }
    updateSchema({
      field: 'menus',
      componentProps: { menus }
    });


    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
        menus
      });

    }
  });

  const getTitle = "分配菜单"

  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      console.log(values);
      // TODO custom api
      const { checked } = values.menus
      await addRoleInfo({
        role_id: values.id,
        ids: checked ? checked : values.menus
      })



      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>