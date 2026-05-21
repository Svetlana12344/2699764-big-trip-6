import RoutePoint from '../view/route-point-view.js';
import EditForm from '../view/edit-form-view.js';

export default class PointPresenter {
  constructor({ point, destinations, allOffers, onDataChange, onModeChange }) {
    this.point = point;
    this.destinations = destinations;
    this.allOffers = allOffers;
    this.onDataChange = onDataChange;
    this.onModeChange = onModeChange;
    this.routePointComponent = null;
    this.editFormComponent = null;
    this.isEditMode = false;
  }

  init() {
    this.renderRoutePoint();
  }

  renderRoutePoint() {
    if (this.routePointComponent) {
      this.routePointComponent.removeElement();
    }

    this.routePointComponent = new RoutePoint(this.point);
    this.routePointComponent.setRollupClickHandler(() => {
      this.replaceToEditForm();
    });
    this.routePointComponent.setFavoriteClickHandler(() => {
      const updatedPoint = {
        ...this.point,
        isFavorite: !this.point.isFavorite
      };
      this.onDataChange(updatedPoint);
    });

    return this.routePointComponent.element;
  }

  renderEditForm() {
    if (this.editFormComponent) {
      this.editFormComponent.removeElement();
    }

    this.editFormComponent = new EditForm({
      point: this.point,
      destinations: this.destinations,
      allOffers: this.allOffers,
      isNew: false
    });
    this.editFormComponent.setFormSubmitHandler(() => {
      this.replaceToRoutePoint();
    });
    this.editFormComponent.setRollupClickHandler(() => {
      this.replaceToRoutePoint();
    });

    return this.editFormComponent.element;
  }

  replaceToEditForm() {
    if (this.isEditMode) {
      return;
    }

    this.onModeChange();
    this.isEditMode = true;
    const editFormElement = this.renderEditForm();
    this.routePointComponent.element.replaceWith(editFormElement);

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape') {
        this.replaceToRoutePoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    document.addEventListener('keydown', onEscKeyDown);
    this.escHandler = onEscKeyDown;
  }

  replaceToRoutePoint() {
    if (!this.isEditMode) {
      return;
    }

    this.isEditMode = false;
    const routePointElement = this.renderRoutePoint();
    this.editFormComponent.element.replaceWith(routePointElement);

    if (this.escHandler) {
      document.removeEventListener('keydown', this.escHandler);
      this.escHandler = null;
    }
  }

  resetView() {
    if (this.isEditMode) {
      this.replaceToRoutePoint();
    }
  }

  update(point) {
    this.point = point;
    if (this.isEditMode) {
      this.replaceToRoutePoint();
    }
    this.renderRoutePoint();
  }
}
