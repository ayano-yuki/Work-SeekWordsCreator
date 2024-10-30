import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

// Vocabulary Store
export const useVocabulary = defineStore('vocabulary', () => {
  const vocabularys = ref<string[]>([]); // Changed initialization to an empty array
  const size = ref<number>(7); // Use 'number' instead of 'Number'

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

  function setSize(num: number) { // Use 'number' instead of 'Number'
    size.value = num;
  }

  function getSize(): number { // Use 'number' instead of 'Number'
    return size.value;
  }

  return { addVocabularys, getVocabularys, setSize, getSize };
});

// Seek Words Store
export const useSeekWords = defineStore('seekwords', () => {
  const board = ref<string[][]>([]);
  const vocabulary = useVocabulary(); // Access the Vocabulary store instance
  const seekwordsLength = ref<number>(vocabulary.getSize());

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

  return { createSeekWords, board }; // Returning board in case you need to access it
});

// Config Data Store
export const useConfigData = defineStore('config_data', () => {
  // const api_url = ref("http://127.0.0.1:8000");
  const api_url = ref("https://work-seekwordscreator.onrender.com");

  function getApiUrl() { // Use camelCase for function names
    return api_url.value;
  }

  return { getApiUrl };
});
