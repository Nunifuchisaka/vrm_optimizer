<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  info: object
}>()
const info = ref<object>(props.info);

watch(() => props.info, () => {
  console.log(props.info)
  info.value = props.info
});

</script>

<template>
  <div id="meta">
    <dl>
      <dt>title</dt><dd>{{ info.title }}</dd>
      <dt>version</dt><dd>{{ info.version }}</dd>
      <dt>triangles</dt><dd>{{ info.triangles }}</dd>
      <dt>materials</dt><dd>{{ info.materials }}</dd>
      <dt>joints</dt><dd>{{ info.joints }}</dd>
      <dt>height</dt><dd>{{ Math.round(info.height*100)/100 }}m</dd>
      <dt>author</dt><dd>{{ info.author }}</dd>
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