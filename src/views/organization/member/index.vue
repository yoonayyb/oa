<template>
  <div class="page">
    <CollapseSearchBar :formState='formState' :headerSchema='schema' :btnSchema='btnSchema' :initForm='initFormState'>
    </CollapseSearchBar>
    <a-table :pagination="{hideOnSinglePage:true}" bordered :scroll="{ x: 'max-content', y: 800 }"
      :dataSource="dataSource" :columns="columns">
      <template #bodyCell="{ column, text, record,index }">
        <template v-if="column.dataIndex === 'dell'">
          <a-button @click="edit(record)" type="link">编辑</a-button>
          <a-button @click="deleteRow(record)" type="link" danger>删除</a-button>
        </template>
      </template>
    </a-table>
    <a-pagination style="text-align: center;marign-top:20px" v-model:current="current" v-model:pageSize="pageSize"
      :total="0" hideOnSinglePage />
    <a-modal destroyOnClose :title="title" v-model:open="open" okText="提交" width="400px" @ok="handleOk">
      <a-form ref="modalFormRef" :model="orderFrom" :label-col="{ style: { width: '90px' } }">
        <a-form-item label="工号" name="name" :rules="[{ required: true, message: '请输入工号' }]">
          <a-input placeholder="请输入" v-model:value="orderFrom.name">
          </a-input>
        </a-form-item>
        <a-form-item label="姓名" name="type" :rules="[{ required: true, message: '请输入姓名' }]">
          <a-input placeholder="请输入" v-model:value="orderFrom.type">
          </a-input>
        </a-form-item>
        <a-form-item label="手机号" name="code" :rules="[{ required: true, message: '请输入手机号' }]">
          <a-input placeholder="请输入" v-model:value="orderFrom.code">
          </a-input>
        </a-form-item>
        <a-form-item label="邮箱" name="unit" :rules="[{ required: true, message: '请输入邮箱' }]">
          <a-input placeholder="请输入" v-model:value="orderFrom.unit">
          </a-input>
        </a-form-item>
        <a-form-item label="部门" name="dept" :rules="[{ required: true, message: '请选择部门' }]">
          <a-select placeholder="请输入" show-search v-model:value="orderFrom.dept" :options="[{
              value:1,label:'技术部'
            },{
              value:2,label:'金融部'
            },{
              value:3,label:'销售部'
            }]">
          </a-select>
        </a-form-item>
        <a-form-item label="职位" name="zhiwei" :rules="[{ required: true, message: '请输入职位' }]">
          <a-input placeholder="请输入" v-model:value="orderFrom.zhiwei">
          </a-input>
        </a-form-item>
        <a-form-item label="入职日期" name="time" :rules="[{ required: true, message: '请选择入职日期' }]">
          <a-date-picker v-model:value="orderFrom.time" show-time format='YYYY-MM-DD' valueFormat='YYYY-MM-DD'
            placeholder="请输入" style="width: 100%" />
        </a-form-item>
        <a-form-item label="类型" name="type" :rules="[{ required: true, message: '请选择类型' }]">
          <a-select placeholder="请输入" show-search v-model:value="orderFrom.type" :options="[{
                value:1,label:'实习'
              },{
                value:2,label:'全职'
              },{
                value:3,label:'兼职'
              }]">
          </a-select>
        </a-form-item>
        <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态' }]">
          <a-select placeholder="请输入" show-search v-model:value="orderFrom.status" :options="[{
                  value:1,label:'正式'
                },{
                  value:2,label:'试用'
                },{
                  value:3,label:'离职'
                }]">
          </a-select>
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
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import Icon from '/@/components/Icon/icon.vue';
  import { CollapseSearchBar } from '/@/components/Business';
  import { formartData } from '@/utils/common.js'
  import { dataSource, columns, userFormData, schema, btnClick, btnSchema } from './index.js'
  import { message, Modal } from 'ant-design-vue';
  import { createVNode } from 'vue'
  const initForm = (obj = {}) => {
    return reactive(obj)
  }
  const orderFrom = initForm()
  const initFormState = () => reactive({});
  let formState = initFormState();
  const modalFormRef = ref();
  const open = ref(false)
  const loading = ref(false)
  const title = ref('')
  const deleteRow = (record) => {
    Modal.confirm({
      title: `是否删除此数据?`,
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, record),
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  }
  const ok = () => {
    modalFormRef.value.validateFields().then(() => {
      console.log(orderFrom)
      open.value = false
    });
  }
  const orderOptions = reactive([{
    value: '均衡代谢管理',
    label: '均衡代谢管理',
  }, {
    value: '残联',
    label: '残联',
  }, {
    value: '燕瘦环肥',
    label: '燕瘦环肥',
  }, ])
  const edit = (record) => {
    title.value = '编辑物料'
    orderFrom.product_come = record.order_from
    orderFrom.out_id = record.inventory
    orderFrom.product_name = record.info
    open.value = true
  }
  btnClick('btn', (v) => {
    console.log(v)
    // if (v === 'reset') {
    //   formartData(formState, initForm())
    // }
    if (v === 'add') {
      formartData(orderFrom, initForm())
      open.value = true
      title.value = '新增物料'
    }
  })
  const handleOk = e => {
    console.log(e);
    open.value = false;
  };
  let current = ref(1);
  let pageSize = ref(20);
</script>
<style lang="scss" scoped>
  .container {
    background: #f7f7f7;
    min-height: 100vh;
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