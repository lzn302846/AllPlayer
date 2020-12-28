<template>
  <div id="login">
    <div class="mask-image">
      <!-- <img src="@/assets/bg.gif" alt /> -->
      <iframe src="html/star.html" ref="onIframe" frameborder="0" scrolling="auto"></iframe>
    </div>
    <div class="main">
      <div style="height: 4px;background-color: #159D73;margin-bottom:45px">
        <!-- <div class="logo" style="">
                <a href="/">
                  <img src="~@/assets/ear.jpg" class="logoImg" alt="logo">
                  <span class="title"></span>
                </a>
        </div>-->
      </div>
      <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin">
        <a-form-item style="width:80%;margin: auto;" v-if="Object.keys(books).length > 1">
          <a-select placeholder="请选择帐套" v-decorator="[ 'datasource', validatorRules.datasource]">
            <a-select-option v-for="(name, value) in books" :value="value">{{name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item style="width:80%;margin: auto;">
          <a-input
            style="border:none;"
            size="large"
            v-decorator="['username',validatorRules.username]"
            type="text"
            placeholder="请输入帐户名"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>

        <a-form-item style="width:80%;margin: auto;padding-top: 20px">
          <a-input
            :class="czypass"
            style="border: 0"
            v-decorator="['password',validatorRules.password]"
            size="large"
            type="password"
            autocomplete="false"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>
        <a-form-item style="padding-top:40px;width:80%;margin: auto;padding-bottom: 60px">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="loginBtn"
            @click.stop.prevent="handleSubmit"
            :disabled="loginBtn"
          >确定</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import instance2 from '@/utils/http'
import Vue from 'vue'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      loginBtn: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        smsSendBtn: false
      },
      formLogin: {
        username: '',
        password: '',
        captcha: '',
        mobile: '',
        rememberMe: true
      },
      validatorRules: {
        username: { rules: [{ required: true, message: '请输入用户名!' }] },
        password: {
          rules: [
            { required: true, message: '请输入密码!', validator: 'click' }
          ]
        },
        inputCode: {
          rules: [
            { required: true, message: '请输入验证码!' },
            { validator: this.validateInputCode }
          ]
        },
        datasource: {
          rules: [
            { required: true, message: '请选择帐套!', initialValue: 'master' }
          ]
        }
      },
      verifiedCode: '',
      inputCodeContent: '',
      books: {},
      czypass: {
        border: 0
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.onIframe.width = window.innerWidth
      this.$refs.onIframe.height = window.innerHeight
    })
  },
  methods: {
    ...mapMutations('LoginMsg', ['changeLoginMsg']),
    // handler
    inputCodeChange (e) {
      this.inputCodeContent =
        e.target.value && e.target.value.length > 0
          ? e.target.value.toLowerCase()
          : ''
    },
    generateCode (value) {
      this.verifiedCode = value.toLowerCase()
    },
    validateInputCode (rule, value, callback) {
      if (!value || this.verifiedCode == this.inputCodeContent) {
        callback()
      } else {
        callback('您输入的验证码不正确!')
      }
    },
    handleSubmit () {
      const that = this
      const loginParams = {}

      //   使用账户密码登陆  ,'inputCode'
      const vas = ['username', 'password', 'datasource']
      that.form.validateFields(vas, { force: true }, (err, values) => {
        loginParams.username = values.username
        loginParams.password = values.password
        loginParams.remember_me = true
        loginParams.captcha = ''
        instance2
          .post('/sys/login', loginParams)
          .then(res => {
            console.log(res)
            if (res.success) {
              this.changeLoginMsg(res.result.userInfo.realname)
              this.formLogin.username = res.result.userInfo.realname
              this.loginSuccess()
              localStorage.setItem('username', res.result.userInfo.realname)
              Cookies.set('token', res.result.token, { expires: 7 }) // 七天免登录
            } else {
              this.requestFailed(res)
              this.Logout()
            }
          })
          .catch(err => {
            console.log(err)
            that.requestFailed(err)
          })
      })
    },
    loginSuccess () {
      this.$notification.success({
        message: '欢迎',
        description: `${this.formLogin.username}，欢迎回来`
      })
      setTimeout(() => {
        this.$router.push('/home')
      }, 1500)
    },
    requestFailed (err) {
      this.$notification.error({
        message: '登录失败',
        description:
          ((err.response || {}).data || {}).message ||
          err.message ||
          '请求出现错误，请稍后再试',
        duration: 4
      })
      this.loginBtn = false
    }
  }
}
</script>
<style lang="scss">
.mask-image{
  overflow-y: scroll;

  /* 2020/10/12 新增代码 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  $scrollBarSize: 10px;
  &::-webkit-scrollbar {
    width: $scrollBarSize;
    height: $scrollBarSize;
    background-color: transparent;
    display: none;
  }

  & .-o-scrollbar {
    display: none;
  }
}
.input {
  border: 0;
}
.czypass {
  border: 0;
}
#password {
  border: 0;
}
.ant-input {
  border: 0;
}
.main {
  z-index: 2;
  min-width: 260px;
  width: 350px;
  /*height: 600px;*/
  /*margin: 0 auto;*/
  background-color: orange;
  border: 0;
  position: absolute;
  top: 55%;
  left: 65%;
  /*height: 30%;*/
  /*width: 50%;*/
  margin: -15% 0 0 -25%;
}
.logo {
  /*padding-top: 40px;*/
  position: absolute;
  height: 44px;
  vertical-align: top;

  /*margin-right: 16px;*/
  border-style: none;
  text-align: center;
  /*vertical-align: middle;*/
}
.ant-input {
  border: 0;
}
.user-layout-login {
  padding-top: 80px;
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}

#login {
  width: 100%;
  height: 100%;
}
</style>
