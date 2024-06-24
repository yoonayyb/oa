<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <a-popover title="操作明细：">
            <template #content>
              <div v-for="v in record.titleArr">{{ v }}</div>
            </template>
            {{ record.count }}
          </a-popover>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '查看',
                onClick: handleEdit.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <!-- <Edit @register="registerModal" @success="handleSuccess" /> -->
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  // import { useModal } from '/@/components/Modal';
  // import Edit from './Edit.vue';
  import { userSchemaFn } from './config';
  const initFormState = () =>
    reactive({
      company_id: localStorage.getItem('companyId'),
    });

  let formState = initFormState();
  let { headerSchema, columns } = userSchemaFn();

  const getTableData = async (params) => {
    try {
      console.log('[ params ]-34', params);
      const data = await window.http.post({
        url: '/erp-ware/inventoryOperationRecord/page',
        data: {
          ...formState,
          ...params,
          createdTimeStart: params.date && params.date[0],
          createdTimeEnd: params.date && params.date[1],
        },
      });

      data.records = data.records.map((v) => {
        const titleArr = v.title.split(',');
        const count = getOperationCount(titleArr);
        return {
          ...v,
          titleArr,
          count,
        };
      });
      console.log('[ data ]-46', data);
      return data;
    } catch (error) {
      console.log('[ error ]-43', error);
    }
  };
  const getOperationCount = (arr) => {
    let count = 0;
    arr.forEach((v) => {
      const vArr = v?.split(':');
      count += parseFloat(vArr[1]);
    });
    return count;
  };
  // const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '库存记录',
    rowKey: 'id',
    api: getTableData,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas: headerSchema,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record) {
    const params = {
      path: '/inventoryManage/inventoryRecordDetails',
      query: {
        id: record.id,
        operationType: record.operationType,
        picList: record.picList,
      },
    };
    window.go(params);
  }

  async function handleDelete(record) {}

  function handleSuccess({ isUpdate, values }) {
    reload();
  }
</script>
