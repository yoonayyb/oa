<template>
  <div>

    <a-timeline>
      <a-timeline-item v-for="item in arr">
        <a-row>
          <a-col :xs="{span:6}" :sm="{span:4}" class="flex flex-col ">
            <div class="mb-1">{{item.nodeName}} <span class="text-sky-500 text-xs">({{changeType(item.type)}})</span>
            </div>

            <template v-if="item.type == 2">
              <div class="text-gray-300 text-xs">
                {{item?.checked?.length?'已选择'+item?.checked?.length+'人':'请选择'}}
              </div>
            </template>
            <template v-else-if="item.type == 7">
              <div v-if="item.form_contact_identify" class="text-gray-300 text-xs">
                {{item.contacts && item.contacts.length?'已选择'+item.contacts.length+'人':'请选择'}}
              </div>
              <div v-else>
                <div v-if="item.approves.length" class="text-gray-300 text-xs">
                  已选择{{item.approves.length}}人
                </div>
                <div v-else class="text-gray-300 text-xs">
                  暂无{{changeType(item.type)}}
                </div>
              </div>
            </template>
            <template v-else>
              <div v-if="item.approves.length" class="text-gray-300 text-xs">
                已选择{{item.approves.length}}人
              </div>
              <div v-else class="text-gray-300 text-xs">
                暂无{{changeType(item.type)}}
              </div>
            </template>

          </a-col>
          <a-col :xs="{span:18}" :sm="{span:20}" class="flex flex-col items-end">
            <div class="flex flex-wrap">
             <!-- <div>1.{{item.type}}2. {{item.checked}} 3.{{item.approves}}4.{{item.contacts}}</div> -->
             <template
                v-if="item?.checked?.length>3 || (item?.approves.length>3 && item.type !=7) || item.contacts?.length>3">

                <div class="flex items-center cursor-pointer">
                  <div @click="open({...item,look:true})" class="flex flex-col justify-center items-center">
                    <Icon class=" text-cyan-500" size="32" icon="icon-park:avatar"></Icon>
                    <div style="width:100%" class=" text-gray-400 text-center truncate">查看全部</div>


                  </div>
                  <Icon size="20" icon="mingcute:right-line"></Icon>
                </div>
              </template>
             
              
              
              <template v-else>
                
                <template v-if="item.type !== 7 || !item.form_contact_identify">
                  <div v-for="(c,d) in item.approves.slice(0,3)" :key="c.id" class="flex items-center">
                    <div style="width:3rem" class="flex flex-col justify-center items-center">
                      <!-- <img style="width: 32px;height: 32px;" src="@/assets/images/icon_role.png"> -->
                      <HeadImg :userInfo="{name:c.name,avatar:c.avatar}" :size='32'></HeadImg>
                      <div style="width:100%" class="text-gray-400 text-center truncate">
                        {{c.name }}
                      </div>
                    </div>
                    <Icon v-if="d !== item.approves.length -1 && d !==2" size="20" icon="mingcute:right-line"></Icon>
                  </div>
                  <div class="text-gray-500 text-xs" v-if="!item.approves.length && item.man_empty_condition === 0">自动通过
                  </div>
                </template>
                <template v-else>
                  <div v-for="(c,d) in item?.contacts?.slice(0,3)" :key="c.id" class="flex items-center">
                    <div style="width:3rem" class="flex flex-col justify-center items-center">
                      <!-- <img style="width: 32px;height: 32px;" src="@/assets/images/icon_role.png"> -->
                      <HeadImg :userInfo="{name:c.label,avatar:c.avatar}" :size='32'></HeadImg>
                      <div style="width:100%" class="text-gray-400 text-center truncate">
                        {{c.label }}
                      </div>
                    </div>
                    <Icon v-if="d !== item?.contacts?.length -1 && d !==2" size="20" icon="mingcute:right-line"></Icon>
                  </div>
                  <div class="text-gray-500 text-xs" v-if="!item?.approves.length && !item?.contacts?.length">请选择联系人
                  </div>
                </template>

              </template>
              <div v-for="(v,i) in item?.checked?.slice(0,3)" :key="v.id" class="flex items-center">
                <div style="width:3rem" class="flex flex-col justify-center items-center">
                  <!-- <img style="width: 32px;height: 32px;" src="@/assets/images/icon_role.png"> -->
                  <HeadImg :userInfo="{name:v.name,avatar:v.avatar}" :size='32'></HeadImg>
                  <div style="width:100%" class="text-gray-400 text-center truncate">{{v.name}}</div>
                </div>
              
                <Icon size="20" icon="mingcute:right-line"></Icon>
              </div>
              
              <Icon v-if="showAddIcon(item.type)" @click="open(item)" class="cursor-pointer" size="48"
                icon="material-symbols-light:add-box-outline">
              
              </Icon>
            </div>
          </a-col>
        </a-row>


      </a-timeline-item>

    </a-timeline>
    <Modal @ok="ok" :title="title" :helpMessage="helpMessage" @register="register" />
  </div>
</template>

<script setup>
  import Icon from '@/components/Icon/Icon.vue'
  import { useModal } from '/@/components/Modal';
  import { HeadImg } from '/@/components/Business';
  import Modal from '/@/components/Business/src/contactsModal/index.vue';
  const props = defineProps({
    list: {
      type: Array,
      default: () => []
    }
  })
  const emits = defineEmits(['arr'])
  const [register, { openModal, closeModal }] = useModal();
  const arr = ref([])
  const checked = ref([])
  const title = ref('选择人员')
  const helpMessage = ref('请勾选人员')

  const showAddIcon = (type) => {

    return type !== 0 && type !== 1 && type !== 3 && type !== 4 && type !== 5 && type !== 6 && type !== 7 && type !== 8

  }

  const open = (item) => {

    title.value = item.look ? item.nodeName : '选择人员'
    helpMessage.value = item.look ? item.nodeName : '请勾选人员'
    //0指定人员 1发起人自己 3角色 4直属主管 5部门主管 6连续多级主管 7表单内联系人 8出库发货人 不用请求就只拿approves的数据

    openModal(true, item);
  }
  const setContacts = (item) => {



    arr.value.forEach(async (v) => {
      const target = item.filter(e => v.type === 7 && v.form_contact_identify.includes(e.field))


      if (target.length) {

        v.contacts = target.map(v => ({ label: v.label, value: v.value }))
        console.log('v.contacts: ', v.contacts)
      }else{
        v.contacts = []
      }



    })
  }
  defineExpose({ setContacts })
  watch(() => props.list, (newVal) => {


    arr.value = []


    // if (!arr.value.length) {
    newVal.forEach(async (v, i) => {
      // if (!v.checked) {
      //   v.checked = []
      //   
      // } else {
      //   v.checked = v.checked
      // }
      v.checked = v.checked?.length ? v.checked : []
      v.nodeName = v.meta && JSON.parse(v.meta).nodeName
      v.selectRange = v.meta && JSON.parse(v.meta).selectRange
      v.approve_mans = v
      v.contacts = []
      // arr.value.push({ ...v, checked: [], })
      // arr.value[i].approve_mans = v

    })
    arr.value = newVal
    console.log('arr.value: ', arr.value)

    // }

    return

  })
  const search = async (form_contact_identify) => {
    return await getPerson(form_contact_identify)
  }
  const getPerson = async (company_user_ids = '') => {
    const { records, total } = await window.http.get({
      url: '/company_center/staff_api/select',
      params: {
        company_id: localStorage.getItem('companyId'),
        pageNum: 1000,
        page: 1,
        company_user_ids
      }
    })
    return records
  }
  watch(arr, (newVal) => {
    emits('arr', newVal)

  }, { deep: true })
  const ok = (val) => {
    // 
    // checked.value = val.value

    // 

    closeModal()
  }
  const changeType = (settype) => {
    let type = '指定成员' // 指定成员
    if (settype == 4) type = '直属主管' //直属主管
    if (settype == 5) type = '部门主管' //部门主管
    if (settype == 2) type = '发起人自选' //发起人自选
    if (settype == 1) type = '发起人自己' //发起人自己
    if (settype == 6) type = '连续多级主管' //连续多级主管
    if (settype == 3) type = '角色' //角色
    if (settype == 7) type = '表单内联系人' //表单内联系人
    if (settype == 8) type = '出库发货人' //出库发货人
    return type
  }
  const filterObj = (obj) => {

    let { childNode, ...val } = obj || {}
    if (obj.type != 0 && obj.type != 1000) {
      arr.value.push({ ...val, checked: [], })
    }
    if (childNode && Object.keys(childNode).length) {
      filterObj(childNode)
    }
  }
</script>

<style lang="scss" scoped>

</style>
