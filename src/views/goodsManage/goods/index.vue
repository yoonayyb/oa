<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'list'">
          <div v-for="item in record.list">{{ item.productName }} x{{ item.productQuantity }} </div>
        </template>

        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '查看',
                onClick: handleEdit.bind(null, record, 'disabled'),
              },
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
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <Edit @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';

  import Edit from './Edit.vue';
  import { schemas, columns, headerSchema } from './index';
  const initFormState = () =>
    reactive({
      company_id: localStorage.getItem('companyId'),
    });

  let formState = initFormState();

  const getTableData = async (params) => {
    let data = await window.http.post({
      url: '/erp-ware/goods/page',
      data: { ...formState, ...params },
    });
    return data;
  };
  const [registerModal, { openModal }] = useModal();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '商品列表',
    rowKey: 'id',
    api: getTableData,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas,
    },
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
    },
  });

  async function handleDelete(record) {
    console.log(record);
    await window.http.post({
      url: '/erp-ware/goods/remove',
      data: { ids: [record.id] },
    });
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    reload();
  }

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record, status) {
    openModal(true, {
      record,
      isUpdate: true,
      status,
    });
  }
</script>
