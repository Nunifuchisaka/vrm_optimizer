<script setup lang="ts">
//import { ref } from 'vue'

interface Emits {
  (e: 'load', v: string ): void;
  (e: 'exportVRM', v: string ): void;
}
const emits = defineEmits<Emits>();

//
const version = 1;
const dbName = 'VRMDatabase';
const storeName = 'model';

const initDB = () => {
  const request = window.indexedDB.open(dbName, version);

  request.onupgradeneeded = (event) => {
    console.log('DB create/update');
    const target = event.target as IDBOpenDBRequest;
    const idbDB = target.result;

    if (event.oldVersion < 1) {
        idbDB.createObjectStore(storeName, { keyPath: 'name' })
    }
    idbDB.close();
  }
}

const saveModel = (model: Blob) => {
  const request = window.indexedDB.open(dbName, version)
  request.onsuccess = function (event) {
    const target = event.target as IDBOpenDBRequest
    const idbDB = target.result

    const transaction = idbDB.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)

    const putRequest = store.put({
      'model': model,
      'name': 'ONE_MODEL_ONLY'
    })

    putRequest.onsuccess = () => {
      console.log('db:put success')
      idbDB.close()
    }

    putRequest.onerror = () => {
      console.log('db:put error')
    }
  }
}

const loadModel = (onLoad: (blob: Blob) => void): void => {
  const request = window.indexedDB.open(dbName, version)
  request.onsuccess = function (event) {
    const target = event.target as IDBOpenDBRequest
    const idbDB = target.result
    const transaction = idbDB.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const getRequest = store.get('ONE_MODEL_ONLY')

    getRequest.onsuccess = (event) => {
        const target = event.target as IDBRequest
        if (!target.result) return

        const model = target.result.model
        if (!model) return

        onLoad(model)
        idbDB.close()
    }

    getRequest.onerror = () => {
      console.log('db:load error')
    }
  }
}

const deleteDB = () => {
  const deleteRequest = window.indexedDB.deleteDatabase(dbName);
}

initDB()

const change = (event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return
  const file = files[0]
  console.log(file)
  if (!file) return
  const blob = new Blob([file], { type: 'application/octet-stream' })
  saveModel(blob)
  emits('load', URL.createObjectURL(blob))
}

loadModel(
  (blob) => {
    emits('load', URL.createObjectURL(blob))
  }
)

const exportVRM = () => {
  emits('exportVRM', '')
}
</script>

<template>
  <div>
    <table>
      <tr>
        <th>Import</th>
        <td><input type="file" accept=".vrm" @change="change"></td>
      </tr>
      <tr>
        <th>Export</th>
        <td>
          <button @click="exportVRM">Export</button>
          <!-- <a download>Export</a> -->
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">
div {
  // position: absolute;
  // top: 10px;
  // right: 10px;
  // padding: 1em;
  // background-color: #fff;
  margin-top: 1em;
  padding: 0 1em;
}
table {
  th {
    width: 0;
    padding-right: 1em;
    white-space: nowrap;
  }
}
</style>