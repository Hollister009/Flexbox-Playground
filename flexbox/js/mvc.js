const PATH = './js/data.json';

/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Model {
  constructor(data) {
    this.data = data;
  }

  static async fetchData(path) {
    try {
      const response = await fetch(path);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  }
}

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor() {
    this.app = this.getElement('#root');
    this.count = 8;
    // elements of the App
    this.main = this.createElement('main', 'content');
    this.list = this.createElement('ul', 'list');
    this.itemsCount = this.createElement('section', 'items-count');
    this.controlsFlex = this.createElement('aside', 'controls-flex');

    this.renderAppView();
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);

    if (className) element.classList.add(className);

    return element;
  }

  renderAppView() {
    const sectionList = this.createElement('section', 'items-list');
    sectionList.append(this.list);
    this.main.append(...[sectionList, this.controlsFlex]);
    this.renderItemsCount();
    this.renderListItems(this.count);
    this.app.append(...[this.itemsCount, this.main]);
  }

  renderItemsCount() {
    const label = this.createElement('label');
    const text = 'How many boxes to display(min 2, max 20):';
    label.innerHTML = `
      ${text}
      <input type="number" name="items" id="items" value="${this.count}" min="2" max="20">
      <input class="btn" type="button" name="items-apply" id="items-apply" value="apply">
    `;
    this.itemsCount.append(label);
  }

  isFlexAllSelected() {
    // return this.checkbox.checked;
    return false;
  }

  renderListItems(num) {
    const max = 20;
    const min = 2;
    let i = 1;

    this.list.innerHTML = '';

    while ((i <= num || i <= min) && (i <= max || num <= max)) {
      const item = this.createElement('li', 'list-item');
      if (i === 2) item.classList.add('selected');
      if (this.isFlexAllSelected()) item.classList.add('flex_all');
      item.innerHTML = `<h2>${i}</h2>`;
      this.list.append(item);
      i += 1;
    }
  }

  // methods wich are responsible for flex controls render

  prefixOption(option) {
    switch (option) {
      case 'display':
        return 'ds';
      case 'flex-direction':
        return 'fd';
      case 'flex-wrap':
        return 'fw';
      case 'flex-flow':
        return 'ff';
      case 'order':
        return 'or';
      case 'justify-content':
        return 'jc';
      case 'align-items':
        return 'ai';
      case 'align-self':
        return 'as';
      case 'align-content':
        return 'ac';
      case 'flex-grow':
        return 'fg';
      case 'flex-shrink':
        return 'fs';
      case 'flex-basis':
        return 'fb';
    }
  }

  buildFlexItemsCheckbox() {
    // method search for elemnt which should be added in the DOM
    const flexGroup = this.getElement('div[data-group*=flexibility]');
    const fieldSet = this.createElement('fieldset');
    const text = 'flex: 1 1 150px';

    fieldSet.innerHTML = `
      <legend>flex(all items):</legend>
      <div class="flex-all-items">
        <input type="checkbox" name="flex" id="flex_all">
        <label for="flex_all">${text}</label>
      </div>
    `;
    flexGroup.appendChild(fieldSet);
  }

  renderSingleOption(object, group) {
    const fragment = document.createDocumentFragment();
    const fieldSet = this.createElement('fieldset');
    const legend = this.createElement('legend');

    legend.innerText = object.name + ':';
    fragment.appendChild(legend);

    object.options.forEach(obj => {
      const pre = this.prefixOption(object.name);
      const radio = this.createElement('div', 'radio-controll');
      radio.innerHTML = `
        <input type="radio" name="${object.name}" id="${pre}_${obj.option}"
          data-value="${obj.option}" data-group="${group}">
        <label for="${pre}_${obj.option}">${obj.option}</label>
      `;
      fragment.appendChild(radio);
    });

    fieldSet.appendChild(fragment);
    return fieldSet;
  }

  renderGroupOptions(group) {
    let title = '';
    const parent = this.createElement('div', 'flex-group');
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
      parent.appendChild(this.renderSingleOption(option, group.title));
    });

    return parent;
  }

  renderControlGroups(data) {
    this.controlsFlex.innerHTML = '';

    data.forEach(group => {
      this.controlsFlex.appendChild(this.renderGroupOptions(group));
    });

    this.buildFlexItemsCheckbox();
    console.log(this.controlsFlex);
  }
}

// new View();

/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.onDataLoad(this.model.data);
  }

  onDataLoad = data => {
    this.view.renderControlGroups(data);
  };

  static async init() {
    const data = await Model.fetchData(PATH);
    return new Controller(new Model(data), new View());
  }
}

Controller.init();
