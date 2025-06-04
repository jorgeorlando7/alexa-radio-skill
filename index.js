/* eslint-disable no-mixed-operators */
/* eslint-disable func-names */
/* eslint-disable no-console */

const Alexa = require('ask-sdk-core');

// Configuración del stream
const STREAMS = [
  {
    token: 'es-tendencia-tlacolula',
    url: 'https://tlacosonido.top/listen/es_tendencia/radio-320.mp3',
    metadata: {
      title: 'Es Tendencia',
      subtitle: 'La estación en línea que te conecta con lo último en música, noticias y tendencias.',
      art: {
        sources: [
          {
            contentDescription: 'Es Tendencia',
            url: 'https://radiococijo.com/wp-content/uploads/2025/06/Logo-512-x-512-px.png',
            widthPixels: 512,
            heightPixels: 512,
          },
        ],
      },
      backgroundImage: {
        sources: [
          {
            contentDescription: 'Es Tendencia',
            url: 'https://radiococijo.com/wp-content/uploads/2025/06/Fondo-Alexa.png',
            widthPixels: 1200,
            heightPixels: 800,
          },
        ],
      },
    },
  },
];

// Handlers
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Bienvenido a Es Tendencia. Di "reproducir" para comenzar.')
      .reprompt('Di "reproducir" para escuchar la estación.')
      .getResponse();
  },
};

const PlayStreamIntentHandler = {
  canHandle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request;
    const supportedIntents = [
      'PlayStreamIntent',
      'AMAZON.ResumeIntent',
      'AMAZON.NextIntent',
      'AMAZON.PreviousIntent',
    ];
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && 
           intent && supportedIntents.includes(intent.name);
  },
  handle(handlerInput) {
    const stream = STREAMS[0];
    return handlerInput.responseBuilder
      .speak('Reproduciendo Es Tendencia.')
      .addAudioPlayerPlayDirective('REPLACE_ALL', stream.url, stream.token, 0, null, stream.metadata)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
           handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Di "reproducir" para escuchar la radio o "detener" para parar.')
      .reprompt('¿Necesitas ayuda? Di "reproducir" o "detener".')
      .getResponse();
  },
};

const AboutIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
           handlerInput.requestEnvelope.request.intent.name === 'AboutIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Es Tendencia Radio te ofrece la mejor música y noticias. Di "reproducir" para empezar.')
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request;
    const supportedIntents = [
      'AMAZON.CancelIntent',
      'AMAZON.StopIntent',
      'AMAZON.PauseIntent',
    ];
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && 
           intent && supportedIntents.includes(intent.name);
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .speak('Deteniendo la reproducción.')
      .getResponse();
  },
};

const PlaybackStartedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStarted';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const PlaybackStoppedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStopped';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Sesión finalizada: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ExceptionEncounteredRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'System.ExceptionEncountered';
  },
  handle(handlerInput) {
    console.log('Error del sistema:', handlerInput.requestEnvelope.request.error);
    return handlerInput.responseBuilder.getResponse();
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
           handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('No entendí eso. Di "reproducir" o "ayuda".')
      .reprompt('Di "reproducir" para escuchar la radio.')
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log('Error:', error.message);
    return handlerInput.responseBuilder
      .speak('Ocurrió un error. Por favor, inténtalo de nuevo.')
      .getResponse();
  },
};

// Exportación con todos los handlers
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayStreamIntentHandler,
    HelpIntentHandler,
    AboutIntentHandler,
    CancelAndStopIntentHandler,
    PlaybackStartedIntentHandler,
    PlaybackStoppedIntentHandler,
    SessionEndedRequestHandler,
    ExceptionEncounteredRequestHandler,
    FallbackIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
