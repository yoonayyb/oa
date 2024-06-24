<template>
  <div>
    <div class="mb-2">已选 <strong>({{list.length}})</strong> 人 <span class="cursor-pointer" style="float: right;"
        @click="clear">清空</span> </div>
    <div v-for="item in list" :key="item.id">
      <div @click="delItem(item.id)" class="flex items-center justify-between mb-1 py-1 px-2 cursor-pointer rounded-lg">
        <!-- <img style="width: 30px;height: 30px;" src="@/assets/images/icon_role.png"> -->
        <HeadImg :userInfo="{name:item.name,avatar:''}" :size='32'></HeadImg>
        <span>{{item.name}}</span>
      </div>
    </div>

  </div>
</template>
<script setup>
  import { contactsProps } from './props.js'
  import Icon from '@/components/Icon/Icon.vue'
  import { HeadImg } from '/@/components/Business';
  const props = defineProps(contactsProps)
  const emits = defineEmits(['delItem'])


  const delItem = (id) => {
    emits('delItem', id)
  }
  const clear = () => {
    emits('delItem', props.list.map(v => v.id))
  }
</script>
<style lang="less" scoped>

</style>
