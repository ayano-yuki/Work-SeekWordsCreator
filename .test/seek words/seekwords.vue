<template>
    <div>
        <h2>シークワーズ</h2>
        <div class="word-search-grid">
            <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="grid-row">
                <span v-for="(cell, colIndex) in row" :key="colIndex"
                    :class="{ 'highlight': isWordCell(rowIndex, colIndex) }" class="grid-cell">
                    {{ cell }}
                </span>
            </div>
        </div>
        <h3>見つける単語</h3>
        <ul>
            <li v-for="word in words" :key="word">{{ word }}</li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'WordSearch',
    data() {
        return {
            words: ['あか', 'さかな', 'ねこ', 'たぬき'],
            grid: this.generateHiraganaWordSearch(['あか', 'さかな', 'ねこ', 'たぬき']),
        };
    },
    methods: {
        generateHiraganaWordSearch(words: string[]): string[][] {
            const size = 9;
            const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
            const hiraganaChars = 'あいうえおかきくけこさしすせそたちつてと';

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
                    [1, 0],  // 縦
                    [0, 1],  // 横
                    [1, 1],  // 斜め右下
                    [1, -1]  // 斜め左下
                ];

                for (let attempt = 0; attempt < 100; attempt++) {
                    const row = Math.floor(Math.random() * size);
                    const col = Math.floor(Math.random() * size);
                    const direction = directions[Math.floor(Math.random() * directions.length)];

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
                        const randomIndex = Math.floor(Math.random() * hiraganaChars.length);
                        grid[row][col] = hiraganaChars[randomIndex];
                    }
                }
            }

            return grid;
        },
        isWordCell(row: number, col: number): boolean {
            for (const word of this.words) {
                // 縦、横、斜めのいずれかに単語が存在するかチェック
                if (this.checkWordInGrid(word, row, col)) {
                    return true;
                }
            }
            return false;
        },
        checkWordInGrid(word: string, row: number, col: number): boolean {
            const directions: [number, number][] = [
                [1, 0],  // 縦
                [0, 1],  // 横
                [1, 1],  // 斜め右下
                [1, -1]  // 斜め左下
            ];

            for (const [dRow, dCol] of directions) {
                let found = true;
                for (let i = 0; i < word.length; i++) {
                    const newRow = row + i * dRow;
                    const newCol = col + i * dCol;

                    if (newRow < 0 || newRow >= 9 || newCol < 0 || newCol >= 9 || this.grid[newRow][newCol] !== word[i]) {
                        found = false;
                        break;
                    }
                }
                if (found) return true;
            }
            return false;
        }
    }
});
</script>

<style scoped>
.word-search-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 5px;
}

.grid-row {
    display: contents;
}

.grid-cell {
    border: 1px solid #000;
    padding: 10px;
    text-align: center;
    font-size: 24px;
}

.highlight {
    color: red;
    /* 赤色で強調表示 */
    font-weight: bold;
}
</style>