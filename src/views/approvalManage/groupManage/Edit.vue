<template>
  <a-modal class="center_model" v-model:open="open" width="500px" :title="title" :centered="true" @ok="handleOk" @cancel="handleCancel">
    <a-form style="padding: 22px 0" ref="aFormRef" :model="formState" :labelCol="{ style: { width: '140px' } }" :colon="false">
      <a-form-item label="分组名称" name="title" :rules="[{ required: true, message: '请输入' }]">
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <a-form-item label="是否启用" name="is_enable">
        <a-switch v-model:checked="formState.is_enable" :checkedValue="1" :unCheckedValue="0" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  interface FormState {
    title: string;
    is_enable: Number;
  }
  defineExpose({
    setOpen(openVal, isUpdateVal, record = { is_enable: 1 }) {
      title.value = titleObj[isUpdateVal];
      isUpdate.value = isUpdateVal !== 'add';
      open.value = openVal;

      formState.value = record;
    },
  });

  const emit = defineEmits(['hideModal', 'success']);
  const aFormRef = ref();
  const open = ref(false);
  const isUpdate = ref(false);
  const title = ref('新增分组');
  const titleObj = {
    edit: '编辑分组',
    add: '新增分组',
  };

  const formState = ref<FormState>({ is_enable: 1 });

  const handleOk = async (e) => {
    aFormRef.value
      .validate()
      .then(async (v) => {
        open.value = false;
        let data = await window.http.post({
          url: '/work_center/form_group_api/save',
          data: { ...formState.value },
        });
        emit('success', { isUpdate: unref(isUpdate), values: { ...data } });
        aFormRef.value.resetFields();
      })
      .catch((err) => {
        console.log('[ err ]-48', err);
      });
  };
  const handleCancel = (e) => {
    open.value = false;
    aFormRef.value.resetFields();
  };
</script>

<style lang="less" scoped>
  .radio_group {
    display: flex;
    justify-content: space-evenly;
  }
</style>
