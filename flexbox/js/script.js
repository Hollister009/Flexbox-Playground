const FILE = './js/data.json';
const list = document.querySelector('.list');
const controlls = document.querySelector('.flex-controlls');
const howManyItems = document.querySelector('.items-input [type="number"]');
const applyItems = document.querySelector('.items-input [type="button"]');

const renderListItems = num => {
  const fragment = document.createDocumentFragment();
  const max = 24;
  let i = 0;

  do {
    i += 1;
    const item = document.createElement('li');
    item.classList.add('list-item');
    item.innerHTML = `<h2>${i}</h2>`;
    fragment.appendChild(item);
  } while (i < num && num <= max);

  list.innerHTML = '';
  [...fragment.children].forEach(item => list.appendChild(item));
};

const renderOption = object => {
  // object.name - STR
  // object.options - ARR of STR
  console.log(object.name);

}

const groupFactory = group => {
  let title = '';
  const parent = document.createElement('div');
  parent.classList.add('flex-group');

  switch (group.title) {
    case 'ordering':
      title = 'Ordering & Orientation';
      break;
    case 'alignment':
      title = 'Alignment';
      break;
    case 'flexibility':
      title = 'Flexibility';
      break;
  }

  if (title.length > 0) {
    parent.innerHTML = '<h3>${title}</h3>';
  }

  // const fieldSet = document.createElement('fieldset');
  group.properties.forEach(option => renderOption(option));
};

const loadJSON = callback => {
  fetch(FILE)
    .then(res => res.json())
    .then(data =>
      data.forEach(group => {
        callback(group);
      }),
    )
    .catch(err => console.log(err));
};


// initialize the application
renderListItems.call(null, howManyItems.value);

applyItems.addEventListener('click', function() {
  renderListItems.call(null, howManyItems.value);
});

loadJSON(groupFactory);
