import { useConfigStore } from '@/store/modules/config';
const { operationTypeOption } = useConfigStore();
import { isNumber } from '/@/utils/is';
export const userSchemaFn = () => {
  const getOperationType = (operationType: number) => {
    return operationTypeOption.find((v) => v.value === operationType)?.label
  }
  const customCellFN = (record, index, type) => {
    const { rowSpan, rowSpan2 } = record;
    // console.log('[  rowSpan, rowSpan2 ]-10',  rowSpan, rowSpan2)
    // type === 1 就是产品内容的合并
    if (isNumber(rowSpan) && type === 1) {
      // console.log('[ rowSpan ]-10', index, rowSpan, rowSpan2)
      return { rowSpan };
    }
    // type === 2 就是移出库位内容的合并
    if (isNumber(rowSpan2) && type === 2) {
      // console.log('[ rowSpan2 ]-20', index, rowSpan, rowSpan2)
      return { rowSpan: rowSpan2 };
    }
  }
  const headerSchema = [

    {
      field: 'date',
      label: '记录时间',
      component: 'RangePicker',
      componentProps: {
        style: {
          width: '100%'
        },
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      colProps: { span: 6 },
    },
    {
      field: 'id',
      label: '记录ID',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'operationType',
      label: '操作类型',
      component: 'Select',
      componentProps: {
        options: operationTypeOption,
      },
      colProps: { span: 6 },
    },

  ];
  const columns = [
    {
      title: '记录时间',
      dataIndex: 'createdTime',
    },
    {
      title: '记录ID',
      dataIndex: 'id',
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      customRender: ({ record }) => {
        return getOperationType(record.operationType)
      },
    },

    // {
    //   title: '库位',
    //   dataIndex: 'locationName',
    // },
    {
      title: '操作数量',
      dataIndex: 'title',
    },
    {
      title: '操作人',
      dataIndex: 'createdUsername',
    },
  ]

  const formSchema = [
    {
      field: 'name',
      label: '供应商名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'no',
      label: '税务编码',
      component: 'Input',
      // required: true,
    },
    {
      field: 'contacts',
      label: '联系人',
      component: 'Input',
    },
    {
      field: 'contactInformation',
      label: '联系电话',
      component: 'Input',
    },
    {
      field: 'remark',
      label: '备注',
      component: 'InputTextArea',
    },


  ];
  const inboundColumns = [
    {
      title: '产品',
      dataIndex: 'productName',
      width: '120px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '包装规格',
      dataIndex: 'packageSpecsStr',
      width: '80px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '装盒规格',
      dataIndex: 'boxingSpecsStr',
      width: '80px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '装箱规格',
      dataIndex: 'packingSpecsStr',
      width: '80px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    // {
    //   title: '入库总数',
    //   dataIndex: 'num',
    //   width: '75px',
    //   defaultHidden: true,
    // },
    {
      title: '厂家参数',
      children: [
        {
          title: '厂家批号',
          dataIndex: 'manuBatchNumber',
          width: '120px'
        },
        {
          title: '生产日期',
          dataIndex: 'produceDate',
          width: '110px'

        },
        {
          title: '保质期',
          dataIndex: 'shelfLife',
          width: '80px'

        },
        {
          title: '失效日期',
          dataIndex: 'expirationDate',
          width: '110px'

        },

      ]

    },

    {
      title: '公司参数',
      children: [
        {
          title: '公司批号',
          dataIndex: 'batchNumber',
          width: '120px'

        },
        {
          title: '库位',
          dataIndex: 'locationName',
          width: '120px'
        },
        {
          title: '托架号',
          dataIndex: 'bracketNo',
          width: '120px'
        },
        {
          title: '入库数量',
          dataIndex: 'amount',
          width: '100px'

        },
        // {
        //   title: '数量',
        //   dataIndex: 'oldAmount',
        // },
      ]

    },


    {
      title: '状态',
      dataIndex: 'inventoryStatusStr',
      width: '80px',
    },
    {
      title: '图片',
      dataIndex: 'Aupload',
      width: '140px',

    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '100px',
    },
  ]

  const outboundColumns = [
    {
      title: '产品',
      dataIndex: 'productName',
      width: '120px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '包装规格',
      dataIndex: 'packageSpecsStr',
      width: '80px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '装盒规格',
      dataIndex: 'boxingSpecsStr',
      width: '80px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '装箱规格',
      dataIndex: 'packingSpecsStr',
      width: '80px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    // {
    //   title: '出库总数',
    //   dataIndex: 'num',
    //   width: '75px',
    //   defaultHidden: true,
    // },
    {
      title: '托架号',
      dataIndex: 'bracketNo',
      width: '130px'
    },
    {
      title: '公司批号',
      dataIndex: 'batchNumber',
      width: '130px'
    },
    {
      title: '生产日期',
      dataIndex: 'produceDate',
      width: '110px'

    },
    {
      title: '保质期',
      dataIndex: 'shelfLife',
      width: '80px'

    },
    {
      title: '失效日期',
      dataIndex: 'expirationDate',
      width: '110px'

    },

    // {
    //   title: '进货价',
    //   dataIndex: 'price',
    //   width: '110px'
    // },


    {
      title: '出库前库存',
      dataIndex: 'beforeAmount',
      width: '75px'
    },
    {
      title: '出库数量',
      dataIndex: 'amount',
      width: '75px'
    },
    {
      title: '出库后库存',
      dataIndex: 'remainAmount',
      width: '75px'
    },

    {
      title: '出库类型',
      dataIndex: 'inoutType',
      width: '75px'
    },

    {
      title: '图片',
      dataIndex: 'Aupload',
      width: '140px',

    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '100px',
    },
  ]

  const transferStockColumns = [
    {
      title: '产品',
      dataIndex: 'productName',
      width: '120px',
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '包装规格',
      dataIndex: 'packageSpecsStr',
      width: '80px',
      customCell: (record, index) => {
        return customCellFN(record, index, 1)

      }
    },
    {
      title: '装盒规格',
      dataIndex: 'boxingSpecsStr',
      width: '80px',
      customCell: (record, index) => {
        return customCellFN(record, index, 1)

      }
    },
    {
      title: '装箱规格',
      dataIndex: 'packingSpecsStr',
      width: '80px',
      customCell: (record, index) => {
        return customCellFN(record, index, 1)

      }
    },
    {
      title: '需移总数',
      dataIndex: 'num',
      width: '75px',
      defaultHidden: true,
      customCell: (record, index, column) => {
        return customCellFN(record, index, 1);
      },
    },
    {
      title: '移出库位',
      children: [
        {
          title: '库位',
          dataIndex: 'locationIdOutObj',
          width: '120px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },
        },
        {
          title: '托架号',
          dataIndex: 'bracketIdOutObj',
          width: '110px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },

        },
        {
          title: '批次号',
          dataIndex: 'batchNumberObj',
          width: '110px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },


        },
        {
          title: '移库前库存',
          dataIndex: 'sourceBeforeStock',
          width: '75px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },
        },
        {
          title: '移库总数',
          dataIndex: 'outAllAmount',
          width: '75px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },
        },
        {
          title: '移库后库存',
          dataIndex: 'sourceAfterStock',
          width: '75px',
          customCell: (record, index, column) => {
            return customCellFN(record, index, 2);
          },
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
          dataIndex: 'amount',
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
      dataIndex: 'inventoryStatusStr',
      width: '80px',
    },
    {
      title: '图片',
      dataIndex: 'Aupload',
      width: '140px',

    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '80px',
    },
    // {
    //   width: 100,
    //   title: '操作',
    //   dataIndex: 'action',
    //   customCell: (record, index) => {
    //     return customCellFN(record, index)

    //   }
    // },
  ]
  return {
    headerSchema,
    formSchema,
    columns,
    inboundColumns,
    outboundColumns,
    transferStockColumns,
    getOperationType,
  };
};
