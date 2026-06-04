<template>
  <div class="message-container">
    <Searchbar>
      <template #bottom>
        <div class="tab-bar">
          <span
            v-for="(item, index) in tabs"
            :key="index"
            @click="activeIndex = index"
            :class="{ active: activeIndex === index }"
          >
            {{ item }}
          </span>
        </div>
      </template>
    </Searchbar>

    <!-- 内容放在 Searchbar 外面 -->
    <div class="message-page" v-for="item in currentList" :key="item.id">
      <div class="comment-left"><img :src="item.avatar" alt=""></div>
      <div class="comment-mid">
        <div class="userName">{{ item.userName }}</div>
        <div class="time" v-if="activeIndex === 0">评论了你的笔记 <span>{{ item.time }}</span></div>
        <div class="time" v-if="activeIndex === 1">收藏了你的笔记 <span>{{ item.time }}</span></div>
        <div class="time" v-if="activeIndex === 2">Ta关注了你，期待你的回关 <span>{{ item.time }}</span></div>
        <div class="comment" v-if="activeIndex === 0">{{ item.comment }}</div>
        <div class="reply-like" v-if="activeIndex === 0">
          <div class="reply"><img :src="reply" alt="">回复</div>
          <div class="like"><img :src="like" alt=""></div>
        </div>
      </div>
      <div class="comment-right"v-if="activeIndex === 0 || activeIndex === 1"><img :src="item.noteImg" alt=""></div>
      <div class="follow" v-if="activeIndex === 2">关注</div>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/stores/search'
import Searchbar from '@/components/searchBar.vue'
import reply from '@/assets/气泡.svg'
import like from '@/assets/爱心.svg'
import { ref,computed } from 'vue'

const tabs = ref(['评论和@', '赞和收藏', '新增关注'])
const activeIndex = ref(0)
const store = useSearchStore()

const currentList = computed(() => {
  if(activeIndex.value === 0) return store.commentList
  if(activeIndex.value === 1) return store.likeList
  if(activeIndex.value === 2) return store.followList
})
</script>

<style lang="scss" scoped>
.tab-bar {
  width: 100%;
  max-width: 846px;
  margin: 20px auto 0;
  padding: 0 20px 12px;
  display: flex;
  gap: 20px;
  font-size: 16px;
  font-weight: bold;
  color: rgb(194, 191, 191);
  border-bottom: 1px solid #2c2b2b;
  box-sizing: border-box;

  span {
    flex: none;
    width: 97px;
    height: 40px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  span:hover {
    color: white;
  }

  .active {
    background-color: #222227;
    color: white;
  }
}

.message-page {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 16px 20px;
  max-width: 846px;
  margin: 0 auto;
  border-bottom: 1px solid #2c2b2b;
}

.comment-left {
  flex-shrink: 0;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #333;
  }
}

.comment-mid {
  flex: 1;
  position: relative;

  .userName {
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .time {
    color: #999;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .comment {
    color: #fff;
    font-size: 12px;
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .reply {
    width: 88px;
    height: 40px;
    border: 1px #2c2b2b solid;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    color: #999;
    font-size: 16px;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
    }
  }

  .reply:hover{
    color: #fff;
    background-color: #222227;
  }

  .like {
    padding: 10px;
    border: 1px #2c2b2b solid;
    border-radius: 999px;
    color: #999;
    font-size: 13px;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
    }
  }

  .like:hover{
    color: #fff;
    background-color: #222227;
  }

  .reply-like {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.comment-right {
  flex-shrink: 0;

  img {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
    background: #333;
  }
}

.follow{
  width: 96px;
  height: 40px;
  color: white;
  font-size: 16px;
  background-color: rgb(255, 46, 77);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
}

</style>