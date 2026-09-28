<script lang="ts" setup>
import {  watch } from 'vue';


const props = withDefaults(defineProps<{
   isOpen: boolean,
   modalTitle?: string
   closeButton?: boolean
   outsideClose?: boolean
}>(), {
   type: 'default',
   outsideClose: true
});

watch(() => props.isOpen, () => console.log('open'))

defineEmits(['close']);
</script>

<template>
   <transition name="fade">
      <teleport to='body'>
         <div class="modal" v-if="isOpen">
            <div class="modal-body block" style="box-shadow: none;" ref="modal-window">
               <h1 class="modal-title" v-if="modalTitle">{{ modalTitle }}</h1>
               <div class="modal-content">
                  <slot />
               </div>
               <div class="modal-bottom">
                  <slot name="options">
                     <button class="base" @click="$emit('close')">Закрыть</button>
                  </slot>
               </div>
            </div>
         </div>
      </teleport>
   </transition>
</template>

<style scoped>
.modal {
   position: fixed;
   inset: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 10000;
   backdrop-filter: blur(0.2rem);

   &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
   }
}

.modal-title {
   margin: 0;
   font-size: larger;
   margin-bottom: 1.5rem;
   font-weight: 500;
}

.modal-body {
   display: grid;
   grid-template-rows: 1fr auto auto;
   position: relative;
   z-index: 1;
   max-width: 90%;
   max-height: 90%;
   min-width: 20%;
   min-height: 10%;
   overflow: auto;
   padding: 1.5rem;
   border-radius: 24px;
}

.modal-content {
   overflow: hidden;
   &:first-child {
      grid-row: span 2;
   }
}

.modal-bottom {
   padding-top: 1rem;
   position: relative;
   top: 0.75rem;
   left: 0.75rem;
   display: flex;
   gap: 0.25rem;
   justify-content: end;
}

.close-button {
   position: absolute;
   top: 1rem;
   right: 1rem;
}
</style>