<template>
  <div class="more-pop" @click.stop>
    <div class="more-pop-grop1">
      <more-pop-grop1-item>隐私、协议 <span>></span></more-pop-grop1-item>
      <more-pop-grop1-item>帮助与客服</more-pop-grop1-item>
    </div>

    <div class="more-pop-grop2">
      <more-pop-grop2-item>创业中心<span>></span></more-pop-grop2-item>
      <more-pop-grop2-item>业务合作<span>></span></more-pop-grop2-item>
    </div>

    <div class="more-pop-grop3">
      <span>访问方式</span>
      <more-pop-grop3-item>键盘快捷键</more-pop-grop3-item>
      <more-pop-grop3-item>添加小红书到桌面</more-pop-grop3-item>
      <more-pop-grop3-item>打开小窗模式</more-pop-grop3-item>
    </div>

    <div class="more-pop-grop4">
      <span>设置</span>
      <more-pop-grop4-item>深色模式
        <modleSwitch />
      </more-pop-grop4-item>
      <more-pop-grop4-item>退出登录</more-pop-grop4-item>

    </div>
  </div>
</template>

<script setup>
import modleSwitch from './modleSwitch.vue'
</script>

<style scoped lang="scss">
.more-pop {
  width: 180px;
  height: auto;
  background-color: #181818;
  border-radius: 12px;
  padding: 1px 1px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  overflow: hidden;
  border: 1px solid #2a2626;
  cursor: default
}

.more-pop-grop1,
.more-pop-grop2,
.more-pop-grop3,
.more-pop-grop4 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid #282828;
  padding: 5px;
}


more-pop-grop1-item,
more-pop-grop2-item,
more-pop-grop3-item,
more-pop-grop4-item {
  display: block;
  padding: 5px 12px;
  border-radius: 8px;
  cursor: default;
  transition: 0.2s;
}

[class^="more-pop-grop"] :is(more-pop-grop1-item,
  more-pop-grop2-item,
  more-pop-grop3-item,
  more-pop-grop4-item):hover {
  background-color: #2a2a2a;
  cursor: pointer;
}

.more-pop-grop4 {
  border-bottom: none;
  padding-bottom: 0;
}

.more-pop-grop1 :nth-child(1),
.more-pop-grop2 :nth-child(1),
.more-pop-grop2 :nth-child(2),
.more-pop-grop4 :nth-child(2) {
  display: flex;
  justify-content: space-between;
}

.more-pop-grop3 :nth-child(1),
.more-pop-grop4 :nth-child(1) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
