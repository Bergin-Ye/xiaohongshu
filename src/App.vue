<template>
  <Layout></Layout>
</template>

<script setup>
import Layout from '@/layout/layout.vue'
</script>

<style>
* {
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE */
}

*::-webkit-scrollbar {
  display: none !important;
  /* Chrome / Safari */
}
</style>
