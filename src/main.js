import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offer-model.js';
import Api from './api.js';

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
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }
});

const filterPresenter = new FilterPresenter({
  filterModel: filterModel,
  onFilterChange: () => {
    boardPresenter.renderPoints();
  }
});

filterPresenter.init();
boardPresenter.init();

const newEventButton = document.querySelector('.trip-main__event-add-btn');
newEventButton.addEventListener('click', () => {
  newEventButton.disabled = true;
  boardPresenter.createNewPoint();
});
