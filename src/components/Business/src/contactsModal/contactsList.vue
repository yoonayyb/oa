<template>
  <div class="my-2">
    <div v-for="item in list" :key="item.id">
      <!-- <div :class="{'bg-sky-50':checkedUser.includes(item.id),'hover:bg-gray-100':!checkedUser.includes(item.id)}"
        @click="checked(item.id)" class="flex items-center justify-between mb-1 py-1 px-2 cursor-pointer rounded-lg">

        <img style="width: 30px;height: 30px;" src="@/assets/images/icon_role.png">
        <span>{{item.name}}</span>
        
      </div> -->
      <!-- <a-checkbox-group v-model:value="checkedUser" name="checkboxgroup" :options="options" /> -->

    </div>

    <a-checkbox-group @change="change" class="flex flex-col " v-model:value="checked" name="checkboxgroup"
      :options="options">
      <template #label="{ label,value,avatar }">
        <div class="flex items-center justify-between py-1">

          <!-- <img style="width: 30px;height: 30px;" src="@/assets/images/icon_role.png"> -->
          <HeadImg :userInfo="{name:label,avatar}" :size='32'></HeadImg>
          <div>{{label}}</div>

        </div>
      </template>
    </a-checkbox-group>
  </div>
</template>
<script setup>
  import { contactsProps } from './props.js'
  import Icon from '@/components/Icon/Icon.vue'
  import { HeadImg } from '/@/components/Business';
  const props = defineProps(contactsProps)
  const emits = defineEmits(['result'])

  const checked = computed(() => props.checkedUser)

  const options = computed(() => (props.list.map(v => ({ label: v.name, value: v.id, avatar: '' }))))


  const change = (val) => {
    // console.log('checkedUser', checkedUser)

    emits('result', val)
  }
</script>
<style lang="less" scoped>
  :deep(.ant-checkbox-group) {
    label {
      display: flex;
      align-items: center;

      span {
        width: 16px // min-width: 0;
      }

      span:last-child {
        flex: 1
      }
    }
  }
</style>
