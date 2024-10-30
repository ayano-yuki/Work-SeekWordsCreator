from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import MeCab

# -----Launching the API server-----------------------------------------------------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# -----POST data format-------------------------------------------------------------------------------
class SeekWords(BaseModel):
    size: int
    board: List[List[str]]

# -----Function to extract patterns from the board-----------------------------------------------------
def extract_patterns(board: List[List[str]], pattern_size: int) -> List[str]:
    patterns = []
    n = len(board)

    # Horizontal patterns (left to right and right to left)
    for row in range(n):
        for col in range(n - pattern_size + 1):
            # Left to right
            patterns.append("".join(board[row][col:col + pattern_size]))
            # Right to left
            patterns.append("".join(board[row][col + pattern_size - 1:col - 1:-1]))

    # Vertical patterns (top to bottom and bottom to top)
    for col in range(n):
        for row in range(n - pattern_size + 1):
            # Top to bottom
            patterns.append("".join(board[row + i][col] for i in range(pattern_size)))
            # Bottom to top
            patterns.append("".join(board[row + pattern_size - 1 - i][col] for i in range(pattern_size)))

    # Diagonal patterns (top-left to bottom-right and bottom-right to top-left)
    for row in range(n - pattern_size + 1):
        for col in range(n - pattern_size + 1):
            # Top-left to bottom-right
            patterns.append("".join(board[row + i][col + i] for i in range(pattern_size)))
            # Bottom-right to top-left
            patterns.append("".join(board[row + pattern_size - 1 - i][col + pattern_size - 1 - i] for i in range(pattern_size)))

    # Diagonal patterns (top-right to bottom-left and bottom-left to top-right)
    for row in range(n - pattern_size + 1):
        for col in range(pattern_size - 1, n):
            # Top-right to bottom-left
            patterns.append("".join(board[row + i][col - i] for i in range(pattern_size)))
            # Bottom-left to top-right
            patterns.append("".join(board[row + pattern_size - 1 - i][col - pattern_size + 1 + i] for i in range(pattern_size)))

    return patterns

# -----API--------------------------------------------------------------------------------------------
@app.get("/")
async def read_main() -> Dict[str, str]:
    return {"msg": "Hello World"}

@app.post("/parse", response_model=Dict[str, Any])
async def noun_extraction(datas: List[SeekWords]) -> Dict[str, List[str]]:
    mecab = MeCab.Tagger()
    all_extracted_words = set()  # Using a set to avoid duplicates

    # Function to check if the word is a valid noun
    def is_valid_noun(line: str, text: str) -> bool:
        return (
            "名詞" in line and 
            "サ変可能" not in line and
            "形状詞可能" not in line and
            "副詞可能" not in line and
            "数詞" not in line and
            "代名詞" not in line and
            "接尾辞" not in line and
            "固有名詞" not in line and
            "名詞的" not in line and
            line.split("\t")[0] == text  # Ensure the word matches the original text
        )

    for data in datas:
        board = data.board
        max_pattern_size = min(data.size, len(board))  # Determine max pattern size

        # Extract nouns for each pattern size
        for size in range(2, max_pattern_size + 1):  # Start from 2
            patterns = extract_patterns(board, size)

            for text in patterns:
                result = mecab.parse(text).splitlines()
                # Filter valid nouns
                valid_nouns = [line.split("\t")[0] for line in result if is_valid_noun(line, text)]
                all_extracted_words.update(valid_nouns)  # Update the set with valid nouns
    return {"words": list(all_extracted_words)}  # Convert set back to list for response
