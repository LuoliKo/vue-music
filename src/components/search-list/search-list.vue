<template>
  <scroll class="search-list"
          :data="data"
          :pullup="pullup"
          @scrollToEnd="loadMore"
          ref="scroll">
    <slot></slot>
    <loading class="loading" v-show="!data.length&&count">
      <span>正在加载...</span>
    </loading>
    <fail-png class="nothing" v-show="!count">
      <span>sorry！小的没有找到大人要的情报~</span>
    </fail-png>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import {playListMixin} from 'common/js/mixin';
  import FailPng from 'base/failpng/failpng';

  export default {
    mixins: [playListMixin],
    data () {
      return {
        pullup: true
      };
    },
    props: {
      data: {
        type: Array,
        default: function () {
          return [];
        }
      },
      count: {
        type: Number,
        default: 1
      }
    },
    created () {
      this.type = location.href.split('?')[0].split('/')[5];
    },
    methods: {
      scrollRefresh (playList) {
        const bottom = playList.length > 0 ? '55px' : '';
        this.$refs.scroll.$el.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      loadMore () {
        this.$emit('loadMore');
      },
      refresh () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
    components: {
      Scroll,
      Loading,
      FailPng
    }
  };
</script>

<style lang="stylus">
  .search-list
    position: absolute
    top: 36px
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    .nothing
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      display: block
      width: 40%
    .loading
      position: absolute
      top: 50%
      transform: translate(0, -50%)
</style>
