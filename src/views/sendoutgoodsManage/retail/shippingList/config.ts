
import { useConfigStoreWithOut } from '/@/store/modules/config';
const configStore = useConfigStoreWithOut();
import { isNumber } from '/@/utils/is';

const customCellFN = (record, index) => {
  const { rowSpan } = record
  if (isNumber(rowSpan)) {
    return { rowSpan };
  }

}
const customCellOutFN = (record, index) => {
  const { rowSpan } = record
  if (isNumber(rowSpan) && record.isWithdraw) {
    return { rowSpan };
  }
}
export const userSchemaFn = (getOption) => {

  const schemas = [
    {
      field: 'isDetails',
      label: ' ',
      colProps: { span: 6 },
      slot: 'form-RadioGroup',
    },
    // {
    //   field: 'warehouseId',
    //   label: '所属仓库',
    //   component: 'Select',
    //   componentProps: {
    //     defaultValue: configStore.getCurrentWarehouseId,
    //     fieldNames: { label: 'name', value: 'id' },
    //     optionFilterProp: 'name',
    //     showSearch: true,
    //     options: configStore.getWarehouseOptions || []
    //   },
    //   colProps: { span: 6 },
    //   required: true,

    // },

  ];
  const summaryColumns = [
    {
      title: '实发产品',
      dataIndex: 'title',

    },
    {
      title: '实发数量',
      dataIndex: 'num',
    },

  ]
  const detailsColumns = [
    {
      title: '报单id',
      dataIndex: 'order_id',
      width: '120px',
      customCell: (record, index) => {
        return customCellFN(record, index)

      }
    },
    {
      title: '物流单号',
      dataIndex: 'express_no',
      width: '120px',
      customCell: (record, index) => {
        return customCellFN(record, index)

      }
    },
    {
      title: '产品',
      dataIndex: 'productName',
      width: '120px',
      customCell: (record, index) => {
        return customCellFN(record, index)

      }
    },
    {
      title: '包装规格',
      dataIndex: 'packageSpecsStr',
      width: '80px',
      customCell: (record, index) => {
        return customCellFN(record, index)

      }
    },
    {
      title: '装盒规格',
      dataIndex: 'boxingSpecsStr',
      width: '80px',
      customCell: (record, index) => {
        return customCellFN(record, index)

      }
    },
    {
      title: '装箱规格',
      dataIndex: 'packingSpecsStr',
      width: '80px',
      customCell: (record, index) => {
        return customCellFN(record, index)

      }
    },
    {
      title: '发货总数',
      dataIndex: 'num',
      width: '80px',
      customCell: (record, index) => {
        return customCellFN(record, index)
      }
    },
    {
      title: '移出库位',
      children: [
        {
          title: '库位',
          dataIndex: 'locationIdOutObj',
          width: '120px',
          customCell: (record, index) => {
            return customCellOutFN(record, index)
          }
        },
        {
          title: '托架号',
          dataIndex: 'bracketIdOutObj',
          width: '110px'
          ,
          customCell: (record, index) => {
            return customCellOutFN(record, index)
          }
        },
        {
          title: '批次号',
          dataIndex: 'batchNumberObj',
          width: '110px'
          ,
          customCell: (record, index) => {
            return customCellOutFN(record, index)
          }

        },
        {
          title: '移库前库存',
          dataIndex: 'sourceBeforeStock',
          width: '75px',
          customCell: (record, index) => {
            return customCellOutFN(record, index)
          }
        },
        {
          title: '移库数量',
          dataIndex: 'amount',
          width: '75px'
        },
        {
          title: '移库后库存',
          dataIndex: 'sourceAfterStock',
          width: '75px',
          customCell: (record, index) => {
            return customCellOutFN(record, index)
          }
        },

      ]

    },

    {
      title: '移入库位',
      children: [

        {
          title: '库位',
          dataIndex: 'locationIdInObj',
          width: '120px'
        },
        {
          title: '托架号',
          dataIndex: 'bracketIdInObj',
          width: '120px'
        },
        {
          title: '移库前库存',
          dataIndex: 'destinationBeforeStock',
          width: '75px'
        },
        {
          title: '移库数量',
          dataIndex: 'amountIn',
          width: '75px'
        },
        {
          title: '移库后库存',
          dataIndex: 'destinationAfterStock',
          width: '75px'
        },

      ]

    },
    {
      title: '状态',
      dataIndex: 'inventoryStatus',
      width: '80px',
    },
    {
      title: '图片',
      dataIndex: 'Aupload',
      width: '80px',

    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '80px',
    },
    {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      // customCell: (record, index) => {
      //   return customCellFN(record, index)

      // }
    },
  ]

  return {
    schemas,
    detailsColumns,
    summaryColumns,
  };
};
