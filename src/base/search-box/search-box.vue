<template>
  <div>
    <div class="search-component">
      <input ref="input" class="input-box" v-model="queryText" type="text" :placeholder="placeholder"/>
      <i v-show="queryText" @click="setQueryEmpty" class="close-icon iconfont icon-guanbi"></i>
    </div>
  </div>
</template>

<script>
  import {debounce} from 'common/js/util';

  export default {
    props: {
      placeholder: {
        type: String,
        default: '关键字搜索歌曲'
      }
    },
    data () {
      return {
        queryText: ''
      };
    },
    created () {
      this.$watch('queryText', debounce((newVal) => {
        this.$emit('queryContent', newVal);
      }, 200));
    },
    activated () {
      this.focus();
      this.setQueryEmpty();
    },
    methods: {
      setQueryText (queryText) {
        this.queryText = queryText;
      },
      focus () {
        this.$refs.input.focus();
      },
      setQueryEmpty () {
        this.queryText = '';
        this.$router.replace('/search');
      },
      blur () {
        this.$refs.input.blur();
      }
    }
  };
</script>

<style lang="stylus">
  .search-component
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
    width: 90%
    height: 36px
    border-radius: 18px
    background: #dd5e5a
    .input-box
      display: block
      width: 100%
      height: 100%
      padding: 0 20px 0 10px
      box-sizing: border-box
      background: transparent
      color: #fff
      outline: none
      &::-webkit-input-placeholder
        color: rgba(255, 255, 255, .7)
      &:-moz-placeholder
        color: rgba(255, 255, 255, .7)
      &::-moz-placeholder
        color: rgba(255, 255, 255, .7)
      &:-ms-input-placeholder
        color: rgba(255, 255, 255, .7)
    .close-icon
      position: absolute
      right: 5px
      top: 50%
      transform: translate(0, -50%)
      padding: 3px
      color: #fff
      border-radius: 50%
      &.iconfont
        font-size: 13px
</style>
