// Copyright (c) 2020
// Transforms curriculum content found in /curriculum folder into spantree content in span folder
//
'use strict';
const readline = require('readline');
var answer;
var stdio = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function Ask(prompt) {
  return new Promise((resolve, reject) => {
    stdio.question(prompt, answer => {
      stdio.close();
      resolve(answer);
    });
  }); //promise
};//function

function AskMe(prompt) {
stdio.question(prompt, function(answer) {
  // TODO: Log the answer in a database
  stdio.close();
});
};

module.exports = { Ask, AskMe };
