<script setup lang="ts">
import { ref, watch } from 'vue'
import Database from './components/Database.vue'
import Info from './components/Info.vue'
import Material from './components/Material.vue'
import Expression from './components/Expression.vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'

let vrm

const info = ref({
  title: '',
  version: 0,
  author: '',
  triangles: 0,
  materials: 0,
  textures: 0,
  joints: 0,
  size: new THREE.Vector3(),
})

const materials = ref({})
const expressions = ref({})

let _gltf
let renderInfo

const reset = () => {
  console.count('reset')
  if ( !vrm ) return;
  scene.remove(vrm.scene)
}

//シーン
const scene = new THREE.Scene()

//レンダラ
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  //alpha: true,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x000000)
document.body.appendChild(renderer.domElement)

//カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
)
camera.position.set(0,1,3)

//カメラコントーロール
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, .85, 0)
controls.screenSpacePanning = true
controls.update()

//ライト
const light = new THREE.DirectionalLight(0xffffff)
light.position.set(1,1,1).normalize()
light.target.position.set(0,0,-1)
scene.add(light)

//グリッドを表示
const gridHelper = new THREE.GridHelper(10, 10)
scene.add(gridHelper)
gridHelper.visible = true

//座標軸
const axesHelper = new THREE.AxesHelper(0.5)
scene.add(axesHelper)

//ローダ
const loader = new GLTFLoader()
loader.register((parser) => {
  return new VRMLoaderPlugin(parser)
})

const onLoad = (gltf) => {
  console.log(gltf)
  _gltf = gltf
  vrm = gltf.userData.vrm
  console.log(vrm)
  scene.add(vrm.scene)
  VRMUtils.rotateVRM0(vrm)
  
  console.group('expressionManager')
  console.log( vrm.expressionManager.expressionMap )
  console.groupEnd()
  //vrm.expressionManager.setValue('happy', 1.0)
  //vrm.expressionManager.update()
  
  vrm.humanoid.getNormalizedBoneNode('leftUpperArm').rotation.z = 1.1
  vrm.humanoid.getNormalizedBoneNode('rightUpperArm').rotation.z = -1.1
  vrm.humanoid.update()

  //vrm.lookAt.target = camera
  //vrm.lookAt.autoUpdate = true

  // バウンディングボックスの可視化
  const boxHelper = new THREE.BoxHelper(vrm.scene, 0xffff00)
  vrm.scene.add(boxHelper)

  const bBox = new THREE.Box3().setFromObject(vrm.scene)
  const bSize = bBox.max.sub(bBox.min)

  //Info
  renderInfo = getRenderInfo()
  info.value = {
    title: vrm.meta.title,
    version: vrm.meta.version,
    author: vrm.meta.author,
    triangles: renderInfo.render.triangles,
    materials: vrm.materials.length,
    textures: Object.keys(gltf.parser.textureCache).length,
    size: bSize,
    joints: vrm.springBoneManager._joints.size,
  }

  //Material
  materials.value = vrm.materials

  //Expression
  expressions.value = vrm.expressionManager.expressionMap
}

function load(model:string) {
  if ( vrm ) reset();
  console.group('Load VRM')
  console.log(model)
  console.groupEnd()
  loader.load(
    model, onLoad,
    (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
    (error) => console.error(error),
  )
}

const update = () => {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}

const getRenderInfo = () => {
  update()
  return (renderer.info)
}

update()


//Expressions
const currentEexpression = ref<string>('')

watch(currentEexpression, (next, prev) => {
  console.group('Watch Current Eexpression')
  console.log(next, prev)
  if ( '' != prev ) {
    vrm.expressionManager.setValue(prev, 0)
  }
  if ( '' != next ) {
    vrm.expressionManager.setValue(next, 1)
  }
  vrm.expressionManager.update()
  console.groupEnd()
})

const setExpression = (key:string) => {
  if ( currentEexpression.value === key ) {
    vrm.expressionManager.setValue(key, 0)
    vrm.expressionManager.update()
    currentEexpression.value = ''
  } else {
    currentEexpression.value = key
  }
}


//
let exportURL = ref('#')

const exporter = new GLTFExporter();
const exportVRM = () => {
  console.group('Export VRM')
  /*
  console.log(_gltf)
  const blob = new Blob([_gltf], { type: 'application/octet-stream' })
  console.log(blob)
  exportURL.value = URL.createObjectURL(blob)
  console.log(exportURL.value)
  */
  /*
  exporter.parse(
    _gltf,
    function ( gltf ) {
      console.log( gltf );
      var output = JSON.stringify( gltf, null, 2 );
      console.log( output );
      //downloadJSON( output, 'scene.gltf' );
    },
    function ( error ) {
      console.log( 'An error happened' );
    },
    {
      //binary: true,
      //maxTextureSize: 2048,
    }
  )
  */
  console.groupEnd()
}
</script>

<template>
  <Info :info="info" />
  <Database @load="load" />
  <Material :materials="materials" />
  <Expression :expressions="expressions" @setExpression="setExpression" />
  <button @click="exportVRM">Export</button>
  <a :href="exportURL" download>Export</a>
</template>

<style lang="scss">
body, p, ul, ol, dl { margin: 0 }

body {
  line-height: 1.4;
}

.button_1 {
  display: inline-block;
  appearance: none;
  padding: .4em .8em;
  font-size: .8rem;
  font-weight: normal;
  background: #fff;
  border: solid 1px #ccc;
  border-radius: .5em;
  vertical-align: middle;
  cursor: pointer;
}
</style>