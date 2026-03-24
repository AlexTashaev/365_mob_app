const entries = require('./entries.json');
const { MONTHS, getMonthIndex } = require('./months');

const getEntry = (month, day) => entries.find((e) => e.month === month && e.day === day);

const getEntriesByMonth = (month) =>
  entries.filter((e) => e.month === month).sort((a, b) => a.day - b.day);

const getEntryByIndex = (index) => entries[index];

const getTotalEntries = () => entries.length;

const getRandomEntry = () => entries[Math.floor(Math.random() * entries.length)];

module.exports = {
  entries,
  MONTHS,
  getMonthIndex,
  getEntry,
  getEntriesByMonth,
  getEntryByIndex,
  getTotalEntries,
  getRandomEntry,
};
