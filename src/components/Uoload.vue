<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'load', v: string ): void;
}
const emits = defineEmits<Emits>();

const reader = new FileReader()

reader.onload = (event) => {
  //console.log(event)
  //console.log(typeof event.target.result)
  emits('load', event.target.result)
}

const upload = (event) => {
  reader.readAsDataURL(event.target.files[0])
}
</script>

<template>
  <input type="file" accept=".vrm" @change="upload">
</template>

<style scoped lang="scss">
input {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>