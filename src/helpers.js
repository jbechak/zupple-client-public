import { reactive } from "vue";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { CONSTANTS } from "./constants";
import WordsearchEditTab from '@/components/WordSearch/WordsearchEditTab.vue'
import CrosswordEditTab from '@/components/Crossword/CrosswordEditTab.vue'
import SudokuEditTab from '@/components/SuDoku/SudokuEditTab.vue'
import WordsearchPuzzle from "@/components/WordSearch/WordsearchPuzzle.vue";
import CrosswordPuzzle from "@/components/Crossword/CrosswordPuzzle.vue";
import SudokuPuzzle from "@/components/SuDoku/SudokuPuzzle.vue";
import * as yup from 'yup';

export function getGuid() {
  return Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);
}

export const toTitleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);
export const displayToast = (msg, type) => 
  toast(msg, { 
    autoClose: 1500, 
    type: type, 
    hideProgressBar: true
  });

const defaultSortColumn = {
  name: 'title',
  isDesc: false,
};

export const sortColumn = reactive({
  wordsearch: {},
  crossword: {},
  sudoku: {},
});

Object.assign(sortColumn.wordsearch, defaultSortColumn);
Object.assign(sortColumn.crossword, defaultSortColumn);
Object.assign(sortColumn.sudoku, defaultSortColumn);

export function sortBy(listingData, column, puzzleType, isNumber = false) {
  console.log('sortBy', listingData, column, puzzleType);
  const sortCol = sortColumn[puzzleType];

  if (sortCol.name === column) {
    sortCol.isDesc = !sortCol.isDesc;
  } else {
    sortCol.name = column;
    sortCol.isDesc = false;
  }
  console.log('sortCol', sortCol)
  sortColumn[puzzleType].isDesc
    ? sortDescending(listingData, sortCol, isNumber)
    : sortAscending(listingData, sortCol, isNumber);
}

function sortAscending(listingData, sortCol, isNumber) {
  if (isNumber) {
    listingData.sort((a,b) => a[sortCol.name] - b[sortCol.name]);
  } else {
    listingData.sort((a,b) => (a[sortCol.name].toLowerCase() > b[sortCol.name].toLowerCase()) 
        ? 1 
        : ((b[sortCol.name].toLowerCase() > a[sortCol.name].toLowerCase()) 
          ? -1 
          : 0
    ));
  }
}

function sortDescending(listingData, sortCol, isNumber) {
  if (isNumber) {
    listingData.sort((a,b) => b[sortCol.name] - a[sortCol.name]);
  } else {
    listingData.sort((a,b) => (b[sortCol.name].toLowerCase() > a[sortCol.name].toLowerCase()) 
        ? 1 
        : ((a[sortCol.name].toLowerCase() > b[sortCol.name].toLowerCase()) 
          ? -1 
          : 0
    ));
  }
}

export const defaultFormData = {
  wordsearch: {
    id: null,
    userId: null,
    title: null,
    height: 3,
    width: 3,
    wordDirections: 1,
    wordCollection: [],
    wordListObj: {},
    isSaveEnabled: true,
  },
  crossword:  {
    id: null,
    userId: null,
    title: null,
    wordClues: {},
    wordClueListObj: {},
    acrossClueList: [],
    acrossClueMap: {},
    downClueList: [],
    downClueMap: {},
    gridString: null,
    instructions: null,
    height: null,
    width: null,
    isSaveEnabled: true,
  },
  sudoku: {
    id: null,
    userId: null,
    title: null,
    showTitle: false,
    difficulty: 1,
    showDifficulty: false,
    isSaveEnabled: true,
  }
}

const getColumn = (field, header, isNumber = false, sortField = null) => 
  ({
    field: field,
    header: header,
    isNumber: isNumber,
    sortField: sortField,
  });

export const columns = {
  wordsearch: [
    getColumn(CONSTANTS.TITLE, "Title"),
    getColumn(CONSTANTS.DIFFICULTY, "Difficulty"),
    getColumn(CONSTANTS.WORDS, "Words", true),
    getColumn(CONSTANTS.WIDTH, "Width", true),
    getColumn(CONSTANTS.HEIGHT, "Height", true),
  ],
  crossword: [
    getColumn(CONSTANTS.TITLE, "Title"),
    getColumn(CONSTANTS.WORDS, "Words", true),
    getColumn(CONSTANTS.WIDTH, "Width", true),
    getColumn(CONSTANTS.HEIGHT, "Height", true),
  ],
  sudoku: [
    getColumn(CONSTANTS.TITLE, "Title"),
    getColumn("formattedDifficulty", "Difficulty", true, CONSTANTS.DIFFICULTY),
  ]
};

const components = {
  edit: {
    [CONSTANTS.WORDSEARCH]: WordsearchEditTab,
    [CONSTANTS.CROSSWORD]: CrosswordEditTab,
    [CONSTANTS.SUDOKU]: SudokuEditTab,
  },
  puzzle: {
    [CONSTANTS.WORDSEARCH]: WordsearchPuzzle,
    [CONSTANTS.CROSSWORD]: CrosswordPuzzle,
    [CONSTANTS.SUDOKU]: SudokuPuzzle,
  }
};

export function getComponent(puzzleType, componentType) {
  return components[componentType][puzzleType];
}

export function nullIfEmpty(event, formData, property) {
  console.log('event', event)
  formData[property] = event.target.value === '' ? null : event.target.value;
}

// export function validateForm(validationSchema) {
//   let validationErrors = [];
//   let status = true;
//   try {
//     validationSchema.validateSync(props.formData, { abortEarly: false });
//     //status = true;
//     //return { status: true, errors: validationErrors };
//   } catch (error) {
//     error.inner.forEach(e => {
//         validationErrors.value.push(e.message);
//     });
//     status = false
//     // return { status: false, errors: validationErrors };
//   }
//   return { status: status, errors: validationErrors };
// }
