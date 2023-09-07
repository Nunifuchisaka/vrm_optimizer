import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin } from '@pixiv/three-vrm'

let vrm

const scene = new THREE.Scene()

//レンダラ
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  //alpha: true,
})
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
scene.add(light)

//グリッドを表示
const gridHelper = new THREE.GridHelper(10, 10)
scene.add(gridHelper)
gridHelper.visible = true

//座標軸
const axesHelper = new THREE.AxesHelper(0.5)
scene.add(axesHelper)

//
function VRMUploader() {
  let reader

  function onChange(event) {
    reader.readAsDataURL(event.target.files[0])
  }

  function onLoad(event) {
    reset()
    load(event.target.result)
  }

  reader = new FileReader()
  reader.onload = onLoad

  document.getElementById('inputFile').addEventListener('change', onChange)
}

VRMUploader()

//ローダ
const loader = new GLTFLoader()

loader.register((parser) => {
  return new VRMLoaderPlugin(parser)
})

//load( '/AliciaSolid.vrm' )

function load(model) {
  loader.load(
    model,
    (gltf) => {
      vrm = gltf.userData.vrm
      scene.add(vrm.scene)
      vrm.scene.rotation.y = Math.PI
    },
    (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
    (error) => console.error(error),
  )
}

function reset() {
  if ( !vrm ) return;
  scene.remove(vrm.scene)
}

const tick = () => {
  requestAnimationFrame(tick)
  renderer.render(scene, camera)
}
tick()
