const FILE = './js/data.json';
const list = document.querySelector('.list');
const controlls = document.querySelector('.flex-controlls');

const renderListItems = num => {
  const fragment = document.createDocumentFragment();
  const max = 20;
  let i = 0;

  do {
    i += 1;
    const item = document.createElement('li');
    item.classList.add('list-item');
    item.innerHTML = `<h2>${i}</h2>`;
    fragment.appendChild(item);
  } while (i < num && num <= max);

  list.innerHTML = '';
  list.appendChild(fragment);
};

const renderOption = object => {
  const fragment = document.createDocumentFragment();
  const fieldSet = document.createElement('fieldset');
  const legend = document.createElement('legend');

  legend.innerText = object.name;
  fragment.appendChild(legend);

  object.options.forEach(opt => {
    const radio = document.createElement('div');
    radio.classList.add('radio-controll');
    radio.innerHTML = `
      <input type="radio" name="${object.name}" id="${opt}">
      <label for="${opt}">${opt}</label>
    `;
    fragment.appendChild(radio);
  });

  fieldSet.appendChild(fragment);
  return fieldSet;
};

const groupFactory = group => {
  let title = '';
  const parent = document.createElement('div');
  parent.classList.add('flex-group');
  parent.dataset.group = group.title;

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
    parent.innerHTML = `<h3>${title}</h3>`;
  }

  group.properties.forEach(option => {
    parent.appendChild(renderOption(option));
  });
  return parent;
};

const loadJSON = callback => {
  controlls.innerHTML = '';

  fetch(FILE)
    .then(res => res.json())
    .then(data =>
      data.forEach(group => {
        controlls.appendChild(callback(group));
      }),
    )
    .catch(err => console.log(err));
};

const prefixOption = name => {
  let prefix;
  switch (name) {
    case 'display':
      prefix = 'ds';
      break;
    case 'flex-direction':
      prefix = 'fd';
      break;
    case 'flex-wrap':
      prefix = 'fw';
      break;
    case 'flex-flow':
      prefix = 'ff';
      break;
    case 'order':
      prefix = 'or';
      break;
    case 'justify-content':
      prefix = 'jc';
      break;
    case 'align-items':
      prefix = 'ai';
      break;
    case 'align-self':
      prefix = 'as';
      break;
    case 'align-content':
      prefix = 'ac';
      break;
    case 'flex-grow':
      prefix = 'fg';
      break;
    case 'flex-shrink':
      prefix = 'fs';
      break;
    case 'flex-basis':
      prefix = 'fb';
      break;
  }
  return prefix;
};

const init = () => {
  const howManyItems = document.querySelector('.items-input [type="number"]');
  const applyItems = document.querySelector('.items-input [type="button"]');

  renderListItems.call(null, howManyItems.value);

  applyItems.addEventListener('click', function() {
    renderListItems.call(null, howManyItems.value);
  });

  loadJSON(groupFactory);
};

// initialize the application
init();
