<template>
    <Layout class="page-login">
        <Content class="content"></Content>
        <Sider class="sider" :width="380">
            <Form class="form" ref="form" :model="form" :rules="formRule">
                <FormItem>
                    <h1>管理系统登陆</h1>
                </FormItem>
                <FormItem prop="username">
                    <i-input v-model="form.username" prefix="md-person" clearable></i-input>
                </FormItem>
                <FormItem prop="password">
                    <i-input v-model="form.password" prefix="md-lock" clearable></i-input>
                </FormItem>
                <FormItem prop="captcha" class="captcha">
                    <i-input v-model="form.captcha" class="captcha-input" prefix="md-image" clearable></i-input>
                    <div class="captcha-img">
                        <img @load="captchaLoading = false" @click="resetUid" :src="'/proxyApi/captcha.jpg?uuid=' + form.uuid" />
                        <Spin fix v-if="captchaLoading"></Spin>
                    </div>
                </FormItem>
                <FormItem>
                    <Button @click="login" :loading="loading" type="primary" long>登录</Button>
                </FormItem>
            </Form>
        </Sider>
    </Layout>
</template>

<script>
import uuid from 'uuid';
export default {
    data() {
        return {
            captchaLoading: true,
            loading: false,
            form: {
                username: '',
                password: '',
                captcha: '',
                uuid: uuid()
            },
            formRule: {
                username: [
                    {required: true, message: '用户名必须填写', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '密码必须填写', trigger: 'blur'},
                    {max: 16, min: 5, message: '密码必须6-16', trigger: 'blur'}
                ],
                captcha: [
                    {required: true, message: '验证码必须填写', trigger: 'blur'},
                    {max: 5, min: 5, message: '验证码错误', trigger: 'blur'}
                ]
            }
        };
    },
    mounted() {
        document.addEventListener('keydown', this.login);
    },
    // 监听离开页面
    beforeRouteLeave(to, from, next) {
        document.removeEventListener('keydown', this.login);
        next();
    },
    // 监听组件销毁也可以
    // beforeDestroy() {
    //     console.log('de');
    // },
    methods: {
        resetUid() {
            if (this.captchaLoading) return;
            this.form.uuid = uuid();
            this.captchaLoading = true;
        },
        login() {
            this.$refs['form'].validate().then(valid => {
                if (valid && !this.loading) {
                    this.loading = true;
                    this
                        .$http
                        .post('/sys/login', this.form)
                        .then(({data}) => {
                            if (data.code === 500) {
                                this.$Notice.error({
                                    title: '错误',
                                    desc: data.msg
                                });
                            } else if (data.code === 0) {
                                localStorage.setItem('token', data.token);
                                this.$router.push('/admin');
                            }
                            this.loading = false;
                        });
                }
            });
        }
    }
};
</script>

<style lang="less">
.page-login {
    .content {
        background: rgba(38,50,56,.6);
    }
    .sider {
        background: #fff;
        border-left: 1px solid #ddd;
        .form {
            width: 80%;
            .captcha {
                .ivu-form-item-content {
                    display: flex;
                    justify-content: space-between;
                }
                .captcha-input {
                    width: 130px;
                }
                .captcha-img {
                    overflow: hidden;
                    position: relative;
                    height: 32px;
                    img {
                        height: 100%;
                    }
                }
            }
        }
    }
    .ivu-layout-sider-children {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>

