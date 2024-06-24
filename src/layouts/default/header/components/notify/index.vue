<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in listData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.total">({{ item.total }})</span>
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <template v-if="item.list.length">
                <NoticeList :pageSize="pageNum" :total="total" v-model:currentPage="pages" :list="item.list"
                  @title-click="onNoticeClick" />
              </template>
              <template v-else>
                <a-empty :image="simpleImage" />
              </template>
              <!-- <NoticeList :pageSize="pageNum" :total="total" v-model:currentPage="pages" :list="item.list"
                v-if="item.key === '1'" @title-click="onNoticeClick" /> -->
              <!-- <NoticeList :list="item.list" v-else /> -->
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { tabListData, ListItem } from './data';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Empty } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  export default defineComponent({
    components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeList },
    setup() {
      const { prefixCls } = useDesign('header-notify');
      const { createMessage } = useMessage();
      const listData = ref(tabListData);
      const pages = ref(1)
      const pageNum = ref(5)
      const total = ref(0)
      const unread_num = ref(0)
      const setIntervaller = ref()
      const { PROD } = import.meta.env
      const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
      onMounted(() => {
        if (setIntervaller.value) clearInterval(setIntervaller.value)
        getNotify()
        if (PROD) {
          setIntervaller.value = setInterval(() => {
            pages.value = 1
            getNotify()
          }, 10000)
        }


      })
      const getNotify = () => {
        if (!userStore.getToken) clearInterval(setIntervaller.value)
        window.http.get({
          url: '/basic_center/notice/list',
          params: {
            pages: pages.value,
            pageNum: pageNum.value
          }
        }).then(res => {
          listData.value[0] = {

            key: '1',
            name: '通知',
            total: res.total,
            list: res.records.map(v => {
              return {
                id: v.id,
                avatar: v.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
                title: v.type === 1 ? '审批提醒' : v.type === 2 ? '物流提醒' : v.type === 4 ? '订单提醒' : '其他',
                titleDelete: !!v.is_read,
                datetime: v.at_time,
                type: v.type,
                is_read: v.is_read,
                param: v?.content?.param,
                description: v?.content?.text,
                // extra: v.at_time,
              }
            })
          }

          total.value = res.total
          //获取未读数量
          getUnread_num()
        })
      }

      watch(pages, (newVal) => {

        getNotify()
      })
      const count = computed(() => {
        return unread_num.value

      });
      const getUnread_num = async () => {
        const data = await window.http.get({
          url: '/basic_center/notice/unread_num',

        })
        unread_num.value = data.count
        console.log('unread_num.value: ', unread_num.value)
        console.log(setIntervaller.value)
        // console.log('process', import.meta.env)

      }
      function onNoticeClick(record : ListItem) {
        // createMessage.success('你点击了通知，ID=' + record.id);
        // // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
        // record.titleDelete = !record.titleDelete;
      }

      return {
        setIntervaller,
        unread_num,
        total,
        pages,
        pageNum,
        prefixCls,
        listData,
        count,
        onNoticeClick,
        numberStyle: {},
        simpleImage
      };
    },

  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-bottom: 1px;

    &__overlay {
      max-width: 360px;
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      display: flex;
      align-items: center;
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
