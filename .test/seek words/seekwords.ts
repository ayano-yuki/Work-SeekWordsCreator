function generateHiraganaWordSearch(words: string[]): string[][] {
    const size = 9;
    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));

    // 平仮名の生成
    const hiraganaChars = 'あいうえおかきくけこさしすせそたちつてと';
    
    // 1つの単語を指定した方向に配置する関数
    const placeWord = (word: string, row: number, col: number, direction: [number, number]): boolean => {
        const [dRow, dCol] = direction;

        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;

            // グリッドの範囲外か、すでに文字がある場合は配置できない
            if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size || (grid[newRow][newCol] && grid[newRow][newCol] !== word[i])) {
                return false;
            }
        }

        // 単語を配置
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            grid[newRow][newCol] = word[i];
        }

        return true;
    };

    // 単語をランダムに配置する関数
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

    // 単語をグリッドに追加
    for (const word of words) {
        if (!addWordToGrid(word)) {
            throw new Error(`Could not place word: ${word}`);
        }
    }

    // 残りのスペースをランダムな平仮名で埋める
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!grid[row][col]) {
                const randomIndex = Math.floor(Math.random() * hiraganaChars.length);
                // grid[row][col] = hiraganaChars[randomIndex];
                grid[row][col] = "＊";
            }
        }
    }

    return grid;
}

// 使用例
const words = ['あか', 'さかな', 'ねこ', 'たぬき'];
const wordSearch = generateHiraganaWordSearch(words);

// 結果の表示
wordSearch.forEach(row => console.log(row.join(' ')));
