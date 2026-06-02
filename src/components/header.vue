<template>
  <div class="header">
    <div class="searchBar">
      <textarea placeholder="搜索或输入任何问题" v-model="store.searchText"></textarea>
      <div class=" bottomBox">
        <div class="bottomBox-left">
          <img :src="add" class="add-icon">
          <span class="line">|</span>
          <div class="diandian-wrap">
            <img :src="diandian" alt="">
            <span>问点点</span>
            <span class="ai">ai</span>
          </div>
        </div>

        <div class="bottomBox-right">
          <div class="search" :class="{ active: isSearching }"> <img :src="search" class="search-icon" alt=""></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import add from '@/assets/加.svg'
import diandian from '@/assets/气泡.svg'
import search from '@/assets/搜索.svg'
import { ref, watch, computed } from 'vue'
import { useSearchStore } from '@/stores/search'

const isSearching = ref(false)
const store = useSearchStore()


watch(() => store.searchText, (newVal) => {
  if (newVal !== '') {
    isSearching.value = true
  } else {
    isSearching.value = false
  }
})
</script>

<style lang="scss">
.header {
  width: 100%;
  height: 100px;
  background-color: #19191E;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
  margin-bottom: 5%;
}

.searchBar {
  width: 65%;
  background-color: #29292E;
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #4B4B50;
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.2);
}

textarea {
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  resize: none;
  color: #fff;
}

textarea::placeholder {
  font-size: 16px;
}

.bottomBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bottomBox-left {
  display: flex;
  align-items: center;
  gap: 20px;

  .line {
    background-color: var(--separator);
  }
}

.diandian-wrap {
  padding: 6px 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  span {
    font-size: 13px;
    color: #ffffff;
  }

  .ai {
    color: #157d6b;
    font-size: 10px;
    line-height: 1;
    flex-shrink: 0;
    transition: background-color .2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 6px;
    background-color: rgba(86, 209, 191, 0.2);
  }
}

.diandian-wrap:hover {
  background-color: #141418;
}

.add-icon {
  width: 16px;
  height: 16px;
}

.diandian-wrap img {
  width: 14px;
  height: 14px;
}

.search {
  width: 32px;
  height: 32px;
  background-color: #3A3A3E;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .search-icon {
    width: 18px;
    height: 18px;
  }
}

.search.active {
  transition: background-color 0.2s ease;
  background-color: #ffffff;
}



.line {
  color: #666;
}
</style>
