<template>
  <div class="header">
    <div class="searchBar">
      <input type="text" class="search-input" placeholder="搜索或输入任何问题" v-model="store.searchText" />
      <img src=" @/assets/搜索.svg" class="search-icon" :class="{ active: isSearching }" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useSearchStore } from '@/stores/search'

const isSearching = ref(false)
const store = useSearchStore()


watch(() => store.searchText, (newVal) => {
  isSearching.value = newVal.trim() !== ''
})
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 164px;
  width: calc(100vw - 164px);
  height: 115px;
  background-color: #19191E;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  margin: 0;
  padding: 0;
}

.searchBar {
  width: 65%;
  background-color: #29292E;
  border-radius: 999px;
  height: 56px;
  display: flex;
  align-items: center;
  position: relative;
  border: 1px solid #4B4B50;
  padding: 0 20px;
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.2);
}

.search-input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  color: #fff;
  padding-right: 50px;
}

.search-input::placeholder {
  font-size: 16px;
}

.search-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background-color: #3A3A3E;
  border-radius: 999px;
  padding: 6px;
  transition: background-color 0.2s ease;
}

.search-icon.active {
  background-color: #ffffff;
}
</style>
