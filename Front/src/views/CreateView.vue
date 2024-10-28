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
        
        <!-- Right-side container for the selected words -->
        <div style="margin-left: 10%;">
            <h2>Words Used:</h2>
            <ul>
                <div v-for="(word, index) in vocabularyArray" :key="index">{{ word }}</div>
            </ul>

            <IconButton v-if="!loading" name="Download PDF" icon_path="/icon/running.svg" @click="downloadPDF"></IconButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import seedrandom from 'seedrandom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { vocabulary } from '@/stores/counter';
import IconButton from '@/components/IconButton.vue';

const vocabularyArray = ref<string[]>([]);
const wordSearchGrid = ref<string[][]>([]);
const loading = ref(false);

// Initialize seedrandom with a dynamic seed based on current time
const rng = seedrandom(Date.now().toString());

const VocabularyController = vocabulary();

function generateHiraganaWordSearch(words: string[]): string[][] {
    const size = 9;
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
            [1, 0],   // Down
            [0, 1],   // Right
            [1, 1],   // Down-Right (Diagonal)
            [1, -1]   // Down-Left (Diagonal)
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
            console.warn(`Could not place word: ${word}`); // Changed to warning for user-friendly feedback
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


onMounted(() => {
    vocabularyArray.value = VocabularyController.getVocabularys().filter(word => /^[\u3040-\u309F]{2,5}$/.test(word));
    const selectedWords = vocabularyArray.value
        .sort(() => 0.5 - rng())
        .slice(0, 9);

    wordSearchGrid.value = generateHiraganaWordSearch(selectedWords);
    console.log(wordSearchGrid.value)
});
</script>

<style scoped>
#space {
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: flex-start; /* Align items at the start vertically */
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
</style>
