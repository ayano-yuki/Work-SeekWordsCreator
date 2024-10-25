<template>
	<h1 id="str-title">Seek Words</h1>

	<div id="space" style="display: flex; flex-direction: column; align-items: center;">
        {{ vocabularyArray }}
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { vocabulary } from '@/stores/counter';

const vocabularyArray = ref<string[]>([]);

const VocabularyController = vocabulary();

onMounted(() => {
    vocabularyArray.value = VocabularyController.getVocabularys();
    console.log( VocabularyController.getVocabularys() );
})


</script>

<style scoped>
</style>