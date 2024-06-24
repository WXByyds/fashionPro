<script setup>
import {
  Search,
  Plus,
  Edit,
  Delete,
  DeleteFilled
} from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import axios from 'axios'
import {
  deleteAll,
  deleteCommodityInfo,
  getTotal,
  insertCommodityInfo,
  selectCommodityInfo,
  updateCommodityInfo
} from '@/api/commodity'

const formModel = ref({
  name: ''
})

const pageObj = ref({
  page: 1,
  size: 5,
  total: 0
})

const rules = ref({
  commodity: [
    { required: true, message: '请输入商品名', trigger: 'blur' },
    {
      pattern: /^\S{2,8}$/,
      message: '商品名为 2-8 位的非空字符',
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
  unitPrice: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    {
      pattern: /^[0-9]{1,6}$/,
      message: '输入不正确',
      trigger: 'blur'
    }
  ],
  vipPrice: [
    { required: true, message: '请输入会员价', trigger: 'blur' },
    {
      pattern: /^[0-9]{1,6}$/,
      message: '输入不正确',
      trigger: 'blur'
    }
  ],
  introduce: [
    {
      max: 20,
      message: '最多输入 20 位非空字符',
      trigger: 'blur'
    }
  ],
  quantity: [
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
      pattern: /^[0-9]{1,8}$/,
      message: '商品编号为 1-8 位的数字',
      trigger: 'blur'
    }
  ]
})

const showTable = ref([])

const addForm = ref({
  commodity: '',
  commodityId: 0,
  introduce: '',
  quantity: 0,
  unitPrice: '',
  varietyId: 0,
  vipPrice: '',
  img: ''
})
const editForm = ref({
  commodity: '',
  commodityId: 0,
  introduce: '',
  quantity: 0,
  unitPrice: '',
  varietyId: 0,
  vipPrice: '',
  img: ''
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

const addImgURL = ref('')
const editImgUrl = ref('')

const onAddSelectFile = (uploadFile) => {
  addImgURL.value = URL.createObjectURL(uploadFile.raw)
  addForm.value.img = uploadFile.raw
}

const onEditSelectFile = (uploadFile) => {
  editImgUrl.value = URL.createObjectURL(uploadFile.raw)
  editForm.value.img = uploadFile.raw
}

const getInfo = async () => {
  loading.value = true
  const res = await selectCommodityInfo(
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
  currentId.value = row.commodityId
}
const onEdit = async (row) => {
  dialogEditVisible.value = true
  editForm.value = { ...row }
  editImgUrl.value = row.img
  currentId.value = row.commodityId
}

const addSubmit = async () => {
  const addFormData = new FormData()
  addFormData.append('commodity', addForm.value.commodity)
  addFormData.append('commodityId', addForm.value.commodityId)
  addFormData.append('introduce', addForm.value.introduce)
  addFormData.append('quantity', addForm.value.quantity)
  addFormData.append('unitPrice', addForm.value.unitPrice)
  addFormData.append('varietyId', addForm.value.varietyId)
  addFormData.append('vipPrice', addForm.value.vipPrice)
  addFormData.append('img', addForm.value.img)
  const res = await insertCommodityInfo(addFormData)
  if (res.data.msg === 'success') ElMessage.success('添加成功！')
  await getInfo()
  drawerAddVisible.value = false
}
const editSubmit = async () => {
  const file = await getImageAsFile(editImgUrl.value)
  editForm.value.img = file
  const editFormData = new FormData()
  editFormData.append('commodity', editForm.value.commodity)
  editFormData.append('commodityId', editForm.value.commodityId)
  editFormData.append('introduce', editForm.value.introduce)
  editFormData.append('quantity', editForm.value.quantity)
  editFormData.append('unitPrice', editForm.value.unitPrice)
  editFormData.append('varietyId', editForm.value.varietyId)
  editFormData.append('vipPrice', editForm.value.vipPrice)
  editFormData.append('img', editForm.value.img)
  const res = await updateCommodityInfo(editFormData)
  if (res.data.msg === 'success') ElMessage.success('修改成功！')
  await getInfo()
  dialogEditVisible.value = false
}
const delSubmit = async () => {
  const res = await deleteCommodityInfo(currentId.value)
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
    currentIds.value.push(ids[i].commodityId)
  }
}

// 将网络图片地址转换为 File 对象的函数
async function getImageAsFile(imageUrl, fileName = 'image.png') {
  try {
    // 使用axios获取图片内容
    const response = await axios.get(imageUrl, {
      responseType: 'blob' // 告诉axios我们期望得到一个Blob对象
    })

    // 获取Blob对象
    const blob = response.data

    // 创建一个指向该Blob对象的URL
    const blobUrl = URL.createObjectURL(blob)

    // 创建一个模拟的File对象（注意：这不是真正的File对象，但足够在许多情况下使用）
    const file = new File([blob], fileName, { type: blob.type })

    // 如果你不再需要blobUrl，可以释放它
    URL.revokeObjectURL(blobUrl)

    // 返回模拟的File对象
    return file
  } catch (error) {
    console.error('Error fetching image:', error)
    throw error
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
    res = await selectCommodityInfo(
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
            placeholder="搜索商品编号"
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
        :default-sort="{ prop: 'commodityId' }"
        style="width: 100%"
        v-loading="loading"
        row-key="commodityId"
        @selection-change="handleSelect"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="commodityId"
          label="商品编号"
          sortable
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="commodity"
          label="商品名"
          width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="varietyId"
          label="种类编号"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="introduce"
          label="商品介绍"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column label="图片" width="80" class="avatar">
          <template #default="{ row }">
            <el-image
              style="width: 60px; height: 60px"
              :src="row.img"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价" width="120" />
        <el-table-column prop="vipPrice" label="会员价" width="120" />
        <el-table-column
          prop="quantity"
          label="库存"
          width="120"
          show-overflow-tooltip
        />
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
        :page-sizes="[2, 3, 5]"
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
      <el-form-item label="商品图片" prop="img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onEditSelectFile"
        >
          <img v-if="editForm.img" :src="editImgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品编号" prop="commodityId">
        <el-input v-model="editForm.commodityId" />
      </el-form-item>
      <el-form-item label="商品名称" prop="commodity">
        <el-input v-model="editForm.commodity" />
      </el-form-item>
      <el-form-item label="商品种类编号" prop="varietyId">
        <el-input v-model="editForm.varietyId" />
      </el-form-item>
      <el-form-item label="商品库存" prop="quantity">
        <el-input v-model="editForm.quantity" />
      </el-form-item>
      <el-form-item label="商品介绍" prop="introduce">
        <el-input
          v-model="editForm.introduce"
          style="width: 240px"
          :rows="2"
          type="textarea"
          placeholder="输入介绍"
        />
      </el-form-item>
      <el-form-item label="单价" prop="unitPrice">
        <el-input v-model="editForm.unitPrice" />
      </el-form-item>
      <el-form-item label="会员价" prop="vipPrice">
        <el-input v-model="editForm.vipPrice" />
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
    <p>你确定要删除商品 {{ currentId }} 吗</p>
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
    <h1>添加商品信息</h1>
    <br />
    <el-form :model="addForm" ref="aForm" :rules="rules" autocomplete="off">
      <el-form-item label="商品图片" prop="img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onAddSelectFile"
        >
          <img v-if="addForm.img" :src="addImgURL" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品编号" prop="commodityId">
        <el-input v-model="addForm.commodityId" />
      </el-form-item>
      <el-form-item label="商品名称" prop="commodity">
        <el-input v-model="addForm.commodity" />
      </el-form-item>
      <el-form-item label="商品种类编号" prop="varietyId">
        <el-input v-model="addForm.varietyId" />
      </el-form-item>
      <el-form-item label="商品库存" prop="quantity">
        <el-input v-model="addForm.quantity" />
      </el-form-item>
      <el-form-item label="商品介绍" prop="introduce">
        <el-input
          v-model="addForm.introduce"
          style="width: 240px"
          :rows="2"
          type="textarea"
          placeholder="输入介绍"
        />
      </el-form-item>
      <el-form-item label="单价" prop="unitPrice">
        <el-input v-model="addForm.unitPrice" />
      </el-form-item>
      <el-form-item label="会员价" prop="vipPrice">
        <el-input v-model="addForm.vipPrice" />
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
      width: 100px;
      height: 100px;
      text-align: center;
    }
  }
}
</style>
