<script setup lang="ts">
import CustomFooter from './components/layout/CustomFooter.vue'
import CustomHeader from './components/layout/CustomHeader.vue'
</script>

<template>
  <custom-header />
  <router-view />
  <custom-footer />
</template>

<style scoped></style>
