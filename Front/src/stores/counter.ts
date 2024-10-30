import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

// Vocabulary Store
export const vocabulary = defineStore('vocabulary', () => {
  const vocabularys = ref<string[]>([""]);

  function addVocabularys(add_vocabularys: string[]) {
    if (add_vocabularys.length === 0) {
      console.error("No vocabulary to add.");
      return;
    }
    vocabularys.value = add_vocabularys;
  }

  function getVocabularys(): string[] {
    return vocabularys.value;
  }

  return { addVocabularys, getVocabularys };
});

// Seek Words Store
export const SeekWords = defineStore('seekwords', () => {
  const board = ref<string[][]>([]);
  const seekwordsLength = ref<number>(9);

  function createSeekWords() {
    if (seekwordsLength.value <= 0) {
      console.error("Seek words length must be greater than 0.");
      return;
    }
    
    const empty = "";
    board.value = [];

    for (let i = 0; i < seekwordsLength.value; i++) {
      const line: string[] = [];
      for (let j = 0; j < seekwordsLength.value; j++) {
        line.push(empty);
      }
      board.value.push(line);
    }
  }

  return { createSeekWords };
});

export const config_data = defineStore('config_data', () => {
  const api_url = ref("http://127.0.0.1:8000")

  function get_api_url() {
      return api_url.value
  }

  return { get_api_url }
})