/*
Current workflow:
Play -> Transition (to next song) -> Pick next song -> Transition

TODO:

Known Issues:


*/

var app = new Vue({
   el: "#app",
   data: {
      msg: "Hello Vue!",
      currPlayer: {
         ID: null,
         deck: null
      },
      deck1: {
         name: "Stromae - Alors on dance",
         src:
            "https://archive.org/download/StromaeAlorsOnDanse/Stromae%20-%20Alors%20On%20Danse.mp3",
         playing: false,
         times: null,
      },
      deck2: {
         name: "Cesaria Evora - Sodade",
         src: "https://archive.org/download/Sodade/49BSodade.mp3",
         playing: false,
         times: null,
      },
      sound1: null,
      sound2: null,

      songpool: [],
      transition_time: 7000,
      playerCountdown: 0,
      atimer: null,
      canTransition: false, //since fade is not triggered if nothing is playing 

      //visualization??
      analyser: null,
      dataArray: null,
   },
   created: function () {
      this.sound1 = new Howl({
         src: [this.deck1.src],
         sprite: {
            seg1: [0, 100000],
            seg2: [100000, 20000],
         }
      });
      this.sound2 = new Howl({
         src: [this.deck2.src],
         sprite: {
            seg1: [0, 100000],
            seg2: [100000, 20000],
         }
      });




   },
   methods: {
      playSong: function () {
         // Do not click more than once!
         this.currPlayer.ID = this.sound1.play('seg1');
         this.deck1.playing = true;
         this.currPlayer.deck = this.deck1;
         this.canTransition = true;

      },
      stopSong: function () {
         this.sound1.stop(this.currPlayer.ID);
         this.sound2.stop(this.currPlayer.ID);
         clearInterval(self.atimer)
      },
      transitionSong: function () {
         self = this;
         if (this.deck1.playing) {
            // Transition: 1 to 2
            self.canTransition = false;
            var lastPlayerID = this.currPlayer.ID;
            this.currPlayer.ID = this.sound2.play('seg1');
            this.deck2.playing = true;
            this.currPlayer.deck = this.deck2;
            this.sound1.fade(1, 0, this.transition_time, lastPlayerID);
            this.sound1.on("fade", function () {
               console.log("2 Finished! " + lastPlayerID);
               self.sound1.stop(self.lastPlayerID);
               self.deck1.playing = false;
               self.canTransition = true;
            });
            this.sound2.on('play', function () {
               console.log("1 Started playing! ");
               var init_time = self.deck2.times[self.deck2.times.length - 1] - self.deck2.times[0] + self.transition_time
               var remain_time = init_time
               clearInterval(self.atimer);
               self.atimer = setInterval(function () {
                  // console.log(self.transition_time);
                  remain_time = remain_time - 1000;

                  if (remain_time <= self.transition_time) {
                     clearInterval(self.atimer);
                     self.transitionSong();
                  }
                  console.log(remain_time);
                  self.playerCountdown = remain_time / init_time
               }, 1000);
            });
         } else {//if (this.sound2.playing()) {
            // Transition: 2 to 1
            self.canTransition = false;
            var lastPlayerID = this.currPlayer.ID;
            this.currPlayer.ID = this.sound1.play('seg1');
            this.deck1.playing = true;
            this.currPlayer.deck = this.deck1;
            this.sound2.fade(1, 0, this.transition_time, lastPlayerID);
            this.sound2.on("fade", function () {
               console.log("1 Finished! " + lastPlayerID);
               self.sound2.stop(self.lastPlayerID);
               self.deck2.playing = false;
               self.canTransition = true;
            });

            this.sound1.on('play', function () {
               console.log("2 Started playing! ");
               var init_time = self.deck1.times[self.deck1.times.length - 1] - self.deck1.times[0] + self.transition_time
               var remain_time = init_time
               clearInterval(self.atimer);
               self.atimer = setInterval(function () {
                  // console.log(self.transition_time);
                  remain_time = remain_time - 1000;

                  if (remain_time <= self.transition_time) {
                     clearInterval(self.atimer);
                     self.transitionSong();
                  }
                  console.log(remain_time);
                  self.playerCountdown = remain_time / init_time
               }, 1000);

            });
         }
         // console.log(this.player2)
      },
      updateDeck: function (song) {
         self = this;
         if (!this.deck1.playing) {
            this.deck1 = {
               name: song.name,
               src: song.src,
               playing: false,
               times: song.times
            }
            this.sound1 = new Howl({
               src: [this.deck1.src],
               sprite: {
                  seg1: [song.times[0] - this.transition_time * 0.5, song.times[song.times.length - 1] - song.times[0] + +this.transition_time],
                  seg2: [song.times[song.times.length - 2] - this.transition_time * 0.75, song.times[song.times.length - 1] - song.times[song.times.length - 2] + this.transition_time],
               }
            });

            // this.sound1.on('play', function () {
            //    console.log("1 Started playing! ");
            //    var init_time= song.times[song.times.length - 1] - song.times[0] + self.transition_time
            //    var remain_time = init_time
            //    a = setInterval(function () {
            //       // console.log(self.transition_time);
            //       remain_time = remain_time - 1000;

            //       if (remain_time <= self.transition_time) {
            //          clearInterval(a);
            //          self.transitionSong();
            //       }
            //       console.log(remain_time);
            //       self.playerCountdown=remain_time/init_time
            //    }, 1000);
            // });
            console.log('dek1 playing?' + this.deck1.playing)

         } else if (!this.deck2.playing) {
            this.deck2 = {
               name: song.name,
               src: song.src,
               playing: false,
               times: song.times
            }
            this.sound2 = new Howl({
               src: [this.deck2.src],
               sprite: { //stripe: [offset, duration, (loop)]
                  seg1: [song.times[0] - this.transition_time * 0.5, song.times[song.times.length - 1] - song.times[0] + this.transition_time],
                  seg2: [song.times[song.times.length - 2] - this.transition_time * 0.75, song.times[song.times.length - 1] - song.times[song.times.length - 2] + this.transition_time],
               }
            });
            // this.sound2.on('play', function () {
            //    console.log("2 Started playing! ");
            //    var init_time= song.times[song.times.length - 1] - song.times[0] + self.transition_time
            //    var remain_time = init_time
            //    a = setInterval(function () {
            //       // console.log(self.transition_time);
            //       remain_time = remain_time - 1000;

            //       if (remain_time <= self.transition_time) {
            //          clearInterval(a);
            //          self.transitionSong();
            //       }
            //       console.log(remain_time);
            //       self.playerCountdown=remain_time/init_time
            //    }, 1000);
            // });
            console.log('dek2 playing?' + this.deck2.playing)
         }
      },
      getNewSongs() {
         // TODO: Get from server
         songlist = [
            {
               name: "Matias Damasio - Voltei com Ela",
               src:
                  "audio/Matias Damasio - Voltei com Ela-pRYrXfIlf58.mp3",
               times: [21000, 49000, 99000, 215000],
               // bpm: 193
            },

            {
               name: "Filho do Zua - Ditado Ft. Carla Prata",
               src:
                  "audio/Filho do Zua - Ditado Ft. Carla Prata (Video Oficial)-pZWZ48TMLcQ.mp3",
               times: [11000, 52000, 72000, 95000, 207000],
               // bpm: 186
            },

            {
               name: "Cubitaa Tks - Me Fala",
               src:
                  "audio/Cubitaa Tks - Me Fala-dGhhm-WmKO4.mp3",
               times: [37000, 97000, 146000], //19000,
               // bpm: 195
            }
         ]

         this.songpool = songlist;
      }

   }
});

//Visualization??
// Create an analyser node in the Howler WebAudio context
app.analyser = Howler.ctx.createAnalyser(),
// Connect the masterGain -> analyser (disconnecting masterGain -> destination)
Howler.masterGain.connect(app.analyser);

app.analyser.connect(Howler.ctx.destination);
// Creating output array (according to documentation https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)
//   this.analyser.fftSize = 2048;
var bufferLength = app.analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

// Get the Data array
app.analyser.getByteTimeDomainData(dataArray);

// Display array on time each 3 sec (just to debug)
// setInterval(function () {
//    app.analyser.getByteTimeDomainData(dataArray);
//    console.dir(dataArray);
// }, 3000);

// function myFunction() {
//    var x = document.createElement("AUDIO");

//    if (x.canPlayType("audio/mpeg")) {
//       x.setAttribute("src", alors);
//    }

//    x.setAttribute("controls", "controls");
//    document.body.appendChild(x);
// }

// myFunction()

// var player1 = new Howl({
//          src: [deck1.src]
//       });
// var player2 =  new Howl({
//          src: [deck2.src]
//       });

// Play returns a unique Sound ID that can be passed
// into any method on Howl to control that specific sound.

// var id1 = sound1.play();
// var id2 = sound2.play();

// Fade out the first sound and speed up the second.
// sound1.fade(1, 0.2, 5000);
// sound2.rate(1.44);
// sound1.rate(0.8);

function downToNormal(sound) {
   decrease_rate = 0.01;
   var myVar = setInterval(function () {
      if (sound.rate() > 1) {
         sound.rate(sound.rate() - decrease_rate);
         // curr_rate = sound.rate();
         console.log(sound.rate());
      } else if (sound.rate() < 1 && sound.rate() > 0.9) {
         // if passed 1, reset
         sound.rate(1);
         clearInterval(myVar);
         console.log("Reset to 1");
      }
      console.log("downToNormal");
   }, 500);
}

function upToNormal(sound) {
   increase_rate = 0.01;
   var myVar = setInterval(function () {
      if (sound.rate() < 1) {
         sound.rate(sound.rate() + increase_rate);
         // curr_rate = sound.rate();
         console.log(sound.rate());
      } else if (sound.rate() > 1 && sound.rate() < 1.1) {
         //if passed 1, reset
         sound.rate(1);
         clearInterval(myVar);
         console.log("Reset to 1");
      }
      console.log("upToNormal");
   }, 500);
}

// downToNormal(sound2);
// upToNormal(sound1);