<template>
  <div>
    <!-- 参考模板 -->
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色 </a-button>
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
    <Modal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable,useTable,TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Modal from './modal.vue';
  import { columns, searchFormSchema } from './config';

  const initFormState = () => reactive({
    company_id: localStorage.getItem('companyId'),
  });

  let formState = initFormState();

  const getTableData = async (params) => {
    let data = await window.http.get({
      url: '/company_center/company_role_api/list',
      params: { ...formState, ...params },
    });
    return data;
  };

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '角色组',
    rowKey: 'id',
    api: getTableData,
    columns,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  function handleCreate() {
    console.log('handleCreate')
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  async function handleDelete(record) {
    console.log(record);
    await window.http.post({
      url: '/company_center/company_role_api/del',
      data: { id: record.id },
    });
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }
</script>
