const DATA = './data.json';
const list = document.querySelector('.list');
const controlls = document.querySelector('.flex-controlls');
const howManyItems = document.querySelector('.items-input [type="number"]');
const applyItems = document.querySelector('.items-input [type="button"]');

const createListItems = num => {
  const fragment = document.createDocumentFragment();
  const max = 24;
  let i = 0;

  do {
    i += 1;
    const item = document.createElement('li');
    item.classList.add('list-item');
    item.innerHTML = `<h2>${i}</h2>`;
    fragment.appendChild(item);
  } while (i < num && num < max);

  list.innerHTML = '';
  [...fragment.children].forEach(item => list.appendChild(item));
};

createListItems.call(null, howManyItems.value);

applyItems.addEventListener('click', function() {
  createListItems.call(null, howManyItems.value);
});

const createGroup = () => {};
const loadJSON = callback => {};
console.log(JSON.stringify(options));
// options.forEach(option => createGroup);
