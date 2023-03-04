<template>
  <div class="Header">
    <slot></slot>
  </div>
</template>
  
<script>
export default {
  name: 'Header',
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Header {
  background-color: white;
  width: 100%;
  height: 50px;
  font-size: 20px;
  line-height: 50px;
  position: relative;
  text-align: center;
}


.title {
    width: 70%;
    margin: auto auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.left-icon {
    position: absolute;
    left: 5%;
    top: 35%;
    font-size: 16px;
}

.right-icon {
    position: absolute;
    right: 5%;
    top: 35%;
    font-size: 16px;
}
</style>
  