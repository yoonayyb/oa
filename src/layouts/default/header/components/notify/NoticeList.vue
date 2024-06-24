<template>
  <a-list :class="prefixCls" bordered :pagination="getPagination">
    <template v-for="item in getData" :key="item.id">
      <a-list-item @click="notifyClick(item)" class="list-item">
        <a-list-item-meta class="!items-center">
          <template #title>
            <div class="title flex">
              <a-typography-paragraph @click="handleTitleClick(item)" style="width: 100%; margin-bottom: 0 !important"
                :style="{ cursor: isTitleClickable ? 'pointer' : '' }" :delete="!!item.titleDelete" :ellipsis="
                  $props.titleRows && $props.titleRows > 0
                    ? { rows: $props.titleRows, tooltip: !!item.title }
                    : false
                " :content="item.title" />
              <div class="datetime truncate" :title="item.datetime">
                {{ formatTopicTime(item.datetime)  }}
              </div>
              <div class="extra" v-if="item.extra">
                <a-tag class="tag" :color="item.color">
                  {{ item.extra }}
                </a-tag>
              </div>
            </div>
          </template>

          <template #avatar>
            <a-badge :dot="!item.is_read">
              <a-avatar v-if="item.avatar" class="avatar" :src="item.avatar" />
              <span v-else> {{ item.avatar }}</span>
            </a-badge>

          </template>

          <template #description>
            <div>
              <div class="description" v-if="item.description">
                <a-typography-paragraph style="width: 100%; margin-bottom: 0 !important" :ellipsis="
                    $props.descRows && $props.descRows > 0
                      ? { rows: $props.descRows, tooltip: !!item.description }
                      : false
                  " :content="item.description" />
              </div>
              <!-- <div class="datetime truncate" :title="item.datetime">
                {{ item.datetime }}
              </div> -->
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
    <Drawer @register="register" />
  </a-list>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType, ref, watch, unref } from 'vue';
  import { ListItem } from './data';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { List, Avatar, Tag, Typography } from 'ant-design-vue';
  import { isNumber } from '/@/utils/is';
  import { useDrawer } from '/@/components/Drawer';
  import { formatTopicTime } from '/@/utils/common.js';

  import Drawer from '@/views/project/projectList/examine/approveDetail.vue';
  export default defineComponent({
    components: {
      [Avatar.name]: Avatar,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
      ATypographyParagraph: Typography.Paragraph,
      [Tag.name]: Tag,
      Drawer
    },
    props: {
      list: {
        type: Array as PropType<ListItem[]>,
        default: () => [],
      },
      pageSize: {
        type: [Boolean, Number] as PropType<Boolean | Number>,
        default: 5,
      },
      total: {
        type: [Boolean, Number] as PropType<Boolean | Number>,
        default: 0,
      },
      currentPage: {
        type: Number,
        default: 1,
      },
      titleRows: {
        type: Number,
        default: 1,
      },
      descRows: {
        type: Number,
        default: 2,
      },
      onTitleClick: {
        type: Function as PropType<(Recordable) => void>,
      },
    },
    emits: ['update:currentPage'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('header-notify-list');
      const current = ref(props.currentPage || 1);
      const [register, { openDrawer }] = useDrawer();
      const getData = computed(() => {
        const { pageSize, list } = props;
        if (pageSize === false) return [];
        let size = isNumber(pageSize) ? pageSize : 5;
        return list
      });
      watch(
        () => props.currentPage,
        (v) => {
          current.value = v;
        },
      );
      const isTitleClickable = computed(() => !!props.onTitleClick);
      const getPagination = computed(() => {
        const { list, pageSize, total } = props;
        if (pageSize > 0 && list && list.length < total) {
          return {
            total,
            pageSize,
            //size: 'small',
            current: unref(current),
            onChange(page) {
              current.value = page;
              emit('update:currentPage', page);
            },
          };
        } else {
          return false;
        }
      });
      const notifyClick = (item) => {
        console.log('notifyClick', item)
        //设置已读
        notifyRead(item)
        if (item.type === 1 && item?.param?.id) {
          openDrawer(true, { company_id: localStorage.getItem('companyId'), form_id: item.param.id })
        }
      }
      const notifyRead = (item) => {

        window.http.post({
          url: '/basic_center/notice/read',
          data: { id: item.id }
        }).then(res => {
          item.is_read = 1
        })
      }
      function handleTitleClick(item : ListItem) {
        props.onTitleClick && props.onTitleClick(item);
      }

      return { formatTopicTime, register, notifyClick, prefixCls, getPagination, getData, handleTitleClick, isTitleClickable };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-notify-list';

  .@{prefix-cls} {
    &::-webkit-scrollbar {
      display: none;
    }

    :deep(.ant-pagination-disabled) {
      display: inline-block !important;
    }

    :deep(.ant-list-item) {
      padding: 8px;
      min-width: 14rem;
    }

    &-item {
      padding: 6px;
      overflow: hidden;
      transition: all 0.3s;
      cursor: pointer;


      .title {
        margin-bottom: 8px;
        font-weight: normal;


        .extra {
          margin-top: -1.5px;
          margin-right: 0;
          float: right;
          font-weight: normal;

          .tag {
            margin-right: 0;
          }
        }

        .avatar {
          margin-top: 4px;
        }

        .description {
          font-size: 12px;
          line-height: 18px;
        }

        .datetime {
          margin-top: 4px;
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
  }
</style>
