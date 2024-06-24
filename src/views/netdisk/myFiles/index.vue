<template>
  <div>
    <BasicTable @row-mouseenter="rowMouseenter" @row-dbClick="rowDbClick" @row-mouseleave="rowMouseleave"
      @row-click="rowClick" @register="registerTable">

      <template #headerTop>

        <a-breadcrumb>
          <a-breadcrumb-item @click="breadcrumbClick(item)" v-for="(item,index) of filesPath" :key="index">
            <a :class="{'!text-slate-950 !font-bold':index === filesPath.length - 1 }">{{item.breadcrumbName}}</a>

          </a-breadcrumb-item>
        </a-breadcrumb>
      </template>
      <template #tableTitle>

        <view class="ml-4" v-if="selectRowFiles.length">
          <view class="!font-bold">已选{{selectRowFiles.length}}项</view>
          <a-space>
            <a-button @click="handleDownload('')" v-if="!selectRowFiles.find(v=>v.file_id == 0)"
              type="primary">下载</a-button>
            <a-button @click="move('')" type="primary">移动</a-button>
            <a-button @click="add('')" type="primary">添加到</a-button>
            <a-popconfirm title="是否确认删除?" ok-text="确定" cancel-text="取消" @confirm="confirm">
              <a-button danger type="primary">删除</a-button>
            </a-popconfirm>


          </a-space>
        </view>

      </template>

      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新建 </a-button>
        <BasicUpload is_netdisk :parent_id="[parent_id]" :api="folder_upload_params" @reload="reload">

        </BasicUpload>
        <!-- <a-button type="primary" @click="handleCreate2"> 上传 </a-button> -->
        <span>文件数量：{{total}}</span>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">


          <a-checkbox v-if="record.show" v-model:checked="record.checked"> </a-checkbox>
          <span v-else style="display: inline-block; width: 1rem;height: 1rem;"> </span>
          <view class="inline-flex justify-center items-center">
            <TableImg v-if="record.file && record.file.file_type === 'IMG'" class="!mx-4" :size="50" simpleShow
              :imgList="[record.file.url]"></TableImg>
            <TableImg v-else-if="record.file && record.file.file_type !== 'IMG'" class="!mx-4" :size="50" simpleShow
              :imgList="[checkFileType(record.file.postfix).url]"></TableImg>
            <TableImg v-else class="!mx-4" :size="50" simpleShow
              :imgList="['https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/folder.png']"></TableImg>
            <span class="!font-bold">{{record.title}}</span>
          </view>



        </template>

        <template v-if="column.key === 'action'">
          <TableAction :dropDownActions="[
              {
                label: '复制链接',
                onClick: onCopy.bind(null, record),
              },
              {
                label: '复制模版链接',
                onClick: onCopyHTML.bind(null, record),
              },
              {
                label: '下载',
                ifShow:record.file_id>0,
                onClick: handleDownload.bind(null, record),
              },
              {
                label: '移动',
                onClick: move.bind(null, record),
              },
              {
                label: '添加到',
                onClick: add.bind(null, record),
              },
              
              {
                label: '重命名',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]" />
        </template>
      </template>
    </BasicTable>
    <Edit @register="registerModal" @success="handleSuccess" />
    <folder @register="registerFolderModal" @success="handleSuccess"></folder>
  </div>
</template>
<script lang="ts" setup>
  import { folder_upload_params } from '/@/api/upload/upload';
  import { BasicTable, useTable, TableAction, TableImg } from '/@/components/Table';
  import { BasicUpload } from '@/components/Upload';
  import { useModal } from '/@/components/Modal';
  import folder from '../components/folder.vue';
  import Edit from './Edit.vue';
  import { userSchemaFn, searchTitle } from './config';
  import { message } from 'ant-design-vue';
  import { router } from '/@/router';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { checkFileType } from '@/utils/common.js';
  import { copyText } from '@/utils/copyTextToClipboard';
  import { downloadByUrl } from '@/utils/file/download';
  import { h } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  const { createInfoModal, createConfirm } = useMessage();
  const onCopyHTML = async (val) => {
    const { isSuccessRef } = useCopyToClipboard(
      val,
    );
    let data = await getShareInfo(val.id)
    unref(isSuccessRef) &&
      createConfirm({
        title: '复制HTML',
        iconType: 'info',
        okText: '复制',
        cancelText: '关闭',
        // content: JSON.stringify(unref(val), null, 2) +'有权限的人可以访问',
        content: `
        <div id="sourceElement" style="user-select: auto;">
        <a href="https://work.weehealth.cn/#/share?hash=${data.hash}&parent_id=${val.id}" target="_block" style="cursor: pointer;border: 1px solid #CACACA;display: flex;flex-direction: column;align-items: center;color:#0079ff;padding:20px;border-radius: 12px;width:200px">
          <div >点按以下载</div>
          <span style="color:#808080;font-size:12px;word-break: break-all;">${val.title}</span>
        </a>
        </div>
        `,
        onOk: async (value) => {
          copyParentElementContent(document.getElementById('sourceElement'))

        }
      });
  }
  const copyParentElementContent = (element) => {
       let range = document.createRange();
                   range.selectNode(element);
                   let selection = window.getSelection();
                   selection.removeAllRanges();
                   selection.addRange(range);
       
                   let rangeToCopy = document.createRange();
                   rangeToCopy.selectNodeContents(element);
                   selection.addRange(rangeToCopy);
       
                   document.execCommand('copy');
                 message.success('复制成功'); 
    }
  const onCopy = async (val) => {
    const { isSuccessRef } = useCopyToClipboard(
      val,
    );
    let data = await getShareInfo(val.id)
    unref(isSuccessRef) &&
      createConfirm({
        title: '复制链接',
        iconType: 'info',
        okText: '复制',
        cancelText: '关闭',
        // content: JSON.stringify(unref(val), null, 2) +'有权限的人可以访问',
        content: () => h('div', [`https://work.weehealth.cn/#/share?hash=${data.hash}&parent_id=${val.id}`, h('div', { style: { color: '#CBCCCC' } }, '有权限的人可以访问')]),
        onOk: async (value) => {

          // router.push({ path: '/share', query: { hash: data.hash,parent_id:val.id } })
          copyText(`https://work.weehealth.cn/#/share?hash=${data.hash}&parent_id=${val.id}`)

        }
      });
  }
  const getShareInfo = async (id) => {
    const p = {
      id,
    }
    let data = await window.http.get({
      url: '/Netdisk/File/share_param',

      params: p
    });
    return data;
  }
  const move = (record) => {
    console.log('record: ', record || selectRowFiles.value)

    openFolderModal(true, {
      isUpdate: false,
      title: '移动到',
      okText: '移动到这里',
      ids: record.id || selectRowFiles.value.map(v => v.id).join(','),
      saveUrl: '/Netdisk/File/move',
    })
  }
  const add = (record) => {
    console.log('record: ', record || selectRowFiles.value)

    openFolderModal(true, {
      isUpdate: false,
      title: '添加到',
      okText: '添加到这里',
      ids: record.id || selectRowFiles.value.map(v => v.id).join(','),
      saveUrl: '/Netdisk/File/copy',
    })
  }
  // 下载
  function handleDownload(item = '') {
    // const { response:{url} } = item;
    // const url = item || item.
    if (!item && selectRowFiles.value.length) {
      // selectRowFiles.value.forEach(v=>{
      //   downloadByUrl({ url: v.file.url,target:'_blank',fileName:v.title, })
      // })
      let arr = selectRowFiles.value.map(v => ({ url: v.file.url, target: '_blank', fileName: v.title, }))
      console.log('arr: ', arr)
      downloadSequentially(arr)
    } else {
      downloadByUrl({ url: item.file.url, target: '_blank', fileName: item.title, })
    }

  }
  function downloadSequentially(arr, currentIndex = 0) {
    if (currentIndex >= arr.length) {
      // 所有链接已经下载完成
      return Promise.resolve();
    }

    const obj = arr[currentIndex];

    return new Promise((resolve, reject) => {
      // 下载当前链接
      const success = downloadByUrl({
        url: obj.url,
        fileName: obj.fileName,
        target: '_self', // 在当前窗口下载
      });

      if (success) {
        // 下载成功后，等待一段时间再继续下载下一个链接
        setTimeout(() => {
          // 递归下载下一个链接
          downloadSequentially(arr, currentIndex + 1)
            .then(resolve)
            .catch(reject);
        }, 500); // 等待 1 秒钟再继续下载下一个链接，可以根据需要调整等待时间
      } else {
        reject(new Error(`Failed to download ${obj.url}`));
      }
    });
  }

  // let formState = initFormState();
  const breadcrumbClick = (e) => {
    console.log('breadcrumbClick: ', e)
    let index = filesPath.value.findIndex(v => v.value === e.value)
    console.log('index: ', index)
    filesPath.value = filesPath.value.slice(0, index + 1)
    parent_id.value = e.value
    reload()
  }
  const filesPath = ref([
    {

      breadcrumbName: '我的文件',
      value: 0,
    },
    // {

    //   breadcrumbName: '第一级文件',
    //   value:2,
    // },
    // {

    //   breadcrumbName: '第二级文件',
    //   value:3,
    // },
  ])
  const { headerSchema, columns } = userSchemaFn();





  const tableData = ref([])
  const total = ref(0)
  const searchFn = useDebounceFn(() => {
    reload()
  }, 500)
  watch(searchTitle, (val) => {
    console.log('searchTitle: ', val)
    searchFn()
  })
  const getTableData = async (p) => {

    let result = { parent_id: parent_id.value, title: p.title }
    if (p.title) { //搜索的时候不用传这个
      delete result.parent_id
    }

    let data = await window.http.get({
      url: '/Netdisk/File/list',

      params: { ...result, ...p }
    });
    data.records.forEach(v => {

      v.show = false
      v.checked = false
    })
    tableData.value = data.records
    total.value = data.total
    if (p.title) { // 搜索的时候返回到第一级目录  parent_id重置为0
      filesPath.value = [{

        breadcrumbName: '我的文件',
        value: 0,
      },]
      parent_id.value = 0
    }
    console.log('data.records ', data.records)

    return data;
  };

  const [registerModal, { openModal }] = useModal();
  const [registerFolderModal, { openModal: openFolderModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '我的文件',
    rowKey: 'id',
    api: getTableData,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas: headerSchema,
    },
    // clickToRowSelect:true,
    // rowSelection: true,
    useSearchForm: true,
    showIndexColumn: false,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
    },

  });

  onMounted(() => {
    document.addEventListener('keydown', backspace, true)
  })
  const backspace = (e) => {
    console.log('e.target: ', e.target.matches('body'))
    if (e.keyCode === 8 && e.target.matches('body')) {

      // 回退键被按下
      console.log('Backspace键被按下');
      // 在这里可以执行你想要的操作
      if (filesPath.value.length > 1) {
        filesPath.value.pop()
        const { value } = filesPath.value[filesPath.value.length - 1]
        parent_id.value = value
        reload()
      }
    }
  }
  const selectRowFiles = computed(() => {
    return tableData.value.filter(v => v.checked)
  })
  const rowMouseenter = (e) => {

    tableData.value.forEach(v => {

      v.show = v.checked ? v.checked : v.id === e.id
    })
  }
  const rowDbClick = (e) => {
    if (e.file_id !== 0) return
    parent_id.value = e.id
    filesPath.value.push({


      breadcrumbName: e.title,
      value: e.id,

    })
    console.log('e: ', e)
    reload();
  }
  const rowMouseleave = (e) => {
    tableData.value.forEach(v => {

      v.show = v.checked
    })
  }
  const rowClick = (e) => {
    console.log('e: ', e.checked)
    e.checked = !e.checked
  }
  const parent_id = ref(0)
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      parent_id: parent_id.value,
      saveUrl: '/Netdisk/File/dir_save',
    });
  }


  function handleEdit(record) {
    openModal(true, {
      record,
      isUpdate: true,
      parent_id: parent_id.value,
      saveUrl: record.file_id ? '/Netdisk/File/save' : '/Netdisk/File/dir_save',
    });
  }

  async function handleDelete(record) {
    console.log(record);
    const { id } = record

    await window.http.post({
      url: '/Netdisk/File/del',
      data: { ids: id },
    });
    message.success('删除成功')
    reload();
  }
  const confirm = e => {
    console.log(e);
    handleDeleteAll()
  };
  async function handleDeleteAll() {


    await window.http.post({
      url: '/Netdisk/File/del',
      data: { ids: selectRowFiles.value.map(v => v.id).join(',') },
    });
    message.success('删除成功')
    reload();

  }


  function handleSuccess({ isUpdate, values }) {
    reload();
  }
</script>
