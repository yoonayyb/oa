<template>
  <div class="img_box flex_aic_jcc relative">
    <a-avatar v-if="userInfo.avatar" class="avatar" :size="size">
      <template #icon><img :src="userInfo.avatar" /></template>
    </a-avatar>
    <div v-else-if="userInfo.name" class="text_img flex_aic_jcc" :class="{img_box_nocircle:nocircle}"
      :style="{ width: `${size}px`, height: `${size}px` }">
      <span class="text_name">
        {{ userInfo.name.slice(-2) }}
      </span>
    </div>
    <img v-if="approve" class="approve_img" :src='`/imgs/icon_${approve}.png`' />
    <!--  1.只有正在审核中（status 0）且已读才展示图标 2.未到他审核（status -1）但是他已读了也展示 3.其他状态肯定已读了 就不用展示  -->
    <img v-if="(approve ==='approvering' || !approve)  && read" class="red_img" :src='`/imgs/icon_${read}.png`' />
    <!-- <img v-if="read" class="red_img" :src='`/imgs/icon_${read}.png`' /> -->
    <!-- 评论 -->
    <img v-if="comment" class="approve_img" :src='`/imgs/icon_${comment}.png`' />

  </div>
</template>

<script lang="ts" setup>
  import { booleanType } from 'ant-design-vue/lib/_util/type';
  const props = defineProps({
    userInfo: { type: Object, default: {} },
    avatarImg: { type: String, default: '' },
    name: { type: String, default: '' },
    size: { type: Number, default: 64 },
    nocircle: { type: Boolean, default: true },
    approve: { type: String, default: '' },//审核状态
    comment: { type: String, default: '' },//评论
    read: { type: String, default: '' },//已读
    // approved: { type: Boolean, default: false }, //已经同意
    // approvering: { type: Boolean, default: false }, // 审核中
    // notapprove: { type: Boolean, default: false } // 不通过
    // revokeapprove: { type: Boolean, default: false } // 已撤回
  });
</script>
<style lang="less" scoped>
  :deep( .ant-avatar) {
    background-color: transparent;
  }

  .img_box {
    // padding: 5px;
  }



  .text_img {
    background-color: #0392ff;
    border-radius: 50%;

    .text_name {
      color: #fff;
      text-align: center;
    }
  }

  .approve_img {
    width: 14px;
    height: 14px;
    position: absolute;
    bottom: -3px;
    right: -3px
  }

  .red_img {
    width: 14px;
    height: 14px;
    position: absolute;
    top: -3px;
    right: -3px
  }

  .img_box_nocircle {
    border-radius: 6px !important;
  }
</style>
