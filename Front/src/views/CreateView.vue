<template>
    <h1 id="str-title">Seek Words</h1>

    <div id="space" style="display: flex; flex-direction: row; align-items: flex-start;">
        <div>
            <table>
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { vocabulary } from '@/stores/counter';
import seedrandom from 'seedrandom';

const vocabularyArray = ref<string[]>([]);
const wordSearchGrid = ref<string[][]>([]);

// Set the random seed to 256
const rng = seedrandom(256);
// const rng = seedrandom( Math.floor(Math.random() * 256) );

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
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1]
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
            throw new Error(`Could not place word: ${word}`);
        }
    }

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!grid[row][col]) {
                const randomIndex = Math.floor(rng() * hiraganaChars.length);
                grid[row][col] = hiraganaChars[randomIndex];
                // grid[row][col] = "＊";
            }
        }
    }

    return grid;
}

onMounted(() => {
    vocabularyArray.value = VocabularyController.getVocabularys().filter(word => /^[\u3040-\u309F]{2,5}$/.test(word));
    const selectedWords = vocabularyArray.value
        .sort(() => 0.5 - rng())
        .slice(0, 9);

    wordSearchGrid.value = generateHiraganaWordSearch(selectedWords);
    console.log(wordSearchGrid.value);
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
