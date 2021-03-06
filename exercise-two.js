'use strict';

var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// runs every problem given as command-line argument to process
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. log poem two stanza one and stanza two, in any order
   *    but log 'done' when both are done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );

  var eachDone = () => console.log('done');
  // promise version
  promisifiedReadFile('poem-two/stanza-01.txt')
    .then(function(stanza1){
      console.log('-- A. promise version --');
      blue(stanza1);
      // eachDone();
      return promisifiedReadFile('poem-two/stanza-02.txt');
    })
    .then(function(stanza2){
      console.log('-- A. promise version --');
      blue(stanza2);
      // return eachDone();
    })
    .then(eachDone);
}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. log all the stanzas in poem two, in any order
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  //leave filenames as is
  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  // async.each(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- B. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- B. callback version done --');
  //   }
  // );

  // promise version
  // ???
  // var done = function(){
  //   console.log('done');
  // };
  // for (var i = 0; i  < filenames.length; i++){
  //   //console.log(filenames[i]);
  //   promisifiedReadFile(filenames[i])
  //     .then(stanza => blue(stanza));
  // }
  // promisifiedReadFile('done').then((done) => console.log('done'));

  //create array of promises
  let promisesArray = [];
  for (var i = 0; i < filenames.length; i++){
    let promise = promisifiedReadFile(filenames[i]).then(blue);
    promisesArray.push(promise);
  }

  Promise.all(promisesArray).then(() => console.log('done'));
}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. read & log all the stanzas in poem two, *in order*
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- C. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- C. callback version done --');
  //   }
  // );

  // promise version
  // ???

  //create array of promises
  var promisesArray = [];
  for (var i = 0; i < filenames.length; i++) {
    let promise = promisifiedReadFile(filenames[i]);
    promisesArray.push(promise);
  }

  Promise.each(promisesArray, blue).then(() => console.log('done'));
}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. log all the stanzas in poem two, *in order*
   *    making sure to fail for any error and log it out
   *    and log 'done' when they're all done
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  //leave filenames array as is
  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- D. callback version --');
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(err);
  //     console.log('-- D. callback version done --');
  //   }
  // );

  // promise version
  // ???

  //make an array of promises
  var promisesArray = [];
  for (var i = 0; i < filenames.length; i++) {
    var promise = promisifiedReadFile(filenames[i]);
    promisesArray.push(promise);
  }

  //pass array of promises to Promise.each
  Promise.each(promisesArray, blue).catch(magenta).then(() => console.log('done'));
}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. make a promisifed version of fs.writeFile
   *
   */


   //Instructor (Emily's) solution
  var fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    // fs.writeFile(filename, function(err, result){
    //   if (err) //reject with that error
    //   else //resolve with the result
    // });

    return new Promise(function(resolve, reject){
      fs.writeFile(filename, function(err, result){
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}
