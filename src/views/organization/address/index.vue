<template>
  <div class="page h-full">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-space class="justify-end">
          <a-button @click='changMember' type="primary">新增成员</a-button>
          <!-- <a-button type="primary">调整顺序</a-button>
          <a-button type="primary">批量管理</a-button> -->
        </a-space>
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
    <MemberEdit ref="memberEdit" @register="registerModal" @success="handleSuccess" />

  </div>
</template>
<script setup>
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
  import Icon from '/@/components/Icon/icon.vue'
  import { CollapseSearchBar } from '/@/components/Business'
  import { formartData } from '@/utils/common.js'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'

  import { columns, schemas } from './index.js'
  import MemberEdit from './memberEdit.vue'
  import { message, Modal } from 'ant-design-vue'
  import { useModal } from '/@/components/Modal'
  import { createVNode } from 'vue'
  import { useAppInject } from '@/hooks/web/useAppInject'
  import { BasicTree } from '/@/components/Tree/index'
  const { getIsMobile } = useAppInject()
  const memberEdit = ref(null)
  const [registerModal, { openModal }] = useModal()

  const initFormState = () => reactive({
    company_id: localStorage.getItem('companyId')
  })
  let formState = initFormState()
  const changMember = (type, title) => {
    openModal(true, {
      isUpdate: false,
    })
  }


  const getTableData = async (params) => {
    let data = await window.http.get({
      url: '/company_center/staff_api/list',
      params: {
        ...params,
        company_id: localStorage.getItem('companyId')
      },
    })
    return data
  }
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '通讯录',
    rowKey: 'id',
    api: getTableData,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas,
    },
    pagination: true,
    striped: false,
    useSearchForm: true,
    isTreeTable: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  })


  const handleDelete = async (record) => {
    await window.http.post({
      url: '/company_center/staff_api/del',
      data: { id: record.id },
    })
    reload()
  }
  function handleSuccess ({ isUpdate, values }) {
    if (isUpdate) {
      console.log('[ isUpdate ]-110', values)
      const result = updateTableDataRecord(values.id, values)
    } else {
      reload()
    }
  }
  const handleEdit = (record) => {
    openModal(true, {
      record: { ...record, company_department_ids: record.departments.map(v => (v?.id)) },
      isUpdate: true,
    })
  }

</script>
<style lang="scss" scoped>
</style>