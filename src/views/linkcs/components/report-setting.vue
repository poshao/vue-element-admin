<template>
  <div>
    <el-row>
      <el-col span="16">
        <div style="width:340px">
          <el-input v-model="currentTemplate" placeholder="请输入模板名称" />
          <el-button type="primary" long @click="handleSave">保存</el-button>
        </div>
        <el-transfer
          :list-style="{height:'420px',width:'340px'}"
          :data="srcKeys"
          :target-keys="selectKeys"
          :titles="['可选字段','输出字段']"
          filterable
          @on-change="handleTransChange"
        >
          <el-button type="default" small long @click="handleRefresh">刷新</el-button>
        </el-transfer>
      </el-col>
      <el-col span="8">
        <ul>
          <li v-for="v in templates" :key="v">
            <a href="javascript:void(0)" @click="handleLoadStruct(v)">{{ v.name }}</a>
            <a
              href="javascript:void(0)"
              style="padding-left:30px;color:red;"
              @click="handleDeleteStruct(v.name)"
            >删除</a>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { clone } from '@/utils/common'
import {
  getFieldsFromViewStruct,
  updateReportStruct,
  listReportStructs,
  deleteReportStruct
} from '../../../api/linkcs'
export default {
  name: 'ReportSetting',
  data() {
    return {
      // 穿梭框参数
      srcKeys: [],
      selectKeys: [],
      // 模板列表
      templates: [],
      // 选中项
      currentTemplate: '',
      showRename: false
    }
  },
  mounted() {
    this.handleRefresh()
  },
  methods: {
    // 加载模板
    handleLoadStruct(template) {
      this.currentTemplate = template.name
      this.$set(this, 'selectKeys', JSON.parse(template.struct))
      // this.selectKeys = JSON.parse(template.struct)
      // console.log(struct)
      // this.selectKeys = struct
    },
    // 删除模板
    handleDeleteStruct(name) {
      deleteReportStruct(name).then(res => {
        this.handleRefresh()
      })
    },
    // 保存模板
    handleSave() {
      if (this.currentTemplate === '') {
        this.$Message.error('请输入名称')
        return
      }
      updateReportStruct(this.currentTemplate, this.selectKeys).then(res => {
        if (res.data.result === 'ok') {
          this.$Message.info('保存成功')
          this.handleRefresh()
        }
      })

      // this.handleRefresh()
      // this.currentTemplate = ''

      // console.log('save result')
      // console.log('name' + this.currentTemplate)
      // console.log(this.selectKeys)
    },
    // 刷新列表
    handleRefresh() {
      this.srcKeys = []
      var columns = []
      getFieldsFromViewStruct(clone(this.$store.getters.baseForm), columns)
      for (var key in columns) {
        this.srcKeys.push({ key: key, label: columns[key] + '(' + key + ')' })
      }
      this.$set(this, 'selectKeys', [])

      // 加载报表列表
      listReportStructs().then(res => {
        console.log(res)
        const rs = res.data.result
        var list = []
        for (var k in rs) {
          list.push(rs[k])
        }
        // console.log(list)
        this.$set(this, 'templates', list)
      })
      this.currentTemplate = ''
    },
    // 列变更
    handleTransChange(newTargetKeys, direction, moveKeys) {
      console.log(newTargetKeys)
      console.log(direction)
      console.log(moveKeys)
      this.selectKeys = newTargetKeys
    }
  }
}
</script>
