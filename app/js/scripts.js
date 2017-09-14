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
            tdee: '',
            fm: '',
            lm: '',
            bodyFat: 0,
            calories: '',
            fat: '',
            proteins: '',
            carbs: '',
            activity: 'L',
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
            weight: '',
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
       getHeight() {
           let height;

           if (!this.formHelpers.heightUnitChecked) {
               height = ((this.formsFields.heightFeet * 30.48) + (this.formsFields.heightInches * 2.54));
           }
           else {
               height = this.formsFields.heightCm;
           }

           return height;
       },
       getWeight() {
           let weight;

           if (!this.formHelpers.weightUnitChecked) {
               weight = (this.formsFields.weight * 0.453592);
           } else {
               weight = this.formsFields.weight;
           }

           return weight;
       },
       getCalories(weight, height) {
           let calories;

           if (this.formsFields.gender == "M") {
               calories = Math.round((weight * 10) + (height * 6.25) - (this.formsFields.age * 5) + 5);
           }
           else {
               calories = Math.round((weight * 10) + (height * 6.25) - (this.formsFields.age * 5) - 161);
           }

           return calories;
       },
       calcOneRm() {
           this.formsFields.oneRepMax = Math.round(this.formsFields.weightLifted / this.formsFields.reps);
           this.goToSecondStep();
       },
       calcLeanBodyMass() {
            this.formsFields.lbm = Math.round((1 - this.bodyFat) * this.formsFields.weight * 10) / 10;
            this.goToSecondStep();
       },
       calcBmr() {
           let height = this.getHeight();
           let weight = this.getWeight();

           if (this.formsFields.gender == "M") {
               this.formsFields.bmr = Math.round(66.5 + (weight * 13.75) + (height * 5.003) - (this.formsFields.age * 6.755));
           }
           else {
               this.formsFields.bmr = Math.round(655 + (weight * 9.563) + (height * 1.850) - (this.formsFields.age * 4.676));
           }

           this.goToSecondStep();
       },
       calcRmr() {
           let height = this.getHeight();
           let weight = this.getWeight();

           if (this.formsFields.gender == "M") {
               this.formsFields.rmr = Math.round((weight * 9.99) + (height * 6.25) - (this.formsFields.age * 4.92) + 5);
           }
           else {
               this.formsFields.rmr = Math.round((weight * 9.99) + (height * 6.25) - (this.formsFields.age * 4.92) + 161);
           }

           this.goToSecondStep();
       },
       calcCreatine() {
           let weight = this.getWeight();

           if (weight < 120) this.formsFields.creatine = 3;
           if (weight > 119 && weight < 201) this.formsFields.creatine = 5;
           if (weight > 200) this.formsFields.creatine = 8;

           this.goToSecondStep();
       },
       calcWater() {
           let weight;

           if (this.formHelpers.weightUnitChecked) {
               weight = this.formsFields.weight * 2.20462;
           } else {
               weight = this.formsFields.weight;
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
       calcCarb() {
           let height = this.getHeight();
           let weight = this.getWeight();
           let calories = this.getCalories(weight, height);

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
               case "FL":
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
       calcProt() {
           let height = this.getHeight();
           let weight = this.getWeight();
           let calories = this.getCalories(weight, height);

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
       calcFat() {
           let height = this.getHeight();
           let weight = this.getWeight();
           let calories = this.getCalories(weight, height);

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
       calcMacroNut() {
           let height = this.getHeight();
           let weight = this.getWeight();
           let calories = this.getCalories(weight, height);

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
               case "FL":
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
       calcCalories() {
           let height = this.getHeight();
           let weight = this.getWeight();
           let calories = this.getCalories(weight, height);

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
       calcFatPerc() {
           let weight;
           let sum = (Number(this.formsFields.skinfold1) + Number(this.formsFields.skinfold2) + Number(this.formsFields.skinfold3));

           if (!this.formHelpers.weightUnitChecked) {
               weight = this.formsFields.weightLbs;
           } else {
               weight = this.formsFields.weightKg;
           }

           if (this.formsFields.gender == 'M') {
               this.formsFields.bodyFat = Math.round((495 / (1.10938 - (0.0008267*sum) + (0.0000016*sum*sum) - (0.0002574 * this.formsFields.age)) - 450) * 10) / 10;
           } else {
               this.formsFields.bodyFat = Math.round((495 / (1.089733 - (0.0009245*sum) + (0.0000025*sum*sum) - (0.0000979 * this.formsFields.age)) - 450) * 10) / 10;
           }

           this.formsFields.fm = Math.round(weight * (this.formsFields.bodyFat / 100) * 10) / 10;
           this.formsFields.lm = weight - this.formsFields.fm;

           this.goToSecondStep();
       },
       calcTdee() {
           let height = this.getHeight();
           let weight = this.getWeight();
           let tdee = this.getCalories(weight, height);

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
        },
        bodyFat() {
            return this.formsFields.fat / 100;
        }
    }
});



