<template>
  <div class="waterfallContainer">
    <div class="card" v-for="item in list" :key="item.id">
      <img :src="item.img" alt="">
      <div class="footer">
        <div class="title">{{ item.title }}</div>
        <div class="subtitle">
          <div class="left">
            <img :src="item.avatar" alt=""><span>{{ item.name }}</span>
          </div>
          <div class="right">
            <img :src="like" alt="">{{ item.like }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import like from '@/assets/爱心.svg'
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

const props = defineProps({
  list: { type: Array, required: true }
})

let masonry = null

// 销毁实例
function destroyMasonry() {
  if (masonry) {
    masonry.destroy()
    masonry = null
  }
}

// 初始化
function initMasonry() {
  const container = document.querySelector('.waterfallContainer');
  if (!container) return
  masonry = new Masonry(container, {
    itemSelector: '.card',
    columnWidth: 238,
    gutter: 35,
    fitWidth: true,
    transitionDuration: 0,
  });
  imagesLoaded(container, () => {
    masonry.layout();
  });
}

onMounted(() => {
  initMasonry()
})

// 组件销毁清实例
onBeforeUnmount(() => destroyMasonry())

// 监听数据变化：先销毁，DOM更新完再新建
watch(() => props.list, async () => {
  destroyMasonry()
  await nextTick() // 等待v-for dom完全刷新
  initMasonry()
}, { deep: true })
</script>

<style scoped lang="scss">
:global(body) {
  overflow-x: hidden !important;
}

.waterfallContainer {
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden !important;
}

.card {
  width: 238px;
  box-sizing: border-box;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
}

/* 👇 只控制卡片大图，不影响头像、爱心 */
.card>img {
  width: 100%;
  min-height: 178px;
  max-height: 318px;
  object-fit: cover;
  display: block;
}

.footer {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  background: transparent;
}

.title {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 6px;
  line-height: 1.4;
}

.subtitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #ffffff;

  .left {
    display: flex;
    align-items: center;
    gap: 6px;

    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      /* 👈 防止头像拉伸 */
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 4px;

    img {
      width: 14px;
      height: 14px;
      object-fit: contain;
      /* 👈 防止爱心变形 */
    }
  }
}
</style>
