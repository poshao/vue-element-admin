<template>
  <div class="table-filter">
    <!-- 编辑筛选条件 -->
    <el-select v-model="activeFilter" allow-create filterable placeholder="请选择筛选类别" clearable style="width:10rem">
      <i slot="prefix" class="el-input__icon" style="display:inline-block;text-align:center;"><svg-icon icon-class="filter" /></i>
      <el-option v-for="(v,k,i) in filters" :key="i" :value="k" :label="v.title">
        <span>{{ v.title }} </span>
        <span style="float:right">
          <svg-icon v-if="!v.fixed" icon-class="edit-square" @click.stop="handleEdit(k)" />
          <svg-icon v-if="!v.fixed" icon-class="close-circle" type="danger" @click.stop="handleDelete(k)" />
        </span>
      </el-option>
    </el-select>

    <!-- 筛选面板 -->
    <el-dialog :visible.sync="filterEditor.visible" width="40rem" top="10vh" :close-on-click-modal="false">
      <div slot="title">
        筛选条件设置({{ filterEditor.selectFilter }})
        <el-button type="primary" style="margin-left:3rem;" @click="handleSubmit">确定</el-button>
      </div>
      <el-form label-width="10em" class="filter-editor">
        <MControl :ele="filterEditor.condition" />
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import { objectMerge } from '@/utils/index'
import { getStoreData, fillFilterData } from '@/utils/linkcs'

export default {
  components: {
    'MControl': () => import('./mcontrol')
  },
  data() {
    return {
      // 筛选条件列表
      filters: {
        'myrequest': {
          title: '我的订单',
          fixed: true,
          condition: {
            creator: {
              key: 'creator',
              op: '=',
              val: this.$store.state.user.workid
            }
          }
        },
        'myrecv': {
          title: '我的受理',
          fixed: true,
          condition: {
            assign: {
              key: 'assign',
              op: '=',
              val: this.$store.state.user.workid
            }
          }
        }
      },

      // 当前筛选条件
      activeFilter: '',

      // 筛选面板参数
      filterEditor: {
        visible: false,
        selectFilter: '',
        condition: {
          filter: true,
          control: {
            type: 'layout',
            children: {
              'layout': this.$store.getters['linkcs/baseForm']
            }
          }
        }
      }
    }
  },
  watch: {
    activeFilter(v, ov) {
      // console.log('activeFilter changed ' + v)

      if (v === '') {
        this.$emit('change', null)
      } else if (this.filters.hasOwnProperty(v)) {
        // 显示已存储的筛选条件
        this.$emit('change', this.filters[v])
      } else {
        // 添加新的筛选条件
        this.filterEditor.selectFilter = v
        this.filters[v] = {
          title: v,
          condition: {
            filter: true,
            control: {
              type: 'layout',
              children: {
                'layout': this.$store.getters['linkcs/baseForm']
              }
            }
          }
        }
        this.activeFilter = v
        this.$set(this.filterEditor, 'condition', this.filters[v].condition)
        this.filterEditor.visible = true
      }
    }
  },
  mounted() {
    this.loadFilters()
  },
  methods: {
    saveFilters() {
      const filters = cloneDeep(this.filters)
      delete filters.myrecv
      delete filters.myrequest
      // console.log(filters)
      localStorage.setItem('linkcs_filters', JSON.stringify(filters))
    },
    loadFilters() {
      let filters = this.filters
      filters = objectMerge(filters, JSON.parse(localStorage.getItem('linkcs_filters')))
      this.$set(this, 'filters', filters)
    },

    handleEdit(k) {
      // 还原筛选条件结构
      this.filterEditor.selectFilter = k

      var node = {
        filter: true,
        control: {
          type: 'layout',
          children: {
            'layout': this.$store.getters['linkcs/baseForm']
          }
        }
      }
      const condition = fillFilterData(node, this.filters[k].condition)
      this.$set(this.filterEditor, 'condition', condition)

      this.filterEditor.visible = true
    },
    handleDelete(k) {
      delete this.filters[k]
      if (this.activeFilter === k) {
        this.activeFilter = ''
      }
      this.saveFilters()
      this.$forceUpdate()
    },
    handleSubmit() {
      this.filters[this.filterEditor.selectFilter].condition = getStoreData(this.filterEditor.condition.children)
      this.saveFilters()
      // 刷新筛选
      if (this.activeFilter === this.filterEditor.selectFilter) {
        this.$emit('change', this.filters[this.activeFilter])
      }
      this.filterEditor.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-filter{
    display: inline-block;
  }
  .filter-editor{
    height: 30rem;
    overflow-y: scroll;
  }
</style>
