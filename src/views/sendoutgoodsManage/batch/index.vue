<template>
  <div>
    <BasicTable @register="registerTable">
      <template #form-systemAddressId>
        <a-cascader v-model:value="system_address_id" :options="system_address_id_options" placeholder="请选择"
          :load-data="loadData" :fieldNames="{label:'name',value:'id'}" change-on-select />
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增发货人规则 </a-button>
        <a-button type="primary" @click="handleCreate2"> 编辑主要发货人 </a-button>
        <a-button type="primary" @click="enable(0)"> 批量禁用 </a-button>
        <a-button type="primary" @click="enable(1)"> 批量启用 </a-button>
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
    <Edit @register="registerModal" @success="handleSuccess" />
    <Edit2 @register="registerModal2" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Edit from './Edit.vue';
  import Edit2 from './Edit2.vue';
  import { userSchemaFn } from './config';
  import { onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  // const initFormState = () =>
  //   reactive({
  //     categoryModule: 10,
  //     company_id: localStorage.getItem('companyId'),
  //   });

  // let formState = initFormState();
  let { headerSchema, columns } = userSchemaFn();
  const system_address_id_options = ref([])
  const system_address_id = ref([])
  const getAreaRecord = async (params) => {
    let data = await window.http.get({
      url: '/basic_center/address_api/list',
      params: { ...params },
    });
    if (!data.length) {
      message.warning('没有下一级了')
    }
    data.forEach(v => v.isLeaf = false)
    return data;
  };
  onMounted(async () => {
    system_address_id_options.value = await getAreaRecord()
  })
  const enable = (type) => {// 1启用 0禁用 
    console.log(getRowSelection())
    const { selectedRowKeys } = getRowSelection()
    if (!selectedRowKeys.length) return message.warning('请勾选数据在执行操作')
    window.http.post({
      url: '/order_center/warehouse_address_map_api/batch_save',
      data: {
        is_enable: type,
        ids: selectedRowKeys
      },

    }, {
      successMessageMode: 'msg',
    }).then(res => {
      reload();
    })
  }
  const loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.loading = true;

    // load options lazily
    setTimeout(async () => {
      targetOption.loading = false;

      targetOption.children = await getAreaRecord({ pid: targetOption.id })
      system_address_id_options.value = [...system_address_id_options.value];
    }, 100);
  };
  const getTableData = async (params) => {
    console.log('params', params)
    console.log('system_address_id', system_address_id)
    const p = {
      system_address_id: system_address_id.value && system_address_id.value[system_address_id.value.length - 1],
      type: params.type
    }
    let data = await window.http.get({
      url: '/order_center/warehouse_address_map_api/list',
      params: p
    });

    const ids = data.records.map(v => v.warehouse_id.toString())
    if (ids.length) {
      const result = await window.http.post({
        url: '/erp-ware/warehouse/list',
        data: {
          idList: ids
        }
      });

      data.records.forEach(v => {
        const obj = result.find(e => e.id == v.warehouse_id)
        if (obj) {
          v.name = obj.name
        }
      })
    }

    console.log('data.records ', data.records)

    return data;
  };

  const [registerModal, { openModal }] = useModal();
  const [registerModal2, { openModal: openModal2 }] = useModal();
  const [registerTable, { reload, updateTableDataRecord, getRowSelection }] = useTable({
    title: '发货人配置',
    rowKey: 'id',
    api: getTableData,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas: headerSchema,
      resetButtonOptions: {
        onClick: () => {
          system_address_id.value = []
        },
      },
    },
    rowSelection: true,
    useSearchForm: true,
    showIndexColumn: false,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
    },

  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }
  function handleCreate2() {
    openModal2(true, {
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
      url: '/order_center/warehouse_address_map_api/del',
      data: { id: record.id },
    });
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    reload();
  }
</script>
