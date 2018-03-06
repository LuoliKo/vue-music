<template>
  <div id="progress" ref="progress" @click="clickProgress">
    <span class="loading" v-show="loading">缓冲中...</span>
    <span class="time left">{{formatCurrentTime}}</span>
    <span class="time right">{{formatDurationTime}}</span>
    <div class="progress-background">
      <div class="progress-bar" ref="progressBar">
        <i class="dot" ref="dot"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      currentTime: 0,
      durationTime: 0,
      percent: 0,
      loading: false
    },
    computed: {
      formatCurrentTime () {
        let s = Math.floor(this.currentTime);
        let mm = Math.floor(s / 60);
        let ss = s % 60;
        if (ss < 10) {
          ss = '0' + ss;
        }
        let time = mm + ':' + ss;
        return time;
      },
      formatDurationTime () {
        let s = Math.floor(this.durationTime / 1000);
        let mm = Math.floor(s / 60);
        let ss = s % 60;
        if (ss < 10) {
          ss = '0' + ss;
        }
        let time = mm + ':' + ss;
        return time;
      }
    },
    created () {
      this.touch = {};
    },
    mounted () {
      let progressWidth = this.$refs.progress.clientWidth;
      this.$refs.progressBar.style.width = this.percent * (progressWidth - 15) + 'px';
    },
    methods: {
      clickProgress (e) {
        const rect = this.$refs.progress.getBoundingClientRect();
        const pos = e.pageX - rect.left;
        if (pos < 0) {
          return;
        }
        this._changeProgressWidth(pos);
        this._changePercent();
      },
      progressTouchStart (e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progressBar.clientWidth;
        this.touch.progressWidth = this.$refs.progress.clientWidth - 15;
      },
      progressTouchMove (e) {
        if (!this.touch.initiated) {
          return;
        }
        const deltaX = e.touches[0].pageX - this.touch.startX;
        let barWidth = this.touch.left + deltaX;
        if (barWidth < 0) {
          barWidth = 0;
        } else if (barWidth > this.touch.progressWidth) {
          barWidth = this.touch.progressWidth;
        }
        this._changeProgressWidth(barWidth);
      },
      progressTouchEnd () {
        this.touch.initiated = false;
        this._changePercent();
      },
      _changePercent () {
        const barWidth = this.$refs.progressBar.clientWidth;
        const percent = barWidth / (this.$refs.progress.clientWidth - 15);
        this.$emit('percentChange', percent);
      },
      _changeProgressWidth (width) {
        this.$refs.progressBar.style.width = width + 'px';
      }
    },
    watch: {
      percent (newVal) {
        if (newVal >= 0 && !this.touch.initiated) {
          let progressWidth = this.$refs.progress.clientWidth;
          this.$refs.progressBar.style.width = newVal * (progressWidth - 15) + 'px';
        }
      }
    }
  };
</script>

<style lang="stylus">
  @import "~common/stylus/variable"

  #progress
    position: absolute
    left: 50%
    bottom: 80px
    transform: translate(-50%, 0)
    width: 70%
    height: 20px
    .loading
      position: absolute
      top: -20px
      left: 50%
      transform: translate(-50%, 0)
      font-size: $font-size-small
      color: rgba(255, 255, 255, .6)
    .time
      position: absolute
      top: 50%
      color: #fff
      font-size: $font-size-small
      &.left
        left: 0
        transform: translate(-120%, -50%)
      &.right
        right: 0
        transform: translate(120%, -50%)
    .progress-background
      position: absolute
      top: 50%
      transform: translate(0, -50%)
      width: 100%
      height: 3px
      background: rgba(0, 0, 0, .5)
      .progress-bar
        position: absolute
        top: 0
        left: 0
        width: 0
        height: 3px
        background: $color-theme
        .dot
          position: absolute
          top: 50%
          right: -15px
          transform: translate(0, -50%)
          display: block
          width: 15px
          height: 15px
          border-radius: 50%
          background: #fff
</style>
