<template>
  <div class="page ">

    <BasicTable @register="registerTable" @field-value-change="fieldValueChange">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增 </a-button>
        <a-button type="primary" @click="handleCreateFast"> 快速报单 </a-button>
        <a-button type="primary" @click="is_me = !is_me;getForm().submit()"> {{is_me?'看所有':'只看自己'}} </a-button>
        <!-- <a-button type="primary" @click="handleCreate"> 导出 </a-button> -->

      </template>
      <template #bodyCell="{ column, text, record,index }">
        <template v-if="column.dataIndex === 'delivery_method'">
          <div class="!m-0 !p-0">

            <span>
              <span style="color:#000">{{delivery_method[record.delivery_method]}}</span>

              <!-- 公司发货 -->
              <div v-if="record.delivery_method === 0">
                <!-- 已发货才有单号 默认拿第一个展示 -->
                <span v-if="record.ship_status === 1">
                  <div v-for="item of record.order_logistics" class="flex justify-center flex-col align-center">
                    <a-button @click.stop="openSendModal(record,4,item.id)"
                      style="height:auto;display:block;text-align: start;" class="!m-0 !p-0" type="link">
                      <div>物流：{{item?.logistics.express_name}}</div>
                      <div>单号：{{item?.logistics.express_no}}</div>
                      <div>状态：{{item?.logistics.status_text}} <span v-if="item.status === 2"
                          style="color:red">(已撤回)</span> </div>


                    </a-button>
                  </div>
                  <!-- {{record.order_logistics[0]?.logistics?.express_no}} -->

                </span>
                <span style="color:#1677ff" @click="openSendModal(record,2)" v-else>
                  {{ship_status[record.ship_status]}}</span>
              </div>
            </span>

          </div>
        </template>
        <template v-if="column.dataIndex === 'teamInfo'">
          <a-tooltip @openChange="openChange(record)">
            <template #title>{{record.teamInfo?.fullTitle}}</template>
            {{record.teamInfo?.title}}
          </a-tooltip>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
              {
                icon: '',
                label:'认领',
                onClick: handleEdit.bind(null, record,1),
              },
              {
                icon: '',
                label:'编辑',
                onClick: handleEdit.bind(null, record,2),
                
              },
            ]" />
        </template>
      </template>
    </BasicTable>

    <a-modal v-model:open="open" okText="提交" :title="modelTitle" :width="modelWidth" :afterClose="handleOk">
      <a-form ref="orderForm" @finish="onFinish" @finishFailed="onFinishFailed" :model="orderFrom"
        :label-col="{ style: { width: '90px' } }">

        <template v-if="opentype ===1">
          <div v-for="item in order_logistics">
            <div>物流公司:{{item?.logistics.express_name}}</div>
            <div>
              快递单号:{{item?.logistics.express_no}}
              <Icon v-if="item?.logistics.express_no" @click="onCopy(item?.logistics.express_no)"
                style="color:#0079ff;margin-right: 5px;font-size:20px" icon="ph:copy-bold" />
            </div>
          </div>
          <!-- <a-form-item label="物流公司">
            <a-select style="width:200px" placeholder="请输入" show-search v-model:value="orderFrom.from_type"
              :options="orderOptions">
            </a-select>
            {{order_logistics.}}
          </a-form-item>
          <a-form-item label="快递单号">
            <a-input style="width:200px" ref="inputRef" placeholder="请输入" v-model:value="orderFrom.express_no" />
            <Icon v-if="orderFrom.express_no" @click="onCopy(orderFrom.express_no)"
              style="color:#0079ff;margin-right: 5px;font-size:20px" icon="ph:copy-bold" />
          </a-form-item> -->
        </template>




        <div v-else style="display: flex;justify-content: space-around;flex-wrap: wrap;">
          <a-card :bordered="false" style="width: 450px;margin-bottom: 20px;">
            <template #title> 报单信息 </template>
            <a-form-item label="订单来源" name="from_type" :rules="[{ required: true, message: '请选择订单来源' }]">
              <a-select :disabled="!!orderFrom.id" placeholder="请输入" show-search v-model:value="orderFrom.from_type"
                :options="orderOptions">
              </a-select>
            </a-form-item>
            <a-form-item label="金额" name="price">
              <a-input-number placeholder="请输入" :controls="false" id="inputNumber" :precision="2"
                v-model:value="orderFrom.price" :min="0" :max="1000000" />
            </a-form-item>
            <a-form-item label="收款账户" name="collection_account">
              <a-input placeholder="请输入" v-model:value="orderFrom.collection_account" />
            </a-form-item>
          </a-card>
          <a-card v-if="orderFrom.from_type == 0 || orderFrom.from_type == 1" :bordered="false"
            style="width: 450px;margin-bottom: 20px;">
            <template #title> 推荐人信息 </template>
            <a-form-item label="推荐人" name="referrer">
              <a-select @change="referrerChange" allowClear placeholder="请输入" show-search
                v-model:value="orderFrom.referrer" :fieldNames="{label:'realname',value:'id'}"
                :filterOption="filterOption" @popupScroll="referrerState.scroll" :filter-option="false"
                :not-found-content="referrerState.fetching ? undefined : null" @search="referrerState.fetchUser"
                :options="referrerState.options">
              </a-select>
            </a-form-item>
            <a-form-item label="医院" name="hospital_id">
              <a-select allowClear :disabled="formDisabled" placeholder="请输入" show-search
                v-model:value="orderFrom.hospital_id" @change="hospitalState.change"
                :fieldNames="{label:'title',value:'id'}" optionFilterProp="title" @popupScroll="hospitalState.scroll"
                :filter-option="false" :not-found-content="hospitalState.fetching ? undefined : null"
                @search="hospitalState.fetchUser" :options="hospitalState.options">
              </a-select>

            </a-form-item>
            <a-form-item label="科室来源" name="department">
              <a-input placeholder="请输入" v-model:value="orderFrom.department" />
            </a-form-item>
            <a-form-item label="转介绍人" name="sponsor">
              <a-select allowClear placeholder="请输入" @change="sponsorState.change" show-search
                v-model:value="orderFrom.sponsor" :fieldNames="{label:'nickname',value:'id'}"
                :filterOption="filterOption" @popupScroll="sponsorState.scroll" :filter-option="false"
                :not-found-content="sponsorState.fetching ? undefined : null" @search="sponsorState.fetchUser"
                :options="sponsorState.options">
              </a-select>
            </a-form-item>

          </a-card>
          <a-card :bordered="false" style="width: 450px;margin-bottom: 20px;">
            <template #title> 团队归属 </template>
            <a-form-item label="所属团队" name="team_id" :rules="[{ required: true, message: '请选择所属团队' }]">
              <a-cascader :disabled="formDisabled" changeOnSelect :fieldNames="{label:'title',value:'id'}"
                placeholder="请输入" show-search v-model:value="orderFrom.team_id" :options="teamOptions">
              </a-cascader>
            </a-form-item>
            <a-form-item label="引流人" name="drainage">
              <a-select allowClear placeholder="请输入" @change="drainageState.change" show-search
                v-model:value="orderFrom.drainage" :fieldNames="{label:'name',value:'id'}"
                @popupScroll="drainageState.scroll" :filterOption="filterOption" :filter-option="false"
                :not-found-content="drainageState.fetching ? undefined : null" @search="drainageState.fetchUser"
                :options="drainageState.options">
              </a-select>
            </a-form-item>
            <a-form-item label="达成人" name="reach">
              <a-select allowClear placeholder="请输入" @change="reachState.change" show-search
                v-model:value="orderFrom.reach" :fieldNames="{label:'name',value:'id'}" @popupScroll="reachState.scroll"
                :filterOption="filterOption" @search="reachState.fetchUser" :filter-option="false"
                :not-found-content="reachState.fetching  ? undefined : null" :options="reachState.options">
              </a-select>
            </a-form-item>
            <a-form-item label="干预人" name="intervener">
              <a-select allowClear placeholder="请输入" @change="intervenerState.change" show-search
                v-model:value="orderFrom.intervener" :fieldNames="{label:'name',value:'id'}"
                @popupScroll="intervenerState.scroll" :filterOption="filterOption" @search="intervenerState.fetchUser"
                :filter-option="false" :not-found-content="intervenerState.fetching  ? undefined : null"
                :options="intervenerState.options">
              </a-select>
            </a-form-item>
          </a-card>
          <a-card :bordered="false" style="width: 450px;margin-bottom: 20px;">
            <template #title> 发货信息 </template>
            <a-form-item label="发货方式" name="delivery_method">
              <a-select allowClear placeholder="请输入" show-search v-model:value="orderFrom.delivery_method" :options="[
                {label:'公司发货',value:0},
                {label:'区域发货',value:1},
                {label:'医院发货',value:2},
                {label:'代理发货',value:3},
              ]">
              </a-select>
            </a-form-item>
            <div class="flex align-center items-center mb-2">
              <h4 class="!m-0"> <strong>收货信息</strong> </h4>
              <a-popconfirm title="一键写入?" ok-text="确定" cancel-text="取消" @confirm="confirm()">
                <Icon class="ml-2 cursor-pointer" style="color:#0079ff" icon="clarity:note-edit-line"></Icon>
              </a-popconfirm>
            </div>
            <a-form-item label="收货人姓名" name="realname">

              <a-input placeholder="请输入" v-model:value="orderFrom.order_report_info.realname" />
            </a-form-item>
            <a-form-item label="收货人手机" name="mobile">

              <a-input placeholder="请输入" v-model:value="orderFrom.order_report_info.mobile" />
            </a-form-item>
            <a-form-item label="收货地址" name="address_adcode">

              <a-cascader :displayRender="handleRenderDisplay" @change="addressChange"
                v-model:value="orderFrom.order_report_info.address_adcode" :options="system_address_id_options"
                placeholder="请选择" :load-data="loadData" :fieldNames="{label:'name',value:'adcode'}" />
            </a-form-item>
            <a-form-item label="详细地址" name="address">

              <a-textarea placeholder="请输入" v-model:value="orderFrom.order_report_info.address" />
            </a-form-item>
          </a-card>
          <a-card v-if="orderFrom.from_type == 0 || orderFrom.from_type == 1" :bordered="false"
            style="width: 450px;margin-bottom: 20px;">
            <template #title> 订单信息 </template>
            <!-- 拿到member_id 去调用接口复显上去 -->
            <a-form-item label="会员类型">
              <a-radio-group disabled v-model:value="userType">
                <a-radio :value="1">系统会员</a-radio>
                <a-radio :value="2">新增会员</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="会员昵称">
              <div>{{orderFrom.vip_info?.nickname}}</div>
              <!-- <a-select disabled placeholder="请输入" show-search v-model:value="orderFrom.username" :options="[]">
              </a-select> -->
            </a-form-item>
            <a-form-item label="手机号">
              <div>{{orderFrom.vip_info?.mobile}}</div>
              <!-- <a-input disabled placeholder="请输入" v-model:value="orderFrom.mobile" /> -->
            </a-form-item>
            <a-form-item label="订单编号">
              <div>{{orderFrom.order_sn}}</div>
              <!-- <a-select disabled placeholder="请输入" show-search v-model:value="orderFrom.order_sn" :options="[]">
              </a-select> -->
            </a-form-item>
            <a-form-item label="达成日期" name="reach_date">
              <a-date-picker v-model:value="orderFrom.reach_date" show-time format='YYYY-MM-DD' valueFormat='YYYY-MM-DD'
                placeholder="请输入" style="width: 100%" />
            </a-form-item>
            <a-form-item label="下单类型" name="is_first_order">
              <a-radio-group v-model:value="orderFrom.is_first_order">
                <a-radio :value="0">复购</a-radio>
                <a-radio :value="1">首购</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-card>
          <a-card :bordered="false" style="width: 450px">
            <a-table :dataSource="dataSource1" :columns="columns1">
              <template #bodyCell="{ column, text, record,index }">
                <template v-if="column.dataIndex === 'product'">
                  <!-- {{text}} -->
                  <a-select @change="productChange" :disabled="filteredOptionsDisabled" style="width:200px"
                    placeholder="请输入" show-search v-model:value="record.product" :options="productOptions">
                  </a-select>
                </template>
                <template v-if="column.dataIndex === 'number'">
                  <!-- {{text}} -->
                  <a-input-number placeholder="请输入" :controls="false" :precision="0" v-model:value="record.number"
                    :min="1" :max="1000000" />
                </template>
                <template v-if="column.dataIndex === 'dell'">
                  <Icon @click="addOrderRow(record)" style="color:#0079ff;margin-right: 5px;font-size:20px"
                    icon="gala:add" />
                  <Icon @click="delOrderRow(index)" icon="icon-park-outline:reduce-one"
                    style="font-size:20px;color:red" />
                </template>
              </template>
            </a-table>
          </a-card>
        </div>
        <a-form-item v-if="opentype !== 1" class="mt-5" style="text-align: center;" :wrapper-col="{  span: 24 }">
          <a-button type="primary" html-type="submit" :loading="loading">提交</a-button>
        </a-form-item>
      </a-form>
      <template #footer>
        <!-- <div style="text-align: center;">
          <a-button html-type="submit" size="mini" key="submit" type="primary" :loading="loading">提交</a-button>
        </div> -->
      </template>
    </a-modal>
    <BasicModal destroyOnClose :afterClose="afterClose" :title="modelTitle" @register="register" width="800px">
      <a-form ref="modalFormRef" :model="zhuanjiaoFrom" :label-col="{ style: { width: '120px' } }">

        <div v-if="opentype ===2" style="display:flex;flex-wrap:wrap;width:100%">
          <a-table :scroll="{ x: 'max-content', y: 800 }" bordered style="width:100%"
            :dataSource="zhuanjiaoFrom.products" :columns="columns2">
            <template #bodyCell="{ column, text, record,index }">
              <template v-if="column.dataIndex === 'products'">

                <div style="margin-bottom:5px" v-for="(item,itemIndex) of record.productItem" :key="itemIndex">
                  <!-- <a-select style="width:200px" placeholder="请输入" show-search v-model:value="item.realproduct"
                    :options="[{value:1,label:'测试1'},{value:2,label:'实发产品测试'}]">
                  </a-select> -->

                  <a-form-item :name="['products',index,'productItem', itemIndex, 'product_id']"
                    :rules="[{ required: true, message: '请选择产品' }]">
                    <div style="display:flex;align-items:center">
                      <a-select :disabled="filteredOptionsDisabled1" style="width:200px" placeholder="请输入" show-search
                        v-model:value="item.product_id" :options="productOptions1">
                      </a-select>
                      <Icon @click="addOrderRow1(record,item)" style="color:#0079ff;margin-left: 5px;font-size:20px"
                        icon="gala:add" />
                      <Icon @click="delOrderRow1(record,itemIndex)" icon="zondicons:minus-outline"
                        style="font-size:20px;color:red" />
                    </div>
                  </a-form-item>

                  <!-- <div style="text-align: start;color:red" v-if="!item.product_id">请选择</div> -->

                </div>

              </template>
              <template v-if="column.dataIndex === 'realnumber'">

                <div style="display:flex;align-items:center;margin-bottom:5px"
                  v-for="(item,itemIndex) of record.productItem" :key="itemIndex">
                  <a-form-item :name="['products',index,'productItem', itemIndex, 'num']"
                    :rules="[{ required: true, message:'请输入',trigger: 'change'}]">
                    <a-input-number :status="numStatus(record,item)" placeholder="请输入" :controls="false" :precision="0"
                      v-model:value="item.num" :min="1" :max="1000000" />
                    <div v-if="errorStatus(record,item)" style="text-align: start;color:red">数量应等于应发数量</div>
                  </a-form-item>
                </div>

              </template>
            </template>
          </a-table>
          <a-form-item label="发货方式" style="width:800px" name="type" :rules="[{ required: true, message: '请选择发货方式' }]">
            <a-radio-group v-model:value="zhuanjiaoFrom.type">
              <a-radio :value="0">物流发货</a-radio>
              <a-radio :value="1">线下发货</a-radio>
            </a-radio-group>
          </a-form-item>
          <template v-if="zhuanjiaoFrom.type === 0">
            <a-form-item style="width:350px" label="物流公司" name="express"
              :rules="[{ required: true, message: '请选择物流公司' }]">
              <a-select placeholder="请输入" @change="expressState.change" show-search labelInValue
                v-model:value="zhuanjiaoFrom.express" :fieldNames="{label:'key'}" @popupScroll="expressState.scroll"
                optionFilterProp="key" :filter-option="false"
                :not-found-content="expressState.fetching ? undefined : null"
                @search="expressState.fetchUser($event,{type:'logistics'})" :options="expressState.options">
              </a-select>
            </a-form-item>
            <a-form-item style="width:350px" label="快递单号" name="express_no"
              :rules="[{ required: true, message: '请输入快递单号' }]">
              <a-input placeholder="请输入" v-model:value="zhuanjiaoFrom.express_no" />
            </a-form-item>
            <a-form-item style="width:350px" label="报单收件信息">

              <div v-if="zhuanjiaoFrom.order_report_info?.province">
                收货地址：{{zhuanjiaoFrom.order_report_info?.province + '/' + zhuanjiaoFrom.order_report_info?.city + zhuanjiaoFrom.order_report_info?.area }}
              </div>
              <div>详细地址：{{zhuanjiaoFrom.order_report_info?.address|| '-'}}</div>
              <div>收件人姓名：{{zhuanjiaoFrom.order_report_info?.realname|| '-'}}</div>
              <div>收件人手机：{{zhuanjiaoFrom.order_report_info?.mobile|| '-'}}</div>
            </a-form-item>
            <a-form-item style="width:350px" label="商城订单收件信息">
              <div v-if="zhuanjiaoFrom.province">
                收货地址：{{zhuanjiaoFrom.province + '/' + zhuanjiaoFrom.city + zhuanjiaoFrom.area }}
              </div>
              <div>详细地址：{{zhuanjiaoFrom.address || '-'}}</div>
              <div>收件人姓名：{{zhuanjiaoFrom.realname|| '-'}}</div>
              <div>收件人手机：{{zhuanjiaoFrom.mobile|| '-'}}</div>
            </a-form-item>
            <a-form-item label="多批发货" name="shipment_type" style="width: 500px"
              :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group :disabled="shipment_type_disabled" v-model:value="zhuanjiaoFrom.shipment_type">
                <a-radio :value="0">完全发货</a-radio>
                <a-radio :value="1">多批发货</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="多地发货" name="region_type" :rules="[{ required: true, message: '请选择' }]">
              <a-radio-group @change="region_type_change(zhuanjiaoFrom.region_type)"
                v-model:value="zhuanjiaoFrom.region_type">
                <a-radio :value="0">独立发货</a-radio>
                <a-radio :value="1">多地发货</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="zhuanjiaoFrom.region_type === 1" name="other_warehouse_ids"
              :rules="[{ required: true, message: '请选择' }]">
              <a-select optionFilterProp="name" v-model:value="zhuanjiaoFrom.other_warehouse_ids" style="width: 200px;"
                mode="multiple" :options="warehouseOptions" :field-names="{ label: 'name', value: 'id' } ">
              </a-select>
            </a-form-item>
          </template>

        </div>
        <div v-if="opentype ===4">
          <a-tabs v-model:activeKey="activeKey" @tabClick="tabClick">
            <a-tab-pane v-for="item in zhuanjiaoFrom.order_logistics" :key="item.id" :tab="item.remark">
              <a-form-item label="物流公司">
                <span v-if="!companyEdit">{{item?.logistics?.express_name || '无'}}</span>
                <a-select ref="inputRef" style="width:200px" v-else placeholder="请输入" show-search labelInValue
                  v-model:value="item.logistics.express_name_obj" :fieldNames="{label:'key'}"
                  @popupScroll="expressState.scroll" optionFilterProp="key" :filter-option="false"
                  :not-found-content="expressState.fetching ? undefined : null"
                  @search="expressState.fetchUser($event,{type:'logistics'})" :options="expressState.options">
                </a-select>
                <Icon v-if="!companyEdit" @click="companyEdit = true"
                  style="color:#0079ff;margin-right: 5px;font-size:20px" icon="fe:edit" />
                <a-button v-if="companyEdit" @click="wuliuSave(item,zhuanjiaoFrom)" type="primary">保存</a-button>
                <a-button v-if="companyEdit" @click="companyEdit = false" type="error">取消</a-button>
              </a-form-item>
              <a-form-item label="快递单号">
                <span v-if="!companyEdit">{{item?.logistics?.express_no || '无'}}</span>
                <a-input style="width:200px" v-else placeholder="请输入" v-model:value="item.logistics.express_no_obj" />

                <Icon @click="onCopy(item.logistics?.express_no)" style="color:#0079ff;margin-right: 5px;font-size:20px"
                  icon="ph:copy-bold" />
              </a-form-item>
              <div class="text-end mb-6 mr-6">
                <a-popconfirm title="是否确认收货?" ok-text="确定" cancel-text="取消" @confirm="submit(item,1,zhuanjiaoFrom)">
                  <a-button v-if="item.is_confirm === 0 && item.status !== 2" type="primary">确认收货</a-button>
                </a-popconfirm>
                <a-popconfirm title="是否撤回?" ok-text="确定" cancel-text="取消" @confirm="submit(item,2,zhuanjiaoFrom)">
                  <a-button v-if="item.status !== 2" type="error">撤回</a-button>
                </a-popconfirm>
                <!-- <a-button @click="submit(item,1,zhuanjiaoFrom)" v-if="item.is_confirm === 0"
                  type="primary">确认收货</a-button>
                <a-button v-if="item.status !== 2" @click="submit(item,2,zhuanjiaoFrom)" type="error">撤回</a-button> -->
                <a-button disabled v-if="item.status === 2" type="info"
                  style="background-color: darkgray;color:#fff">已撤回</a-button>
              </div>
              <a-form-item>
                <a-table :pagination="false" :scroll="{ x: 'max-content', y: 800 }" bordered style="width:100%"
                  :dataSource="item.product" :columns="columns3"> </a-table>
              </a-form-item>

              <a-form-item label="物流进度">
                <a-timeline>
                  <a-timeline-item v-for="v in item.logistics?.last_result?.data">
                    <div>{{v.time}}</div>
                    <div>
                      {{v.context}}
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </a-form-item>
            </a-tab-pane>
            <a-tab-pane key="add">
              <template #tab>
                <a-button type="primary"> 新增 </a-button>
              </template>

            </a-tab-pane>
          </a-tabs>

        </div>


      </a-form>
      <template #footer>
        <div style="text-align: center;">
          <a-button size="mini" type="primary" @click="onOk"
            :loading="loading">{{ opentype===3 || opentype===4?'确认':"提交" }}</a-button>
        </div>
      </template>
    </BasicModal>
  </div>
</template>
<script lang='ts' setup>
  import Icon from '/@/components/Icon/icon.vue';
  import {
    is_ylyyy,
    getColumns,
    columns1,
    userFormData,
    getVipInfo,
    get_total_vipInfo,
    getReferrerDetail,
    reviewInfo,
    popupScrollSelect,
    getAdressDetail,
  }
  from './index.js'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue';
  import { useModal } from '/@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  const [register, { openModal, closeModal }] = useModal();
  const zhuanjiaoFrom = ref({})
  const reload1 = ref({})
  const columns = getColumns(reload1)
  const opentype = ref()
  const activeKey = ref()
  const getWuliuDetail = async (order_id) => {
    let data = await window.http.get({
      url: '/order_center/order_api/logistics',
      params: {
        order_id
      }
    });
    return data
  }
  const tabClick = async (e) => {
    console.log('e: ', e)

    if (e == 'add') {

      opentype.value = 2
      closeModal();
      openSendModal(recordObj.value, 2, '')
    }
  }
  const wuliuSave = (item, record) => {
    let params = {
      order_logistics_id: item.id,
      express_name: item.logistics.express_name_obj?.label || item.logistics.express_name,
      express_code: item.logistics.express_name_obj?.value || item.logistics.express_code,
      express_no: item.logistics.express_no_obj || item.logistics.express_no,
      warehouse_id: localStorage.getItem('warehouseId')
    }

    window.http.post({
      url: '/order_center/order_api/delivery_edit',
      data: params
    }).then(async res => {
      companyEdit.value = false
      let data = await getWuliuDetail(record.id)
      // await getWuliuOptions()


      zhuanjiaoFrom.value = cloneDeep(data)
      zhuanjiaoFrom.value.order_logistics.forEach(v => {
        v.logistics.express_name_obj = v.logistics.express_name
        v.logistics.express_no_obj = v.logistics.express_no
      })
      // activeKey.value = id
      reload()
    })
  }
  const submit = (item, type, record) => { // type 1 收货 2 撤回

    let params = {
      order_logistics_id: item.id,
      warehouse_id: localStorage.getItem('warehouseId')
    }
    if (type === 2) delete params.warehouse_id
    let url = type === 1 ? '/order_center/order_api/confirm' : '/order_center/order_api/cancel_delivery'
    window.http.post({
      url,
      data: params
    }).then(async res => {
      if (type === 2) {
        if (item.status === 1 && res.is_rollback_warehouse) {
          // const goodsIdList = record.order_logistics.map((v) => v.id)?.join(',');
          // console.log('[ goodsIdList ]-837', goodsIdList)
          let dataList = [];
          record.order_logistics.forEach((v) =>
            v.product.forEach((item) => {
              dataList.push({
                objectId: item.id,
                express_no: v.logistics.express_no,
                order_id: v.order_id,
              });
            }),
          );
          console.log('[ dataList ]-839', dataList)
          const params = {
            path: '/sendoutgoodsManage/shippingList',
            query: {
              dataList: JSON.stringify(dataList)
            },
          };
          window.go(params);
          return
        }
      }


      companyEdit.value = false
      let data = await getWuliuDetail(record.id)
      // await getWuliuOptions()


      zhuanjiaoFrom.value = cloneDeep(data)
      zhuanjiaoFrom.value.order_logistics.forEach(v => {
        v.logistics.express_name_obj = v.logistics.express_name
        v.logistics.express_no_obj = v.logistics.express_no
      })

      reload()
    })

  }
  const ship_status = {
    '-1': '已取消',
    0: '待发货',
    1: '已发货',
  }
  const delivery_method = {
    0: '公司发货',
    1: '区域发货',
    2: '医院发货',
    3: '代理发货',
  }
  const columns2 = [{
    title: '应发产品',
    align: 'center',
    dataIndex: 'title',
    // key: 'product',
    width: '200px',
  }, {
    title: '应发数量',
    align: 'center',
    dataIndex: 'num',

    width: '100px',
  }, {
    title: '实发产品',
    align: 'center',
    dataIndex: 'products',
    width: '200px',
  }, {
    title: '实发数量',
    align: 'center',
    dataIndex: 'realnumber',
    width: '120px',
  }, ]
  const columns3 = [{
    title: '应发产品',
    align: 'center',
    dataIndex: 'original_product_title',
    // key: 'product',
    width: '200px',
  }, {
    title: '应发数量',
    align: 'center',
    dataIndex: 'original_product_num',

    width: '100px',
  }, {
    title: '实发产品',
    align: 'center',
    dataIndex: 'title',
    width: '200px',
  }, {
    title: '实发数量',
    align: 'center',
    dataIndex: 'num',
    width: '120px',
  }, ]
  const productOptions1 = ref([])
  const filteredOptionsDisabled1 = computed(() => {
    let flag = false
    const pro = zhuanjiaoFrom.value.products.flatMap(v => v.productItem).map(v => v.product_id)


    productOptions1.value.forEach(o => {
      o.disabled = pro.includes(o.value)
    })

    return flag
  });
  const addOrderRow1 = (record, item) => {


    // 

    record.productItem.push({
      product_id: '',
      num: 1,
      original_product_id: record.product_id,
      original_product_num: record.num,
      original_product_title: record.title
    })

  }
  const delOrderRow1 = (record, index) => {

    if (record.productItem.length > 1) {
      record.productItem.splice(index, 1)
    }
  }
  const numStatus = (record, item) => {
    const { num } = record //应发数量
    let flag = ''
    if (item && zhuanjiaoFrom.value.shipment_type === 0) {
      if (num !== item.num) {
        flag = 'error'
      }
    }

    return flag
  }
  const errorStatus = (record, item) => {
    const { num } = record //应发数量
    let flag = false

    if (item && item.num > 0 && zhuanjiaoFrom.value.shipment_type === 0) {
      if (num !== item.num) {
        flag = true
      }
    }

    return flag
  }
  const region_type_change = (e) => {

    if (e === 1 && !warehouseOptions.value.length) {
      getWarehouseOptions()
    }
  }
  const warehouseOptions = ref([])
  const getWarehouseOptions = async () => {
    let data = await window.http.post({
      url: '/erp-ware/warehouse/list',
      // data: { user_id },
    });
    warehouseOptions.value = data;

    // configStore.setMainOptions(warehouseOptions.value);
  };
  const shipment_type_disabled = computed(() => {
    let flag = false
    if (productsChangeLength.value > zhuanjiaoFrom.value.products?.length ||
      zhuanjiaoFrom.value.order_logistics?.[0]?.shipment_type === 1) {
      flag = true
    }

    return flag

  })
  const productsChangeLength = computed(() => {


    return zhuanjiaoFrom.value?.products?.flatMap(v => v.productItem)?.length || 0
  })
  watch(productsChangeLength, val => {

    if (zhuanjiaoFrom.value.order_logistics?.[0]?.shipment_type !== 1) {
      zhuanjiaoFrom.value.shipment_type = val > zhuanjiaoFrom.value?.products?.length ? 1 : 0
    }


  })
  const modalFormRef = ref();
  const onOk = async () => {
    try {
      loading.value = true
      let params = {}
      let url = ''

      if (opentype.value === 2) {
        url = '/order_center/order_api/delivery'
        if (!zhuanjiaoFrom.value.products.length) return message.error('该订单异常，不允许发货')
        if (zhuanjiaoFrom.value.shipment_type === 0) { //完全发货状态下 特殊校验

          let err = false
          zhuanjiaoFrom.value.products.forEach(v => {
            v.productItem.forEach(e => {
              if (e.num !== v.num) {
                err = true
              }
            })
          })

          if (err) return
        }

        await modalFormRef.value.validateFields().then(() => {

          params = {
            "order_id": zhuanjiaoFrom.value.id,
            "warehouse_id": localStorage.getItem('warehouseId'), //仓库id
            "type": zhuanjiaoFrom.value.type, //0线上发货1线下发货
            "shipment_type": zhuanjiaoFrom.value.shipment_type, //发货类型0完全发货1多批发货
            "region_type": zhuanjiaoFrom.value.region_type, //0独立发货1多地发货
            "other_warehouse_ids": zhuanjiaoFrom.value.other_warehouse_ids, //其他发货仓库
            "express_name": zhuanjiaoFrom.value.express.label,
            "express_code": zhuanjiaoFrom.value.express.value,
            "express_no": zhuanjiaoFrom.value.express_no,
            products: zhuanjiaoFrom.value.products.flatMap(v => v.productItem).map(v => ({
              id: v.product_id,
              num: v.num,
              original_product_id: v.original_product_id,
              original_product_title: v.original_product_title,
              original_product_num: v.original_product_num,
              title: productOptions1.value.find(e => e.value === v.product_id)?.label,
            }))
          }
          return Promise.resolve()
        })

        console.log('params: ', params)

        window.http.post({
          url,
          data: params
        }, { successMessageMode: 'message' }).then(res => {
          closeModal();
          reload()
        }).finally(err => {

        })
      } else if (opentype.value === 4) {
        return closeModal();
      }

    } catch (error) {
      console.log('[ error ]-675', error)

    } finally {
      loading.value = false

    }


  };
  const order_logistics = ref([])
  const expressState = ref({})
  const getOrderDetail = async (id) => {
    let data = await window.http.get({
      url: '/order_center/order_api/detail',
      params: {
        id
      }
    });
    return data
  }
  const getWuliuOptions = async (key = {}) => {
    const [state] = popupScrollSelect('/basic_center/dictionary_api/select', { type: 'logistics', ...key })
    await state.requireApi()
    expressState.value = state

    return { state }
  }
  const recordObj = ref({})
  const openSendModal = async (record, type, id) => {
    console.log('record: ', record)
    //只有公司发货才弹框
    if (record.delivery_method !== 0) return
    recordObj.value = record

    // open.value = true
    // opentype.value = 1
    // modelWidth.value = "300px"
    // modelTitle.value = "发货方式"
    // order_logistics.value = record.order_logistics
    // orderFrom.value.order_report_info = {}
    opentype.value = type
    if (type === 2) {
      modelTitle.value = "发货"
      let data = await getOrderDetail(record.id)
      await getWuliuOptions()
      await getProducts()
      zhuanjiaoFrom.value = cloneDeep(data)
      zhuanjiaoFrom.value.type = 0
      if (data.products.length) {
        zhuanjiaoFrom.value.products.forEach((v, i) => {
          v.productItem = cloneDeep([data.products[i]])
          v.productItem.forEach(e => {
            e.original_product_num = v.num
            e.original_product_title = v.title
            e.original_product_id = v.product_id

          })
        })
      }


      if (zhuanjiaoFrom.value.order_logistics.length) {
        zhuanjiaoFrom.value.shipment_type = zhuanjiaoFrom.value.order_logistics[0].shipment_type

      } else {
        zhuanjiaoFrom.value.shipment_type = zhuanjiaoFrom.value.products.flatMap(v => v.productItem).length >
          zhuanjiaoFrom.value.products
          .length ? 1 : 0
      }
    } else {
      modelTitle.value = "物流查询"
      let data = await getWuliuDetail(record.id)
      await getWuliuOptions()

      zhuanjiaoFrom.value = cloneDeep(data)
      zhuanjiaoFrom.value.order_logistics.forEach(v => {
        v.logistics.express_name_obj = v.logistics.express_name
        v.logistics.express_no_obj = v.logistics.express_no
      })

      activeKey.value = id
    }

    openModal()
  }
  const onCopy = (val) => {
    if (navigator.clipboard && window.isSecureContext) {
      // 页面在安全上下文中，所以 Clipboard API 可用
      // do something...
      return navigator.clipboard.writeText(val).then(() => {
        message.success("复制成功");
      });
    } else {
      message.error('请手动复制')
    }
  }
  const companyEdit = ref(false)
  const inputRef = ref()
  const modelWidth = ref('1000px')
  const modelTitle = ref('报单')
  watch(inputRef, (newx) => {


    if (newx) {
      if (companyEdit.value) newx.focus()
    }
  })
  const formDisabled = computed(() => {

    return orderFrom.value.referrer > 0
  })
  const getTableList = async (p) => {
    for (let i in p) {
      if ((p[i] ?? 1000) === 1000) {
        delete p[i]
      }
    }
    let data = await window.http.get({
      url: '/order_center/order_report_api/list',
      params: { ...p, is_me: Number(is_me.value) }
    });
    const { total_vipInfo, total_sponsorInfo, total_referrerInfo, total_hospitalInfo, total_teamInfo } =

    await get_total_vipInfo(
      data.records)

    data.records.forEach(v => {
      //复显信息
      reviewInfo(v, total_vipInfo, 'member_id', 'vipInfo')
      reviewInfo(v, total_sponsorInfo, 'sponsor', 'sponsorInfo')
      reviewInfo(v, total_referrerInfo, 'referrer', 'referrerInfo')
      reviewInfo(v, total_hospitalInfo, 'hospital_id', 'hospitalInfo')
      reviewInfo(v, total_teamInfo, 'team_id', 'teamInfo')
    })
    return data
  }
  const [registerTable, { reload, updateTableDataRecord, getRowSelection, getForm, getDataSource }] = useTable({
    title: '报单中心',
    rowKey: 'id',
    api: getTableList,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas: userFormData
    },
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

  reload1.value = reload

  const fieldValueChange = async (key, value, schema) => {


    if (key === 'from_type' && typeof value === 'number') {

      let url = value === 1 ? '/ylyyy' : ''
      //团队
      let teamUrl = url + '/gp_mini/erp_oa/api/team/tree'
      let teamOptions = await getTeamOptopns(teamUrl)
      //医院

      let hospitalUrl = url + '/gp_mini/erp_oa/api/hospital/select'
      const { state: hospital } = await getPersonOptions(hospitalUrl)
      //推荐人
      let referrerUrl = url + '/gp_mini/erp_oa/api/staff/select'
      const { state: referrer } = await getPersonOptions(referrerUrl)
      //转介绍人
      let sponsorUrl = url + '/gp_mini/erp_oa/api/member/select'
      const { state: sponsor } = await getPersonOptions(sponsorUrl)

      const { setFieldsValue, updateSchema } = getForm()

      setFieldsValue({
        team_id: null,
        hospital_id: null,
        referrer: null,
        sponsor: null,
      })
      updateSchema({
        field: 'team_id',

        componentProps: {

          fieldNames: { label: 'title', value: 'id' },
          options: teamOptions,
          'change-on-select': true,
        },
      })
      setFrom('hospital_id', hospital)
      setFrom('referrer', referrer, 'realname')
      setFrom('sponsor', sponsor, 'nickname')

    }

  }
  const setFrom = (field, obj, label = 'title') => {

    getForm().updateSchema({
      field,
      componentProps: {
        fieldNames: { label, value: 'id' },
        filterOption,
        'show-search': true,
        'filter-option': false,
        'not-found-content': obj.fetching ? undefined : null,
        onSearch: obj.fetchUser,
        options: obj.options,
        onPopupScroll: obj.scroll,
        onChange: obj.change,
        onDropdownVisibleChange: (e) => {
          //暂时这样做
          e && setFrom(field, obj, label)
        }
      },
    })
  }
  const initForm = (obj = {}) => {
    return ref(obj)
  }

  const confirm = () => {
    orderFrom.value.order_report_info = {
      address: orderFrom.value.address,
      address_adcode: orderFrom.value.address_adcode,
      area: orderFrom.value.area,
      city: orderFrom.value.city,
      province: orderFrom.value.province,
      realname: orderFrom.value.realname,
      mobile: orderFrom.value.mobile,
    }
    displayRenderArray.value = [orderFrom.value.province, orderFrom.value.city, orderFrom.value.area]
  }
  const orderFrom = initForm({

  })
  const referrerChange = async (e) => {
    let url = orderFrom.value.from_type === 1 ? '/ylyyy' : ''
    if (e) {
      const data = await getReferrerDetail(url, { id: e })


      reviewTeam(url, data.store_id)
      orderFrom.value.hospital_id = data.hospital_id

    }
  }
  const productOptions = ref([])
  const teamOptions = ref([])
  const is_me = ref(false)
  //引流人
  const drainageState = ref({
    fetching: false,
    options: [],
    fetchUser: () => {},
    scroll: () => {}
  });
  //达成人
  const reachState = ref({
    fetching: false,
    options: [],
    fetchUser: () => {},
    scroll: () => {}
  });
  //干预人
  const intervenerState = ref({
    fetching: false,
    options: [],
    fetchUser: () => {},
    scroll: () => {}
  });
  //推荐人
  const referrerState = ref({
    fetching: false,
    options: [],
    fetchUser: () => {},
    scroll: () => {}
  });
  //转介绍人
  const sponsorState = ref({

    fetching: false,
    options: [],
    fetchUser: () => {},
    scroll: () => {}
  });
  //医院列表
  const hospitalState = ref({

    fetching: false,
    options: [],
    fetchUser: () => {},
    scroll: () => {}
  });
  const addressLabels = ref([])
  const orderForm = ref()
  const dataSource = ref([])
  const displayRenderArray = ref([])
  const userType = ref(1)
  const handleRenderDisplay = ({ labels, selectedOptions }) => {
    if (unref(orderFrom.value?.order_report_info?.address_adcode).length === selectedOptions?.length) {
      return labels.join(' / ');
    }
    if (displayRenderArray.value.length) {
      return displayRenderArray.value.join(' / ');
    }
    return '';
  };
  const openChange = async e => {
    // let url = e.
    if (e.teamInfo.fullTitle) return
    let url = e.from_type === 1 ? '/ylyyy' : ''
    let { full_name } = await getTeamFull(url, e.team_id)
    e.teamInfo.fullTitle = full_name

  }
  const displayRender = ({ labels, selectedOptions }) => {
    return labels.join(' / ')
  }
  const getTeamOptopns = async (url) => {

    let data = await window.http.get({
      url
    });

    return data
  }
  const getPersonOptions = async (url, params = {}) => {
    const [state] = popupScrollSelect(url, params)

    await state.requireApi()

    return { state }
  }
  const getTeamFull = async (url, id) => {
    let data = await window.http.get({
      url: url + '/gp_mini/erp_oa/api/team/full',
      params: {
        id
      }
    });
    return data
  }
  const system_address_id_options = ref([])
  const filteredOptionsDisabled = computed(() => {
    let flag = false
    const pro = dataSource1.value.map(v => v.product)

    productOptions.value.forEach(o => {
      o.disabled = pro.includes(o.value)
    })

    return flag
  });
  const filterOption = (input, option) => {
    return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  onMounted(async () => {
    system_address_id_options.value = await getAreaRecord()
    //drainage
    const { state: drainage } = await getPersonOptions('/user_center/user_api/select')
    //reach
    const { state: reach } = await getPersonOptions('/user_center/user_api/select')
    //intervener
    const { state: intervener } = await getPersonOptions('/user_center/user_api/select')
    drainageState.value = drainage
    reachState.value = reach
    intervenerState.value = intervener
    setFrom('drainage', drainage, 'name')
    setFrom('reach', reach, 'name')
    setFrom('intervener', intervener, 'name')

  })

  const getProducts = async () => {
    let data = await window.http.post({
      url: '/erp-ware/product/list',
    });

    productOptions.value = data.map(v => ({
      label: v.productName,
      value: v.id
    }))
    productOptions1.value = data.map(v => ({
      label: v.productName,
      value: v.id
    }))
    return
  }

  const getAreaRecord = async (params = {}, level = 0) => {
    let data = await window.http.get({
      url: '/basic_center/address_api/list',
      params: { ...params },
    });
    if (!data.length) {
      message.warning('没有下一级了')
    }
    data.forEach(v => {
      v.isLeaf = level
    })
    return data;
  };
  const loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    const { level } = targetOption
    targetOption.loading = true;

    // load options lazily
    setTimeout(async () => {
      targetOption.loading = false;

      targetOption.children = await getAreaRecord({ pid: targetOption.id }, level)
      system_address_id_options.value = [...system_address_id_options.value];
    }, 100);
  };
  const addressChange = (e, selectedOptions) => {
    // 通过selectedOptions获取标签值
    addressLabels.value = selectedOptions && selectedOptions.map(option => option.name);
    // 输出选定的标签值
    // 输出选定的标签值
    // 输出选定的标签值

  }
  const initFormState = () =>
    reactive({});

  let formState = initFormState();
  const open = ref(false)
  const loading = ref(false)
  const title = ref('')
  const dataSource1 = ref([{
    key: 1,
    product: '',
    number: 1,
  }])
  const orderOptions = reactive([{
      value: 0,
      label: '均衡代谢管理',
      disabled: true
    }, {
      value: 1,
      label: '残联小程序',
      disabled: true
    }, {
      value: 2,
      label: '内部订单',
    },
    {
      value: 3,
      label: '其他订单',
    },
  ])
  const addOrderRow = (record) => {

    let newRow = JSON.parse(JSON.stringify(record))
    dataSource1.value.push({
      key: dataSource1.value.length + 1,
      product: '',
      number: 1,
    })
  }
  const delOrderRow = (index) => {
    if (dataSource1.value.length > 1) {
      dataSource1.value.splice(index, 1)
    }
  }
  const productChange = e => {


  }
  const reviewTeam = async (url, team_id) => {
    //复显所属团队
    let { full_path } = await getTeamFull(url, team_id)
    orderFrom.value.team_id = full_path.toString().split('-').map(v => Number(v))
  }
  const delType = ref(1)

  function handleEdit(record, type) {
    delType.value = type
    window.http.get({
      url: '/order_center/order_report_api/detail',
      params: {
        id: record.id
      }
    }).then(async res => {
      open.value = true
      orderFrom.value = res
      orderFrom.value.order_report_info = {
        address: orderFrom.value.order_report_info?.address,
        address_adcode: orderFrom.value.order_report_info?.address_adcode,
        area: orderFrom.value.order_report_info?.area,
        city: orderFrom.value.order_report_info?.city,
        province: orderFrom.value.order_report_info?.province,
        realname: orderFrom.value.order_report_info?.realname,
        mobile: orderFrom.value.order_report_info?.mobile,
      }
      console.log('orderFrom.value.order_report_info: ', orderFrom.value.order_report_info)
      //把一些返回值为0的转化成空 （select值为0会显示）
      for (let i in orderFrom.value) {
        const arr = ['from_type', 'team_id', 'delivery_method', 'is_first_order']
        if (orderFrom.value[i] === 0 && !arr.includes(i)) orderFrom.value[i] = ''
      }
      //复显产品列表
      if (res.products?.length) {
        dataSource1.value = res.products.map(v => {
          return {
            key: v.id,
            product: v.product_id,
            number: v.num,
          }
        })
      } else { //没有产品的时候新增一个默认值
        dataSource1.value = [{
          key: 1,
          product: '',
          number: 1,
        }]
      }

      //复显收货地址 如果有才请求
      if (orderFrom.value.address_adcode) {
        // const { full_id } = await getAdressDetail({ adcode: orderFrom.value.address_adcode })
        // let ids = full_id.toString().split('-').map(v => Number(v))
        // 
        // const tast = ids.map(v => getAreaRecord({ pid: v }))
        // Promise.all(tast).then(res => {
        //   

        // })
      }


      displayRenderArray.value = [orderFrom.value.order_report_info.province, orderFrom.value.order_report_info.city, orderFrom.value.order_report_info.area]
      let url = res.from_type === 1 ? '/ylyyy' : ''
      //drainage
      if (orderFrom.value.drainage) {
        const { state: drainage } = await getPersonOptions('/user_center/user_api/select', {
          ids: orderFrom
            .value.drainage
        })
        drainageState.value = drainage
        const { state: drainage1 } = await getPersonOptions('/user_center/user_api/select')

        drainageState.value = drainage1
      }
      if (orderFrom.value.reach) {
        //reach
        const { state: reach } = await getPersonOptions('/user_center/user_api/select', {
          ids: orderFrom.value
            .reach
        })
        reachState.value = reach
        const { state: reach1 } = await getPersonOptions('/user_center/user_api/select')
        reachState.value = reach1
      }
      if (orderFrom.value.intervener) {
        //intervener
        const { state: intervener } = await getPersonOptions('/user_center/user_api/select', {
          ids: orderFrom.value
            .intervener
        })
        intervenerState.value = intervener
        const { state: intervener1 } = await getPersonOptions('/user_center/user_api/select')
        intervenerState.value = intervener1
      }

      //推荐人
      const { state: referrer } = await getPersonOptions(url + '/gp_mini/erp_oa/api/staff/select', {
        ids: orderFrom.value
          .referrer
      })
      referrerState.value = referrer
      const { state: referrer1 } = await getPersonOptions(url + '/gp_mini/erp_oa/api/staff/select')
      referrerState.value = referrer1

      //转介绍人
      const { state: sponsor } = await getPersonOptions(url + '/gp_mini/erp_oa/api/member/select', {
        ids: orderFrom.value
          .sponsor
      })
      sponsorState.value = sponsor
      const { state: sponsor1 } = await getPersonOptions(url + '/gp_mini/erp_oa/api/member/select')
      sponsorState.value = sponsor1

      //医院
      const { state: hospital } = await getPersonOptions(url + '/gp_mini/erp_oa/api/hospital/select', {
        ids: orderFrom.value
          .hospital_id
      })
      hospitalState.value = hospital
      //医院
      const { state: hospital1 } = await getPersonOptions(url + '/gp_mini/erp_oa/api/hospital/select')
      hospitalState.value = hospital1




      if (!productOptions.value.length) {
        await getProducts() // 产品列表

      }
      //团队
      await getTeamOptopns(url + '/gp_mini/erp_oa/api/team/tree').then(e => {
        teamOptions.value = e
      })
      //复显所属团队
      reviewTeam(url, orderFrom.value.team_id)
      //复显会员
      orderFrom.value.vip_info = (await getVipInfo(url, { ids: orderFrom.value.member_id })).records?.[0]
    })
  }
  const handleCreateFast = async () => {
    handleCreate()
    // title.value = '快速报单'
    modelTitle.value = '快速报单'
  }
  const handleCreate = async () => {
    delType.value = 1
    open.value = true
    // title.value = '新增'
    modelTitle.value = '新增'
    orderFrom.value = {
      order_report_info: {}
    }
    orderFrom.value.id = 0
    displayRenderArray.value = []
    dataSource1.value = [{
      key: 1,
      product: '',
      number: 1,
    }]

    // //drainage
    // const { state: drainage } = await getPersonOptions('/user_center/user_api/select')
    // //reach
    // const { state: reach } = await getPersonOptions('/user_center/user_api/select')
    // //intervener
    // const { state: intervener } = await getPersonOptions('/user_center/user_api/select')
    // drainageState.value = drainage
    // reachState.value = reach
    // intervenerState.value = intervener

    if (!productOptions.value.length) {
      getProducts() // 产品列表
    }
    //团队
    getTeamOptopns('/gp_mini/erp_oa/api/team/tree').then(e => {
      teamOptions.value = e
    })
  }
  const handleOk = e => {
    orderForm.value.resetFields()
    open.value = false;
    opentype.value = '';
    modelWidth.value = "1000px"
    modelTitle.value = "报单"
  };

  const afterClose = () => {
    // openInfo.value = null
  }
  const onFinish = e => {
    const err = dataSource1.value.find(v => !v.product)

    if (err) return message.error('请选择产品')
    const parmas = {
      ...e,
      id: orderFrom.value.id || 0,
      // address_adcode: e.address_adcode?.length ? e.address_adcode[e.address_adcode.length - 1] : e.address_adcode,
      team_id: e.team_id[e.team_id.length - 1],
      province: addressLabels.value[0] || orderFrom.value.order_report_info.province,
      city: addressLabels.value[1] || orderFrom.value.order_report_info.city,
      area: addressLabels.value[2] || orderFrom.value.order_report_info.area,
      address: orderFrom.value.order_report_info?.address,
      address_adcode: orderFrom.value.order_report_info?.address_adcode?.length ? orderFrom.value.order_report_info
        .address_adcode[orderFrom.value.order_report_info
          .address_adcode.length - 1
        ] : orderFrom.value.order_report_info.address_adcode,
      realname: orderFrom.value.order_report_info?.realname,
      mobile: orderFrom.value.order_report_info?.mobile,
      products: dataSource1.value.map(v => ({
        id: v.product,
        title: productOptions.value.find(e => e.value === v.product)?.label,
        num: v.number
      }))
    }

    loading.value = true
    const url = delType.value === 1 ? '/order_center/order_report_api/report' : '/order_center/order_report_api/edit'
    window.http.post({
      url,
      data: parmas
    }).then(res => {
      handleOk(res)

      reload()
    }).finally(e => {
      loading.value = false
    })
  }
  const onFinishFailed = e => {


  }
</script>
<style lang="scss" scoped>
  .container {
    background: #f7f7f7;
    min-height: 100vh;
  }

  .ant-pagination {
    margin-top: 20px;
  }

  .ant-card-head {
    border: 4px solid #fff;
  }

  .ant-card-body {
    border: 4px solid #fff;
  }
</style>
