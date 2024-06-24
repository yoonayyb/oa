<template>
  <Collapse v-model:activeKey="activeKey">
    <slot>

    </slot>
  </Collapse>
</template>

<script setup>
  import { ref } from 'vue';
  import { Collapse } from 'ant-design-vue';
  const activeKey = ref(['1']);

</script>
<style lang="less" scoped></style>
