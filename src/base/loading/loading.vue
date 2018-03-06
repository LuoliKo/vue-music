<template>
  <div id="loading">
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="stylus">
  #loading
    display: block
    width: 100%
    text-align: center
    ul
      height: 15px
      padding-bottom: 5px
      li
        display: inline-block
        width: 5px
        height: 10px
        vertical-align: bottom
        background: #dd1418
        transform-origin: bottom
        animation-name: bar
        animation-duration: .3s
        animation-direction: alternate
        animation-iteration-count: infinite
        &:nth-child(1)
          animation-delay: 0
        &:nth-child(2)
          animation-delay: .1s
        &:nth-child(3)
          animation-delay: .2s
        &:nth-child(4)
          animation-delay: .3s
        &:nth-child(5)
          animation-delay: .4s

  @keyframes bar
    from
      height: 10px
    to
      height: 15px
</style>
