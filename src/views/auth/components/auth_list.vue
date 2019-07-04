<template>
  <div>
    <h1>{{ form.title }}</h1>
    <Button type="button" @click="handleRefresh">刷新</Button>
    <Table :columns="form.cols" :data="form.rows" size="small" />
  </div>
</template>

<script>
export default {
  name: 'AuthForm',
  props: {
    form: {
      default() {
        return {
          title: 'auth list',
          cols: [],
          rows: []
        }
      },
      type: Object
    }
  },
  mounted() {
    this.handleRefresh()
  },
  methods: {
    handleRefresh() {
      this.$emit('on-refresh')
    }
  }
}
</script>

<style>
</style>
