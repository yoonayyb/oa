<template>
  <div>
    <!-- :value="form.txt" -->
    <!-- v-bind='{...bind}' -->
    1.
    <a-input type="text" :value="form.txt" @update:value="newValue => form.txt = newValue" />
    <!-- v-bind='bind' -->
    2.
    <a-input type="text" v-bind="bind" @update:value="newValue => form.txt = newValue" />
  </div>
</template>

<script setup>

  const props = defineProps({
    form: {
      type: Object,
      default: {},
    },
    bind: {
      type: Object,
      default: {},
    },
  });
</script>
<style lang="less" scoped></style>
    <!-- @update:value="newValue => form.txt = newValue"  -->

