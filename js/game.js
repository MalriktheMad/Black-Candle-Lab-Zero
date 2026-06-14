const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1800;
const FOREST_WIDTH = 3000;
const FOREST_HEIGHT = 3000;
const LAB_WIDTH = 920;
const LAB_HEIGHT = 620;
const DILLY_WIDTH = 880;
const DILLY_HEIGHT = 640;
const BEDROOM_WIDTH = 820;
const BEDROOM_HEIGHT = 560;
const MIN_ZOOM = 0.65;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM = 0.85;
const PATH_GRID_SIZE = 32;
const PATH_SEARCH_LIMIT = 14000;
const SURFACE_GRID_SIZE = 32;
const SAND_CELLS = new Set([
  "30,0",
  "31,0",
  "32,0",
  "36,0",
  "37,0",
  "38,0",
  "39,0",
  "58,0",
  "59,0",
  "60,0",
  "61,0",
  "62,0",
  "63,0",
  "64,0",
  "65,0",
  "66,0",
  "30,1",
  "31,1",
  "32,1",
  "33,1",
  "37,1",
  "38,1",
  "39,1",
  "40,1",
  "58,1",
  "59,1",
  "60,1",
  "61,1",
  "62,1",
  "63,1",
  "64,1",
  "65,1",
  "66,1",
  "30,2",
  "31,2",
  "32,2",
  "33,2",
  "34,2",
  "37,2",
  "38,2",
  "39,2",
  "40,2",
  "58,2",
  "59,2",
  "60,2",
  "61,2",
  "62,2",
  "63,2",
  "64,2",
  "65,2",
  "66,2",
  "31,3",
  "32,3",
  "33,3",
  "34,3",
  "38,3",
  "39,3",
  "40,3",
  "41,3",
  "58,3",
  "59,3",
  "60,3",
  "61,3",
  "62,3",
  "63,3",
  "64,3",
  "65,3",
  "66,3",
  "32,4",
  "33,4",
  "34,4",
  "35,4",
  "38,4",
  "39,4",
  "40,4",
  "41,4",
  "42,4",
  "43,4",
  "58,4",
  "59,4",
  "60,4",
  "61,4",
  "62,4",
  "63,4",
  "64,4",
  "65,4",
  "66,4",
  "32,5",
  "33,5",
  "34,5",
  "35,5",
  "36,5",
  "39,5",
  "40,5",
  "41,5",
  "42,5",
  "43,5",
  "44,5",
  "58,5",
  "59,5",
  "60,5",
  "61,5",
  "62,5",
  "63,5",
  "64,5",
  "65,5",
  "66,5",
  "33,6",
  "34,6",
  "35,6",
  "36,6",
  "40,6",
  "41,6",
  "42,6",
  "43,6",
  "44,6",
  "45,6",
  "57,6",
  "58,6",
  "59,6",
  "60,6",
  "61,6",
  "62,6",
  "63,6",
  "64,6",
  "65,6",
  "66,6",
  "34,7",
  "35,7",
  "36,7",
  "37,7",
  "38,7",
  "42,7",
  "43,7",
  "44,7",
  "45,7",
  "46,7",
  "57,7",
  "58,7",
  "59,7",
  "60,7",
  "61,7",
  "62,7",
  "63,7",
  "64,7",
  "65,7",
  "66,7",
  "34,8",
  "35,8",
  "36,8",
  "37,8",
  "38,8",
  "39,8",
  "43,8",
  "44,8",
  "45,8",
  "46,8",
  "47,8",
  "57,8",
  "58,8",
  "59,8",
  "60,8",
  "61,8",
  "62,8",
  "63,8",
  "64,8",
  "65,8",
  "35,9",
  "36,9",
  "37,9",
  "38,9",
  "39,9",
  "40,9",
  "44,9",
  "45,9",
  "46,9",
  "47,9",
  "48,9",
  "57,9",
  "58,9",
  "59,9",
  "60,9",
  "61,9",
  "62,9",
  "63,9",
  "64,9",
  "65,9",
  "66,9",
  "36,10",
  "37,10",
  "38,10",
  "39,10",
  "40,10",
  "41,10",
  "45,10",
  "46,10",
  "47,10",
  "48,10",
  "58,10",
  "59,10",
  "60,10",
  "61,10",
  "62,10",
  "63,10",
  "64,10",
  "65,10",
  "38,11",
  "39,11",
  "40,11",
  "41,11",
  "42,11",
  "46,11",
  "47,11",
  "48,11",
  "49,11",
  "63,11",
  "64,11",
  "39,12",
  "40,12",
  "41,12",
  "42,12",
  "43,12",
  "46,12",
  "47,12",
  "48,12",
  "49,12",
  "50,12",
  "40,13",
  "41,13",
  "42,13",
  "43,13",
  "47,13",
  "48,13",
  "49,13",
  "50,13",
  "41,14",
  "42,14",
  "43,14",
  "44,14",
  "48,14",
  "49,14",
  "50,14",
  "51,14",
  "41,15",
  "42,15",
  "43,15",
  "44,15",
  "45,15",
  "48,15",
  "49,15",
  "50,15",
  "51,15",
  "42,16",
  "43,16",
  "44,16",
  "45,16",
  "46,16",
  "49,16",
  "50,16",
  "51,16",
  "43,17",
  "44,17",
  "45,17",
  "46,17",
  "49,17",
  "50,17",
  "51,17",
  "44,18",
  "45,18",
  "46,18",
  "49,18",
  "50,18",
  "51,18",
  "52,18",
  "44,19",
  "45,19",
  "46,19",
  "49,19",
  "50,19",
  "51,19",
  "52,19",
  "44,20",
  "45,20",
  "46,20",
  "49,20",
  "50,20",
  "51,20",
  "52,20",
  "44,21",
  "45,21",
  "46,21",
  "49,21",
  "50,21",
  "51,21",
  "52,21",
  "43,22",
  "44,22",
  "45,22",
  "46,22",
  "49,22",
  "50,22",
  "51,22",
  "52,22",
  "36,23",
  "37,23",
  "38,23",
  "39,23",
  "40,23",
  "41,23",
  "42,23",
  "43,23",
  "44,23",
  "45,23",
  "46,23",
  "49,23",
  "50,23",
  "51,23",
  "34,24",
  "35,24",
  "36,24",
  "37,24",
  "38,24",
  "39,24",
  "40,24",
  "41,24",
  "42,24",
  "43,24",
  "44,24",
  "45,24",
  "48,24",
  "49,24",
  "50,24",
  "51,24",
  "52,24",
  "32,25",
  "33,25",
  "34,25",
  "35,25",
  "36,25",
  "37,25",
  "38,25",
  "39,25",
  "40,25",
  "41,25",
  "42,25",
  "43,25",
  "44,25",
  "47,25",
  "48,25",
  "49,25",
  "50,25",
  "51,25",
  "30,26",
  "31,26",
  "32,26",
  "33,26",
  "34,26",
  "35,26",
  "36,26",
  "37,26",
  "46,26",
  "47,26",
  "48,26",
  "49,26",
  "50,26",
  "51,26",
  "28,27",
  "29,27",
  "30,27",
  "31,27",
  "32,27",
  "33,27",
  "34,27",
  "35,27",
  "45,27",
  "46,27",
  "47,27",
  "48,27",
  "49,27",
  "27,28",
  "28,28",
  "29,28",
  "30,28",
  "31,28",
  "32,28",
  "39,28",
  "40,28",
  "41,28",
  "42,28",
  "43,28",
  "44,28",
  "45,28",
  "46,28",
  "47,28",
  "48,28",
  "26,29",
  "27,29",
  "28,29",
  "29,29",
  "30,29",
  "31,29",
  "36,29",
  "37,29",
  "38,29",
  "39,29",
  "40,29",
  "41,29",
  "42,29",
  "43,29",
  "44,29",
  "45,29",
  "46,29",
  "47,29",
  "25,30",
  "26,30",
  "27,30",
  "28,30",
  "29,30",
  "34,30",
  "35,30",
  "36,30",
  "37,30",
  "38,30",
  "39,30",
  "40,30",
  "41,30",
  "42,30",
  "43,30",
  "44,30",
  "45,30",
  "24,31",
  "25,31",
  "26,31",
  "27,31",
  "28,31",
  "32,31",
  "33,31",
  "34,31",
  "35,31",
  "36,31",
  "37,31",
  "38,31",
  "39,31",
  "40,31",
  "41,31",
  "42,31",
  "22,32",
  "23,32",
  "24,32",
  "25,32",
  "26,32",
  "27,32",
  "31,32",
  "32,32",
  "33,32",
  "34,32",
  "35,32",
  "36,32",
  "37,32",
  "22,33",
  "23,33",
  "24,33",
  "25,33",
  "26,33",
  "27,33",
  "30,33",
  "31,33",
  "32,33",
  "33,33",
  "34,33",
  "35,33",
  "21,34",
  "22,34",
  "23,34",
  "24,34",
  "25,34",
  "29,34",
  "30,34",
  "31,34",
  "32,34",
  "33,34",
  "21,35",
  "22,35",
  "23,35",
  "24,35",
  "25,35",
  "28,35",
  "29,35",
  "30,35",
  "31,35",
  "32,35",
  "20,36",
  "21,36",
  "22,36",
  "23,36",
  "24,36",
  "25,36",
  "27,36",
  "28,36",
  "29,36",
  "30,36",
  "31,36",
  "32,36",
  "18,37",
  "19,37",
  "20,37",
  "21,37",
  "22,37",
  "23,37",
  "24,37",
  "25,37",
  "27,37",
  "28,37",
  "29,37",
  "30,37",
  "31,37",
  "32,37",
  "33,37",
  "17,38",
  "18,38",
  "19,38",
  "20,38",
  "21,38",
  "22,38",
  "23,38",
  "24,38",
  "27,38",
  "28,38",
  "29,38",
  "30,38",
  "31,38",
  "32,38",
  "33,38",
  "14,39",
  "15,39",
  "16,39",
  "17,39",
  "18,39",
  "19,39",
  "20,39",
  "21,39",
  "22,39",
  "23,39",
  "24,39",
  "28,39",
  "29,39",
  "30,39",
  "31,39",
  "32,39",
  "33,39",
  "34,39",
  "35,39",
  "12,40",
  "13,40",
  "14,40",
  "15,40",
  "16,40",
  "17,40",
  "18,40",
  "19,40",
  "20,40",
  "21,40",
  "22,40",
  "23,40",
  "24,40",
  "28,40",
  "29,40",
  "30,40",
  "31,40",
  "32,40",
  "33,40",
  "34,40",
  "35,40",
  "36,40",
  "37,40",
  "71,40",
  "72,40",
  "73,40",
  "74,40",
  "0,41",
  "1,41",
  "2,41",
  "3,41",
  "4,41",
  "5,41",
  "6,41",
  "12,41",
  "13,41",
  "14,41",
  "15,41",
  "16,41",
  "17,41",
  "18,41",
  "19,41",
  "20,41",
  "21,41",
  "22,41",
  "29,41",
  "30,41",
  "31,41",
  "32,41",
  "33,41",
  "34,41",
  "35,41",
  "36,41",
  "37,41",
  "38,41",
  "67,41",
  "68,41",
  "69,41",
  "70,41",
  "71,41",
  "72,41",
  "73,41",
  "74,41",
  "0,42",
  "1,42",
  "2,42",
  "3,42",
  "4,42",
  "5,42",
  "6,42",
  "7,42",
  "8,42",
  "9,42",
  "10,42",
  "11,42",
  "12,42",
  "13,42",
  "14,42",
  "15,42",
  "16,42",
  "17,42",
  "18,42",
  "19,42",
  "23,42",
  "24,42",
  "25,42",
  "26,42",
  "30,42",
  "31,42",
  "32,42",
  "33,42",
  "34,42",
  "35,42",
  "36,42",
  "37,42",
  "38,42",
  "39,42",
  "64,42",
  "65,42",
  "66,42",
  "67,42",
  "68,42",
  "69,42",
  "70,42",
  "71,42",
  "72,42",
  "73,42",
  "74,42",
  "0,43",
  "1,43",
  "2,43",
  "3,43",
  "4,43",
  "5,43",
  "6,43",
  "7,43",
  "8,43",
  "9,43",
  "10,43",
  "11,43",
  "12,43",
  "13,43",
  "14,43",
  "15,43",
  "16,43",
  "17,43",
  "18,43",
  "21,43",
  "22,43",
  "23,43",
  "24,43",
  "25,43",
  "26,43",
  "27,43",
  "33,43",
  "34,43",
  "35,43",
  "36,43",
  "37,43",
  "38,43",
  "39,43",
  "40,43",
  "56,43",
  "57,43",
  "58,43",
  "59,43",
  "60,43",
  "61,43",
  "62,43",
  "63,43",
  "64,43",
  "65,43",
  "66,43",
  "67,43",
  "68,43",
  "69,43",
  "70,43",
  "71,43",
  "72,43",
  "73,43",
  "74,43",
  "0,44",
  "1,44",
  "2,44",
  "3,44",
  "4,44",
  "5,44",
  "6,44",
  "7,44",
  "8,44",
  "9,44",
  "10,44",
  "11,44",
  "12,44",
  "13,44",
  "14,44",
  "15,44",
  "20,44",
  "21,44",
  "22,44",
  "23,44",
  "24,44",
  "25,44",
  "26,44",
  "27,44",
  "28,44",
  "34,44",
  "35,44",
  "36,44",
  "37,44",
  "38,44",
  "39,44",
  "40,44",
  "41,44",
  "42,44",
  "43,44",
  "44,44",
  "45,44",
  "46,44",
  "47,44",
  "48,44",
  "49,44",
  "50,44",
  "51,44",
  "52,44",
  "53,44",
  "54,44",
  "55,44",
  "56,44",
  "57,44",
  "58,44",
  "59,44",
  "60,44",
  "61,44",
  "62,44",
  "63,44",
  "64,44",
  "65,44",
  "66,44",
  "67,44",
  "68,44",
  "69,44",
  "70,44",
  "71,44",
  "72,44",
  "73,44",
  "74,44",
  "0,45",
  "1,45",
  "2,45",
  "3,45",
  "4,45",
  "5,45",
  "6,45",
  "7,45",
  "8,45",
  "9,45",
  "10,45",
  "11,45",
  "12,45",
  "13,45",
  "14,45",
  "16,45",
  "17,45",
  "18,45",
  "19,45",
  "20,45",
  "21,45",
  "22,45",
  "23,45",
  "24,45",
  "25,45",
  "26,45",
  "27,45",
  "28,45",
  "29,45",
  "30,45",
  "35,45",
  "36,45",
  "37,45",
  "38,45",
  "39,45",
  "40,45",
  "41,45",
  "42,45",
  "43,45",
  "44,45",
  "45,45",
  "46,45",
  "47,45",
  "48,45",
  "49,45",
  "50,45",
  "51,45",
  "52,45",
  "53,45",
  "54,45",
  "55,45",
  "56,45",
  "57,45",
  "58,45",
  "59,45",
  "60,45",
  "61,45",
  "62,45",
  "63,45",
  "64,45",
  "65,45",
  "66,45",
  "67,45",
  "68,45",
  "69,45",
  "70,45",
  "71,45",
  "73,45",
  "0,46",
  "1,46",
  "2,46",
  "3,46",
  "4,46",
  "5,46",
  "6,46",
  "7,46",
  "8,46",
  "9,46",
  "10,46",
  "11,46",
  "12,46",
  "13,46",
  "16,46",
  "17,46",
  "18,46",
  "19,46",
  "20,46",
  "21,46",
  "22,46",
  "23,46",
  "24,46",
  "25,46",
  "26,46",
  "27,46",
  "28,46",
  "29,46",
  "30,46",
  "31,46",
  "32,46",
  "37,46",
  "38,46",
  "39,46",
  "40,46",
  "41,46",
  "42,46",
  "43,46",
  "44,46",
  "45,46",
  "46,46",
  "47,46",
  "48,46",
  "49,46",
  "50,46",
  "51,46",
  "52,46",
  "53,46",
  "54,46",
  "55,46",
  "56,46",
  "57,46",
  "58,46",
  "59,46",
  "60,46",
  "61,46",
  "62,46",
  "63,46",
  "64,46",
  "65,46",
  "66,46",
  "67,46",
  "68,46",
  "0,47",
  "1,47",
  "2,47",
  "3,47",
  "4,47",
  "6,47",
  "8,47",
  "9,47",
  "10,47",
  "11,47",
  "12,47",
  "16,47",
  "17,47",
  "18,47",
  "19,47",
  "20,47",
  "21,47",
  "22,47",
  "23,47",
  "24,47",
  "25,47",
  "26,47",
  "27,47",
  "28,47",
  "29,47",
  "30,47",
  "31,47",
  "32,47",
  "33,47",
  "38,47",
  "39,47",
  "40,47",
  "41,47",
  "42,47",
  "43,47",
  "44,47",
  "45,47",
  "46,47",
  "47,47",
  "48,47",
  "49,47",
  "50,47",
  "51,47",
  "52,47",
  "53,47",
  "54,47",
  "55,47",
  "56,47",
  "57,47",
  "58,47",
  "59,47",
  "60,47",
  "61,47",
  "62,47",
  "63,47",
  "64,47",
  "66,47",
  "67,47",
  "16,48",
  "17,48",
  "18,48",
  "19,48",
  "20,48",
  "21,48",
  "22,48",
  "23,48",
  "24,48",
  "25,48",
  "26,48",
  "27,48",
  "28,48",
  "29,48",
  "30,48",
  "31,48",
  "32,48",
  "33,48",
  "39,48",
  "40,48",
  "41,48",
  "42,48",
  "43,48",
  "44,48",
  "45,48",
  "46,48",
  "47,48",
  "48,48",
  "49,48",
  "50,48",
  "51,48",
  "52,48",
  "53,48",
  "54,48",
  "55,48",
  "56,48",
  "58,48",
  "17,49",
  "18,49",
  "19,49",
  "20,49",
  "21,49",
  "22,49",
  "23,49",
  "24,49",
  "25,49",
  "26,49",
  "27,49",
  "28,49",
  "29,49",
  "30,49",
  "31,49",
  "32,49",
  "33,49",
  "42,49",
  "43,49",
  "44,49",
  "45,49",
  "46,49",
  "47,49",
  "48,49",
  "49,49",
  "50,49",
  "51,49",
  "52,49",
  "53,49",
  "54,49",
  "55,49",
  "24,50",
  "25,50",
  "26,50",
  "27,50",
  "28,50",
  "29,50",
  "30,50",
  "31,50",
  "32,50",
  "33,50",
]);
const TRANSITION_COOLDOWN = 0.45;
const FLIGHT_TAKEOFF_MS = 380;
const FLIGHT_LAND_MS = 320;
const BLOCKED_TERRAIN = [
  { name: "lab-zero-building", left: 1952, top: 636, right: 2124, bottom: 754 },
  { name: "northeast-millet-1", left: 1988, top: 116, right: 2036, bottom: 164, flightPassable: true },
  { name: "northeast-millet-2", left: 2048, top: 236, right: 2096, bottom: 284, flightPassable: true },
  { name: "water-000", left: 1024, top: 0, right: 1216, bottom: 32, flightPassable: true },
  { name: "water-001", left: 1024, top: 32, right: 1216, bottom: 64, flightPassable: true },
  { name: "water-002", left: 1056, top: 64, right: 1248, bottom: 96, flightPassable: true },
  { name: "water-003", left: 1088, top: 96, right: 1248, bottom: 128, flightPassable: true },
  { name: "water-004", left: 1088, top: 128, right: 1280, bottom: 160, flightPassable: true },
  { name: "water-005", left: 1120, top: 160, right: 1312, bottom: 192, flightPassable: true },
  { name: "water-006", left: 1120, top: 192, right: 1376, bottom: 224, flightPassable: true },
  { name: "water-007", left: 1152, top: 224, right: 1408, bottom: 256, flightPassable: true },
  { name: "water-008", left: 1216, top: 256, right: 1440, bottom: 288, flightPassable: true },
  { name: "water-009", left: 1248, top: 288, right: 1472, bottom: 320, flightPassable: true },
  { name: "water-010", left: 1280, top: 320, right: 1504, bottom: 352, flightPassable: true },
  { name: "water-011", left: 1312, top: 352, right: 1536, bottom: 384, flightPassable: true },
  { name: "water-012", left: 1344, top: 384, right: 1536, bottom: 416, flightPassable: true },
  { name: "water-013", left: 1376, top: 416, right: 1568, bottom: 448, flightPassable: true },
  { name: "water-014", left: 1376, top: 448, right: 1568, bottom: 480, flightPassable: true },
  { name: "water-015", left: 1408, top: 480, right: 1600, bottom: 512, flightPassable: true },
  { name: "water-016", left: 1440, top: 512, right: 1600, bottom: 544, flightPassable: true },
  { name: "water-017", left: 1472, top: 544, right: 1600, bottom: 576, flightPassable: true },
  { name: "water-018", left: 1472, top: 576, right: 1600, bottom: 608, flightPassable: true },
  { name: "water-019", left: 1472, top: 608, right: 1632, bottom: 640, flightPassable: true },
  { name: "water-020", left: 1472, top: 640, right: 1632, bottom: 672, flightPassable: true },
  { name: "water-021", left: 1472, top: 672, right: 1632, bottom: 704, flightPassable: true },
  { name: "water-022", left: 1472, top: 704, right: 1600, bottom: 736, flightPassable: true },
  { name: "water-023", left: 1440, top: 736, right: 1600, bottom: 768, flightPassable: true },
  { name: "water-024", left: 1408, top: 768, right: 1600, bottom: 800, flightPassable: true },
  { name: "water-025", left: 1152, top: 800, right: 1600, bottom: 832, flightPassable: true },
  { name: "water-026", left: 1088, top: 832, right: 1568, bottom: 864, flightPassable: true },
  { name: "water-027", left: 1056, top: 864, right: 1504, bottom: 896, flightPassable: true },
  { name: "water-028", left: 992, top: 896, right: 1472, bottom: 928, flightPassable: true },
  { name: "water-029", left: 928, top: 928, right: 1312, bottom: 960, flightPassable: true },
  { name: "water-030", left: 896, top: 960, right: 1184, bottom: 992, flightPassable: true },
  { name: "water-031", left: 864, top: 992, right: 1120, bottom: 1024, flightPassable: true },
  { name: "water-032", left: 864, top: 1024, right: 1056, bottom: 1056, flightPassable: true },
  { name: "water-033", left: 800, top: 1056, right: 1024, bottom: 1088, flightPassable: true },
  { name: "water-034", left: 800, top: 1088, right: 992, bottom: 1120, flightPassable: true },
  { name: "water-035", left: 800, top: 1120, right: 960, bottom: 1152, flightPassable: true },
  { name: "water-036", left: 800, top: 1152, right: 928, bottom: 1184, flightPassable: true },
  { name: "water-037", left: 768, top: 1184, right: 896, bottom: 1216, flightPassable: true },
  { name: "water-038", left: 768, top: 1216, right: 928, bottom: 1248, flightPassable: true },
  { name: "water-039", left: 768, top: 1248, right: 928, bottom: 1280, flightPassable: true },
  { name: "water-040", left: 672, top: 1280, right: 960, bottom: 1312, flightPassable: true },
  { name: "water-041", left: 608, top: 1312, right: 1024, bottom: 1344, flightPassable: true },
  { name: "water-042", left: 576, top: 1344, right: 1088, bottom: 1376, flightPassable: true },
  { name: "water-043", left: 480, top: 1376, right: 768, bottom: 1408, flightPassable: true },
  { name: "water-044", left: 800, top: 1376, right: 1152, bottom: 1408, flightPassable: true },
  { name: "water-045", left: 2336, top: 1376, right: 2400, bottom: 1408, flightPassable: true },
  { name: "water-046", left: 448, top: 1408, right: 704, bottom: 1440, flightPassable: true },
  { name: "water-047", left: 864, top: 1408, right: 1184, bottom: 1440, flightPassable: true },
  { name: "water-048", left: 2208, top: 1408, right: 2400, bottom: 1440, flightPassable: true },
  { name: "water-049", left: 416, top: 1440, right: 672, bottom: 1472, flightPassable: true },
  { name: "water-050", left: 896, top: 1440, right: 1248, bottom: 1472, flightPassable: true },
  { name: "water-051", left: 2144, top: 1440, right: 2400, bottom: 1472, flightPassable: true },
  { name: "water-052", left: 0, top: 1472, right: 576, bottom: 1504, flightPassable: true },
  { name: "water-053", left: 960, top: 1472, right: 1248, bottom: 1504, flightPassable: true },
  { name: "water-054", left: 1920, top: 1472, right: 2400, bottom: 1504, flightPassable: true },
  { name: "water-055", left: 0, top: 1504, right: 544, bottom: 1536, flightPassable: true },
  { name: "water-056", left: 992, top: 1504, right: 1280, bottom: 1536, flightPassable: true },
  { name: "water-057", left: 1792, top: 1504, right: 2400, bottom: 1536, flightPassable: true },
  { name: "water-058", left: 0, top: 1536, right: 640, bottom: 1568, flightPassable: true },
  { name: "water-059", left: 1056, top: 1536, right: 2400, bottom: 1568, flightPassable: true },
  { name: "water-060", left: 0, top: 1568, right: 864, bottom: 1600, flightPassable: true },
  { name: "water-061", left: 1024, top: 1568, right: 2400, bottom: 1600, flightPassable: true },
  { name: "water-062", left: 0, top: 1600, right: 2400, bottom: 1632, flightPassable: true },
  { name: "water-063", left: 0, top: 1632, right: 2400, bottom: 1664, flightPassable: true },
  { name: "water-064", left: 0, top: 1664, right: 2400, bottom: 1696, flightPassable: true },
  { name: "water-065", left: 0, top: 1696, right: 2400, bottom: 1728, flightPassable: true },
  { name: "water-066", left: 0, top: 1728, right: 2400, bottom: 1760, flightPassable: true },
  { name: "water-067", left: 0, top: 1760, right: 2400, bottom: 1792, flightPassable: true },
  { name: "water-068", left: 0, top: 1792, right: 2400, bottom: 1824, flightPassable: true },
];
const LAB_BLOCKED_TERRAIN = [
  { name: "lab-furniture", left: 42, top: 361, right: 300, bottom: 594 },
  { name: "lab-pc-monitor", left: 310, top: 50, right: 413, bottom: 173 },
  { name: "wing-master-cricket", left: 492, top: 74, right: 609, bottom: 177 },
  { name: "candlewick-workstation", left: 672, top: 52, right: 847, bottom: 187 }
];
const BEDROOM_BLOCKED_TERRAIN = [];
const DILLY_BLOCKED_TERRAIN = [
  { name: "old-dilly", left: 90, top: 152, right: 213, bottom: 296 },
  { name: "liz", left: 267, top: 158, right: 432, bottom: 314 }
];
const FOREST_BLOCKED_TERRAIN = [
  { name: "old-dilly-house", left: 2314, top: 2282, right: 2498, bottom: 2490 }
];
const FOREST_CANOPY_ROWS = [
  [0, [[0, 93]]],
  [1, [[0, 93]]],
  [2, [[0, 93]]],
  [3, [[0, 93]]],
  [4, [[0, 93]]],
  [5, [[0, 93]]],
  [6, [[0, 93]]],
  [7, [[0, 93]]],
  [8, [[0, 93]]],
  [9, [[0, 93]]],
  [10, [[0, 93]]],
  [11, [[0, 93]]],
  [12, [[0, 93]]],
  [13, [[0, 93]]],
  [14, [[0, 93]]],
  [15, [[0, 93]]],
  [16, [[0, 93]]],
  [17, [[0, 93]]],
  [18, [[0, 93]]],
  [19, [[0, 93]]],
  [20, [[0, 93]]],
  [21, [[0, 93]]],
  [22, [[0, 93]]],
  [23, [[0, 93]]],
  [24, [[0, 93]]],
  [25, [[0, 93]]],
  [26, [[0, 93]]],
  [27, [[0, 34], [37, 37], [40, 93]]],
  [28, [[0, 33], [44, 93]]],
  [29, [[0, 33], [44, 93]]],
  [30, [[0, 33], [44, 93]]],
  [31, [[0, 33], [44, 93]]],
  [32, [[0, 33], [43, 93]]],
  [33, [[0, 34], [43, 93]]],
  [34, [[0, 34], [43, 93]]],
  [35, [[0, 35], [43, 93]]],
  [36, [[0, 35], [43, 93]]],
  [37, [[0, 35], [42, 93]]],
  [38, [[0, 35], [42, 93]]],
  [39, [[0, 35], [42, 93]]],
  [40, [[0, 35], [42, 93]]],
  [41, [[0, 36], [42, 93]]],
  [42, [[0, 36], [41, 93]]],
  [43, [[0, 36], [41, 93]]],
  [44, [[0, 36], [40, 93]]],
  [45, [[0, 37], [40, 93]]],
  [46, [[0, 37], [41, 93]]],
  [47, [[0, 37], [41, 93]]],
  [48, [[0, 36], [41, 93]]],
  [49, [[0, 35], [41, 93]]],
  [50, [[0, 34], [40, 93]]],
  [51, [[0, 34], [40, 93]]],
  [52, [[0, 35], [39, 93]]],
  [53, [[0, 35], [39, 93]]],
  [54, [[0, 35], [39, 93]]],
  [55, [[0, 35], [39, 52], [57, 93]]],
  [56, [[0, 35], [39, 52], [58, 93]]],
  [57, [[0, 35], [39, 52], [59, 93]]],
  [58, [[0, 33], [40, 44], [48, 52], [59, 93]]],
  [59, [[0, 33], [40, 43], [49, 50], [59, 93]]],
  [60, [[0, 33], [40, 42], [59, 93]]],
  [61, [[0, 31], [60, 93]]],
  [62, [[0, 29], [61, 93]]],
  [63, [[0, 29], [66, 93]]],
  [64, [[0, 30], [66, 93]]],
  [65, [[0, 30], [67, 93]]],
  [66, [[0, 29], [53, 58], [68, 70], [72, 72], [76, 93]]],
  [67, [[0, 30], [52, 59], [79, 93]]],
  [68, [[0, 30], [49, 59], [80, 93]]],
  [69, [[0, 36], [38, 60], [80, 93]]],
  [70, [[0, 60], [80, 93]]],
  [71, [[0, 61], [81, 93]]],
  [72, [[0, 61], [82, 93]]],
  [73, [[0, 61], [81, 93]]],
  [74, [[0, 61], [81, 93]]],
  [75, [[0, 61], [81, 93]]],
  [76, [[0, 62], [81, 93]]],
  [77, [[0, 62], [81, 93]]],
  [78, [[0, 62], [81, 93]]],
  [79, [[0, 63], [81, 93]]],
  [80, [[0, 64], [81, 93]]],
  [81, [[0, 64], [81, 93]]],
  [82, [[0, 64], [80, 93]]],
  [83, [[0, 64], [79, 93]]],
  [84, [[0, 64], [78, 93]]],
  [85, [[0, 63], [78, 93]]],
  [86, [[0, 63], [76, 93]]],
  [87, [[0, 62], [72, 72], [75, 93]]],
  [88, [[0, 61], [71, 72], [74, 93]]],
  [89, [[0, 61], [71, 93]]],
  [90, [[0, 62], [71, 93]]],
  [91, [[0, 61], [70, 93]]],
  [92, [[0, 61], [70, 93]]],
  [93, [[0, 60], [69, 93]]]
];
const FOREST_CANOPY_ROW_MAP = new Map(FOREST_CANOPY_ROWS);

const stage = document.getElementById("stage");
const world = document.getElementById("world");
const player = document.getElementById("player");
const targetEl = document.getElementById("target");
const forestArea = document.getElementById("forest-area");
const forestPlayer = document.getElementById("forest-player");
const forestTarget = document.getElementById("forest-target");
const labInterior = document.getElementById("lab-interior");
const interiorPlayer = document.getElementById("interior-player");
const interiorTarget = document.getElementById("interior-target");
const bedroomInterior = document.getElementById("bedroom-interior");
const bedroomPlayer = document.getElementById("bedroom-player");
const bedroomTarget = document.getElementById("bedroom-target");
const dillyInterior = document.getElementById("dilly-interior");
const dillyPlayer = document.getElementById("dilly-player");
const dillyTarget = document.getElementById("dilly-target");
const readout = document.getElementById("readout");
const quickNav = document.getElementById("quick-nav");
const zoomControls = document.getElementById("zoom-controls");
const flightControls = document.getElementById("flight-controls");
const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");
const flightToggle = document.getElementById("flight-toggle");

const AREAS = {
  outside: {
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    element: world,
    player,
    target: targetEl,
    blocked: BLOCKED_TERRAIN,
    transitions: [
      { left: 1996, top: 724, right: 2106, bottom: 818, to: "lab", entryX: 752, entryY: 456 },
      { left: 1254, top: 0, right: 1403, bottom: 95, to: "forest", entryX: 2095, entryY: 2910 }
    ]
  },
  forest: {
    width: FOREST_WIDTH,
    height: FOREST_HEIGHT,
    element: forestArea,
    player: forestPlayer,
    target: forestTarget,
    blocked: FOREST_BLOCKED_TERRAIN,
    canopyRows: FOREST_CANOPY_ROW_MAP,
    transitions: [
      { left: 2024, top: 2930, right: 2166, bottom: 2963, to: "outside", entryX: 1328, entryY: 128 },
      { left: 2320, top: 2490, right: 2490, bottom: 2560, to: "dilly", entryX: 748, entryY: 320 }
    ]
  },
  lab: {
    width: LAB_WIDTH,
    height: LAB_HEIGHT,
    element: labInterior,
    player: interiorPlayer,
    target: interiorTarget,
    blocked: LAB_BLOCKED_TERRAIN,
    transitions: [
      { left: 792, top: 488, right: 862, bottom: 565, to: "outside", entryX: 2052, entryY: 832 },
      { left: 62, top: 45, right: 191, bottom: 159, to: "bedroom", entryX: 536, entryY: 232 }
    ]
  },
  bedroom: {
    width: BEDROOM_WIDTH,
    height: BEDROOM_HEIGHT,
    element: bedroomInterior,
    player: bedroomPlayer,
    target: bedroomTarget,
    blocked: BEDROOM_BLOCKED_TERRAIN,
    transitions: [
      { left: 570, top: 32, right: 740, bottom: 204, to: "lab", entryX: 210, entryY: 184 }
    ]
  },
  dilly: {
    width: DILLY_WIDTH,
    height: DILLY_HEIGHT,
    element: dillyInterior,
    player: dillyPlayer,
    target: dillyTarget,
    blocked: DILLY_BLOCKED_TERRAIN,
    transitions: [
      { left: 792, top: 252, right: 874, bottom: 404, to: "forest", entryX: 2405, entryY: 2588 }
    ]
  }
};

const state = {
  area: "bedroom",
  x: 138,
  y: 162,
  targetX: 138,
  targetY: 162,
  path: [],
  speed: 260,
  zoom: DEFAULT_ZOOM,
  cameraX: 0,
  cameraY: 0,
  transitionCooldown: 0,
  flightMode: false,
  flightPhase: "ground",
  flightTimer: 0,
  lastTime: performance.now()
};

initializeAreaVisibility();
placePlayer();
placeTarget();
placeCamera();
syncPlayerAnimationState();
requestAnimationFrame(tick);

stage.addEventListener("pointerdown", setTarget);
stage.addEventListener("pointermove", (event) => {
  if (event.buttons === 1 && event.pointerType !== "mouse") {
    setTarget(event);
  }
});

[readout, quickNav, zoomControls, flightControls].filter(Boolean).forEach((element) => {
  element.addEventListener("pointerdown", stopUiMovement);
});

zoomIn.addEventListener("click", () => changeZoom(ZOOM_STEP));
zoomOut.addEventListener("click", () => changeZoom(-ZOOM_STEP));
if (flightToggle) {
  flightToggle.addEventListener("click", toggleFlightMode);
}

window.addEventListener("resize", () => {
  state.x = clampWorldX(state.x);
  state.y = clampWorldY(state.y);
  state.targetX = clampWorldX(state.targetX);
  state.targetY = clampWorldY(state.targetY);
  state.path = [];
  placePlayer();
  placeTarget();
  placeCamera();
});

function initializeAreaVisibility() {
  Object.values(AREAS).forEach((area) => {
    area.element.hidden = area !== getActiveArea();
  });
}

function stopUiMovement(event) {
  event.stopPropagation();
}

function isGamePausedForDialogue() {
  return typeof isDialogueActive === "function" && isDialogueActive();
}

function isMovementLockedForBedroomCage() {
  return typeof isBedroomCageBreakoutPending === "function" && isBedroomCageBreakoutPending();
}

function setTarget(event) {
  if (isGamePausedForDialogue()) {
    return;
  }

  if (isMovementLockedForBedroomCage()) {
    return;
  }

  if (event.target.closest(".readout, .quick-nav, .zoom-controls, .flight-controls, .start-menu")) {
    return;
  }

  const point = screenToWorld(event.clientX, event.clientY);
  const requested = {
    x: clampWorldX(point.x),
    y: clampWorldY(point.y)
  };
  const destination = findNearestWalkablePoint(requested.x, requested.y);

  if (!destination) {
    state.path = [];
    setPlayerMoving(false);
    return;
  }

  state.targetX = destination.x;
  state.targetY = destination.y;
  state.path = findPath(state.x, state.y, destination.x, destination.y);
  getActiveArea().target.classList.add("visible");
  placeTarget();
}

function changeZoom(amount) {
  state.zoom = clamp(roundZoom(state.zoom + amount), MIN_ZOOM, MAX_ZOOM);
  placeCamera();
}

function toggleFlightMode() {
  if (state.flightPhase === "taking-off" || state.flightPhase === "landing") {
    return;
  }

  if (state.flightMode) {
    startLanding();
  } else {
    startTakeoff();
  }
}

function startTakeoff() {
  state.flightMode = true;
  state.flightPhase = "taking-off";
  clearTimeout(state.flightTimer);
  syncPlayerAnimationState();

  state.flightTimer = setTimeout(() => {
    if (state.flightMode && state.flightPhase === "taking-off") {
      state.flightPhase = "flying";
      syncPlayerAnimationState();
    }
  }, FLIGHT_TAKEOFF_MS);
}

function startLanding() {
  state.flightMode = false;
  state.flightPhase = "landing";
  state.path = [];
  getActiveArea().target.classList.remove("visible");
  clearTimeout(state.flightTimer);
  syncPlayerAnimationState();

  state.flightTimer = setTimeout(() => {
    if (!state.flightMode && state.flightPhase === "landing") {
      state.flightPhase = "ground";
      syncPlayerAnimationState();
    }
  }, FLIGHT_LAND_MS);
}

function tick(now) {
  const delta = Math.min((now - state.lastTime) / 1000, 0.05);
  state.lastTime = now;
  state.transitionCooldown = Math.max(0, state.transitionCooldown - delta);

  
  if (isGamePausedForDialogue()) {
    state.path = [];
    getActiveArea().target.classList.remove("visible");
    setPlayerMoving(false);
    requestAnimationFrame(tick);
    return;
  }

  if (state.path.length > 0) {
    followPath(delta);
  } else {
    getActiveArea().target.classList.remove("visible");
  }

  setPlayerMoving(state.path.length > 0);
  requestAnimationFrame(tick);
}

function followPath(delta) {
  const waypoint = state.path[0];
  const dx = waypoint.x - state.x;
  const dy = waypoint.y - state.y;
  const distance = Math.hypot(dx, dy);
  const step = state.speed * delta;

  if (distance <= Math.max(1, step)) {
    state.x = waypoint.x;
    state.y = waypoint.y;
    state.path.shift();
    placePlayer();
    placeCamera();
    enterTransitionAtCurrentPosition();
    return;
  }

  const nextX = state.x + (dx / distance) * step;
  const nextY = state.y + (dy / distance) * step;
  const transition = getTransition(nextX, nextY);

  if (transition && state.transitionCooldown === 0) {
    enterArea(transition.to, transition.entryX, transition.entryY);
  } else if (isUiBlocked(nextX, nextY) || isTerrainBlocked(nextX, nextY)) {
    state.path = [];
    state.targetX = state.x;
    state.targetY = state.y;
    getActiveArea().target.classList.remove("visible");
  } else {
    getActiveArea().player.classList.toggle("facing-left", dx > 1);
    state.x = nextX;
    state.y = nextY;
    placePlayer();
    placeCamera();
  }
}

function enterTransitionAtCurrentPosition() {
  const transition = getTransition(state.x, state.y);

  if (transition && state.transitionCooldown === 0) {
    enterArea(transition.to, transition.entryX, transition.entryY);
  }
}

function placePlayer() {
  const area = getActiveArea();
  area.player.style.left = `${state.x}px`;
  area.player.style.top = `${state.y}px`;
  syncSurfaceState();
}

function syncSurfaceState() {
  Object.values(AREAS).forEach((area) => {
    area.player.classList.toggle("on-sand", area === getActiveArea() && state.area === "outside" && isSandPoint(state.x, state.y));
  });
}

function isSandPoint(worldX, worldY) {
  if (state.area !== "outside") {
    return false;
  }

  const cellX = Math.floor(worldX / SURFACE_GRID_SIZE);
  const cellY = Math.floor(worldY / SURFACE_GRID_SIZE);
  return SAND_CELLS.has(`${cellX},${cellY}`);
}

function setPlayerMoving(isMoving) {
  Object.values(AREAS).forEach((area) => {
    area.player.classList.toggle("is-moving", area === getActiveArea() && isMoving);
  });
  syncPlayerAnimationState();
}

function syncPlayerAnimationState() {
  Object.values(AREAS).forEach((area) => {
    const isActive = area === getActiveArea();
    area.player.classList.toggle("is-taking-off", isActive && state.flightPhase === "taking-off");
    area.player.classList.toggle("is-flying", isActive && state.flightPhase === "flying");
    area.player.classList.toggle("is-landing", isActive && state.flightPhase === "landing");
  });

  if (flightToggle) {
    flightToggle.textContent = state.flightMode ? "Land" : "Fly";
    flightToggle.setAttribute("aria-label", state.flightMode ? "Land" : "Take flight");
    flightToggle.setAttribute("aria-pressed", String(state.flightMode));
  }
}

function placeTarget() {
  const area = getActiveArea();
  area.target.style.left = `${state.targetX}px`;
  area.target.style.top = `${state.targetY}px`;
}

function placeCamera() {
  const area = getActiveArea();
  const scaledWidth = area.width * state.zoom;
  const scaledHeight = area.height * state.zoom;
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;

  state.cameraX = scaledWidth <= viewWidth
    ? (viewWidth - scaledWidth) / 2
    : clamp(viewWidth / 2 - state.x * state.zoom, viewWidth - scaledWidth, 0);
  state.cameraY = scaledHeight <= viewHeight
    ? (viewHeight - scaledHeight) / 2
    : clamp(viewHeight / 2 - state.y * state.zoom, viewHeight - scaledHeight, 0);

  area.element.style.transform = `translate(${state.cameraX}px, ${state.cameraY}px) scale(${state.zoom})`;
}

function screenToWorld(screenX, screenY) {
  return {
    x: (screenX - state.cameraX) / state.zoom,
    y: (screenY - state.cameraY) / state.zoom
  };
}

function worldToScreen(worldX, worldY) {
  return {
    x: state.cameraX + worldX * state.zoom,
    y: state.cameraY + worldY * state.zoom
  };
}

function isUiBlocked(worldX, worldY) {
  const screenPoint = worldToScreen(worldX, worldY);
  return getBlockedRects().some((rect) => {
    return screenPoint.x >= rect.left && screenPoint.x <= rect.right && screenPoint.y >= rect.top && screenPoint.y <= rect.bottom;
  });
}

function isTerrainBlocked(worldX, worldY) {
  const radius = 18;
  if (!state.flightMode && isAreaCanopyBlocked(worldX, worldY)) {
    return true;
  }

  return getActiveArea().blocked.some((rect) => {
    if (rect.flightPassable && state.flightMode) {
      return false;
    }
    return worldX >= rect.left - radius && worldX <= rect.right + radius && worldY >= rect.top - radius && worldY <= rect.bottom + radius;
  });
}

function isAreaCanopyBlocked(worldX, worldY) {
  const canopyRows = getActiveArea().canopyRows;
  if (!canopyRows) {
    return false;
  }

  const cellX = Math.floor(worldX / PATH_GRID_SIZE);
  const cellY = Math.floor(worldY / PATH_GRID_SIZE);
  const ranges = canopyRows.get(cellY);
  return Boolean(ranges && ranges.some(([left, right]) => cellX >= left && cellX <= right));
}

function isWalkablePoint(worldX, worldY) {
  return !isTerrainBlocked(worldX, worldY) && worldX >= 24 && worldX <= getActiveArea().width - 24 && worldY >= 24 && worldY <= getActiveArea().height - 24;
}

function getTransition(worldX, worldY) {
  return getActiveArea().transitions.find((rect) => {
    return worldX >= rect.left && worldX <= rect.right && worldY >= rect.top && worldY <= rect.bottom;
  });
}

function enterArea(areaName, x, y) {
  const currentArea = getActiveArea();
  currentArea.target.classList.remove("visible");
  currentArea.element.hidden = true;

  state.area = areaName;
  state.x = x;
  state.y = y;
  state.targetX = x;
  state.targetY = y;
  state.path = [];
  state.transitionCooldown = TRANSITION_COOLDOWN;

  const nextArea = getActiveArea();
  nextArea.element.hidden = false;
  Object.values(AREAS).forEach((area) => area.player.classList.remove("is-moving"));
  nextArea.player.classList.remove("facing-left");
  syncPlayerAnimationState();
  placePlayer();
  placeTarget();
  placeCamera();
}

function getActiveArea() {
  return AREAS[state.area];
}

function findPath(startX, startY, endX, endY) {
  const start = findNearestWalkableCell(worldToCell(startX), worldToCell(startY));
  const end = findNearestWalkableCell(worldToCell(endX), worldToCell(endY));

  if (!start || !end) {
    return [];
  }

  if (start.key === end.key) {
    return [{ x: endX, y: endY }];
  }

  const open = [makePathNode(start.x, start.y, null, 0, getCellDistance(start, end))];
  const best = new Map([[start.key, open[0]]]);
  const closed = new Set();
  let searched = 0;

  while (open.length > 0 && searched < PATH_SEARCH_LIMIT) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();

    if (closed.has(current.key)) {
      continue;
    }

    if (current.key === end.key) {
      return simplifyPath(buildWaypointPath(current, endX, endY)).slice(1);
    }

    closed.add(current.key);
    searched += 1;

    getNeighbors(current).forEach((neighbor) => {
      if (closed.has(neighbor.key) || !isWalkableCell(neighbor.x, neighbor.y)) {
        return;
      }

      if (neighbor.diagonal && (!isWalkableCell(current.x + neighbor.dx, current.y) || !isWalkableCell(current.x, current.y + neighbor.dy))) {
        return;
      }

      const moveCost = neighbor.diagonal ? Math.SQRT2 : 1;
      const g = current.g + moveCost;
      const previous = best.get(neighbor.key);

      if (!previous || g < previous.g) {
        const node = makePathNode(neighbor.x, neighbor.y, current, g, getCellDistance(neighbor, end));
        best.set(neighbor.key, node);
        open.push(node);
      }
    });
  }

  return [];
}

function buildWaypointPath(node, exactEndX, exactEndY) {
  const path = [];
  let current = node;

  while (current) {
    path.unshift(cellToWorld(current.x, current.y));
    current = current.parent;
  }

  path.push({ x: exactEndX, y: exactEndY });
  return path;
}

function simplifyPath(path) {
  if (path.length <= 2) {
    return path;
  }

  const simplified = [path[0]];
  let anchorIndex = 0;

  for (let index = 2; index < path.length; index += 1) {
    if (!hasLineOfSight(path[anchorIndex], path[index])) {
      simplified.push(path[index - 1]);
      anchorIndex = index - 1;
    }
  }

  simplified.push(path[path.length - 1]);
  return simplified;
}

function hasLineOfSight(from, to) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const samples = Math.max(1, Math.ceil(distance / (PATH_GRID_SIZE / 2)));

  for (let index = 1; index <= samples; index += 1) {
    const ratio = index / samples;
    const x = from.x + (to.x - from.x) * ratio;
    const y = from.y + (to.y - from.y) * ratio;

    if (!isWalkablePoint(x, y)) {
      return false;
    }
  }

  return true;
}

function findNearestWalkablePoint(worldX, worldY) {
  if (isWalkablePoint(worldX, worldY)) {
    return { x: worldX, y: worldY };
  }

  const cell = findNearestWalkableCell(worldToCell(worldX), worldToCell(worldY));
  return cell ? cellToWorld(cell.x, cell.y) : null;
}

function findNearestWalkableCell(startX, startY) {
  const maxColumns = Math.ceil(getActiveArea().width / PATH_GRID_SIZE);
  const maxRows = Math.ceil(getActiveArea().height / PATH_GRID_SIZE);
  const originX = clamp(startX, 0, maxColumns - 1);
  const originY = clamp(startY, 0, maxRows - 1);

  if (isWalkableCell(originX, originY)) {
    return makeCell(originX, originY);
  }

  const maxRadius = Math.max(maxColumns, maxRows);

  for (let radius = 1; radius <= maxRadius; radius += 1) {
    for (let y = originY - radius; y <= originY + radius; y += 1) {
      for (let x = originX - radius; x <= originX + radius; x += 1) {
        const onEdge = x === originX - radius || x === originX + radius || y === originY - radius || y === originY + radius;

        if (onEdge && isWalkableCell(x, y)) {
          return makeCell(x, y);
        }
      }
    }
  }

  return null;
}

function getNeighbors(cell) {
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: -1, diagonal: true },
    { dx: 1, dy: 1, diagonal: true },
    { dx: -1, dy: 1, diagonal: true },
    { dx: -1, dy: -1, diagonal: true }
  ];

  return directions.map((direction) => ({
    x: cell.x + direction.dx,
    y: cell.y + direction.dy,
    dx: direction.dx,
    dy: direction.dy,
    diagonal: Boolean(direction.diagonal),
    key: getCellKey(cell.x + direction.dx, cell.y + direction.dy)
  }));
}

function isWalkableCell(cellX, cellY) {
  const maxColumns = Math.ceil(getActiveArea().width / PATH_GRID_SIZE);
  const maxRows = Math.ceil(getActiveArea().height / PATH_GRID_SIZE);

  if (cellX < 0 || cellX >= maxColumns || cellY < 0 || cellY >= maxRows) {
    return false;
  }

  const point = cellToWorld(cellX, cellY);
  return isWalkablePoint(point.x, point.y);
}

function makePathNode(x, y, parent, g, h) {
  return {
    x,
    y,
    parent,
    g,
    h,
    f: g + h,
    key: getCellKey(x, y)
  };
}

function makeCell(x, y) {
  return {
    x,
    y,
    key: getCellKey(x, y)
  };
}

function getCellDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function worldToCell(value) {
  return Math.floor(value / PATH_GRID_SIZE);
}

function cellToWorld(cellX, cellY) {
  return {
    x: clamp(cellX * PATH_GRID_SIZE + PATH_GRID_SIZE / 2, 24, getActiveArea().width - 24),
    y: clamp(cellY * PATH_GRID_SIZE + PATH_GRID_SIZE / 2, 24, getActiveArea().height - 24)
  };
}

function getCellKey(cellX, cellY) {
  return `${cellX},${cellY}`;
}

function getBlockedRects() {
  return [readout, quickNav, zoomControls, flightControls].filter(Boolean).map((element) => {
    const rect = element.getBoundingClientRect();
    const padding = getPlayerRadius() * state.zoom + 8;
    return {
      left: rect.left - padding,
      right: rect.right + padding,
      top: rect.top - padding,
      bottom: rect.bottom + padding
    };
  });
}

function getPlayerRadius() {
  return player.getBoundingClientRect().width / 2;
}

function clampWorldX(value) {
  return clamp(value, 32, getActiveArea().width - 32);
}

function clampWorldY(value) {
  return clamp(value, 32, getActiveArea().height - 32);
}

function roundZoom(value) {
  return Math.round(value * 100) / 100;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}



















