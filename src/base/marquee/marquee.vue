<template>
  <div class="v-marquee" ref="marquee">
    <slot></slot>
  </div>
</template>

<script>
  import {prefixStyle} from 'common/js/dom';

  const transform = prefixStyle('transform');

  export default {
    mounted () {
      this.timer = null;
      this.refresh();
    },
    methods: {
      refresh () {
        this.$nextTick(() => {
          clearInterval(this.timer);
          const marquee = this.$refs.marquee;
          const marqueeWidth = marquee.clientWidth;
          const childWidth = marquee.children[0].clientWidth;
          if (marqueeWidth < childWidth) {
            const dis = marqueeWidth;
            const final = childWidth;
            this._run(marquee.children[0], dis, final);
          } else {
            marquee.children[0].style[transform] = `translateX(0px)`;
          }
        });
      },
      _run (el, dis, final) {
        let s = dis;
        this.timer = setInterval(() => {
          if (-s === final) {
            s = dis;
          }
          el.style[transform] = `translateX(${s}px)`;
          s--;
        }, 20);
      }
    }
  };
</script>

<style lang="stylus">
  .v-marquee
    text-align: center
    overflow: hidden
</style>
