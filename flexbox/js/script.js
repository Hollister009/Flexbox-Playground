const FILE = './js/data.json';
const list = document.querySelector('.list');
const flexControlls = document.querySelector('.flex-controlls');
let flexAllFlag = false;
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

    if (i === 2) item.classList.add('selected');
    if (flexAllFlag) item.classList.add('flex_all');

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

const renderOption = (object, group) => {
  const fragment = document.createDocumentFragment();
  const fieldSet = document.createElement('fieldset');
  const legend = document.createElement('legend');

  legend.innerText = object.name + ':';
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

async function loadJSON(callback) {
  try {
    const response = await fetch(FILE);
    jsonData = await response.json();
    callback(jsonData);
  } catch (err) {
    console.log(err);
  }
}

const renderFlexControlls = data => {
  flexControlls.innerHTML = '';

  data.forEach(group => {
    flexControlls.appendChild(groupFactory(group));
  });

  // select element after it renders
  const flexGroup = flexControlls.querySelector('div[data-group*=flexibility]');
  const fieldSet = document.createElement('fieldset');
  const text = 'flex: 1 1 150px';

  fieldSet.innerHTML = `
    <legend>flex(all items):</legend>
    <div class="flex-all-items">
      <input type="checkbox" name="flex" id="flex_all">
      <label for="flex_all">${text}</label>
    </div>
  `;
  flexGroup.appendChild(fieldSet);
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

const inputEventGroup = object => {
  if (object.type === 'radio') {
    if (object.dataset.group !== 'flexibility') {
      updateTargetClassNames(list.classList, object);
    } else {
      const flexItem = list.querySelector('li.selected');
      updateTargetClassNames(flexItem.classList, object);
    }
    return;
  }

  flexAllFlag = object.checked;
  const allItems = [...list.querySelectorAll('.list-item')];
  allItems.forEach(item => item.classList.toggle('flex_all'));
};

const uncheckAllOptions = () => {
  const cnList = [...list.classList].filter(cn => cn !== 'list');
  // uncheck all radio inputs
  [...document.querySelectorAll('[type="radio"]')].forEach(radio => (radio.checked = false));
  // clear flex container
  list.classList.remove(...cnList);
};

const init = () => {
  const howManyItems = document.querySelector('.items-input [type="number"]');
  const applyItems = document.querySelector('.items-input [type="button"]');
  const clearBtn = document.querySelector('.btn-clear-radio');

  // initial render of items
  renderListItems(howManyItems.value);

  applyItems.addEventListener('click', function() {
    let flexItem = document.querySelector('li.selected');
    const cnList = [...flexItem.classList];

    renderListItems(howManyItems.value);

    // reselect the item cause it was rerendered
    flexItem = document.querySelector('li.selected');
    flexItem.classList.add(...cnList);
  });

  flexControlls.addEventListener('change', function(evt) {
    evt.stopPropagation();
    inputEventGroup(evt.target);
  });

  clearBtn.addEventListener('click', function() {
    renderListItems(howManyItems.value);
    uncheckAllOptions();
  });

  // asynchronous operation
  loadJSON(renderFlexControlls);
};

// initialize the application
init();
