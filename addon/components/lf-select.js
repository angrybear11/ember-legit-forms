import Component from '@ember/component';
import { observer, get, computed } from '@ember/object';
import { isNone } from '@ember/utils';
import layout from '../templates/components/lf-select';
import LFInputMixin from '../mixins/lf-input-mixin';

export default Component.extend(LFInputMixin, {
  layout,
  _inputName: 'lf-select',
  content: null, //passed in
  prompt: '-- select --', //passed in
  disableDefault: true,
  valuePath: 'value',
  labelPath: 'label',

  //eslint-disable-next-line ember/no-observers
  propertyDidChange: observer('property', function() {
    if(isNone(get(this, 'property'))) {
      // we have to reset fields
      this.clearValidations();
      this.hideValidationState();
      return;
    }
  }),

  actions: {
    optionSelected(value) {
      this.callUpdateHook(value);
      this.validateField(value);
    }
  }
});
