<template>
    <h1 id="str-title">Seek Words</h1>

    <div id="space" style="display: flex; flex-direction: row; align-items: flex-start;">
        <div>
            <table ref="wordSearchTable">
                <tr v-for="(row, rowIndex) in wordSearchGrid" :key="rowIndex">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                        {{ cell }}
                    </td>
                </tr>
            </table>
        </div>

        <div style="margin-left: 10%;" v-if="!loading">
            <h2>Words Used:</h2>
            <ul class="vocabulary-list">
                <li v-for="(word, index) in vocabularyArray" :key="index">{{ word }}</li>
            </ul>

            <IconButton name="Download SeekWords" icon_path="/icon/running.svg" @click="downloadPDF" />
            <IconButton name="Download Vocabulary" icon_path="/icon/running.svg" @click="downloadVocabulary" />
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import seedrandom from 'seedrandom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useVocabulary, useConfigData } from '@/stores/counter';
import IconButton from '@/components/IconButton.vue';

const vocabularyArray = ref<string[]>([]);
const wordSearchGrid = ref<string[][]>([]);
const loading = ref(false);

const rng = seedrandom(Date.now().toString());
const VocabularyController = useVocabulary();
const APIurl = useConfigData().getApiUrl();

function generateHiraganaWordSearch(words: string[]): string[][] {
    const size = Number(VocabularyController.getSize());
    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
    const hiraganaChars = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽっー';

    const placeWord = (word: string, row: number, col: number, direction: [number, number]): boolean => {
        const [dRow, dCol] = direction;
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size || (grid[newRow][newCol] && grid[newRow][newCol] !== word[i])) {
                return false;
            }
        }
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            grid[newRow][newCol] = word[i];
        }
        return true;
    };

    const addWordToGrid = (word: string): boolean => {
        const directions: [number, number][] = [
            [1, 0], [0, 1], [1, 1], [1, -1]
        ];
        for (let attempt = 0; attempt < 100; attempt++) {
            const row = Math.floor(rng() * size);
            const col = Math.floor(rng() * size);
            const direction = directions[Math.floor(rng() * directions.length)];
            if (placeWord(word, row, col, direction)) {
                return true;
            }
        }
        return false;
    };

    for (const word of words) {
        if (!addWordToGrid(word)) {
            console.warn(`Could not place word: ${word}`);
        }
    }

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!grid[row][col]) {
                const randomIndex = Math.floor(rng() * hiraganaChars.length);
                grid[row][col] = hiraganaChars[randomIndex];
            }
        }
    }

    return grid;
}

async function sendBoardDataToAPI(board: string[][], size: number) {
    const data = [{
        size: size,
        board: board
    }];
    console.log("Sending data:", data);  // 送信データの確認

    try {
        const response = await axios.post(`${APIurl}/parse`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("API response:", response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error response:", error.response?.data);
        } else {
            console.error("Unknown error:", error);
        }
    }
}

const downloadPDF = async (): Promise<void> => {
    loading.value = true;

    // Allow the DOM to update before capturing
    setTimeout(async () => {
        const element = document.getElementById('space');
        if (!element) {
            console.error('Element not found!');
            loading.value = false;
            return;
        }

        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/jpeg');

            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const imgWidth = 297; // A4 landscape width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const heightLeft = imgHeight;

            // Calculate the vertical position to center the image
            const verticalOffset = (pdf.internal.pageSize.height - imgHeight) / 2;

            pdf.addImage(imgData, 'JPEG', (pdf.internal.pageSize.width - imgWidth) / 2, verticalOffset, imgWidth, imgHeight);
            if (heightLeft >= pdf.internal.pageSize.height) {
                let position = verticalOffset; // Start from the calculated vertical offset
                while (heightLeft >= 0) {
                    pdf.addImage(imgData, 'JPEG', (pdf.internal.pageSize.width - imgWidth) / 2, position, imgWidth, imgHeight);
                    position -= pdf.internal.pageSize.height;
                }
            }

            pdf.save('SeekWords.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            loading.value = false;
        }
    }, 0);
};

const downloadVocabulary = () => {
    const blob = new Blob([vocabularyArray.value.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vocabulary.txt'; // Change the file name as needed
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

onMounted(async () => {
    await initializeBoardData();
});

async function initializeBoardData() {
    // Get size from VocabularyController
    const size = VocabularyController.getSize();
    const board = wordSearchGrid.value;

    // Get words from the existing vocabulary
    vocabularyArray.value = VocabularyController.getVocabularys().filter(word => /^[\u3040-\u309F]{2,5}$/.test(word));
    const selectedWords = vocabularyArray.value
        .sort(() => 0.5 - rng())
        .slice(0, size); // Use size to limit selected words

    // Generate the word search using the size obtained
    wordSearchGrid.value = generateHiraganaWordSearch(selectedWords);

    // Send board data to the API and process the response
    sendBoardDataToAPI(wordSearchGrid.value, size)
        .then(apiResponse => {
            // Ensure the response contains the expected words
            const apiWords = (apiResponse.words || []).filter((word: string) => /^[\u3040-\u309F]{2,5}$/.test(word));

            // Combine existing vocabulary with API data, ensuring no duplicates
            const combinedWords = new Set([...vocabularyArray.value, ...apiWords]);

            // Log the state for debugging
            console.log("Vocabulary Array (updated):", vocabularyArray.value);
            console.log("API Words:", apiWords);
            console.log("Combined Words Set:", combinedWords);

            // Update vocabularyArray with combinedWords
            vocabularyArray.value = Array.from(combinedWords); // This line ensures the UI updates
        })
        .catch(error => {
            console.error("Error sending board data to API:", error);
        });
}
</script>

<style scoped>
#space {
    display: flex;
    justify-content: center;
    /* Center horizontally */
    align-items: flex-start;
    /* Align items at the start vertically */
}

table {
    border-collapse: collapse;
    background-color: #ffffff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin-top: 20px;
    border: 1px solid #333;
}

td {
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #555555;
    border-radius: 5px;
    border: 1px solid #333;
}

.vocabulary-list {
    list-style-type: none;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    gap: 10px;
    max-height: 200px;
    max-width: 150%;
    overflow-y: auto;
    background-color: var(--color-button-icon);
    border: 2px solid #ffb3ba;
    border-radius: 12px;
    padding-right: 15px;
}

.vocabulary-list li {
    padding: 8px 12px;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
    transition: transform 0.2s ease;
}

.vocabulary-list li:hover {
    transform: scale(1.05);
    background-color: var(--color-button-background);
}
</style>
