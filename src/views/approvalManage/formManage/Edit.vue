<template>
  <a-modal class='center_model' v-model:open="open" width="500px" :title="title" :centered="true" @ok="handleOk"
    @cancel="handleCancel">
    <a-form style="padding:22px 0" ref="aFormRef" :model="formState" :labelCol='{style:{width:"140px"}}' :colon='false'>
      <a-form-item label="分组名称" name="title">
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <a-form-item label="是否启用" name="is_enable">
        <a-switch v-model:checked="formState.is_enable" :checkedValue='1' :unCheckedValue='0' />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang='ts' setup>
  defineExpose({
    setOpen(openVal, titleVal, record = { is_enable: 1 }) {
      open.value = openVal;
      title.value = titleObj[titleVal];
      formState.value = record;
    },
  });
  const emit = defineEmits(['hideModal', 'submit']);
  const aFormRef = ref();
  const open = ref(false);
  const title = ref('新增分组');
  const titleObj = {
    del: '删除分组',
    edit: '编辑分组',
    add: '新增分组',
  };
  interface FormState {
    title: string;
    is_enable: Number;
  }
  const formState = ref<FormState>({ is_enable: 1 });

  const handleOk = (e) => {
    open.value = false;
    emit('submit', formState.value);
    aFormRef.value.resetFields();
  };
  const handleCancel = (e) => {
    open.value = false;
    aFormRef.value.resetFields();
  };
</script>

<style lang='less' scoped>
  .radio_group {
    display: flex;
    justify-content: space-evenly;
  }
</style>