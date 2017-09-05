/* here is scripts for fitness 1 and fitness 2 websites written using vue.js  */

"use strict";

const config = {
    errorBagName: 'errors', // change if property conflicts.
    fieldsBagName: 'fields',
    delay: 0,
    locale: 'en',
    dictionary: null,
    strict: true,
    classes: true,
    classNames: {
        touched: 'touched', // the control has been blurred
        untouched: 'untouched', // the control hasn't been blurred
        valid: 'calc-form__input_valid', // model is valid
        invalid: 'calc-form__input_invalid', // model is invalid
        pristine: 'pristine', // control has not been interacted with
        dirty: 'dirty' // control has been interacted with
    },
    events: 'input|blur',
    inject: true,
    validity: true,
    aria: true
};

Vue.use(VeeValidate, config);

let app = new Vue({
    el: "#app",
    data: {
        formHelpers: {
            formStepOne: true,
            calcOverlay: false,
            weightUnitChecked: false,
            heightUnitChecked: false,
            firstValidCounter: 0
        },
        formsFields: {
            weightLbs: '',
            weightKg: '',
            heightCm: '',
            heightFeet: '',
            heightInches: '',
            age: '',
            name: '',
            email: '',
            oneRm90: '',
            oneRm85: '',
            oneRm80: '',
            oneRm75: '',
            oneRm70: '',
            oneRm65: '',
            oneRm60: '',
            oneRm55: ''
        }
    },
   methods: {
        goToSecondStep: function() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    this.formHelpers.calcOverlay = true;
                    let self = this;

                    setTimeout(function () {
                        self.formHelpers.calcOverlay = false;
                        self.formHelpers.formStepOne = false;
                    }, 3000);
                    return;
                }
                console.log('Correct them errors!');
            });
        },
       submitForm: function() {
             this.$validator.validateAll().then((result) => {
                if (result) {
                    // here code for pass form data
                    this.sendViaAjax();
                }
            });
       },
       sendViaAjax: function() {
           let dataForServer = {};

           for (let key in this.formsFields) {
               if (this.formsFields[key] !== '') {
                   dataForServer[key] = this.formsFields[key];
               }
           }
           //console.log(dataForServer);

           $.ajax({
               url: '/url-for-sending',
               method: 'POST',
               data: dataForServer,
               success: function(){
                   console.log('We did succeed!');
               },
               error: function(){
                   console.log('We did not succeed!');
               }
           });
       }
    },
    computed: {
        weightUnit() {
            return this.formHelpers.weightUnitChecked ? 'kg' : 'lbs';
        },
        heightUnit() {
            return this.formHelpers.heightUnitChecked ? 'cm' : 'ft';
        }
    }
});



