<template>
    <h1 id="str-title">
        Please upload the vocabulary
        <a href="/template.txt" download="TEMPLATE.txt"> (*.txt) </a>
    </h1>

    <div id="space" style="display: flex; flex-direction: column; align-items: center;">
        <div id="js-selectFile">
            <input id="js-upload" type="file" style="display:none" ref="fileInput" accept=".txt"
                @change="handleFileChange">
            <button class="original_btn" @click="handleFileSelect">Select File</button>
            <span class="icon" :class="{ select: isFileSelected }">{{ fileName || 'Not selected' }}</span>
        </div>

        <!-- Slider for size selection -->
        <div style="margin-top: 2%;">
            <label for="size-slider">Select Size (7 to 9): {{ selectedSize }}</label>
            <input id="size-slider" type="range" min="7" max="9" step="1" v-model="selectedSize"
                @input="handleSizeChange" />
        </div>

        <div v-if="fileContent" class="file-content">
            <pre>{{ fileContent }}</pre>
        </div>

        <div v-if="fileContent" style="margin-top: 2%;">
            <IconButton name="Generate with this vocabulary!" icon_path="/icon/running.svg" next="/create"></IconButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import IconButton from '@/components/IconButton.vue';
import { useVocabulary } from '@/stores/counter';

const fileInput = ref<HTMLInputElement | null>(null);
const isFileSelected = ref(false);
const fileName = ref<string | null>(null);
const fileContent = ref<string | null>(null);
const vocabularyArray = ref<string[]>([]);

// New ref for selected size
const selectedSize = ref<number>(7);

const VocabularyController = useVocabulary();

const handleFileSelect = (): void => {
	if (fileInput.value) {
		fileInput.value.click();
	}
};

const handleFileChange = (event: Event): void => {
	const input = event.target as HTMLInputElement;
	const file = input.files && input.files[0];

	if (file && file.type === 'text/plain') {
		isFileSelected.value = true;
		fileName.value = file.name;

		const reader = new FileReader();
		reader.onload = () => {
			const text = reader.result as string;
			fileContent.value = text;

			// 行ごとに分割し、スペースを削除してトリミング
			vocabularyArray.value = text.split('\n')
				.map(line => line.replace(/\s+/g, '').trim()) // スペースを削除し、トリム
				.filter(line => line !== ''); // 空行をフィルタリング

			VocabularyController.addVocabularys(Array.from(new Set(vocabularyArray.value)));
		};
		reader.readAsText(file);
	} else {
		alert('Please upload a valid .txt file');
		isFileSelected.value = false;
		fileName.value = null;
		fileContent.value = null;
	}
};

// New method to handle size change
const handleSizeChange = (): void => {
    VocabularyController.setSize(selectedSize.value);
	console.log(VocabularyController.getSize())
};

// Watcher to set the size initially
watch(selectedSize, (newValue) => {
    VocabularyController.setSize(newValue);
});
</script>

<style scoped>
body {
    font-size: 18px;
    text-align: left;
}

.original_btn {
    border: 1px solid #ddd;
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    color: #666;
    background: linear-gradient(to bottom, #fff 0, #f4f4f4 100%);
    box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.09);
    font-size: 16px;
}

.icon {
    font-size: 16px;
    margin: 0 10px 0 15px;
    padding: 3px 30px;
    border-radius: 15px;
    background: #666;
    color: #fff;
    display: inline-block;
}

.icon.select {
    background: #ff5050;
    color: #fff;
}

.filename {
    display: inline-block;
    font-size: 16px;
}

.file-content {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    width: 80%;
    background-color: #f9f9f9;
    font-size: 16px;
    max-height: 300px;
    overflow-y: auto;
    text-align: left;
    font-size: larger;
}

pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>
