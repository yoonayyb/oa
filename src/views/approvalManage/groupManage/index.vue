<template>

  <div class="page">

    <BasicTable @register="registerTable" class="w-full">
      <template #toolbar>
        <a-button type="primary" @click="changeModal(true, 'add')">新建分组</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
              {
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]" />
        </template>
      </template>
    </BasicTable>
    <Edit ref='edit' @success='successFn' />
  </div>
</template>

<script lang='ts' setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { userSchemaFn } from './config.ts';
  import Edit from './Edit.vue';
  import { CollapseSearchBar } from '/@/components/Business';

  const title = ref('add');
  const edit = ref(null);
  const initForm = () => reactive({});
  let formState = initForm();

  //打开modal
  const changeModal = (val, title = 'add', record) => {
    edit.value.setOpen(val, title, record);
  };
  let tableData = ref([]);

  const getTableList = async (e) => {
    let data = await window.http.get({
      url: '/work_center/form_group_api/list',
      params: { ...formState, ...e },
    });
    return data;
  };

  let { headerSchema, columns } = userSchemaFn(formState, initForm);

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    rowKey: 'id',
    api: getTableList,
    formConfig: {
      labelWidth: 100,
      schemas: headerSchema,
    },
    columns,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });

  const handleEdit = (record) => {
    changeModal(true, 'edit', { ...record });
  };
  const handleDelete = async ({ id }) => {
    await window.http.post({
      url: '/work_center/form_group_api/del',
      data: { id },
    });
    reload();
  };
  const successFn = ({ isUpdate, values }) => {
    if (isUpdate) {
      // 演示不刷新表格直接更新内部数据。
      // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
      const result = updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  };
</script>
<style lang='less' scoped>
  .page {
    margin: 16px;
  }
</style>
