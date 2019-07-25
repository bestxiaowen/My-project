<template>
    <Layout class="admin-child-syspage oss-list">
        <header>
            <Button
                type="primary"
                style="margin-right: 10px"
                @click="configModalState = true"
            >
                云存储配置
            </Button>
            <Button
                @click="uploadModalState = true"
                type="success"
            >
                上传文件
            </Button>
        </header>
        <div class="data">
            <Table
                size="small"
                :data="data"
                :columns="columns"
                :loading="loading"
            />
        </div>
        <div class="pager">
            <Button type="error">批量删除</Button>
            <Page
                :current.sync="current"
                :total="totalCount"
                :page-size="limit"
                @on-page-size-change="(size) => limit = size"
                :page-size-opts="[5, 10]"
                show-sizer
            />
        </div>
        <Modal
            v-model="configModalState"
            title="云存储配置"
            @on-ok="handlerSaveConfig"
            @on-cancel="handlerCancelConfig"
        >
             <Tabs v-model="configForm.type">
                <TabPane label="七牛" name="1">
                    <Form
                        :label-width="80"
                    >
                        <FormItem
                            label="域名"
                        >
                            <Input
                                placeholder="七牛的绑定域名"
                                v-model="configForm.qiniuDomain"
                            />
                        </FormItem>
                        <FormItem
                            label="路径前缀"
                        >
                            <Input
                                placeholder="不设置默认为空"
                                v-model="configForm.qiniuPrefix"
                            />
                        </FormItem>
                        <FormItem
                            label="AccessKey"
                        >
                            <Input
                                placeholder="七牛的AccessKey"
                                v-model="configForm.qiniuAccessKey"
                            />
                        </FormItem>
                        <FormItem
                            label="SecretKey"
                        >
                            <Input
                                placeholder="七牛的SecretKey"
                                v-model="configForm.qiniuSecretKey"
                            />
                        </FormItem>
                        <FormItem
                            label="空间名"
                        >
                            <Input
                                placeholder="七牛的空间名"
                                v-model="configForm.qiniuBucketName"
                            />
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="阿里" name="2">
                    <Form
                        :label-width="80"
                    >
                        <FormItem
                            label="域名"
                        >
                            <Input
                                placeholder="阿里云的绑定域名"
                                v-model="configForm.aliyunDomain"
                            />
                        </FormItem>
                        <FormItem
                            label="路径前缀"
                        >
                            <Input
                                placeholder="不设置默认为空"
                                v-model="configForm.aliyunPrefix"
                            />
                        </FormItem>
                        <FormItem
                            label="EndPoint"
                        >
                            <Input
                                placeholder="阿里云的EndPoint"
                                v-model="configForm.aliyunEndPoint"
                            />
                        </FormItem>
                        <FormItem
                            label="AccessKeyId"
                        >
                            <Input
                                placeholder="阿里云的AccessKeyId"
                                v-model="configForm.aliyunAccessKeyId"
                            />
                        </FormItem>
                        <FormItem
                            label="AccessKeySecret"
                        >
                            <Input
                                placeholder="阿里云的AccessKeySecret"
                                v-model="configForm.aliyunAccessKeySecret"
                            />
                        </FormItem>
                        <FormItem
                            label="BucketName"
                        >
                            <Input
                                placeholder="阿里云的BucketName"
                                v-model="configForm.aliyunBucketName"
                            />
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="腾讯" name="3">
                    <Form
                        :label-width="80"
                    >
                        <FormItem
                            label="域名"
                        >
                            <Input
                                placeholder="腾讯云的绑定域名"
                                v-model="configForm.qcloudDomain"
                            />
                        </FormItem>
                        <FormItem
                            label="路径前缀"
                        >
                            <Input
                                placeholder="不设置默认为空"
                                v-model="configForm.qcloudPrefix"
                            />
                        </FormItem>
                        <FormItem
                            label="AppId"
                        >
                            <Input
                                placeholder="腾讯云的AppId"
                                v-model="configForm.qcloudAppId"
                            />
                        </FormItem>
                        <FormItem
                            label="SecretId"
                        >
                            <Input
                                placeholder="腾讯云的SecretId"
                                v-model="configForm.qcloudSecretId"
                            />
                        </FormItem>
                        <FormItem
                            label="SecretKey"
                        >
                            <Input
                                placeholder="腾讯云的SecretKey"
                                v-model="configForm.qcloudSecretKey"
                            />
                        </FormItem>
                        <FormItem
                            label="BucketName"
                        >
                            <Input
                                placeholder="腾讯云的BucketName"
                                v-model="configForm.qcloudBucketName"
                            />
                        </FormItem>
                        <FormItem
                            label="所属地区"
                        >
                            <Input
                                placeholder="如：sh（可选值 ，华南：gz 华北：tj 华东：sh）"
                                v-model="configForm.qcloudRegion"
                            />
                        </FormItem>
                    </Form>
                </TabPane>
            </Tabs>
        </Modal>

        <Modal
            v-model="uploadModalState"
            title="上传文件"
            ok-text="关闭"
            cancel-text="取消"
            @on-ok="$refs['upload'].clearFiles()"
        >
            <Upload
                multiple
                type="drag"
                ref="upload"
                :headers="{
                    token: getToken()
                }"
                action="/proxyApi/sys/oss/upload"
                :on-success="handlerSuccess"
                :on-error="handlerError"
            >
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>Click or drag files here to upload</p>
                </div>
            </Upload>
        </Modal>
    </Layout>
</template>

<script>
import http from '@/utils/http';
export default {
    data() {
        return {
            // 表体数据
            data: [],
            // 表头数据
            columns: [
                {
                    type: 'selection',
                    width: 50
                },
                {
                    title: 'ID',
                    align: 'center',
                    key: 'id'
                },
                {
                    title: 'URL',
                    align: 'center',
                    key: 'url',
                    tooltip: true
                },
                {
                    title: '创建时间',
                    align: 'center',
                    key: 'createDate'
                },
                {
                    title: '操作',
                    align: 'center'
                }
            ],
            // 当前页码
            current: 1,
            // 条数限制
            limit: 10,
            // 排序Id
            sidx: 'id',
            // 排序方式
            order: 'desc',
            // 数据总条数
            totalCount: 1,
            // 配置模态框的显示状态
            configModalState: false,
            // 上传模态框的显示状态
            uploadModalState: false,
            // 配置的表单
            configForm: {
                type: '0',
                qiniuDomain: '',
                qiniuPrefix: '',
                qiniuAccessKey: '',
                qiniuSecretKey: '',
                qiniuBucketName: '',
                aliyunDomain: '',
                aliyunPrefix: '',
                aliyunEndPoint: '',
                aliyunAccessKeyId: '',
                aliyunAccessKeySecret: '',
                aliyunBucketName: '',
                qcloudDomain: '',
                qcloudPrefix: '',
                qcloudAppId: '',
                qcloudSecretId: '',
                qcloudSecretKey: '',
                qcloudBucketName: '',
                qcloudRegion: ''
            },
            // 表格数据的加载状态
            loading: false
        };
    },
    watch: {
        current() {
            this.loading = true;
            this.getFileList();
        },
        limit() {
            this.loading = true;
            this.getFileList();
        }
    },
    created() {
        this.loading = true;
        this.getFileList();
        this.getConfig();
    },
    methods: {
        handlerSaveConfig() {
            const data = JSON.parse(JSON.stringify(this.configForm));
            data.type = Number(data.type);
            http.post('/sys/oss/saveConfig', data).then(({data}) => {
                const { code, msg } = data;
                if (code === 0) {
                    this.$Notice.success({
                        title: '操作成功',
                        desc: '云存储配置设置成功'
                    });
                } else {
                    this.$Message.error(msg);
                }
            });
        },
        handlerCancelConfig() {
            this.getConfig();
        },
        getFileList() {
            const { current, limit } = this;
            http.get('/sys/oss/list', {
                params: {
                    page: current,
                    limit: limit
                }
            }).then(({data}) => {
                const { code, msg, page } = data;
                if (code === 0) {
                    const { currPage, totalCount, list } = page;
                    this.data = list;
                    this.current = currPage;
                    this.totalCount = totalCount;
                } else {
                    this.$Message.error(msg);
                }
                this.loading = false;
            });
        },
        getConfig() {
            http.get('/sys/oss/config').then(({ data }) => {
                const { code, config, msg } = data;
                if (code === 0) {
                    config.type = String(config.type);
                    this.configForm = config;
                } else {
                    this.$Message.error(msg);
                }
            });
        },
        handlerSuccess(response, file, fileList) {
            console.log(response);
            this.getFileList();
        },
        handlerError(error, file, fileList) {
            console.log(error);
        },
        getToken() {
            return localStorage.getItem('token');
        }
    }
};
</script>

<style lang="less">
.oss-list {
    width: 100%;
    height: 100%;
    overflow: hidden;
    header {
        margin-bottom: 20px;
    }
    .pager {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
    .data {
        position: relative;
    }
}
</style>
