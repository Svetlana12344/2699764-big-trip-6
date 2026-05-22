import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({
  filterModel: filterModel,
  onFilterChange: () => {
    boardPresenter.renderPoints();
  }
});

const boardPresenter = new BoardPresenter({
  pointsModel: pointsModel,
  filterModel: filterModel,
  onNewPointDestroy: () => {
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }
});

filterPresenter.init();
boardPresenter.init();

const newEventButton = document.querySelector('.trip-main__event-add-btn');
newEventButton.addEventListener('click', () => {
  newEventButton.disabled = true;
  boardPresenter.createNewPoint();
});
