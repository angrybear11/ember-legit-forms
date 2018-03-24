import Component from '@ember/component';
import { observer, computed, get } from '@ember/object';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import layout from '../templates/components/lf-form';
import formValidator from '../utils/form-validator';

export default Component.extend({
  eventDispatcher: service('lf-event-dispatcher'),

  layout,
  tagName: 'form',
  rules: null, //passed in
  changeset: null, //passed in
  data: null, //passed in
  preventSubmit: null, //passed in
  formValid: computed('formValidator.isFormValid', function() {
    if (get(this, 'formValidator')) {
      return get(this, 'formValidator.isFormValid');
    }

    return false;
  }),

  formValidator: computed('rules', 'changeset', 'data', function() {
    return formValidator.create({
      container: getOwner(this),
      rules: get(this, 'rules'),
      changeset: get(this, 'changeset'),
      data: get(this, 'data')
    });
  }),

  //eslint-disable-next-line ember/no-observers
  rulesChanged: observer('rules', function() {
    run.next(() => get(this, 'eventDispatcher').trigger('lf-forceValidate', false));
  }),

  //eslint-disable-next-line ember/no-observers
  errorsChanged: observer('changeset.errors', function() {
    run.next(() => get(this, 'eventDispatcher').trigger('lf-forceValidate', false));
  }),

  actions: {
    validateChange(name, value) {
      let validityData = get(this, 'formValidator').validate(name, value);
      //eslint-disable-next-line  ember/closure-actions
      this.sendAction('validityChanged', get(this, 'formValid'));
      return validityData;
    }
  },

  submit(e) {
    e.preventDefault();

    if (get(this, 'preventSubmit') && !get(this, 'formValid')) {
      get(this, 'eventDispatcher').trigger('lf-forceValidate');
    } else if (get(this, 'onSubmit')) {
      get(this, 'onSubmit')(get(this, 'formValid'));
    }
  },
});
