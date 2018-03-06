<template>
  <div class="disc" ref="disc">
    <div>
      <v-nav></v-nav>
      <keep-alive>
        <router-view @showInfo="showInfo"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import Nav from 'components/nav/nav';

  export default {
    components: {
      'v-nav': Nav
    },
    methods: {
      showInfo () {
        this.$emit('showInfo');
      }
    }
  };
</script>

<style lang="stylus">
  @import '~common/stylus/variable.styl'

  .disc
    position: absolute
    top: 55px
    bottom: 0
    left: 0
    right: 0
    overflow: hidden
</style>
