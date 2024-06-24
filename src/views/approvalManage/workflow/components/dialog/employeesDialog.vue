<template>
  <a-modal title="选择成员" v-model:open="visibleDialog" :width="600" class="promoter_person">
    <div class="person_body clear">
      <div class="person_tree l">
        <a-input-search placeholder="请输入姓名" v-model:value="searchVal" @search="search" />
        <!-- <p class="ellipsis tree_nav" v-if="!searchVal">
                  <span @click="getDepartmentList(0)" class="ellipsis">天下</span>
                  <span v-for="(item,index) in departments.titleDepartments" class="ellipsis" 
                  :key="index+'a'" @click="getDepartmentList(item.id)">{{item.departmentName}}</span>   
              </p> -->
        <selectBox :list="list" />
        <a-pagination v-model:current="pagetions.current" :pageSize="pagetions.pageNum" @change="pageChange"
          :total="pagetions.total" show-less-items />
      </div>
      <selectResult :total="total" @del="delList" :list="resList" />
    </div>
    <template #footer>
      <a-button @click="$emit('update:visible',false)">取 消</a-button>
      <a-button type="primary" @click="saveDialog">确 定</a-button>
    </template>
  </a-modal>
</template>

<script setup>
  import selectBox from '../selectBox.vue'
  import selectResult from '../selectResult.vue'
  import { computed, watch, ref } from 'vue'
  import { departments, getDebounceData, getDepartmentList, searchVal } from './common'
  import { useConfigStoreWithOut, } from '/@/store/modules/config';
  import $func from '@/utils/workIndex.js'
  const configStore = useConfigStoreWithOut();
   
  let props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    isDepartment: {
      type: Boolean,
      default: false
    },
  })
  let emits = defineEmits(['update:visible', 'change'])
  let visibleDialog = computed({
    get() {

      return props.visible
    },
    set() {
      closeDialog()
    }
  })
  let checkedDepartmentList = ref([])
  let checkedEmployessList = ref([])
  const pagetions = reactive({
    current: 1,
    pageNum: 15,
    total: 0
  })
  const pageChange = (val) => {
    console.log(val)
    getPerson()
  }
  const search = () => {
    pagetions.current = 1
    getPerson()
  }
  const getPerson = async (name = '') => {

    const { records, total } = await window.http.get({
      url: '/company_center/staff_api/select',
      params: {
        company_id: localStorage.getItem('companyId'),
        pageNum: pagetions.pageNum,
        pages: pagetions.current,
        name: searchVal.value
      }
    })
    
    departments.value.employees = records.map(v => {
      return {
        employeeName:v.name,
        id: v.id,
        isLeave: 0,
        companyName:localStorage.getItem('companyName') || '',
        companyId:localStorage.getItem('companyId') || '',
        open: false
      }
    })
    pagetions.total = total
    
    console.log('departments.value.employees', departments.value.employees)
    // console.log('data', data)
    // console.log('checkedEmployessList', checkedEmployessList)
  }
  let list = computed(() => {

    return [
      //   {
      //   isDepartment: props.isDepartment,
      //   type: 'department',
      //   data: departments.value.childDepartments,
      //   isActive: (item) => $func.toggleClass(checkedDepartmentList.value, item),
      //   change: (item) => $func.toChecked(checkedDepartmentList.value, item),
      //   next: (item) => getDepartmentList(item.id)
      // }, 
      {
        type: 'employee',
        data: departments.value.employees,
        isActive: (item) => $func.toggleClass(checkedEmployessList.value, item),
        change: (item) => $func.toChecked(checkedEmployessList.value, item),
      }
    ]
  })
  let resList = computed(() => {
    let data = [{
      type: 'employee',
      data: checkedEmployessList.value,
      cancel: (item) => $func.removeEle(checkedEmployessList.value, item)
    }]
    // if (props.isDepartment) {
    //   data.unshift({
    //     type: 'department',
    //     data: checkedDepartmentList.value,
    //     cancel: (item) => $func.removeEle(checkedDepartmentList.value, item)
    //   })
    // }
    return data
  })
  watch(() => props.visible, (val) => {
    if (val) {
      // getDepartmentList();
      getPerson()
      searchVal.value = ""
      checkedEmployessList.value = props.data.filter(item => item.type === 1).map(({ name, targetId,companyName,companyId }) => ({
        employeeName: name,
        companyName,
        companyId,
        id: targetId
      }))
      // checkedDepartmentList.value = props.data.filter(item => item.type === 3).map(({ name, targetId }) => ({
      //   departmentName: name,
      //   id: targetId
      // }));
    }
  })

  const closeDialog = () => {
    emits('update:visible', false)
  }

  let total = computed(() => checkedDepartmentList.value.length + checkedEmployessList.value.length)

  let saveDialog = () => {
    let checkedList = [
      ...checkedDepartmentList.value,
      ...checkedEmployessList.value
    ].map(item => ({
      type: item.employeeName ? 1 : 3,
      targetId: item.id,
      companyName: item.companyName,
      companyId:item.companyId,
      name: item.employeeName || item.departmentName
    }))

    emits('change', checkedList)

  }
  const delList = () => {
    checkedDepartmentList.value = []
    checkedEmployessList.value = []
  }
</script>
<style>
  @import '@/css/dialog.css';
</style>
