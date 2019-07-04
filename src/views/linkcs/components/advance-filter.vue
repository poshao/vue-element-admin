<template>
  <div>
    <p>高级筛选</p>
    <el-row v-for="item in filters" :key="item" class="row">
      <el-col :span="2">
        <el-button type="error" size="small" @click="handleRemoveFilter(item)">移除</el-button>
      </el-col>
      <el-col :span="8" class="filterItem">
        <b>{{ item.field }}</b>
        {{ item.operator }}
        <span style="color:blue">{{ item.value }}</span>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="6">
        <el-select v-model="currentFilter.field" style="width:100%">
          <el-option v-for="(v,k) in fields" :key="k" :value="k" :label="v">{{ v }}</el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="currentFilter.operator">
          <el-option v-for="operator in operators" :key="operator" :value="operator">{{ operator }}</el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input v-model="currentFilter.value" placeholder />
      </el-col>
      <el-col :span="6">
        <el-button type="info" @click="handleAddFilter">添加</el-button>
      </el-col>
    </el-row>

    <el-button type="success" class="button" @click="handleFilter">筛选</el-button>
    <el-button
      type="default"
      class="button"
      @click="handleReset"
    >重置</el-button>
  </div>
</template>

<script>
import { getFieldsFromViewStruct } from '@/api/linkcs'
import { deepClone } from '@/utils/index'

export default {
  name: 'AdvanceFilter',
  data() {
    return {
      // 筛选条件
      filters: [],
      // 可选字段
      fields: {},
      // 可选操作符
      operators: ['>', '>=', '=', '<', '<=', 'like'],
      // 当前值
      currentFilter: {
        field: '',
        operator: '',
        value: ''
      }
    }
  },
  mounted() {
    this.loadFields()
  },
  methods: {
    loadFields() {
      this.fields = {}
      getFieldsFromViewStruct(deepClone(this.$store.getters.baseForm), this.fields)
      // console.log(this.fields)
    },
    // 添加条件
    handleAddFilter() {
      this.filters.push({
        field: this.currentFilter.field,
        operator: this.currentFilter.operator,
        value: this.currentFilter.value
      })
      this.currentFilter.field = ''
      this.currentFilter.operator = ''
      this.currentFilter.value = ''
    },
    // 移除条件
    handleRemoveFilter(item) {
      this.filters.splice(this.filters.indexOf(item), 1)
    },
    // 重置筛选
    handleReset() {
      this.filters = []
    },
    // 处理筛选动作
    handleFilter() {
      this.$emit('on-filter', this.filters)
    }
  }
}
</script>
<style scoped>
.button {
  width: 120px;
  margin-right: 3px;
  margin-top: 3px;
  margin-bottom: 5px;
}
.row {
  margin-top: 3px;
}
.filterItem {
  /* border: 1px solid lightgray; */
  background-color: white;
  font-size: 14px;
  line-height: 22px;
}
</style>
