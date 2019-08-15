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

//const data = await Model.fetchData(PATH);
//new Model(data);

// init
Model.fetchData(PATH).then(data => new Model(data));

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor() {
    this.app = this.getElement('#root');
    this.main = this.createElement('main', 'container');
    this.list = this.createElement('ul', 'list');
    this.itemsCount = this.createElement('section', 'items-count');
    this.itemsCount.append(this.renderItemsCount());
    this.app.append(...[this.itemsCount, this.main]);

    this.renderListItems();
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);

    if (className) element.classList.add(className);

    return element;
  }

  renderItemsCount() {
    const label = this.createElement('label');
    const text = 'How many boxes to display(min 2, max 20):';
    label.innerHTML = `
      ${text}
      <input type="number" name="items" id="items" value="8" min="2" max="20">
      <input class="btn" type="button" name="items-apply" id="items-apply" value="apply">
    `;
    return label;
  }

  renderListItems() {
    console.log(this.list);
  }
}

console.log(new View());

// /**
//  * @class Controller
//  *
//  * Links the user input and the view output.
//  *
//  * @param model
//  * @param view
//  */
// class Controller {
//   constructor(model, view) {
//     this.model = model;
//     this.view = view;
//   }
// }

// const app = {
//   init() {
//     new Controller(new Model(), new View());
//   },
// };

// app.init();
