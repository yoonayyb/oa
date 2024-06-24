<template>
  <div>
    <BasicTable @register="registerTable" @field-value-change="fieldValueChange">
      <template #toolbar>
        <a-button type="primary" @click="go('inbound')"> 入库 </a-button>
        <a-button type="primary" @click="go('transferStock')"> 移库 </a-button>
        <a-button type="primary" @click="go('outbound')"> 出库 </a-button>
      </template>
    </BasicTable>
    <Edit @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import Edit from './Edit.vue';
  import { userSchemaFn } from './config';

  const getWarehouseList = async () => {
    const result = await window.http.post({
      url: '/erp-ware/warehouse/list',
      data: {
        type: 10,
      },
    });
    return result.map((v) => ({ ...v, label: v.name, value: v.id }));
  };
  const getLocationManageList = async (data) => {
    const result = await window.http.post({
      url: '/erp-ware/locationManage/list',
      data,
    });
    return result.map((v) => ({ ...v, label: v.locationName, value: v.id }));
  };
  const getProductList = async (data) => {
    const result = await window.http.post({
      url: '/erp-ware/product/list',
      data,
    });
    return result.map((v) => ({ ...v, label: v.productName, value: v.id }));
  };

  let formTableState = {
    inventoryType: 10,
    warehouseId: -1,
    company_id: localStorage.getItem('companyId'),
  };
  let formState = {
    warehouseIdIsFirstLoaded: false,
    locationIdIsFirstLoaded: false,
    productIdIsFirstLoaded: false,
    warehouseIdList: [],
    locationIdList: [],
    productIdList: [],
  };

  const getOption = async (field, visible) => {
    if (!visible) return;
    if (field === 'warehouseId') {
      await loadOptions('warehouseId', getWarehouseList);
    }
    if (field === 'locationId') {
      await loadOptions('locationId', getLocationManageList, 'warehouseId');
    }
    if (field === 'productId') {
      await loadOptions('productId', getProductList);
    }
  };

  const loadOptions = async (fieldKey, loadFunction, filterKey = null) => {
    const { setFieldsValue, updateSchema, getFieldsValue } = getForm();
    let options = formState[fieldKey + 'List'];
    if (!formState[fieldKey + 'IsFirstLoaded']) {
      //IsFirstLoaded为ture时证明请求已经执行一次了  不需要在执行了
      formState[fieldKey + 'IsFirstLoaded'] = true;
      options = formState[fieldKey + 'List'] = await loadFunction();
    }
    if (filterKey) {
      const fieldVal = getFieldsValue()[filterKey];
      options = filterList(options, filterKey, fieldVal);
    }
    updateSchemaFn(fieldKey, options, updateSchema);
  };
  /*
   * list 是接口返回的数据数组
   * fieldKey是filter的key
   * fieldVal 是在form选中的值
   */
  const filterList = (list, filterKey, fieldVal) => {
    // fieldVal为真时 证明前面select选中了某项值 所以需要过滤   否则返回全部
    return list.filter((v) => (fieldVal ? v[filterKey] === fieldVal : v));
  };
  const updateSchemaFn = (field, options, updateSchema) => {
    updateSchema({
      field,
      componentProps: {
        options,
      },
    });
  };
  const fieldValueChange = (key, value, schema) => {
    const { setFieldsValue } = getForm();
    if (key === 'warehouseId') {
      //选中仓库时清空库位的值
      setFieldsValue({
        locationId: null,
      });
      updateColumns(value);
      // getColumns
    }
    reload();
  };
  let { headerSchema, columns } = userSchemaFn(getOption);

  const updateColumns = (value) => {
    if (value === 0) {
      let columnsList = getColumns();
      const hideKeyArr = ['warehouseName','locationName', 'bracketNo'];
      columnsList = columnsList.map((v) => {
        let params = {
          ...v,
          defaultHidden: hideKeyArr.includes(v.key),
        };
        return params;
      });
      setColumns(columnsList);
    }
    if (value === -1) {
      let columnsList = getColumns();
      columnsList = columnsList.map((v) => {
        let params = {
          ...v,
          defaultHidden: false,
        };
        return params;
      });
      setColumns(columnsList);
    }
  };
  const getTableData = async (params) => {
    let data = await window.http.post({
      url: '/erp-ware/inventory/statisticsPage',
      data: { ...formTableState, ...params },
    });
    return data;
  };

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, updateTableDataRecord, getForm, getColumns, setColumns }] = useTable({
    title: '库存列表',
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
    // actionColumn: {
    //   width: 100,
    //   title: '操作',
    //   dataIndex: 'action',
    // },
  });

  function handleCreate() {
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

  function go(url) {
    window.go(url);
  }
</script>
