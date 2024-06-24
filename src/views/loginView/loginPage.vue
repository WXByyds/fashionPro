<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { userLogin, userRegister, userSendCode } from '@/api/user'

const formModel = ref({
  account: '',
  type: '',
  password: '',
  repassword: '',
  Phonnumber: '',
  CAPTCHA: ''
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
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,12}$/,
      message: '密码为 6-12 位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value != formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }
    }
  ],
  Phonnumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9][0-9]{9}$/,
      message: '手机号不正确',
      trigger: 'blur'
    }
  ],
  CAPTCHA: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      min: 4,
      max: 4,
      message: '验证码为4位',
      trigger: 'change'
    }
  ]
})

const form = ref()

const isRegister = ref(false)

watch(isRegister, () => {
  Object.keys(formModel.value).forEach((key) => {
    formModel.value[key] = ''
  })
})

const userStore = useUserStore()
const register = async () => {
  await form.value.validate()
  await userRegister(formModel.value)
  ElMessage.success('恭喜您，注册成功！')
  isRegister.value = false
}

const router = useRouter()
const login = async () => {
  await form.value.validate()
  const res = await userLogin(formModel.value)
  ElMessage.success('登陆成功，欢迎您！')
  userStore.token = res.data.data
  userStore.account = formModel.value.account
  userStore.type = formModel.value.type
  if (userStore.type === 'user') router.push('/user')
  else router.push('/admin')
}

const onSendCode = async () => {
  await userSendCode(formModel.value.Phonnumber)
}
</script>

<template>
  <el-row class="loginClass">
    <el-col :span="12" class="leftClass"></el-col>
    <el-col :span="8" :offset="2">
      <el-form
        v-if="isRegister"
        :model="formModel"
        ref="form"
        :rules="rules"
        class="loginFormClass"
        autocomplete="off"
        :hide-required-asterisk="true"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item label="账号：" prop="account">
          <el-input placeholder="请输入账号" v-model="formModel.account" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            placeholder="请输入密码"
            show-password
            v-model="formModel.password"
          />
        </el-form-item>
        <el-form-item label="确认密码：" prop="repassword">
          <el-input
            placeholder="请再次输入密码"
            show-password
            v-model="formModel.repassword"
          />
        </el-form-item>
        <el-form-item label="手机号：" prop="Phonnumber">
          <el-input placeholder="请输入手机号" v-model="formModel.Phonnumber" />
        </el-form-item>
        <el-form-item label="验证码：" prop="CAPTCHA">
          <el-input placeholder="请输入验证码" v-model="formModel.CAPTCHA">
            <template #append>
              <el-link type="primary" :underline="false" @click="onSendCode">
                发送验证码
              </el-link>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="您是？" prop="type">
          <el-radio-group v-model="formModel.type">
            <el-radio value="user">顾客</el-radio>
            <el-radio value="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
          <el-button
            type="primary"
            class="button-gap"
            auto-insert-space
            @click="register"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <el-form
        v-else
        :model="formModel"
        ref="form"
        :rules="rules"
        class="loginFormClass"
        autocomplete="off"
        :hide-required-asterisk="true"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item label="账号：" prop="account">
          <el-input placeholder="请输入账号" v-model="formModel.account" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            placeholder="请输入密码"
            show-password
            v-model="formModel.password"
          />
        </el-form-item>
        <el-form-item label="您是？" prop="type">
          <el-radio-group v-model="formModel.type">
            <el-radio value="user">顾客</el-radio>
            <el-radio value="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" @click="isRegister = true">
            ← 返回
          </el-link>
          <el-button
            type="primary"
            class="button-gap"
            auto-insert-space
            @click="login"
          >
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="danger"> 忘记密码 </el-link>
          <el-link type="primary" class="button-gap"> 联系我们 </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped>
.loginClass {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/loginBackground.png');
}

.leftClass {
  background-image: url('@/assets/loginImage.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.loginFormClass {
  margin-top: 30%;
  padding: 40px;
  padding-top: 30px;
  padding-bottom: 30px;

  background-color: #ffffff;

  border: black solid 1px;
  border-radius: 10px;
  box-shadow: 6px 6px 2px 1px rgba(0, 0, 255, 0.2);
}

.button-gap {
  margin-left: 65%;
}
</style>
