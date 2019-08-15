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
  }

  getElement(selector) {
    return document.querySelector(selector);
  }
}

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
