<template>
  <div class="header">
    <!-- 搜索框 -->
    <div class="searchbar">
      <textarea placeholder="搜索或输入任何问题"></textarea>
      <img class="search-icon" :src="search" alt="搜索">
    </div>

    <!-- 插槽 TabBar -->
    <div class="header-bottom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script setup>
import search from '@/assets/搜索.svg'
</script>

<style lang="scss">
.header {
  width: 100%;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.searchbar {
  position: relative;
  width: 100%;
  max-width: 474px;
  min-width: 300px;

  textarea {
    width: 100%;
    height: 40px;
    border-radius: 20px;
    border: none;
    background: #222227;
    padding: 0 16px;
    resize: none;
    outline: none;
    font-size: 14px;
    color: #fff;
    line-height: 40px;
  }

  .search-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    filter: invert(1);
    cursor: pointer;
  }
}

.header-bottom {
  width: 100%;
  max-width: 846px;
  margin-top: 8px;
}
</style>