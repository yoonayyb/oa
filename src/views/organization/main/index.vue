<template>
  <div class="page">
    <!-- <CollapseSearchBar :formState='formState' :headerSchema='schema' :btnSchema='btnSchema' :initForm='initFormState'
      @reset="reset">
    </CollapseSearchBar> -->
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="add">新增主体</a-button>
      </template>
      <template #bodyCell="{ column, text, record,index }">
        <template v-if="column.dataIndex === 'is_enable'">
          <!-- <a-switch :size='"default"' checked-children="启用" un-checked-children="禁用"
            v-model:checked="record.is_enable" /> -->
          <a-tag v-if="record.is_enable" color="success">启用</a-tag>
          <a-tag v-else color="error">禁用</a-tag>
        </template>
        <template v-if="column.dataIndex === 'dell'">
          <a-row>
            <a-col span="12">
              <a-button @click="edit(record)" type="link">编辑</a-button>
            </a-col>
            <a-col span="12">
              <a-button @click="exportRow(record)" type="link">导出</a-button>
            </a-col>
            <a-col span="12">
              <a-button @click="copy(record)" type="link">复制</a-button>
            </a-col>
            <a-col span="12">
              <a-popconfirm title="是否确认删除该主体？" ok-text="确认" cancel-text="取消" @confirm="delConfirm(record)">
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </a-col>
          </a-row>
        </template>
      </template>
    </BasicTable>

    <a-modal destroyOnClose :title="title" v-model:open="open" okText="提交" width="500px" @ok="handleOk">
      <a-form ref="modalFormRef" :model="orderFrom" :label-col="{ style: { width: '90px' } }">
        <a-form-item label="主体名称" name="title" :rules="[{ required: true, message: '请输入主体名称' }]">
          <a-input placeholder="请输入" v-model:value="orderFrom.title">
          </a-input>
        </a-form-item>
        <a-form-item label="组织机构代码" name="code" :rules="[{ required: true, message: '请输入组织机构代码' }]">
          <a-input placeholder="请输入" v-model:value="orderFrom.code">
          </a-input>
        </a-form-item>
        <a-form-item label="地址" name="address" :rules="[{ required: true, message: '请输入地址' }]">
          <a-textarea placeholder="请输入" :rows="3" v-model:value="orderFrom.address">
          </a-textarea>
        </a-form-item>
        <a-form-item label="电话" name="landline" :rules="[{ required: true, message: '请输入电话' }]">
          <a-input placeholder="请输入" v-model:value="orderFrom.landline">
          </a-input>
        </a-form-item>
        <a-form-item label="开户银行" name="bank_name" :rules="[{ required: true, message: '请输入开户银行' }]">
          <a-input placeholder="请输入" v-model:value="orderFrom.bank_name">
          </a-input>
        </a-form-item>
        <a-form-item label="账号" name="bank_num" :rules="[{ required: true, message: '请输入账号' }]">
          <a-input placeholder="请输入" v-model:value="orderFrom.bank_num">
          </a-input>
        </a-form-item>
      </a-form>
      <template #footer>
        <div style="text-align: center;">
          <a-button size="mini" key="submit" type="primary" :loading="loading" @click="ok">提交</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script setup>
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
  import Icon from '/@/components/Icon/icon.vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { CollapseSearchBar } from '/@/components/Business'
  import { formartData } from '@/utils/common.js'
  import { columns, userFormData, schemas } from './index.js'
  import { message, Modal } from 'ant-design-vue'
  import { createVNode } from 'vue'

  onMounted(() => {
    getTableList(formState)
  })

  const tableData = ref([])
  const initForm = () => {
    return reactive({})
  }
  let orderFrom = initForm()
  const initFormState = () => reactive({
    order_from: ''
  })
  let formState = initFormState()

  const getTableList = async (params) => {
    let res = await window.http.get({
      url: '/company_center/company_api/list',
      params
    })
    res.records = res.records.map(val => {
      return {
        ...val,
        created_userName: val?.created_user?.name,
        updated_userName: val?.updated_user?.name
      }
    })
    return res
  }

  const [registerTable, { reload, updateTableDataRecord, setTableData }] = useTable({
    rowKey: 'id',
    api: getTableList,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas
    },
    useSearchForm: true,
    striped: false,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
  })



  const modalFormRef = ref()
  const open = ref(false)
  const loading = ref(false)
  const isUpdate = ref(false)
  const title = ref('')
  const ok = () => {
    modalFormRef.value.validateFields().then(async () => {
      let data = await window.http.post({
        url: '/company_center/company_api/save',
        data: { ...orderFrom, },
      })
      open.value = false
      // getTableList(formState)
      handleSuccess({
        isUpdate: isUpdate.value,
        values: { ...data },
      })
    })
  }
  function handleSuccess ({ isUpdate, values }) {
    console.log('[ values ]-162', values)
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values)
    } else {
      reload()
    }
  }
  const edit = (record) => {
    isUpdate.value = true
    open.value = true
    title.value = '编辑主体'
    orderFrom = { ...record }
    // Object.assign(orderFrom, record)
  }
  const add = () => {
    orderFrom = initForm()
    open.value = true
    isUpdate.value = false
    title.value = '新增主体'
    nextTick(() => {
      modalFormRef.value.resetFields()
    })
  }
  const delConfirm = async (record) => {
    let data = await window.http.post({
      url: '/company_center/company_api/del',
      data: { id: record.id },
    })
    reload()

  }



  const reset = () => {
    getTableList(formState)
  }
  const handleOk = e => {
    open.value = false
  }
  const exportRow = e => {

  }
  const copy = e => {

  }




</script>
<style lang="less" scoped>
  .ant-input-number-cunstom {
    min-width: 0 !important;
    width: 80px !important;
  }

  .ant-form-item-cunstom {
    margin-bottom: 0 !important;
  }

  .ant-pagination {
    margin-top: 20px;
  }

  .ant-card-head {
    border: 4px solid #fff;
  }

  .ant-card-body {
    border: 4px solid #fff;
  }
</style>