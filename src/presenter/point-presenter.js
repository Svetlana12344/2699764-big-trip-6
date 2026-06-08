import RoutePoint from '../view/route-point-view.js';
import EditForm from '../view/edit-form-view.js';

export const UserAction = {
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  CREATE: 'CREATE'
};

export default class PointPresenter {
  #point = null;
  #destinations = [];
  #allOffers = [];
  #onDataChange = null;
  #onModeChange = null;
  #isNew = false;
  #routePointComponent = null;
  #editFormComponent = null;
  #isEditMode = false;
  #isSaving = false;
  #escHandler = null;

  constructor({ point, destinations, allOffers, onDataChange, onModeChange, isNew = false }) {
    this.#point = point;
    this.#destinations = destinations;
    this.#allOffers = allOffers;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#isNew = isNew;
  }

  get element() {
    return this.#routePointComponent ? this.#routePointComponent.element : null;
  }

  get routePointComponent() {
    return this.#routePointComponent;
  }

  get isNew() {
    return this.#isNew;
  }

  get point() {
    return this.#point;
  }

  init() {
    this.#renderRoutePoint();
  }

  #renderRoutePoint() {
    if (this.#routePointComponent) {
      this.#routePointComponent.removeElement();
    }

    if (!this.#point) {
      return null;
    }

    this.#routePointComponent = new RoutePoint(this.#point);
    this.#routePointComponent.setRollupClickHandler(() => {
      this.#replaceToEditForm();
    });
    this.#routePointComponent.setFavoriteClickHandler(() => {
      const updatedPoint = {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      };
      this.#onDataChange(updatedPoint, UserAction.UPDATE);
    });

    return this.#routePointComponent.element;
  }

  #renderEditForm() {
    if (this.#editFormComponent) {
      this.#editFormComponent.removeElement();
    }

    this.#editFormComponent = new EditForm({
      point: this.#point,
      destinations: this.#destinations,
      allOffers: this.#allOffers,
      isNew: this.#isNew
    });

    this.#editFormComponent.setFormSubmitHandler(async () => {
      await this.#handleFormSubmit();
    });

    this.#editFormComponent.setRollupClickHandler(() => {
      if (!this.#isSaving) {
        this.#replaceToRoutePoint();
      }
    });

    this.#editFormComponent.setDeleteClickHandler(async () => {
      await this.#handleDeleteClick();
    });

    return this.#editFormComponent.element;
  }

  async #handleFormSubmit() {
    if (this.#isSaving) {
      return;
    }

    this.#isSaving = true;
    this.#editFormComponent.setSavingState();

    const formData = this.#editFormComponent.getData();

    try {
      if (this.#isNew) {
        await this.#onDataChange(formData, UserAction.CREATE);
      } else {
        await this.#onDataChange(formData, UserAction.UPDATE);
      }
    } catch (error) {
      this.#editFormComponent.shake();
    } finally {
      this.#isSaving = false;
      this.#editFormComponent.setDefaultState();
    }
  }

  async #handleDeleteClick() {
    if (this.#isSaving) {
      return;
    }

    this.#isSaving = true;
    this.#editFormComponent.setDeletingState();

    try {
      await this.#onDataChange(this.#point, UserAction.DELETE);
    } catch (error) {
      this.#editFormComponent.shake();
    } finally {
      this.#isSaving = false;
      this.#editFormComponent.setDefaultState();
    }
  }

  #replaceToEditForm() {
    if (this.#isEditMode || this.#isSaving) {
      return;
    }

    this.#onModeChange();
    this.#isEditMode = true;
    const editFormElement = this.#renderEditForm();
    if (this.#routePointComponent && this.#routePointComponent.element) {
      this.#routePointComponent.element.replaceWith(editFormElement);
    }

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' && !this.#isSaving) {
        if (this.#isNew) {
          this.#onDataChange(null, UserAction.DELETE);
        } else {
          this.#replaceToRoutePoint();
        }
        document.removeEventListener('keydown', onEscKeyDown);
        this.#escHandler = null;
      }
    };

    document.addEventListener('keydown', onEscKeyDown);
    this.#escHandler = onEscKeyDown;
  }

  #replaceToRoutePoint() {
    if (!this.#isEditMode) {
      return;
    }

    this.#isEditMode = false;
    const routePointElement = this.#renderRoutePoint();
    if (this.#editFormComponent && this.#editFormComponent.element && routePointElement) {
      this.#editFormComponent.element.replaceWith(routePointElement);
    }

    if (this.#escHandler) {
      document.removeEventListener('keydown', this.#escHandler);
      this.#escHandler = null;
    }
  }

  resetView() {
    if (this.#isEditMode && !this.#isSaving) {
      this.#replaceToRoutePoint();
    }
  }

  destroy() {
    if (this.#routePointComponent) {
      this.#routePointComponent.removeElement();
    }
    if (this.#editFormComponent) {
      this.#editFormComponent.removeElement();
    }
    if (this.#escHandler) {
      document.removeEventListener('keydown', this.#escHandler);
      this.#escHandler = null;
    }
    this.#isEditMode = false;
    this.#isSaving = false;
  }

  update(point) {
    this.#point = point;
    if (this.#isEditMode && !this.#isSaving) {
      this.#replaceToRoutePoint();
    }
    this.#renderRoutePoint();
  }

  replaceToEditForm() {
    this.#replaceToEditForm();
  }
}
