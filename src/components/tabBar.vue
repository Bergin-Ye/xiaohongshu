<template>
  <div class="tab-bar">
    <div v-for="(item, idx) in tabList" :key="idx" class="tab-item" :class="{ active: activeIndex === idx }"
      @click="handleClick(idx)">
      <span class="tab-text">{{ item.text }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabList: { type: Array, required: true },
  activeIndex: { type: Number, default: 0 },
})
const emit = defineEmits(['tabChange'])
function handleClick(index) {
  const currentText = props.tabList[index].text
  emit('tabChange', currentText, index)
}
</script>

<style scoped lang="scss">
.tab-bar {
  width: 100%;
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: center;
  background: transparent;
  z-index: 2;
  margin-bottom: 3%;
}

.tab-item {
  text-align: center;
  color: rgba(255, 255, 255, 0.56);
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
}

.active {
  color: rgba(255, 255, 255, 0.84);
  border-bottom: 2px solid #FF2E4D;
  font-weight: bold;
}
</style>
