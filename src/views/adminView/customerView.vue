<script setup>
import {
  deleteAll,
  deleteUserInfo,
  getImageUrl,
  getTotal,
  insertUserInfo,
  selectUserInfo,
  updateUserInfo
} from '@/api/userProfile'
import {
  Search,
  Plus,
  Edit,
  Delete,
  DeleteFilled
} from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import axios from 'axios'

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
  type: [{ required: true, message: '请选择用户类型', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择用户性别', trigger: 'blur' }],
  preference: [
    {
      max: 20,
      message: '最多输入 20 位非空字符',
      trigger: 'blur'
    }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value > 127 || value < 1) {
          callback(new Error('年龄不正确'))
        } else {
          callback()
        }
      }
    }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9][0-9]{9}$/,
      message: '手机号不正确',
      trigger: 'blur'
    }
  ]
})

const showTable = ref([])

const addForm = ref({
  account: '',
  gender: '',
  age: 0,
  avatar: '',
  phone: '',
  preference: '',
  type: ''
})
const editForm = ref({
  account: '',
  gender: '',
  age: 0,
  avatar: '',
  phone: '',
  preference: '',
  type: ''
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

const isSelectFile = ref(false)

const addImgURL = ref('')
const editImgUrl = ref('')

const onAddSelectFile = (uploadFile) => {
  addImgURL.value = URL.createObjectURL(uploadFile.raw)
  addForm.value.avatar = uploadFile.raw
  isSelectFile.value = true
}

const onEditSelectFile = (uploadFile) => {
  editImgUrl.value = URL.createObjectURL(uploadFile.raw)
  editForm.value.avatar = uploadFile.raw
}

const getInfo = async () => {
  loading.value = true
  const res = await selectUserInfo(
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
  currentId.value = row.account
}
const onEdit = async (row) => {
  dialogEditVisible.value = true
  editForm.value = { ...row }
  editImgUrl.value = row.avatar
  currentId.value = row.account
}

const addSubmit = async () => {
  if (isSelectFile.value === false) {
    const url = await getImageUrl()
    const file = await getImageAsFile(url)
    addForm.value.avatar = file
  }
  const addFormData = new FormData()
  addFormData.append('account', addForm.value.account)
  addFormData.append('gender', addForm.value.gender)
  addFormData.append('age', addForm.value.age)
  addFormData.append('avatar', addForm.value.avatar)
  addFormData.append('phone', addForm.value.phone)
  addFormData.append('preference', addForm.value.preference)
  addFormData.append('type', addForm.value.type)
  const res = await insertUserInfo(addFormData)
  if (res.data.msg === 'success') ElMessage.success('添加成功！')
  await getInfo()
  drawerAddVisible.value = false
  isSelectFile.value = false
}
const editSubmit = async () => {
  const file = await getImageAsFile(addImgURL.value)
  editForm.value.avatar = file
  const editFormData = new FormData()
  editFormData.append('account', editForm.value.account)
  editFormData.append('gender', editForm.value.gender)
  editFormData.append('age', editForm.value.age)
  editFormData.append('avatar', editForm.value.avatar)
  editFormData.append('phone', editForm.value.phone)
  editFormData.append('preference', editForm.value.preference)
  editFormData.append('type', editForm.value.type)
  const res = await updateUserInfo(editFormData)
  if (res.data.msg === 'success') ElMessage.success('修改成功！')
  await getInfo()
  dialogEditVisible.value = false
}
const delSubmit = async () => {
  const res = await deleteUserInfo(currentId.value)
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
    currentIds.value.push(ids[i].account)
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
    res = await selectUserInfo(
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
            placeholder="搜索用户账号"
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
        :default-sort="{ prop: 'account' }"
        style="width: 100%"
        v-loading="loading"
        row-key="account"
        @selection-change="handleSelect"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="account"
          label="账号"
          sortable
          width="120"
          show-overflow-tooltip
        />
        <el-table-column prop="type" label="类型" width="90" />
        <el-table-column prop="gender" label="性别" width="60" />
        <el-table-column prop="age" label="年龄" width="60" />
        <el-table-column label="头像" width="80" class="avatar">
          <template #default="{ row }">
            <el-image
              style="width: 60px; height: 60px"
              :src="row.avatar"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="preference"
          label="偏好"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="170">
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
      <el-form-item label="用户头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onEditSelectFile"
        >
          <img v-if="editForm.avatar" :src="editImgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户账号" prop="account">
        <el-input v-model="editForm.account" />
      </el-form-item>
      <el-form-item label="用户性别" prop="gender">
        <el-radio-group v-model="editForm.gender">
          <el-radio value="男">男</el-radio>
          <el-radio value="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户年龄" prop="age">
        <el-input v-model="editForm.age" />
      </el-form-item>
      <el-form-item label="用户手机号" prop="phone">
        <el-input v-model="editForm.phone" />
      </el-form-item>
      <el-form-item label="用户偏好" prop="preference">
        <el-input v-model="editForm.preference" />
      </el-form-item>
      <el-form-item label="用户类型" prop="type">
        <el-select
          v-model="editForm.type"
          placeholder="请选择用户类型"
          style="width: 150px"
        >
          <el-option label="user" value="user" />
          <el-option label="member" value="member" />
        </el-select>
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
    <p>你确定要删除用户 {{ currentId }} 吗</p>
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
    <h1>添加用户信息</h1>
    <br />
    <el-form :model="addForm" ref="aForm" :rules="rules" autocomplete="off">
      <el-form-item label="用户头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onAddSelectFile"
        >
          <img v-if="addForm.avatar" :src="addImgURL" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户账号" prop="account">
        <el-input v-model="addForm.account" />
      </el-form-item>
      <el-form-item label="用户性别" prop="gender">
        <el-radio-group v-model="addForm.gender">
          <el-radio value="男">男</el-radio>
          <el-radio value="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户年龄" prop="age">
        <el-input v-model="addForm.age" />
      </el-form-item>
      <el-form-item label="用户手机号" prop="phone">
        <el-input v-model="addForm.phone" />
      </el-form-item>
      <el-form-item label="用户偏好" prop="preference">
        <el-input v-model="addForm.preference" />
      </el-form-item>
      <el-form-item label="用户类型" prop="type">
        <el-select
          v-model="addForm.type"
          placeholder="请选择用户类型"
          style="width: 150px"
        >
          <el-option label="user" value="user" />
          <el-option label="member" value="member" />
        </el-select>
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
