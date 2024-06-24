<script setup>
import { getGoods } from '@/api/commodity'
import { buyCommodity, delShopping, getShopping } from '@/api/shopping'
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'

const dataTable = ref([])
const showTable = ref([])
const loading = ref(true)
const userStore = useUserStore()
const num = ref(0)
const sumPrice = ref(0)
const selectShoppings = ref([])

const getInfo = async () => {
  loading.value = true
  num.value += 4
  const res = await getShopping(userStore.account, num.value)
  dataTable.value = res.data.data
  getDetailInfo()
  loading.value = false
}
getInfo()

const getDetailInfo = async () => {
  showTable.value = []
  for (let i = 0; i < dataTable.value.length; i++) {
    const res = await getGoods(dataTable.value[i].commodityId)
    const dataLine = res.data.data
    dataLine.number = dataTable.value[i].number
    if (userStore.type === 'user') {
      sumPrice.value += dataLine.unitPrice * dataLine.number
    } else {
      sumPrice.value -= dataLine.unitPrice * dataLine.number
    }
    showTable.value.push(dataLine)
  }
}

const onDelete = async (row) => {
  const res = await delShopping(row.id)
  if (res.data.msg === 'success') {
    ElMessage.success('移除成功！')
  }
  num.value = 0
  getInfo()
}

const onAdd = (row) => {
  if (row.number >= 0) {
    row.number += 1
    if (userStore.type === 'user') sumPrice.value += row.unitPrice
    else sumPrice.value += row.vipPrice
  }
}

const onMinus = (row) => {
  if (row.number > 0) {
    row.number -= 1
    if (userStore.type === 'user') sumPrice.value -= row.unitPrice
    else sumPrice.value -= row.vipPrice
  }
}

const handleSelect = (shoppings) => {
  selectShoppings.value = shoppings
}

const onAllBuy = async () => {
  let isSuccess = true
  for (let i = 0; i < selectShoppings.value.length; i++) {
    const res = await buyCommodity(
      userStore.account,
      selectShoppings.value[i].commodityId,
      selectShoppings.value[i].number
    )
    if (res.data.msg !== 'success') isSuccess = false
  }
  if (isSuccess) {
    ElMessage.success('购买成功！')
  } else {
    ElMessage.danger('购买时出错！')
  }
}
</script>

<template>
  <div class="main">
    <div class="shopping">
      <h3 style="margin-bottom: 20px">我的购物车</h3>
      <el-table
        :data="showTable"
        :default-sort="{ prop: 'commodityId' }"
        style="width: 100%"
        @selection-change="handleSelect"
        v-loading="loading"
        element-loading-text="Loading..."
        element-loading-svg-view-box="-10, -10, 50, 50"
        element-loading-background="rgba(122, 122, 122, 0.8)"
        :cell-style="{ border: 0 + 'px' }"
        :header-cell-style="{ border: 0 + 'px' }"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="图片" width="90" class="avatar">
          <template #default="{ row }">
            <el-image
              style="width: 60px; height: 60px"
              :src="row.img"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="commodity"
          label="商品名"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="varietyId"
          label="种类编号"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column prop="unitPrice" label="单价" width="80" />
        <el-table-column prop="vipPrice" label="会员价" width="80" />
        <el-table-column label="数量" width="160" prop="number">
          <template #default="{ row }">
            <el-button @click="onMinus(row)">-</el-button>
            <input
              type="number"
              min="0"
              style="
                width: 40px;
                height: 32px;
                border: none;
                text-align: center;
              "
              :value="row.number"
              disabled="true"
            />
            <el-button @click="onAdd(row)">+</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="onDelete(row)">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div
        style="display: flex; justify-content: space-between; margin-top: 3%"
      >
        <h3 style="width: 20%">总计： {{ sumPrice }} ￥</h3>
        <el-button style="width: 20%" @click="onAllBuy">确认购买</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  width: 90%;
  margin: 30px auto;
  border: black solid 1px;
  border-radius: 10px;
  box-shadow: 6px 6px 2px 1px rgba(0, 0, 255, 0.2);

  .shopping {
    width: 90%;
    margin: 20px auto;
  }
}

.more-button {
  width: 100px;
  margin-left: 43%;
}

input:focus {
  outline: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
