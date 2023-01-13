list = [
  {
    name: '1',
  },
  {
    name: '2',
    // boosted_date: new Date('2022-12-28T13:50:00'),
  },
  {
    name: '3',
    // boosted_date: new Date('2022-12-28T13:40:00'),
  },
  {
    name: '4',
  },
];
// array = [9, 8, 7, 5, 6, 4, 3, 1, 1]
// array.sort((a, b) => {
//   console.log(a, b, a - b)
//   return a === 5 ? 1 : -1
// })
list.sort((a, b) => {
  if (a.boosted_date !== undefined) {
    console.log((Date.now() - a.boosted_date) / 1000 / 60);
    if (Date.now() - a.boosted_date < 30 * 60 * 1000) {
      return -1;
    }
  }
  return 1;
});

console.log(list.findIndex(a => a.name === '3'));
// console.log(array)
console.log(list);
