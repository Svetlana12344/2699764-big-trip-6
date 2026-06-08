import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offer-model.js';
import Api from './api.js';

const CYPRESS_INIT_DELAY_MS = 500;

const api = new Api();
const pointsModel = new PointsModel(api);
const destinationsModel = new DestinationsModel(api);
const offersModel = new OffersModel(api);
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  pointsModel: pointsModel,
  filterModel: filterModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel,
  onNewPointDestroy: () => {
    const eventButton = document.querySelector('.trip-main__event-add-btn');
    if (eventButton) {
      eventButton.disabled = false;
    }
  }
});

const filterPresenter = new FilterPresenter({
  filterModel: filterModel,
  pointsModel: pointsModel,
  onFilterChange: () => {
    boardPresenter.forceUpdateByFilter();
  }
});

const initApp = () => {
  filterPresenter.init();
  boardPresenter.init();
};

if (window.Cypress) {
  setTimeout(initApp, CYPRESS_INIT_DELAY_MS);
} else {
  initApp();
}

const newEventButton = document.querySelector('.trip-main__event-add-btn');
if (newEventButton) {
  newEventButton.addEventListener('click', () => {
    newEventButton.disabled = true;
    boardPresenter.createNewPoint();
  });
}
