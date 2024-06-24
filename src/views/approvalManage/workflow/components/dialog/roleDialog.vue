<!--
 * @Date: 2022-08-25 14:05:59
 * * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-15 14:59:19
 * @FilePath: /Workflow-Vue3/src/components/dialog/roleDialog.vue
-->
<template>
  <a-modal title="选择角色" v-model:open="visibleDialog" :width="600" class="promoter_person">
    <div class="person_body clear">
      <div class="person_tree l">
        <!-- <input type="text" placeholder="搜索角色" v-model="searchVal" @input="getFilterRoleList"> -->
        <a-input-search placeholder="搜索角色" v-model:value="searchVal" @input="getFilterRoleList" />
        <selectBox :list="list" />
      </div>
      <selectResult :total="total" @del="delList" :list="resList" />
    </div>
    <template #footer>
      <a-button @click="closeDialog">取 消</a-button>
      <a-button type="primary" @click="saveDialog">确 定</a-button>
    </template>
  </a-modal>
</template>
<script setup>
  import selectBox from '../selectBox.vue'
  import selectResult from '../selectResult.vue'
  import { computed, watch, ref } from 'vue'
  import $func from '@/utils/workIndex.js'
  import { roles, getDebounceData, searchVal } from './common'
  let props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    }
  })
  let checkedRoleList = ref([])


  let emits = defineEmits(['update:visible', 'change'])
  let list = computed(() => {
    return [{
      type: 'role',
      not: true,
      data: roles.value,
      isActive: (item) => $func.toggleClass(checkedRoleList.value, item, 'roleId'),
      change: (item) => {
        if (checkedRoleList.value.length) {
          let index = checkedRoleList.value.findIndex(v => v.roleId === item.roleId)
          if (index > -1) {
            checkedRoleList.splice(index, 1)
          } else {
            checkedRoleList.value.push(item)
          }
        } else {
          checkedRoleList.value.push(item) // = [item]
        }
        // checkedRoleList.value.push(item)
        // console.log('item',item)
        // if(checkedRoleList.value.findIndexOf(v=>) > -1){
        //   checkedRoleList.value.push(item)
        // }else{
        //   console.log('index',checkedRoleList.value.findIndex(item))
        // }
        // checkedRoleList.value = [item]
      },

    }]
  })
  let resList = computed(() => {
    return [{
      type: 'role',
      data: checkedRoleList.value,
      cancel: (item) => $func.removeEle(checkedRoleList.value, item, 'roleId')
    }]
  })
  let visibleDialog = computed({
    get () {
      return props.visible
    },
    set (val) {
      closeDialog()
    }
  })
  let copyRole = []
  const getFilterRoleList = () => {
    // if (searchVal.value) {
    //   console.log('copyRole',copyRole)
    //   roles.value = roles.value.filter(v => v.roleName.includes(searchVal.value))
    // } else {
    //   getRoleList()
    // }
    roles.value = copyRole.filter(v => v.roleName.includes(searchVal.value))
    // console.log('copyRole', copyRole)
  }
  const getRoleList = async () => {
    console.log('searchVal.value', searchVal.value)
    const data = await window.http.get({
      url: '/company_center/company_role_api/select',
      params: { company_id: localStorage.getItem('companyId') }
    })
    console.log('data', data)

    roles.value = data.map(v => {
      return {
        roleName: v.title,
        roleId: v.id,
        scope: 1,
        status: 1,
        code: '',
        description: ''
      }
    })
    copyRole = [...roles.value]
    console.log('roles', roles)
    // console.log('data', data)
    // console.log('checkedEmployessList', checkedEmployessList)
  }
  watch(() => props.visible, (val) => {
    if (val) {
      getRoleList()
      console.log('roles', roles)
      searchVal.value = ""
      checkedRoleList.value = props.data.map(({ name, targetId }) => ({
        roleName: name,
        roleId: targetId
      }))
    }
  })
  let total = computed(() => checkedRoleList.value.length)
  const saveDialog = () => {
    let checkedList = checkedRoleList.value.map(item => ({
      type: 2,
      targetId: item.roleId,
      name: item.roleName
    }))
    emits('change', checkedList)
  }
  const delList = () => {
    checkedRoleList.value = []
  }

  const closeDialog = () => {
    emits('update:visible', false)
  }
</script>

<style>
  @import '@/css/dialog.css';
</style>
