/* here is scripts for fitness 1 and fitness 2 websites written using vue.js  */

"use strict";

var config = {
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

var app = new Vue({
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
            oneRm55: '',
            skinfold1: '',
            skinfold2: '',
            skinfold3: '',
            fat: ''
        }
    },
    methods: {
        goToSecondStep: function goToSecondStep() {
            var _this = this;

            this.$validator.validateAll().then(function (result) {
                if (result) {
                    _this.formHelpers.calcOverlay = true;
                    var self = _this;

                    setTimeout(function () {
                        self.formHelpers.calcOverlay = false;
                        self.formHelpers.formStepOne = false;
                    }, 3000);
                    return;
                }
                console.log('Correct them errors!');
            });
        },
        submitForm: function submitForm() {
            var _this2 = this;

            this.$validator.validateAll().then(function (result) {
                if (result) {
                    // here code for pass form data
                    _this2.sendViaAjax();
                }
            });
        },
        sendViaAjax: function sendViaAjax() {
            var dataForServer = {};

            for (var key in this.formsFields) {
                if (this.formsFields[key] !== '') {
                    dataForServer[key] = this.formsFields[key];
                }
            }
            //console.log(dataForServer);

            $.ajax({
                url: '/url-for-sending',
                method: 'POST',
                data: dataForServer,
                success: function success() {
                    console.log('We did succeed!');
                },
                error: function error() {
                    console.log('We did not succeed!');
                }
            });
        }
    },
    computed: {
        weightUnit: function weightUnit() {
            return this.formHelpers.weightUnitChecked ? 'kg' : 'lbs';
        },
        weightUnitReverse: function weightUnitReverse() {
            return this.formHelpers.weightUnitChecked ? 'lbs' : 'kg';
        },
        heightUnit: function heightUnit() {
            return this.formHelpers.heightUnitChecked ? 'cm' : 'ft';
        },
        heightUnitReverse: function heightUnitReverse() {
            return this.formHelpers.heightUnitChecked ? 'ft' : 'cm';
        }
    }
});