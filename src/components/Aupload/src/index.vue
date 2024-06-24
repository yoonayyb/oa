<template>
  <div class="clearfix">
    <a-image-preview-group v-if="!hideImageList">
      <a-space class="flex flex-wrap">
        <!--  <a-image v-for="item in checked" :key="item" :fallback="fallback" style="object-fit: contain;"
          :width="getIsMobile?80:100" :height="getIsMobile?80:100" :src="item">
        </a-image> -->
        <div class="relative" v-for="(item, index) in checked" :key="item">
          <div @mouseenter="hover = item">
            <a-image
              :preview="false"
              :fallback="fallback"
              style="object-fit: contain"
              :width="getIsMobile ? 110 : 110"
              :height="getIsMobile ? 110 : 110"
              :src="item"
            >
            </a-image>
          </div>
          <div
            v-if="hover === item"
            @mouseleave="hover = ''"
            @click="open"
            class="flex flex-col absolute top-0 bg-slate-950/50 w-full h-full text-white justify-center items-center"
          >
            <div
              class="cursor-pointer"
              @click.stop="
                () => {
                  previewImg = item;
                  setVisible(true);
                }
              "
              >预览</div
            >
            <div class="cursor-pointer" @click.stop="checked.splice(index, 1)">删除</div>
          </div>
        </div>
      </a-space>
    </a-image-preview-group>
    <a-button v-if="!hideBtn" @click="open" class="mt-1" type="primary">上传</a-button>
    <BasicModal
      @register="register"
      @ok="ok"
      v-bind="$attrs"
      :width="600"
      :minHeight="400"
      title="图片库"
      :helpMessage="['从图片文件夹中选择']"
    >
      <a-flex wrap="wrap" gap="small">
        <upload ref="uploadRef" :disabled="disabled" :limitNum="limitNum" :defaultImageList="defaultImageList" @change="handleChange" />
        <div class="relative" v-for="item in folder" :key="item.path">
          <div @mouseenter="hover = item.path">
            <a-image
              :preview="false"
              :fallback="fallback"
              style="object-fit: contain"
              :width="getIsMobile ? 110 : 110"
              :height="getIsMobile ? 110 : 110"
              :src="item.url"
            >
            </a-image>
            <Icon v-if="checked.includes(item.url)" class="absolute bottom-1 right-1 text-sky-500" size="24" icon="raphael:checked"></Icon>
          </div>
          <div
            v-if="hover === item.path"
            @mouseleave="hover = ''"
            @click="choose(item.url)"
            class="flex flex-col absolute top-0 bg-slate-950/50 w-full h-full text-white justify-center items-center"
          >
            <div
              class="cursor-pointer"
              @click.stop="
                () => {
                  previewImg = item.url;
                  setVisible(true);
                }
              "
              >预览</div
            >
          </div>
        </div>
      </a-flex>
      <a-pagination
        @change="currentChange"
        class="absolute bottom-0 right-4"
        v-model:current="pagination.page"
        :total="pagination.total"
        show-less-items
      />
    </BasicModal>
    <a-image
      :style="{ display: 'none' }"
      v-if="visible"
      :preview="{
        visible,
        onVisibleChange: setVisible,
      }"
      :fallback="fallback"
      :src="previewImg"
    >
    </a-image>
  </div>
</template>
<script setup>
  import { message } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { BasicModal } from '/@/components/Modal';
  import { getfolder, get_upload_params } from '/@/api/upload/upload';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import Icon from '@/components/Icon/Icon.vue';
  import upload from './upload.vue';
  const { getIsMobile } = useAppInject();
  const emit = defineEmits(['change', 'onOk']);
  const choseFileStatus = ref(false);
  const [register, { openModal, closeModal }] = useModal();
  const props = defineProps({
    defaultImageList: {
      type: Array,
      default: function () {
        return [];
      },
      // required: true
    },
    limitNum: {
      type: Number,
      default: 1,
      required: false,
    },
    hideImageList: {
      type: Boolean,
      default: false,
    },
    hideBtn: {
      type: Boolean,
      default: false,
    },
    catgory: {
      type: String,
      default: 'user',
      required: false,
    },
  });

  const visible = ref(false);
  const hover = ref();
  const previewImg = ref();
  const checked = ref([]);
  const uploadRef = ref();
  const disabled = ref(false);
  const defaultImageList = computed(() => props.defaultImageList);
  // checked.value = defaultImageList.value
  watch(
    checked,
    (newVal) => {
      if (props.limitNum === 1) {
      } else if (newVal.length > props.limitNum) {
        return message.warning('只能选取' + props.limitNum + '个');
      }
      emit('change', newVal);
    },
    { deep: true },
  );
  watch(defaultImageList, (newVal) => {
    checked.value = newVal;
  });
  const ok = () => {
    console.log('checked', checked);
    choseFileStatus.value = true;
    closeModal();
    emit('onOk', defaultImageList, checked);
  };
  const choose = (url) => {
    if (checked.value.indexOf(url) > -1) {
      checked.value.splice(checked.value.indexOf(url), 1);
    } else if (checked.value.length < props.limitNum) {
      checked.value.push(url);
    } else if (props.limitNum === 1) {
      checked.value = [url];
    } else {
      message.warning('只能选取' + props.limitNum + '个');
    }
    console.log('checked', checked.value);
  };
  const setVisible = (value) => {
    console.log('111111111');
    visible.value = value;
  };
  const mouseenter = () => {
    console.log('mouseenter');
  };
  const folder = ref([]);
  const pagination = reactive({
    page: 1,
    pageNum: 10,
    total: 0,
  });
  const currentChange = (val) => {
    pagination.page = val;
    getfolderList();
  };
  const getfolderList = async () => {
    console.log('[ getfolderList ]-203');
    const { records, total } = await getfolder({
      pages: pagination.page,
      pageNum: pagination.pageNum,
      catgory: props.catgory,
    });
    folder.value = records;
    pagination.total = total;
  };
  const fallback =
    'data:image/png;base64,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';
  // reqStatus用来判断是否需要请求图片库
  const open = async () => {
    pagination.page = 1;
    // checked.value = []
    await getfolderList();
    openModal();
  };
  const handleChange = (arr) => {
    console.log('arr', arr);
    if (Object.prototype.toString.call(arr) === '[object Array]' && arr.length) {
      const taskPromises = arr.map((v) => get_upload_params(v.file, props.catgory));
      Promise.all(taskPromises)
        .then(async (res) => {
          console.log('promiseAll', res);
          res.length && message.success('成功上传图片库');
          uploadRef.value.clearImageList();
          // console.log('uploadRef.value.imageList.value', uploadRef.value.imageList)
          pagination.page = 1;
          getfolderList();
          resolve();
        })
        .catch((err) => {
          // message.error('上传失败')
        });
    }
    // emit('change', arr)
  };
  // imageList = handleData(props.defaultImageList)
  defineExpose({ open });
</script>
<style lang="less" scoped>
  :deep(.ant-upload) {
    width: 128px !important;
    height: 128px !important;
    margin: 0 !important;
  }
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .relative {
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
  }
</style>
