<template>
  <div class="page">
    <CollapseSearchBar :formState='formState' :headerSchema='schema' :contentSchema='contentSchema'
      :btnSchema='btnSchema' :initForm='initFormState'>
    </CollapseSearchBar>
    <!-- <a-table :scroll="{ x: 'max-content', y: 800 }" :dataSource="dataSource" :columns="columns" />
    <a-pagination style="text-align: center;marign-top:20px" v-model:current="current" v-model:pageSize="pageSize"
      :total="0" hideOnSinglePage /> -->
    <a-modal v-model:open="open" okText="提交" width="1000px" @ok="handleOk">
      <a-form :model="orderFrom" :label-col="{ style: { width: '90px' } }">
        <div style="display: flex;justify-content: space-around;flex-wrap: wrap;">
          <a-card :bordered="false" style="width: 450px;margin-bottom: 20px;">
            <template #title> 报单信息 </template>
            <a-form-item label="订单来源" name="orderCome" :rules="[{ required: true, message: '请选择订单来源' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.orderCome" :options="orderOptions">
              </a-select>
            </a-form-item>
            <a-form-item label="金额" name="price" :rules="[{ required: true, message: '请输入金额' }]">
              <a-input-number placeholder="请输入" :controls="false" id="inputNumber" :precision="2"
                v-model:value="orderFrom.price" :min="0" :max="1000000" />
            </a-form-item>
            <a-form-item label="收款账户" name="account" :rules="[{ required: true, message: '请输入收款账户' }]">
              <a-input placeholder="请输入" v-model:value="orderFrom.account" />
            </a-form-item>
          </a-card>
          <a-card :bordered="false" style="width: 450px;margin-bottom: 20px;">
            <template #title> 推荐人信息 </template>
            <a-form-item label="推荐人" name="tuijian" :rules="[{ required: true, message: '请选择推荐人' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.tuijian" :options="[]">
              </a-select>
            </a-form-item>
            <a-form-item label="科室来源" name="depat" :rules="[{ required: true, message: '请输入科室来源' }]">
              <a-input placeholder="请输入" v-model:value="orderFrom.depat" />
            </a-form-item>
            <a-form-item label="转介绍人" name="zhuanjieshao" :rules="[{ required: true, message: '请输入转介绍人' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.zhuanjieshao" :options="[]">
              </a-select>
            </a-form-item>
          </a-card>
          <a-card :bordered="false" style="width: 450px;margin-bottom: 20px;">
            <template #title> 团队归属 </template>
            <a-form-item label="所属团队" name="tuandui" :rules="[{ required: true, message: '请选择所属团队' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.tuandui" :options="[]">
              </a-select>
            </a-form-item>
            <a-form-item label="引流人" name="yinliu" :rules="[{ required: true, message: '请选择引流人' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.yinliu" :options="[]">
              </a-select>
            </a-form-item>
            <a-form-item label="达成人" name="dacheng" :rules="[{ required: true, message: '请选择达成人' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.dacheng" :options="[]">
              </a-select>
            </a-form-item>
            <a-form-item label="干预人" name="ganyu" :rules="[{ required: true, message: '请选择干预人' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.ganyu" :options="[]">
              </a-select>
            </a-form-item>
          </a-card>
          <a-card :bordered="false" style="width: 450px;margin-bottom: 20px;">
            <template #title> 发货信息 </template>
            <a-form-item label="发货信息" name="fahuo" :rules="[{ required: true, message: '请选择发货信息' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.fahuo" :options="[]">
              </a-select>
            </a-form-item>
            <a-form-item label="收件信息" name="depat" :rules="[{ required: true, message: '请输入收件信息' }]">
              <a-textarea :rows="4" placeholder="请输入" v-model:value="orderFrom.depat" />
            </a-form-item>
          </a-card>
          <a-card :bordered="false" style="width: 450px;margin-bottom: 20px;">
            <template #title> 订单信息 </template>
            <a-form-item label="会员类型" name="userType" :rules="[{ required: true, message: '请选择会员类型' }]">
              <a-radio-group v-model:value="orderFrom.userType">
                <a-radio :value="1">系统会员</a-radio>
                <a-radio :value="2">新增会员</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="会员昵称" name="username" :rules="[{ required: true, message: '请选择会员昵称' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.username" :options="[]">
              </a-select>
            </a-form-item>
            <a-form-item label="手机号" name="mobile" :rules="[{ required: true, message: '请输入手机号' }]">
              <a-input placeholder="请输入" v-model:value="orderFrom.mobile" />
            </a-form-item>
            <a-form-item label="订单编号" name="orderNo" :rules="[{ required: true, message: '请选择订单编号' }]">
              <a-select placeholder="请输入" show-search v-model:value="orderFrom.orderNo" :options="[]">
              </a-select>
            </a-form-item>
            <a-form-item label="达成日期" name="time" :rules="[{ required: true, message: '请选择达成日期' }]">
              <a-date-picker v-model:value="orderFrom.time" show-time format='YYYY-MM-DD' valueFormat='YYYY-MM-DD'
                placeholder="请输入" style="width: 100%" />
            </a-form-item>
          </a-card>
          <a-card :bordered="false" style="width: 450px">
            <a-table :dataSource="dataSource1" :columns="columns1">
              <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'product'">
                  <!-- {{text}} -->
                  <a-select style="width:100%" placeholder="请输入" show-search v-model:value="record.product"
                    :options="[]">
                  </a-select>
                </template>
                <template v-if="column.dataIndex === 'dell'">
                  <Icon style="color:#0079ff;margin-right: 5px;font-size:20px" icon="gala:add" />
                  <Icon icon="icon-park-outline:reduce-one" style="font-size:20px;color:red" />
                </template>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-form>
      <template #footer>
        <div style="text-align: center;">
          <a-button size="mini" key="submit" type="primary" :loading="loading" @click="handleOk">提交</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script lang='ts' setup>
  import
  Icon
  from '/@/components/Icon/icon.vue';
  import {
    CollapseSearchBar
  }
  from '/@/components/Business';
  import {
    formartData
  } from '@/utils/common.js'
  import {
    dataSource,
    columns,
    userFormData,
    schema,
    btnSchema,
    btnClick
  }
  from './index.js'
  const initForm = (obj = {}) => {
    return reactive(obj)
  }
  const orderFrom = initForm({
    userType: 1
  })
  const initFormState = () => reactive({});
  let formState = initFormState();
  const open = ref(false)
  const loading = ref(false)
  const title = ref('')
  const dataSource1 = reactive([{
    key: 1,
    product: '啊飒飒大生',
    number: 11,
    dell: 1,
  }])
  const columns1 = [{
    title: '产品',
    align: 'center',
    dataIndex: 'product',
    key: 'product',
    // width: '100px',
  }, {
    title: '数量',
    align: 'center',
    dataIndex: 'number',
    key: 'number',
    // width: '100px',
  }, {
    title: '操作',
    align: 'center',
    dataIndex: 'dell',
    key: 'dell',
    // width: '100px',
  }, ]
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
  btnClick('btn', (v) => {
    console.log(v)
    if (v === 'add') {
      open.value = true
      title.value = '新增'
    }
  })
  const handleOk = e => {
    console.log(e);
    open.value = false;
  };
  const contentSchema = userFormData()
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