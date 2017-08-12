/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

// npm install alexa-skill-test -D to setup a local test-envirenment
'use strict';

const Alexa = require('alexa-sdk');
// http request library
const axios = require("axios");

const APP_ID = 'xxx'; 

// map user input to valid currency abbrevations
function mapCurrency (slotValue) {
    if (['amerikanischer dollar', 'amerikanische dollar', 'u es dollar', 'dollar', 'us dollar', 'u s dollar', 'amerikanischen dollar'].includes(slotValue)) return 'USD';
    if (['euro', 'euros'].includes(slotValue)) return 'EUR';
    if (['japanischer yen', 'japanische yen', 'yen', 'japanischen yen'].includes(slotValue)) return 'JPY';
    if (['bulgarischer lev', 'bulgarische lev', 'lev', 'bulgarischen levs'].includes(slotValue)) return 'BGN';
    if (['tschechischer koruna', 'tschechische koruna', 'koruna', 'tschechischen koruna', 'tschechischen korunas'].includes(slotValue)) return 'CZK';
    if (['dänische krone', 'dänische kronen', 'dänischen kronen'].includes(slotValue)) return 'DKK';
    if (['britischer pfund', 'britische pfund', 'pfund stierling', 'pfund', 'britischen pfund'].includes(slotValue)) return 'GBP';
    if (['forint', 'ungarischer forint', 'ungarische forint' , 'ungarischen forint'].includes(slotValue)) return 'HUF';
    if (['zlotje', 'polnische zlotje', 'polnischer zlotje', 'plonischen zlotje'].includes(slotValue)) return 'PLN';
    if (['rumänischer leu', 'leu', 'rumänische leu', 'rumänischen leu'].includes(slotValue)) return 'RON';
    if (['schwedische kronen', 'schwedische krone', 'schwedischen kronen'].includes(slotValue)) return 'SEK';
    if (['franken', 'franke', 'schweizer franke', 'franken', 'schweizer franken'].includes(slotValue)) return 'CHF';
    if (['norwegische kronen', 'norwegische krone', 'norwegischen kronen'].includes(slotValue)) return 'NOK';
    if (['kuna', 'kroatischer kuna', 'kroatische kuna', 'kroatischen kuna'].includes(slotValue)) return 'HRK';
    if (['rubel', 'ruble', 'rubell', 'russische rubel', 'russischer rubel', 'russischen rubels'].includes(slotValue)) return 'RUB';
    if (['lire', 'liren', 'türkische lire', 'türkischen lire'].includes(slotValue)) return 'TRY';
    if (['australischer dollar', 'australische dollar', 'australischer dollar'].includes(slotValue)) return 'AUD';
    if (['real', 'brasilianische real', 'brasilianischer real', 'brasilianische real'].includes(slotValue)) return 'BRL';
    if (['kanadischer dollar', 'kanadische dollar', 'kanadischen dollar'].includes(slotValue)) return 'CAD';
    if (['renminbi', 'renminbis', 'chinesischer renminbi', 'chinesische renminbi', 'chinesischen renminbi'].includes(slotValue)) return 'CNY';
    if (['hong kong dollar'].includes(slotValue)) return 'HKD';
    if (['rupia', 'indonesische rupias', 'indonesische rupia', 'indonesischen rupias'].includes(slotValue)) return 'IDR';
    if (['shekel', 'israelischer shekel', 'israelische shekel', 'israelischen shekel'].includes(slotValue)) return 'ILS';
    if (['rupie', 'rupien', 'indische rupien', 'indische rupie', 'indischen rupien'].includes(slotValue)) return 'INR';
    if (['südkoreanischer won', 'won', 'südkoreanische won', 'südkoreanischen won'].includes(slotValue)) return 'KRW';
    if (['mexikanische pesos', 'mexikanischer peso', 'pesos', 'peso', 'mexikanischen pesos'].includes(slotValue)) return 'MXN';
    if (['ringgit', 'malaysischer ringgit', 'malaysische ringgit', 'malaysischen ringgit'].includes(slotValue)) return 'MYR';
    if (['neuseeländischer dollar', 'neuseeländische dollar', 'neuseeland dollar', 'neuseeländischen dollar'].includes(slotValue)) return 'NZD';
    if (['phillipinische pesos', 'phillipinischer peso', 'phillipinische pesos'].includes(slotValue)) return 'PHP';
    if (['singapur dollar'].includes(slotValue)) return 'SGD';
    if (['baht', 'thai baht', 'thailändische baht', 'thailändischer baht', 'thailändische baht'].includes(slotValue)) return 'THB';
    if (['rand', 'südafrika rand', 'südafrikanischer rand', 'südafrikanische rand', 'südafrikanische rand'].includes(slotValue)) return 'ZAR';
    return null;
}

// API request to fixer.io
function getFactor (inputCurrency, outputCurrency) { 
    let success = function (response) {
        return  response.data.rates[Object.keys(response.data.rates)[0]];
    }
    let error = function (response) {
        console.log(response);
        return null;
    }
    return axios.get("http://api.fixer.io/latest?base="+inputCurrency+"&symbols="+outputCurrency)
       .then(success, error);
}

const messages = {
    SKILL_NAME: 'Währungsrechner',
    WELCOME_MESSAGE: 'Willkommen bei Währungsrechner. Du kannst beispielsweise die Frage stellen: Wie viel Euro sind fünf Dollar ... Nun, womit kann ich dir helfen?',
    WELCOME_REPROMT: 'Wenn du wissen möchtest, was du sagen kannst, sag einfach Hilf mir.',
    HELP_MESSAGE: 'Du kannst beispielsweise Fragen stellen wie Wie viel Euro sind fünf Dollar oder du kannst Beenden sagen ... Für eine Übersicht der möglichen Befehle und der unterstützten Währungen schaue in die Skillbeschreibung in deiner Alexa App... Nun, Wie kann ich dir helfen?',
    HELP_REPROMT: 'Du kannst beispielsweise Sachen sagen wie Wie viel Euro sind fünf Dollar oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?',
    STOP_MESSAGE: 'Auf Wiedersehen!',
    CURRENCY_NOT_FOUND_REPROMPT: 'Frage doch nach einer anderen Währung aus dem Katalog der europäischen Zentralbank.'
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = messages.WELCOME_MESSAGE;
        this.attributes.repromptSpeech = messages.WELCOME_REPROMT;
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'CurrencyIntent': function () {
        let vm = this;
        const inputCurrencySlot = vm.event.request.intent.slots.inputCurrency;
        const outputCurrencySlot = vm.event.request.intent.slots.outputCurrency;
        const amountSlot = vm.event.request.intent.slots.amount;

        // are all slots present - if yes, get their value
        let inputCurrency, outputCurrency, amount;
        if (inputCurrencySlot && inputCurrencySlot.value &&
            outputCurrencySlot && outputCurrencySlot.value &&
            amountSlot && amountSlot.value) {
            inputCurrency = inputCurrencySlot.value.toLowerCase();
            outputCurrency = outputCurrencySlot.value.toLowerCase();
            amount = parseInt(amountSlot.value);
        } else {
            vm.emit('AMAZON.HelpIntent');
        }
        
        let success = function (factor) {
            let result = factor * amount;
            result = +(Math.round(result + "e+2")  + "e-2");
            result = result.toString().replace(".", ",");

            const cardTitle = messages.SKILL_NAME + ' - ' + amount + ' ' + inputCurrency + ' sind ' + factor + ' ' + outputCurrency;
             vm.attributes.speechOutput = amount + " " + inputCurrency + " entsprechen " + result + " " + outputCurrency;
             vm.emit(':tellWithCard', vm.attributes.speechOutput, cardTitle);
        } 
        
       let error = function () {
            vm.attributes.speechOutput = "Der Service ist momentan nicht erreichbar. Bitte versuche es später noch einmal.";
            vm.emit(':tell', vm.attributes.speechOutput);
       }
       let mappedInput = mapCurrency(inputCurrency);
       let mappedOutput = mapCurrency(outputCurrency);
       if (mappedInput == null) {
            vm.attributes.speechOutput = "Die Währung " + inputCurrency + " wird leider nicht unterstützt.";
            vm.attributes.repromptSpeech = messages.CURRENCY_NOT_FOUND_REPROMPT;
            vm.emit(':ask', vm.attributes.speechOutput, vm.attributes.repromptSpeech);
       } else if (mappedOutput == null) {
            vm.attributes.speechOutput = "Die Währung " + outputCurrency + " wird leider nicht unterstützt.";
            vm.attributes.repromptSpeech = messages.CURRENCY_NOT_FOUND_REPROMPT;
            vm.emit(':ask', vm.attributes.speechOutput, vm.attributes.repromptSpeech);
       }
        getFactor(mappedInput, mappedOutput).then(success, error);
        
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = messages.HELP_MESSAGE;
        this.attributes.repromptSpeech = messages.HELP_REPROMT;
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', messages.STOP_MESSAGE);
    },
    'Unhandled': function () {
        this.attributes.speechOutput = messages.HELP_MESSAGE;
        this.attributes.repromptSpeech = messages.HELP_REPROMPT;
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
