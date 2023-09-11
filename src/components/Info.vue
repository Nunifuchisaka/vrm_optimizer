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
    <table>
      <tr>
        <th>title</th>
        <td>{{ info.title }}</td>
      </tr>
      <tr>
        <th>version</th>
        <td>{{ info.version }}</td>
      </tr>
      <tr>
        <th>triangles</th>
        <td>{{ info.triangles.toLocaleString() }}</td>
      </tr>
      <tr>
        <th>materials</th>
        <td>{{ info.materials }}</td>
      </tr>
      <tr>
        <th>textures</th>
        <td>{{ info.textures }}</td>
      </tr>
      <tr>
        <th>joints</th>
        <td>{{ info.joints }}</td>
      </tr>
      <tr>
        <th>size</th>
        <td>
          <table>
            <tr>
              <th>x</th>
              <td>{{ Math.round(info.size.x*10000)/100 }}cm</td>
            </tr>
            <tr>
              <th>y</th>
              <td>{{ Math.round(info.size.y*10000)/100 }}cm</td>
            </tr>
            <tr>
              <th>x</th>
              <td>{{ Math.round(info.size.z*10000)/100 }}cm</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <th>author</th>
        <td>{{ info.author }}</td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss">
#meta {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 1em;
  background: rgba(255,255,255,.8);
  table {
    text-align: left;
  }
  th, td {
    vertical-align: top;
  }
  th {
    width: 0;
    padding-right: 1em;
    white-space: nowrap;
  }
}
</style>