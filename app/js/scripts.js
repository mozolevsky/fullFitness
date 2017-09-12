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

if (typeof VeeValidate !== 'undefined') {
    Vue.use(VeeValidate, config);
}

let app = new Vue({
    el: "#app",
    data: {
        submenu: {
            status: false
        },
        formHelpers: {
            formStepOne: true,
            calcOverlay: false,
            weightUnitChecked: false,
            heightUnitChecked: false,
            firstValidCounter: 0
        },
        formsFields: {
            reps: '1',
            weightLifted: '',
            oneRepMax: '',
            weightLbs: '',
            weightKg: '',
            heightCm: '',
            heightFeet: '',
            heightInches: '',
            age: '',
            name: '',
            email: '',
            skinfold1: '',
            skinfold2: '',
            skinfold3: '',
            fat: ''
        }
    },
   methods: {
       goToSecondStep() {
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
       submitForm() {
             this.$validator.validateAll().then((result) => {
                if (result) {
                    // here code for pass form data
                    this.sendViaAjax();
                }
            });
       },
       sendViaAjax() {
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
       },
       calcOneRm() {
           this.formsFields.oneRepMax = Math.round(this.formsFields.weightLifted / this.formsFields.reps);
           this.goToSecondStep();
       }
    },
    computed: {
        weightUnit() {
            return this.formHelpers.weightUnitChecked ? 'kg' : 'lbs';
        },
        weightUnitReverse() {
            return this.formHelpers.weightUnitChecked ? 'lbs' : 'kg';
        },
        heightUnit() {
            return this.formHelpers.heightUnitChecked ? 'cm' : 'ft';
        },
        heightUnitReverse() {
            return this.formHelpers.heightUnitChecked ? 'ft' : 'cm';
        },
        oneRm95() {
            return Math.round(this.formsFields.oneRepMax * 0.95);
        },
        oneRm90() {
            return Math.round(this.formsFields.oneRepMax * 0.90);
        },
        oneRm85() {
            return Math.round(this.formsFields.oneRepMax * 0.85);
        },
        oneRm80() {
            return Math.round(this.formsFields.oneRepMax * 0.8);
        },
        oneRm75() {
            return Math.round(this.formsFields.oneRepMax * 0.75);
        },
        oneRm70() {
            return Math.round(this.formsFields.oneRepMax * 0.7);
        },
        oneRm65() {
            return Math.round(this.formsFields.oneRepMax * 0.65);
        },
        oneRm60() {
            return Math.round(this.formsFields.oneRepMax * 0.6);
        },
        oneRm55() {
            return Math.round(this.formsFields.oneRepMax * 0.55);
        },
        oneRm50() {
            return Math.round(this.formsFields.oneRepMax * 0.5);
        }
    }
});



