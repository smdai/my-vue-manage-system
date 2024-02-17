<template>
  <div>
    <canvas ref="qrcode"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  value: {
    type: String,
    default: "https://baidu.com"
  },
  size: {
    type: Number,
    default: 300 // 默认大小为 300
  }
})

const qrcode = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  render()
})

// 监听 props.value 和 props.size 的变化
watch([() => props.value, () => props.size], () => {
  render()
})

const render = () => {
  // 非空检查
  if (qrcode.value) {
    const canvas = qrcode.value
    const context = canvas.getContext('2d')
    // 设置 canvas 大小

    // canvas.width = props.size
    // canvas.height = props.size
    // 非空检查
    if (context) {
      // 清空现有的二维码
      context.clearRect(0, 0, canvas.width, canvas.height)
      // 渲染新的二维码
      QRCode.toCanvas(canvas, props.value, {
        margin: 1,
        width: props.size,
        color: {
          dark: '#000000', // 黑色
          light: '#ffffff' // 白色
        }
      }, (error) => {
        if (error) {
          console.log(error)
        }
      })
    } else {
      console.error('Canvas context is null')
    }
  }
}
</script>
