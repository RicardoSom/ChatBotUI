'use strict';


//jQuery.getJSON('https://siichile.herokuapp.com/consulta', {rut: '18.210.980-0'}, function(result) {
//  console.log(result);
//})
//const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);

  $.ajax({
    url: "http://127.0.0.1:5000/bot",
    type: "GET",
    data: {input: text},
    crossDomain: true,
    success: function(data){
      if(data == '') data = '(No hay respuesta...)';
      outputBot.textContent = data;
      synthVoice(data);
      
    }
  });  

  //socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.lang = 'es-ES';
  utterance.text = text;
  synth.speak(utterance);
}

//socket.on('bot reply', function(replyText) {
//  synthVoice(replyText);

//  if(replyText == '') replyText = '(No answer...)';
//  outputBot.textContent = replyText;
//});
