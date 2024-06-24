<!--
 * @Date: 2022-08-25 14:05:59
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-05-24 15:17:13
 * @FilePath: /Workflow-Vue3/src/components/drawer/promoterDrawer.vue
-->
<template>
    <a-drawer :append-to-body="true" title="发起人" v-model:open="visible" class="set_promoter" :show-close="false" :width="550" :before-close="savePromoter"> 
        <div class="demo-drawer__content">
            <div class="promoter_content drawer_content">
                <p>{{ $func.arrToStr(flowPermission) || '所有人' }}</p>
                <a-button class="m0!" type="primary" @click="addPromoter">添加/修改发起人</a-button>
            </div>
            <div class="demo-drawer__footer clear">
                <a-button type="primary" @click="savePromoter">确 定</a-button>
                <a-button @click="closeDrawer">取 消</a-button>
            </div>
            <employees-dialog 
                :isDepartment="true"
                v-model:visible="promoterVisible"
                :data="checkedList"
                @change="surePromoter"
            />
        </div>
    </a-drawer>
</template>
<script setup>
import employeesDialog from '../dialog/employeesDialog.vue'
import $func from '@/utils/workIndex'
import { useStore } from '@/store/modules/workIndex'
import { computed, ref, watch } from 'vue'
let flowPermission = ref([])
let promoterVisible = ref(false)
let checkedList = ref([])

let store = useStore()
let { setPromoter, setFlowPermission } = store
let promoterDrawer = computed(()=> store.promoterDrawer)
let flowPermission1 = computed(()=> store.flowPermission1)
let visible = computed({
    get() {
        return promoterDrawer.value
    },
    set() {
        closeDrawer()
    }
})
watch(flowPermission1, (val) => {
    flowPermission.value = val.value
})

const addPromoter = () => {
    checkedList.value = flowPermission.value
    promoterVisible.value = true;
}
const surePromoter = (data) => {
    flowPermission.value = data;
    promoterVisible.value = false;
}
const savePromoter = () => {
    setFlowPermission({
        value: flowPermission.value,
        flag: true,
        id: flowPermission1.value.id
    })
    closeDrawer()
}
const closeDrawer = () => {
    setPromoter(false)
}
</script>
<style lang="less" scoped>
.set_promoter {
    .promoter_content {
        padding: 0 20px;
        .ant-button {
            // margin-bottom: 20px;
        }
        p {
            padding: 18px 0;
            font-size: 14px;
            line-height: 20px;
            color: #000000;
        }
    }
}
</style>
