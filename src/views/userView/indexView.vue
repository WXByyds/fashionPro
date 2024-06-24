<script setup>
import { getCommodity, getTotal } from '@/api/commodity'
import { useImageStore } from '@/stores/imageStore'
import { ref, watch } from 'vue'
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue'
import { useTextStore } from '@/stores/textStore'
import { addShopping, buyCommodity } from '@/api/shopping'
import { useUserStore } from '@/stores/userStore'
import { getVariety } from '@/api/variety'

const imageStore = useImageStore()

const images = imageStore.images

const textStore = useTextStore()
const userStore = useUserStore()
const isLookDialog = ref(false)
const lookCommodity = ref()
const lookVariety = ref()
const goodsNumber = ref(0)

const loading = ref(true)
const num = ref(0)
const sum = ref(0)
const commodityList = ref([])
const showList = ref([])
const isMore = ref(true)

const groupedCommodity = () => {
  const groupSize = 4
  const groups = []
  for (let i = 0; i < commodityList.value.length; i += groupSize) {
    groups.push(commodityList.value.slice(i, i + groupSize))
  }
  return groups
}

const getInfo = async () => {
  if (isMore.value === true) {
    loading.value = true
    num.value += 4
    let res = await getCommodity(num.value, textStore.text)
    commodityList.value = res.data.data
    showList.value = groupedCommodity()
    res = await getTotal('')
    sum.value = res.data.data
    if (sum.value <= num.value || textStore.isSearch) {
      isMore.value = false
      textStore.text = ''
      textStore.isSearch = false
    }
    loading.value = false
  } else {
    num.value = 0
    showList.value = []
    isMore.value = true
    textStore.isFlush += 1
  }
}
getInfo()

const onLook = async (commodity) => {
  const res = await getVariety(commodity.varietyId)
  lookVariety.value = res.data.data
  lookCommodity.value = commodity
  isLookDialog.value = true
}

const onBuy = async () => {
  const res = await buyCommodity(
    userStore.account,
    lookCommodity.value.commodityId,
    goodsNumber.value
  )
  if (res.data.msg === 'success') {
    ElMessage.success('购买成功！')
  }
  isLookDialog.value = false
}

const onAddShopping = async () => {
  const res = await addShopping(
    userStore.account,
    lookCommodity.value.commodityId,
    goodsNumber.value
  )
  if (res.data.msg === 'success') {
    ElMessage.success('添加成功！')
  }
  isLookDialog.value = false
}

watch(isLookDialog, () => {
  goodsNumber.value = 0
})

watch(
  () => textStore.isFlush,
  async () => {
    getInfo()
  }
)
</script>

<template>
  <div class="carousel">
    <el-carousel height="200px" motion-blur>
      <el-carousel-item v-for="item in images" :key="item">
        <el-image :src="item" fit="cover"> </el-image>
      </el-carousel-item>
    </el-carousel>
  </div>

  <h1 class="title">精选服装</h1>

  <div
    class="main"
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <div class="goods">
      <div
        class="product-container"
        v-for="commodityGroup in showList"
        :key="commodityGroup"
      >
        <div
          class="product"
          v-for="commodity in commodityGroup"
          :key="commodity.commodityId"
        >
          <el-link @click="onLook(commodity)">
            <template #default>
              <el-card shadow="hover">
                <template #footer>
                  <div>{{ commodity.commodity }}</div>
                  <div>单价：{{ commodity.unitPrice }} ￥</div>
                  <div style="color: red">
                    会员价：{{ commodity.vipPrice }} ￥
                  </div>
                </template>
                <el-image
                  :src="commodity.img"
                  style="width: 160px; height: 120px; display: block"
                />
              </el-card>
            </template>
          </el-link>
        </div>
      </div>
      <el-link @click="getInfo" :underline="false" class="more-button">
        <div v-if="isMore">
          更多
          <el-icon><ArrowDownBold /></el-icon>
        </div>
        <div v-else>
          收起
          <el-icon><ArrowUpBold /></el-icon>
        </div>
      </el-link>
    </div>
  </div>

  <el-dialog v-model="isLookDialog" title="查看商品" width="500" align-center>
    <img v-if="lookCommodity.img" :src="lookCommodity.img" class="avatar" />
    <el-image v-else class="avatar"> </el-image><br />
    <span>单价</span><el-input v-model="lookCommodity.unitPrice" />
    <span>商品名</span
    ><el-input v-model="lookCommodity.commodity" style="margin-top: 5px" />
    <span>会员价</span>
    <el-input v-model="lookCommodity.vipPrice" style="margin-top: 5px" />
    <span>种类</span>
    <el-input v-model="lookVariety.variety" style="margin-top: 5px" />
    <span>商品介绍</span>
    <el-input
      v-model="lookCommodity.introduce"
      style="margin-top: 5px"
      :rows="2"
      type="textarea"
    /><br />
    <span>种类介绍</span>
    <el-input
      v-model="lookVariety.introduce"
      style="margin-top: 5px"
      :rows="2"
      type="textarea"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button style="margin-right: 20%" @click="onAddShopping"
          >加入购物车</el-button
        >
        <span>数量：</span>
        <el-input-number v-model="goodsNumber" style="margin-right: 5px" />
        <el-button type="primary" @click="onBuy">购买</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.carousel {
  width: 70%;
  margin: 10px auto;
}

.title {
  width: 80%;
  margin: 0px auto;
  margin-bottom: 10px;
}

:deep(.el-card .el-card__body) {
  padding: 0px;
}

:deep(.el-card .el-card__footer) {
  padding: 10px;
  background-image: linear-gradient(
    to top,
    #d5dee7 0%,
    #ffafbd 0%,
    #c9ffbf 100%
  );
}

.main {
  width: 90%;
  margin: 0px auto;
  border: black solid 1px;
  border-radius: 10px;
  box-shadow: 6px 6px 2px 1px rgba(0, 0, 255, 0.2);

  .goods {
    width: 90%;
    margin: 20px auto;
  }
}

.more-button {
  width: 100px;
  margin-left: 43%;
}

.dialog-footer {
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.product-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 22.5%);
  justify-content: center; /* 控制水平间距 */
  width: 100%;
  grid-gap: 0 3%;
}

.product {
  width: 100%;
  margin-bottom: 20px;
}
</style>
