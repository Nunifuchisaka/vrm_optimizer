<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  vrm: object
}>()
const vrm = ref<object>(props.vrm);

watch(() => props.vrm, () => {
  console.log(props.vrm)
  vrm.value = props.vrm
});

</script>

<template>
  <div id="meta">
    <dl>
      <dt>title</dt><dd>{{ vrm.meta.title }}</dd>
      <dt>version</dt><dd>{{ vrm.meta.version }}</dd>
      <dt>materials</dt><dd>{{ vrm.materials.length }}</dd>
      <dt>joints</dt><dd>{{ vrm.springBoneManager._joints.size }}</dd>
      <dt>author</dt><dd>{{ vrm.meta.author }}</dd>
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