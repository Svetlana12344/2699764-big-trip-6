import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/point-model.js';

const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({ pointsModel });

boardPresenter.init();
