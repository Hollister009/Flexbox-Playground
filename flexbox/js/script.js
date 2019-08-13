const FILE = './js/data.json';
const list = document.querySelector('.list');
const flexControlls = document.querySelector('.flex-controlls');
let jsonData;

const renderListItems = num => {
  const fragment = document.createDocumentFragment();
  const max = 20;
  const min = 2;
  let i = 0;

  do {
    i += 1;
    const item = document.createElement('li');
    item.classList.add('list-item');
    item.innerHTML = `<h2>${i}</h2>`;
    fragment.appendChild(item);
  } while ((i < num || i < min) && num <= max);

  list.innerHTML = '';
  list.appendChild(fragment);
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

/**
 *
 * @param {object} object - optiion object wich must be rendered
 * @param {string} group - group of option object
 */
const renderOption = (object, group) => {
  const fragment = document.createDocumentFragment();
  const fieldSet = document.createElement('fieldset');
  const legend = document.createElement('legend');

  legend.innerText = object.name;
  fragment.appendChild(legend);

  object.options.forEach(obj => {
    const pre = prefixOption(object.name);
    const radio = document.createElement('div');
    radio.classList.add('radio-controll');
    radio.innerHTML = `
      <input type="radio" name="${object.name}" id="${pre}_${obj.option}"
        data-value="${obj.option}" data-group="${group}">
      <label for="${pre}_${obj.option}">${obj.option}</label>
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
    case 'flexibility':
      title = 'Item Flexibility';
      break;
    default:
      title = group.title[0].toUpperCase() + group.title.slice(1);
      break;
  }

  if (title.length > 0) {
    parent.innerHTML = `<h3>${title}</h3><hr>`;
  }

  group.properties.forEach(option => {
    parent.appendChild(renderOption(option, group.title));
  });
  return parent;
};

const loadJSON = callback => {
  fetch(FILE)
    .then(res => res.json())
    .then(data => {
      jsonData = data;
      callback(data);
    })
    .catch(err => console.log(err));
};

const renderFlexControlls = data => {
  flexControlls.innerHTML = '';
  data.forEach(group => {
    flexControlls.appendChild(groupFactory(group));
  });
};

const updateTargetClassNames = (cnList, object) => {
  // 1. find options object from jsonData
  const group = jsonData.find(item => item.title === object.dataset.group);
  // 2. find target property from group
  const property = group.properties.find(prop => prop.name === object.name);
  // 3. array of option classes
  const groupClassNames = property.options.map(el => el.className);
  // 4. find target option from property array
  const option = property.options.find(opt => opt.option === object.dataset.value);

  groupClassNames.forEach(radio => {
    cnList.contains(radio) && cnList.remove(radio);
  });

  option.className && cnList.add(option.className);
};

const eventGroup = object => {
  if (object.dataset.group !== 'flexibility') {
    updateTargetClassNames(list.classList, object);
  } else {
    const flexItem = list.querySelectorAll('li')[1];
    updateTargetClassNames(flexItem.classList, object);
  }
};

const clearFlexItem = (item, base) => {
  const cnList = [...item.classList].filter(cn => cn !== base);

  item.classList.remove(...cnList);
};

const uncheckAllOptions = () => {
  const flexItem = list.querySelectorAll('li')[1];
  const allOptions = [...document.querySelectorAll('[type="radio"]')];

  allOptions.forEach(radio => (radio.checked = false));
  // clear flex container
  clearFlexItem(list, 'list');
  // clear single item
  clearFlexItem(flexItem, 'list-item');
};

const init = () => {
  const howManyItems = document.querySelector('.items-input [type="number"]');
  const applyItems = document.querySelector('.items-input [type="button"]');
  const clearBtn = document.querySelector('.btn-clear-radio');

  renderListItems(howManyItems.value);

  applyItems.addEventListener('click', function() {
    renderListItems(howManyItems.value);
    uncheckAllOptions();
  });

  flexControlls.addEventListener('change', function(evt) {
    eventGroup(evt.target);
  });

  clearBtn.addEventListener('click', uncheckAllOptions);

  loadJSON(renderFlexControlls);
};

// initialize the application
init();
