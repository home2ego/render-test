const reverse = (string) => string.split('').reverse().join('');

const average = (array) => {
  const sum = array.reduce((acc, item) => acc + item, 0);

  return array.length === 0 ? 0 : sum / array.length;
};

module.exports = { reverse, average };
