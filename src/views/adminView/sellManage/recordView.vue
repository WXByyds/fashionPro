<script setup>
import {
  deleteAll,
  deleteOrderInfo,
  getTotal,
  insertOrderInfo,
  selectOrderInfo,
  updateOrderInfo
} from '@/api/userOrder'
import {
  Search,
  Plus,
  Edit,
  Delete,
  DeleteFilled
} from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

const formModel = ref({
  name: ''
})

const pageObj = ref({
  page: 1,
  size: 5,
  total: 0
})

const rules = ref({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    {
      pattern: /^\S{2,12}$/,
      message: '账号为 2-12 位的非空字符',
      trigger: 'blur'
    }
  ],
  commodityId: [
    { required: true, message: '请输入商品编号', trigger: 'blur' },
    {
      pattern: /^[0-9]{1,8}$/,
      message: '商品编号为 1-8 位的数字',
      trigger: 'blur'
    }
  ],
  order_price: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    {
      pattern: /^[0-9]{1,6}$/,
      message: '输入不正确',
      trigger: 'blur'
    }
  ],
  orderid: [
    { required: true, message: '请输入订单编号', trigger: 'blur' },
    {
      pattern: /^[0-9]{1,8}$/,
      message: '订单编号为 1-8 位的数字',
      trigger: 'blur'
    }
  ],
  buyTime: [{ required: true, message: '请输入购买时间', trigger: 'blur' }],
  number: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    {
      pattern: /^[0-9]{1,6}$/,
      message: '输入不正确',
      trigger: 'blur'
    }
  ],
  varietyId: [
    { required: true, message: '请输入种类编号', trigger: 'blur' },
    {
      pattern: /^[0-9]{1,6}$/,
      message: '商品编号为 1-8 位的数字',
      trigger: 'blur'
    }
  ]
})

const showTable = ref([])

const addForm = ref({
  account: '',
  buyTime: '',
  commodityId: 0,
  number: 0,
  order_price: 0,
  orderid: 0,
  varietyid: ''
})
const editForm = ref({
  account: '',
  buyTime: '',
  commodityId: 0,
  number: 0,
  order_price: 0,
  orderid: 0,
  varietyid: ''
})
const aForm = ref({})
const eForm = ref({})

const loading = ref(true)
const currentId = ref()
const currentIds = ref([])
const drawerAddVisible = ref(false)
const dialogDeleteVisible = ref(false)
const dialogEditVisible = ref(false)
const dialogAllDeleteVisible = ref(false)

const getInfo = async () => {
  loading.value = true
  const res = await selectOrderInfo(
    formModel.value.name,
    pageObj.value.page,
    pageObj.value.size
  )
  const totalRes = await getTotal(formModel.value.name)
  pageObj.value.total = totalRes.data.data
  showTable.value = res.data.data
  loading.value = false
}
getInfo()

const handleCurrentChange = (page) => {
  pageObj.value.page = page
  getInfo()
}
const handleSizeChange = (size) => {
  pageObj.value.page = 1
  pageObj.value.size = size
  getInfo()
}

const onAdd = () => {
  drawerAddVisible.value = true
}
const onDelete = (row) => {
  dialogDeleteVisible.value = true
  currentId.value = row.orderid
}
const onEdit = async (row) => {
  dialogEditVisible.value = true
  editForm.value = { ...row }
  currentId.value = row.orderid
}

const addSubmit = async () => {
  const res = await insertOrderInfo(addForm.value)
  if (res.data.msg === 'success') ElMessage.success('添加成功！')
  await getInfo()
  drawerAddVisible.value = false
}
const editSubmit = async () => {
  const res = await updateOrderInfo(editForm.value)
  if (res.data.msg === 'success') ElMessage.success('修改成功！')
  await getInfo()
  dialogEditVisible.value = false
}
const delSubmit = async () => {
  const res = await deleteOrderInfo(currentId.value)
  if (res.data.msg === 'success') ElMessage.success('删除成功！')
  await getInfo()
  dialogDeleteVisible.value = false
}

const onAllDelete = async () => {
  dialogAllDeleteVisible.value = true
}

const delAllSubmit = async () => {
  const res = await deleteAll(currentIds.value)
  if (res.data.msg === 'success') ElMessage.success('删除成功！')
  await getInfo()
  dialogAllDeleteVisible.value = false
}

const handleSelect = (ids) => {
  currentIds.value = []
  for (let i = 0; i < ids.length; i++) {
    currentIds.value.push(ids[i].orderid)
  }
}

watch(drawerAddVisible, () => {
  Object.keys(addForm.value).forEach((key) => {
    addForm.value[key] = ''
  })
})

watch(
  () => formModel.value.name,
  async () => {
    let res
    loading.value = true
    res = await selectOrderInfo(
      formModel.value.name,
      pageObj.value.page,
      pageObj.value.size
    )
    const totalRes = await getTotal(formModel.value.name)
    pageObj.value.total = totalRes.data.data
    showTable.value = res.data.data
    loading.value = false
  }
)
</script>

<template>
  <div class="all-layout">
    <div class="Layout">
      <el-form :inline="true" :model="formModel" class="search-layout">
        <el-form-item>
          <el-input
            v-model="formModel.name"
            :prefix-icon="Search"
            placeholder="搜索订单编号"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAdd">
            <el-icon style="margin-right: 2px"> <Plus /> </el-icon>添加数据
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="onAllDelete">
            <el-icon style="margin-right: 2px"> <DeleteFilled /> </el-icon
            >批量删除
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="showTable"
        stripe
        :default-sort="{ prop: 'orderid' }"
        style="width: 100%"
        v-loading="loading"
        row-key="orderid"
        @selection-change="handleSelect"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="orderid"
          label="订单编号"
          sortable
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="account"
          label="用户"
          width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="commodityId"
          label="商品编号"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="varietyid"
          label="种类编号"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column prop="number" label="数量" width="80" />
        <el-table-column prop="order_price" label="金额" width="120" />
        <el-table-column prop="buyTime" label="购买时间" width="120" />
        <el-table-column label="操作" width="170" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              @click="onEdit(row)"
              :icon="Edit"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="onDelete(row)"
              :icon="Delete"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pageObj.page"
        v-model:page-size="pageObj.size"
        :page-sizes="[3, 5, 7, 10]"
        background
        layout="sizes, prev, pager, next, jumper, total"
        v-model:total="pageObj.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px"
      />
    </div>
  </div>

  <el-dialog v-model="dialogEditVisible" title="编辑" width="500" align-center>
    <el-form :model="editForm" ref="eForm" :rules="rules" autocomplete="off">
      <el-form-item label="订单编号" prop="orderid">
        <el-input v-model="editForm.orderid" />
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="editForm.account" />
      </el-form-item>
      <el-form-item label="商品编号" prop="commodityId">
        <el-input v-model="editForm.commodityId" />
      </el-form-item>
      <el-form-item label="种类编号" prop="varietyid">
        <el-input v-model="editForm.varietyid" />
      </el-form-item>
      <el-form-item label="数量" prop="number">
        <el-input v-model="editForm.number" />
      </el-form-item>
      <el-form-item label="金额" prop="order_price">
        <el-input v-model="editForm.order_price" />
      </el-form-item>
      <el-form-item label="购买时间" prop="buyTime">
        <el-date-picker
          v-model="editForm.buyTime"
          type="date"
          placeholder="选择时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :size="size"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取消</el-button>
        <el-button type="primary" @click="editSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialogDeleteVisible"
    title="删除"
    width="500"
    align-center
  >
    <p>你确定要删除订单 {{ currentId }} 吗</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取消</el-button>
        <el-button type="primary" @click="delSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialogAllDeleteVisible"
    title="删除"
    width="500"
    align-center
  >
    <p>你确定要删除吗</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogAllDeleteVisible = false">取消</el-button>
        <el-button type="primary" @click="delAllSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-drawer
    v-model="drawerAddVisible"
    title="I am the title"
    :with-header="false"
  >
    <h1>添加订单信息</h1>
    <br />
    <el-form :model="addForm" ref="aForm" :rules="rules" autocomplete="off">
      <el-form-item label="订单编号" prop="orderid">
        <el-input v-model="addForm.orderid" />
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="addForm.account" />
      </el-form-item>
      <el-form-item label="商品编号" prop="commodityId">
        <el-input v-model="addForm.commodityId" />
      </el-form-item>
      <el-form-item label="种类编号" prop="varietyid">
        <el-input v-model="addForm.varietyid" />
      </el-form-item>
      <el-form-item label="数量" prop="number">
        <el-input v-model="addForm.number" />
      </el-form-item>
      <el-form-item label="金额" prop="order_price">
        <el-input v-model="addForm.order_price" />
      </el-form-item>
      <el-form-item label="购买时间" prop="buyTime">
        <el-date-picker
          v-model="addForm.buyTime"
          type="date"
          placeholder="选择时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :size="size"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="drawerAddVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.all-layout {
  width: 100%;
  height: 100%;
  background-color: #ecdcdc34;
}

.Layout {
  margin: 10px auto;
  width: 860px;
  overflow: hidden;
}

.avatar-uploader {
  :deep() {
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      text-align: center;
    }
  }
}
</style>
