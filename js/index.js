/*
Current workflow:
Play -> Transition (to next song) -> Pick next song ->

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
      },
      deck2: {
         name: "Cesaria Evora - Sodade",
         src: "https://archive.org/download/Sodade/49BSodade.mp3",
         playing: false,
      },
      sound1: null,
      sound2: null,

      songpool:[]
      // player1: new Howl({
      //     src: [this.deck1.src]
      //  }),
      // player2: new Howl({
      //     src: [this.deck2.src]
      //  }),
   },
   created: function () {
      this.sound1 = new Howl({
         src: [this.deck1.src]
      });
      this.sound2 = new Howl({
         src: [this.deck2.src]
      });
      // this.player1.on('fade', function(){
      //         console.log('Finished!');
      //       });
      // console.log(this.player1);
   },
   methods: {
      playSong: function () {
         // Do not click more than once!
         this.currPlayer.ID = this.sound1.play();
         this.deck1.playing = true;
         this.currPlayer.deck = this.deck1;
      },
      stopSong: function () {
         this.sound1.stop(this.currPlayer.ID);

         this.sound2.stop(this.currPlayer.ID);
      },
      transitionSong: function () {
         if (this.sound1.playing()) {
            self = this;
            var lastPlayerID = this.currPlayer.ID;
            this.currPlayer.ID = this.sound2.play();
            this.currPlayer.deck = this.deck2;
            this.sound1.fade(1, 0.2, 5000, lastPlayerID);
            this.sound1.on("fade", function () {
               console.log("Finished! " + lastPlayerID);
               self.sound1.stop(self.lastPlayerID);
               self.deck1.playing = false;
            });
         } else if (this.sound2.playing()) {
            self = this;
            var lastPlayerID = this.currPlayer.ID;
            this.currPlayer.ID = this.sound1.play();
            this.currPlayer.deck = this.deck1;
            this.sound2.fade(1, 0.2, 5000, lastPlayerID);
            this.sound2.on("fade", function () {
               console.log("Finished! " + lastPlayerID);
               self.sound2.stop(self.lastPlayerID);
               self.deck2.playing = true;
            });
         }
         // console.log(this.player2)
      },
      updateDeck: function (song) {
         if (!this.deck1.playing) {
            this.deck1 = {
               name: song.name,
               src: song.src,
               playing: false,
            }
            this.sound1 = new Howl({
               src: [this.deck1.src]
            });
            console.log('dek1:' + this.deck1.playing)
         } else if (!this.deck2.playing) {
            // this.deck2= {
            //    name: "Matias Damasio - Voltei com Ela",
            //    src:
            //       "audio/Matias Damasio - Voltei com Ela-pRYrXfIlf58.mp3",
            //    playing: false,
            // }
            // this.sound2 = new Howl({
            //    src: [this.deck2.src]
            // });
            console.log('dek2 playing?' + this.deck2.playing)
         }
      },
      getNewSongs() {
         // TODO: Get from server
         songlist= [
            {
               name: "Matias Damasio - Voltei com Ela",
               src:
                  "audio/Matias Damasio - Voltei com Ela-pRYrXfIlf58.mp3",
            }, 
            {
               name: "Filho do Zua - Ditado Ft. Carla Prata",
               src:
                  "audio/Filho do Zua - Ditado Ft. Carla Prata (Video Oficial)-pZWZ48TMLcQ.mp3",
            },
            {
               name: "Cubitaa Tks - Me Fala",
               src:
                  "audio/Cubitaa Tks - Me Fala-dGhhm-WmKO4.mp3",
            }
         ]

         this.songpool = songlist;
      }

   }
});

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