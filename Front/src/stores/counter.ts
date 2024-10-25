import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment }
})

export const vocabulary = defineStore('vocabulary', () => {
  const vocabularys = ref([""]);

  function addVocabularys(add_vocabularys: Array<string>) {
    vocabularys.value = add_vocabularys;
    console.log( vocabularys.value );
  }

  function getVocabularys() {
    return vocabularys.value
  }

  return { addVocabularys, getVocabularys }
})