<template>
	<h1 id="str-title">Please upload the test file(*.txt)</h1>

	<div id="space" style="display: flex; flex-direction: column; align-items: center;">
		<div id="js-selectFile">
			<input id="js-upload" type="file" style="display:none" ref="fileInput" accept=".txt"
				@change="handleFileChange">
			<button class="original_btn" @click="handleFileSelect">ファイルを選択</button>
			<span class="icon" :class="{ select: isFileSelected }">{{ fileName || '未選択' }}</span>
		</div>
		
		<div v-if="fileContent" class="file-content">
			<pre>{{ fileContent }}</pre>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const fileInput = ref<HTMLInputElement | null>(null);
const isFileSelected = ref(false);
const fileName = ref<string | null>(null);
const fileContent = ref<string | null>(null);

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
			fileContent.value = null
			fileContent.value = reader.result as string;
		};
		reader.readAsText(file);
	} else {
		alert('Please upload a .txt file');
		isFileSelected.value = false;
		fileName.value = null;
		fileContent.value = null;
	}
};
</script>

<style scoped>
body {
	font-size: 18px;
	text-align: left;
}

/* オリジナルボタン */
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

/* 未選択時のアイコン */
.icon {
	font-size: 16px;
	margin: 0 10px 0 15px;
	padding: 3px 30px;
	border-radius: 15px;
	background: #666;
	color: #fff;
	display: inline-block;
}

/* 選択時のアイコン */
.icon.select {
	background: #ff5050;
	color: #fff;
}

/* ファイル名 */
.filename {
	display: inline-block;
	font-size: 16px;
}

/* ファイルの内容を表示するスタイル */
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