<!--
 * @Date: 2022-08-25 14:05:59
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-05-24 15:20:53
 * @FilePath: /Workflow-Vue3/src/components/drawer/copyerDrawer.vue
-->
<template>
    <a-drawer :append-to-body="true" title="抄送人设置" v-model:open="visible" class="set_copyer" :show-close="false" :width="550" :before-close="saveCopyer"> 
        <div class="demo-drawer__content">
            <div class="copyer_content drawer_content">
                <a-button type="primary" @click="addCopyer">添加成员</a-button>
                <p class="selected_list">
                    <span v-for="(item,index) in copyerConfig.nodeUserList" :key="index">{{item.name}}
                        <img src="@/assets/images/add-close1.png" @click="$func.removeEle(copyerConfig.nodeUserList,item,'targetId')">
                    </span>
                    <a v-if="copyerConfig.nodeUserList&&copyerConfig.nodeUserList.length!=0" @click="copyerConfig.nodeUserList=[]">清除</a>
                </p>
                <a-checkbox-group v-model:value="ccSelfSelectFlag" :options="[{value:1,label:'允许发起人自选抄送人'}]" class="clear">
                    
                </a-checkbox-group>
            </div>
            <div class="demo-drawer__footer clear">
                <a-button type="primary" @click="saveCopyer">确 定</a-button>
                <a-button @click="closeDrawer">取 消</a-button>
            </div>
            <employees-role-dialog 
                v-model:visible="copyerVisible"
                :data="checkedList"
                @change="sureCopyer"
            />
        </div>
    </a-drawer>
</template>
<script setup>
import employeesRoleDialog from '../dialog/employeesRoleDialog.vue'
import $func from '@/utils/workIndex'
import { useStore } from '@/store/modules/workIndex'
import { ref, watch, computed } from 'vue'
let copyerConfig = ref({})
let ccSelfSelectFlag = ref([])
let copyerVisible = ref(false)
let checkedList = ref([])
let store = useStore()
let { setCopyerConfig, setCopyer } = store
let copyerDrawer = computed(()=> store.copyerDrawer)
let copyerConfig1 = computed(()=> store.copyerConfig1)
let visible = computed({
    get() {
        return copyerDrawer.value
    },
    set() {
        closeDrawer()
    }
})
watch(copyerConfig1, (val) => {
    copyerConfig.value = val.value;
    ccSelfSelectFlag.value = copyerConfig.value.ccSelfSelectFlag == 0 ? [] : [copyerConfig.value.ccSelfSelectFlag]
})

const addCopyer = () => {
    copyerVisible.value = true;
    checkedList.value = copyerConfig.value.nodeUserList
}
const sureCopyer = (data) => {
    copyerConfig.value.nodeUserList = data;
    copyerVisible.value = false;
}
const saveCopyer = () => {
    copyerConfig.value.ccSelfSelectFlag = ccSelfSelectFlag.value.length == 0 ? 0 : 1;
    copyerConfig.value.error = !$func.copyerStr(copyerConfig.value);
    setCopyerConfig({
        value: copyerConfig.value,
        flag: true,
        id: copyerConfig1.value.id
    })
    closeDrawer();
}
const closeDrawer = () => {
    setCopyer(false)
}    
</script>

<style lang="less">
.set_copyer {
    .copyer_content {
        padding: 20px 20px 0;

        .ant-button {
            margin-bottom: 20px;
        }

        .ant-checkbox {
            margin-bottom: 20px;
        }
    }
}
</style>
