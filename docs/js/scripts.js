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

if (typeof VeeValidate !== 'undefined') {
    Vue.use(VeeValidate, config);
}

var app = new Vue({
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
            tdee: '',
            fm: '',
            lm: '',
            bodyFat: 0,
            calories: '',
            fat: '',
            proteins: '',
            carbs: '',
            activity: '',
            goal: 'FL',
            water: '',
            workoutTime: 'L',
            creatine: '',
            rmr: '',
            bmr: '',
            gender: 'M',
            lbm: '0',
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
            skinfold3: ''
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
        },
        getHeight: function getHeight() {
            var height = void 0;

            if (!this.formHelpers.heightUnitChecked) {
                height = this.formsFields.heightFeet * 30.48 + this.formsFields.heightInches * 2.54;
            } else {
                height = this.formsFields.heightCm;
            }

            return height;
        },
        getWeight: function getWeight() {
            var weight = void 0;

            if (!this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightLbs * 0.453592;
            } else {
                weight = this.formsFields.weightKg;
            }

            return weight;
        },
        calcOneRm: function calcOneRm() {
            this.formsFields.oneRepMax = Math.round(this.formsFields.weightLifted / this.formsFields.reps);
            this.goToSecondStep();
        },
        calcLeanBodyMass: function calcLeanBodyMass() {
            if (!this.formHelpers.weightUnitChecked) {
                this.formsFields.lbm = Math.round((1 - this.bodyFat) * this.formsFields.weightLbs * 10) / 10;
            } else {
                this.formsFields.lbm = Math.round((1 - this.bodyFat) * this.formsFields.weightKg * 10) / 10;
            }
            this.goToSecondStep();
        },
        calcBmr: function calcBmr() {
            var height = this.getHeight();
            var weight = this.getWeight();

            /*if (!this.formHelpers.heightUnitChecked) {
                height = ((this.formsFields.heightFeet * 30.48) + (this.formsFields.heightInches * 2.54));
            }
            else {
                height = this.formsFields.heightCm;
            }
             if (!this.formHelpers.weightUnitChecked) {
                weight = (this.formsFields.weightLbs * 0.453592);
            } else {
                weight = this.formsFields.weightKg;
            }*/

            if (this.formsFields.gender == "M") {
                this.formsFields.bmr = Math.round(66.5 + weight * 13.75 + height * 5.003 - this.formsFields.age * 6.755);
            } else {
                this.formsFields.bmr = Math.round(655 + weight * 9.563 + height * 1.850 - this.formsFields.age * 4.676);
            }

            this.goToSecondStep();
        },
        calcRmr: function calcRmr() {
            var height = void 0;
            var weight = void 0;

            if (!this.formHelpers.heightUnitChecked) {
                height = this.formsFields.heightFeet * 30.48 + this.formsFields.heightInches * 2.54;
            } else {
                height = this.formsFields.heightCm;
            }

            if (!this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightLbs * 0.453592;
            } else {
                weight = this.formsFields.weightKg;
            }

            if (this.formsFields.gender == "M") {
                this.formsFields.rmr = Math.round(weight * 9.99 + height * 6.25 - this.formsFields.age * 4.92 + 5);
            } else {
                this.formsFields.rmr = Math.round(weight * 9.99 + height * 6.25 - this.formsFields.age * 4.92 + 161);
            }

            this.goToSecondStep();
        },
        calcCreatine: function calcCreatine() {
            var weight = void 0;

            if (this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightKg * 2.20462;
            } else {
                weight = this.formsFields.weightLbs;
            }

            if (weight < 120) this.formsFields.creatine = 3;
            if (weight > 119 && weight < 201) this.formsFields.creatine = 5;
            if (weight > 200) this.formsFields.creatine = 8;

            this.goToSecondStep();
        },
        calcWater: function calcWater() {
            var weight = void 0;

            if (this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightKg * 2.20462;
            } else {
                weight = this.formsFields.weightLbs;
            }

            switch (this.formsFields.workoutTime) {
                case "L":
                    this.formsFields.water = Math.round(weight * 0.6 + 12);
                    break;
                case "M":
                    this.formsFields.water = Math.round(weight * 0.6 + 24);
                    break;
                case "V":
                    this.formsFields.water = Math.round(weight * 0.6 + 36);
                    break;
            }

            this.goToSecondStep();
        },
        calcCarb: function calcCarb() {
            var height = void 0;
            var weight = void 0;
            var calories = void 0;

            if (!this.formHelpers.heightUnitChecked) {
                height = this.formsFields.heightFeet * 30.48 + this.formsFields.heightInches * 2.54;
            } else {
                height = this.formsFields.heightCm;
            }

            if (!this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightLbs * 0.453592;
            } else {
                weight = this.formsFields.weightKg;
            }

            if (this.formsFields.gender == "M") {
                calories = Math.round(weight * 10 + height * 6.25 - this.formsFields.age * 5 + 5);
            } else {
                calories = Math.round(weight * 10 + height * 6.25 - this.formsFields.age * 5 - 161);
            }

            switch (this.formsFields.activity) {
                case "L":
                    calories = Math.round(calories * 1.1);
                    break;
                case "M":
                    calories = Math.round(calories * 1.3);
                    break;
                case "V":
                    calories = Math.round(calories * 1.5);
                    break;
                case "E":
                    calories = Math.round(calories * 1.7);
                    break;
            }

            switch (this.formsFields.goal) {
                case "FM":
                    if (calories <= 2000) calories = 0.9 * calories;
                    if (calories > 2000) calories = 0.8 * calories;
                    this.formsFields.carbs = Math.round(0.40 * calories / 4);
                    break;
                case "M":
                    this.formsFields.carbs = Math.round(0.45 * calories / 4);
                    break;
                case "MG":
                    calories += 500;
                    this.formsFields.carbs = Math.round(0.45 * calories / 4);
                    break;
            }
            this.goToSecondStep();
        },
        calcProt: function calcProt() {
            var height = void 0;
            var weight = void 0;
            var calories = void 0;

            if (!this.formHelpers.heightUnitChecked) {
                height = this.formsFields.heightFeet * 30.48 + this.formsFields.heightInches * 2.54;
            } else {
                height = this.formsFields.heightCm;
            }

            if (!this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightLbs * 0.453592;
            } else {
                weight = this.formsFields.weightKg;
            }

            if (this.formsFields.gender == "M") {
                calories = Math.round(weight * 10 + height * 6.25 - this.formsFields.age * 5 + 5);
            } else {
                calories = Math.round(weight * 10 + height * 6.25 - this.formsFields.age * 5 - 161);
            }

            switch (this.formsFields.activity) {
                case "L":
                    calories = Math.round(calories * 1.1);
                    break;
                case "M":
                    calories = Math.round(calories * 1.3);
                    break;
                case "V":
                    calories = Math.round(calories * 1.5);
                    break;
                case "E":
                    calories = Math.round(calories * 1.7);
                    break;
            }

            switch (this.formsFields.goal) {
                case "FM":
                    if (calories <= 2000) calories = 0.9 * calories;
                    if (calories > 2000) calories = 0.8 * calories;
                    this.formsFields.proteins = Math.round(0.4 * calories / 4);
                    break;
                case "M":
                    this.formsFields.proteins = Math.round(0.3 * calories / 4);
                    break;
                case "MG":
                    calories += 500;
                    this.formsFields.proteins = Math.round(0.3 * calories / 4);
                    break;
            }
            this.goToSecondStep();
        },
        calcFat: function calcFat() {
            var height = void 0;
            var weight = void 0;
            var calories = void 0;

            if (!this.formHelpers.heightUnitChecked) {
                height = this.formsFields.heightFeet * 30.48 + this.formsFields.heightInches * 2.54;
            } else {
                height = this.formsFields.heightCm;
            }

            if (!this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightLbs * 0.453592;
            } else {
                weight = this.formsFields.weightKg;
            }

            if (this.formsFields.gender == "M") {
                calories = Math.round(weight * 10 + height * 6.25 - this.formsFields.age * 5 + 5);
            } else {
                calories = Math.round(weight * 10 + height * 6.25 - this.formsFields.age * 5 - 161);
            }

            switch (this.formsFields.activity) {
                case "L":
                    calories = Math.round(calories * 1.1);
                    break;
                case "M":
                    calories = Math.round(calories * 1.3);
                    break;
                case "V":
                    calories = Math.round(calories * 1.5);
                    break;
                case "E":
                    calories = Math.round(calories * 1.7);
                    break;
            }

            switch (this.formsFields.goal) {
                case "FM":
                    if (calories <= 2000) calories = 0.9 * calories;
                    if (calories > 2000) calories = 0.8 * calories;
                    this.formsFields.fat = Math.round(0.2 * calories / 9);
                    break;
                case "M":
                    this.formsFields.fat = Math.round(0.25 * calories / 9);
                    break;
                case "MG":
                    calories += 500;
                    this.formsFields.fat = Math.round(0.25 * calories / 9);
                    break;
            }
            this.goToSecondStep();
        },
        calcMacroNut: function calcMacroNut() {
            var height = void 0;
            var weight = void 0;
            var calories = void 0;

            if (!this.formHelpers.heightUnitChecked) {
                height = this.formsFields.heightFeet * 30.48 + this.formsFields.heightInches * 2.54;
            } else {
                height = this.formsFields.heightCm;
            }

            if (!this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightLbs * 0.453592;
            } else {
                weight = this.formsFields.weightKg;
            }

            if (this.formsFields.gender == "M") {
                calories = Math.round(weight * 10 + height * 6.25 - this.formsFields.age * 5 + 5);
            } else {
                calories = Math.round(weight * 10 + height * 6.25 - this.formsFields.age * 5 - 161);
            }

            switch (this.formsFields.activity) {
                case "L":
                    calories = Math.round(calories * 1.1);
                    break;
                case "M":
                    calories = Math.round(calories * 1.3);
                    break;
                case "V":
                    calories = Math.round(calories * 1.5);
                    break;
                case "E":
                    calories = Math.round(calories * 1.7);
                    break;
            }

            switch (this.formsFields.goal) {
                case "FM":
                    if (calories <= 2000) calories = 0.9 * calories;
                    if (calories > 2000) calories = 0.8 * calories;
                    this.formsFields.carbs = Math.round(0.40 * calories / 4);
                    this.formsFields.proteins = Math.round(0.40 * calories / 4);
                    this.formsFields.fat = Math.round(0.2 * calories / 9);
                    break;
                case "M":
                    this.formsFields.carbs = Math.round(0.45 * calories / 4);
                    this.formsFields.proteins = Math.round(0.30 * calories / 4);
                    this.formsFields.fat = Math.round(0.25 * calories / 9);
                    break;
                case "MG":
                    calories += 500;
                    this.formsFields.carbs = Math.round(0.45 * calories / 4);
                    this.formsFields.proteins = Math.round(0.30 * calories / 4);
                    this.formsFields.fat = Math.round(0.25 * calories / 9);
                    break;
            }
            this.goToSecondStep();
        },
        calcCalories: function calcCalories() {
            var height = void 0;
            var weight = void 0;
            var calories = this.formsFields.calories;

            if (!this.formHelpers.heightUnitChecked) {
                height = this.formsFields.heightFeet * 30.48 + this.formsFields.heightInches * 2.54;
            } else {
                height = this.formsFields.heightCm;
            }

            if (!this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightLbs * 0.453592;
            } else {
                weight = this.formsFields.weightKg;
            }

            if (this.formsFields.gender == "M") {
                calories = Math.round(weight * 10 + height * 6.25 - this.formsFields.age * 5 + 5);
            } else {
                calories = Math.round(weight * 10 + height * 6.25 - this.formsFields.age * 5 - 161);
            }

            switch (this.formsFields.activity) {
                case "L":
                    calories = Math.round(calories * 1.1);
                    break;
                case "M":
                    calories = Math.round(calories * 1.3);
                    break;
                case "V":
                    calories = Math.round(calories * 1.5);
                    break;
                case "E":
                    calories = Math.round(calories * 1.7);
                    break;
            }

            switch (this.formsFields.goal) {
                case "FM":
                    if (calories <= 2000) calories = 0.9 * calories;
                    if (calories > 2000) calories = 0.8 * calories;
                    break;
                case "M":
                    break;
                case "MG":
                    calories += 500;
                    break;
            }

            this.formsFields.calories = calories;
            this.goToSecondStep();
        },
        calcFatPerc: function calcFatPerc() {
            var weight = void 0;
            var sum = Number(this.formsFields.skinfold1) + Number(this.formsFields.skinfold2) + Number(this.formsFields.skinfold3);
            console.log(sum);

            if (!this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightLbs;
            } else {
                weight = this.formsFields.weightKg;
            }

            if (this.formsFields.gender == 'M') {
                this.formsFields.bodyFat = Math.round((495 / (1.10938 - 0.0008267 * sum + 0.0000016 * sum * sum - 0.0002574 * this.formsFields.age) - 450) * 10) / 10;
            } else {
                this.formsFields.bodyFat = Math.round((495 / (1.089733 - 0.0009245 * sum + 0.0000025 * sum * sum - 0.0000979 * this.formsFields.age) - 450) * 10) / 10;
            }

            this.formsFields.fm = Math.round(weight * (this.formsFields.bodyFat / 100) * 10) / 10;
            this.formsFields.lm = weight - this.formsFields.fm;

            this.goToSecondStep();
        },
        calcTdee: function calcTdee() {
            var height = void 0;
            var weight = void 0;
            var tdee = this.formsFields.tdee;

            if (!this.formHelpers.heightUnitChecked) {
                height = this.formsFields.heightFeet * 30.48 + this.formsFields.heightInches * 2.54;
            } else {
                height = this.formsFields.heightCm;
            }

            if (!this.formHelpers.weightUnitChecked) {
                weight = this.formsFields.weightLbs * 0.453592;
            } else {
                weight = this.formsFields.weightKg;
            }

            if (this.formsFields.gender == "M") {
                tdee = weight * 10 + height * 6.25 - this.formsFields.age * 5 + 5;
            } else {
                tdee = weight * 10 + height * 6.25 - this.formsFields.age * 5 - 161;
            }

            switch (this.formsFields.activity) {
                case "L":
                    tdee = Math.round(tdee * 1.1);
                    break;
                case "M":
                    tdee = Math.round(tdee * 1.3);
                    break;
                case "V":
                    tdee = Math.round(tdee * 1.5);
                    break;
                case "E":
                    tdee = Math.round(tdee * 1.7);
                    break;
            }

            this.formsFields.tdee = tdee;
            this.goToSecondStep();
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
        },
        oneRm95: function oneRm95() {
            return Math.round(this.formsFields.oneRepMax * 0.95);
        },
        oneRm90: function oneRm90() {
            return Math.round(this.formsFields.oneRepMax * 0.90);
        },
        oneRm85: function oneRm85() {
            return Math.round(this.formsFields.oneRepMax * 0.85);
        },
        oneRm80: function oneRm80() {
            return Math.round(this.formsFields.oneRepMax * 0.8);
        },
        oneRm75: function oneRm75() {
            return Math.round(this.formsFields.oneRepMax * 0.75);
        },
        oneRm70: function oneRm70() {
            return Math.round(this.formsFields.oneRepMax * 0.7);
        },
        oneRm65: function oneRm65() {
            return Math.round(this.formsFields.oneRepMax * 0.65);
        },
        oneRm60: function oneRm60() {
            return Math.round(this.formsFields.oneRepMax * 0.6);
        },
        oneRm55: function oneRm55() {
            return Math.round(this.formsFields.oneRepMax * 0.55);
        },
        oneRm50: function oneRm50() {
            return Math.round(this.formsFields.oneRepMax * 0.5);
        },
        bodyFat: function bodyFat() {
            return this.formsFields.fat / 100;
        }
    }
});