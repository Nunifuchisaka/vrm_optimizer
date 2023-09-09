<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const version = ref(0)
const author = ref('')
</script>

<template>
  <div id="meta">
    <dl>
      <dt>title</dt><dd>{{ title }}</dd>
      <dt>version</dt><dd>{{ version }}</dd>
      <dt>author</dt><dd>{{ author }}</dd>
    </dl>
  </div>
</template>

<style lang="scss">
#meta {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 1em;
  background: rgba(255,255,255,.8);
  dl {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>