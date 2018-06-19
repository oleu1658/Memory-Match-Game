(function(){
	
	var Play = {

		init: function(cardsEN, cardsCH){
			this.$game = $(".game");
            this.$timer = $(".timer");
            
            // Main Menu
            this.$mainMenuOverlayEN = $(".main-menu-overlay-EN");
            this.$mainMenuModalEN = $(".main-menu-modal-EN");
            this.$mainMenuOverlayCH = $(".main-menu-overlay-CH");
            this.$mainMenuModalCH = $(".main-menu-modal-CH");
            this.$levelOneButton = $("button.level-one");
            this.$levelTwoButton = $("button.level-two");
            this.$levelThreeButton = $("button.level-three");
            this.$englishVersionButton = $("button.english-version");
            this.$chineseVersionButton = $("button.chinese-version");
            
            // Pick Team Menu
            this.$teamOverlay = $(".team-overlay");
            this.$teamModalEN = $(".team-modal-EN");
            this.$teamModalCH = $(".team-modal-CH");
            this.$blackTeamButton = $("button.black");
            this.$yellowTeamButton = $("button.yellow");
            
            // Pause Menu
            this.$pauseOverlay = $(".pause-overlay");
            this.$pauseModalEN = $(".pause-modal-EN");
            this.$pauseModalCH = $(".pause-modal-CH");
            this.$pauseButton = $("button.pause");
            this.$continueButton = $("button.continue");
            this.$quitButton = $("button.quit");
            
            // Game Over Menu
            this.$gameoverOverlayEN = $(".gameover-overlay-EN");
			this.$winModalEN = $(".win-modal-EN");
            this.$loseModalEN = $(".lose-modal-EN");
			this.$gameoverOverlayCH = $(".gameover-overlay-CH");
            this.$winModalCH = $(".win-modal-CH");
            this.$loseModalCH = $(".lose-modal-CH");
            this.$restartButton = $("button.restart");
            
            this.cardsArrayEN = cardsEN;
            this.cardsArrayCH = cardsCH; 
            this.menuBinding();
            this.showMainMenuCH();
		},

		shuffleCards: function(levelCards){
			this.$cards = $(this.shuffle(levelCards));
		},

		setup: function(){
			this.html = this.buildHTML();
			this.$game.html(this.html);
			this.$allCards = $(".card");
            if (this.level == 1) {
                this.$allCards.width("15%");
                this.$allCards.height("38%");
                this.$allCards.minHeight
            }
            else if(this.level == 2) {
                this.$allCards.width("15%");
                this.$allCards.height("22%");
            }
            else {
                    this.$allCards.width("6.666%"); 
                    this.$allCards.height("22%"); 
            }
            
            // Choose card border color based on team
            if(this.team == "Black") {
                this.$allCards.find(".front").addClass("black");
                this.$allCards.find(".back").addClass("black");
            }
            else {
                this.$allCards.find(".front").addClass("yellow");
                this.$allCards.find(".back").addClass("yellow");
            }
            
			this.paused = false;
     	    this.guess = null;
            this.win = false;
            this.$allCards.on("click", this.cardClicked); // Bind cards to cardClicked function when clicked
		},
        
        menuBinding: function(){
            // Connect buttons to corresponding functions
            this.$levelOneButton.on("click", {idNum: "1"}, $.proxy(this.createLevel, this));
            this.$levelTwoButton.on("click", {idNum: "2"}, $.proxy(this.createLevel,this));
            this.$levelThreeButton.on("click", {idNum: "3"}, $.proxy(this.createLevel,this));
            this.$englishVersionButton.on("click", $.proxy(this.showMainMenuEN, this));
            this.$chineseVersionButton.on("click", $.proxy(this.showMainMenuCH, this));
            this.$blackTeamButton.on("click", {team: "Black"}, $.proxy(this.beginGame, this));
            this.$yellowTeamButton.on("click", {team: "Yellow"}, $.proxy(this.beginGame, this));
            this.$pauseButton.on("click", $.proxy(this.showPauseMenu, this));
            this.$continueButton.on("click", $.proxy(this.hidePauseMenu, this));
            this.$quitButton.on("click", $.proxy(this.reset, this));
            this.$restartButton.on("click", $.proxy(this.reset, this));
		},

		cardClicked: function(){
			var $card = $(this);
            // If game is not paused && card is not already matched && card is not already picked
			if(!Play.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				$card.find(".inside").addClass("picked");
                // If no card has been picked before, assign the id of this card to Play.guess
				if(!Play.guess){
					Play.guess = $(this).attr("data-id");
				} 
                // If id of this card matches id of previously picked card && this card was not already picked
                else if(Play.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
                    // Adds matched class to the 2 picked cards at once
					$(".picked").addClass("matched");
					Play.guess = null;
				} 
                // Otherwise unpick the two picked cards b/c they don't match
                else {
					Play.guess = null;
					Play.paused = true;
					setTimeout(function(){
                        // Removes picked class from each card
						$(".picked").removeClass("picked");
                        Play.paused = false;
					}, 600);
				}
                // If all cards are matched, user wins game
				if($(".matched").length == $(".card").length){
                    Play.win = true;
					Play.over();
				}
			}
		},

		over: function(){
			this.paused = true;
			setTimeout(function(){
				Play.showGameoverMenu();
				Play.$game.fadeOut();
                Play.$timer.fadeOut();
			}, 1000);
		},

		showGameoverMenu: function(){
            if(this.version == "English") {
			     this.$gameoverOverlayEN.show();
			     if(this.win) {
                     this.$winModalEN.fadeIn("slow");
                     if(this.team == "Black") $(".win-modal-EN").find(".black-winner").fadeIn("slow");
                     else $(".win-modal-EN").find(".yellow-winner").fadeIn("slow");                     
                 }
                 else {
                     this.$loseModalEN.fadeIn("slow");
                     if(this.team == "Black") $(".lose-modal-EN").find(".black-loser").fadeIn("slow");
                     else $(".lose-modal-EN").find(".yellow-loser").fadeIn("slow");
                 }
            }
            else {
                 this.$gameoverOverlayCH.show();
			     if(this.win) {
                     this.$winModalCH.fadeIn("slow");
                     if(this.team == "Black") $(".win-modal-CH").find(".black-winner").fadeIn("slow");
                     else $(".win-modal-CH").find(".yellow-winner").fadeIn("slow");
                 }
                 else {
                     this.$loseModalCH.fadeIn("slow");
                     if(this.team == "Black") $(".lose-modal-CH").find(".black-loser").fadeIn("slow");
                     else $(".lose-modal-CH").find(".yellow-loser").fadeIn("slow");
                 }
            }
		},

		hideGameoverMenu: function(){
            if(this.version == "English") {
                 this.$gameoverOverlayEN.hide();
			     if(this.win) {
                     this.$winModalEN.hide();
                     $(".win-modal-EN").find(".black-winner").hide();
                     $(".win-modal-EN").find(".yellow-winner").hide();
                 }
                 else {
                     this.$loseModalEN.hide();
                     $(".lose-modal-EN").find(".black-loser").hide();
                     $(".lose-modal-EN").find(".yellow-loser").hide();
                 }
            }
            else {
                 this.$gameoverOverlayCH.hide();
			     if(this.win) {
                     this.$winModalCH.hide();
                     $(".win-modal-CH").find(".black-winner").hide();
                     $(".win-modal-CH").find(".yellow-winner").hide();
                 }
                 else {
                     this.$loseModalCH.hide();
                     $(".lose-modal-CH").find(".black-loser").hide();
                     $(".lose-modal-CH").find(".yellow-loser").hide();
                 }
            }
		},
        
        showMainMenuEN: function() {
            this.hideMainMenu();
            this.version = "English";
            this.$mainMenuOverlayEN.show();
            this.$mainMenuModalEN.fadeIn("slow");
        },
        
        showMainMenuCH: function() {
            this.hideMainMenu();
            this.version = "Chinese";
            this.$mainMenuOverlayCH.show();
            this.$mainMenuModalCH.fadeIn("slow");
        },
        
        hideMainMenu: function() {
            if(this.version == "English") {
                this.$mainMenuOverlayEN.hide();
                this.$mainMenuModalEN.hide();
            }
            else {
                this.$mainMenuOverlayCH.hide();
                this.$mainMenuModalCH.hide();
            }
        },
        
        showTeamMenu: function() {
            this.$teamOverlay.show();
            if(this.version == "English") this.$teamModalEN.fadeIn("slow");
            else this.$teamModalCH.fadeIn("slow");
        },
        
        hideTeamMenu: function() {
            if(this.version == "English") this.$teamModalEN.hide();
            else this.$teamModalCH.hide();
            this.$teamOverlay.hide();
        },
        
        createLevel: function(event) {
            if(this.version == "English") this.cardsArray = this.cardsArrayEN;
            else this.cardsArray = this.cardsArrayCH;
            if(event.data.idNum == "1") {
                this.level = 1;
                this.levelCards = this.cardsArray.slice(0,8);
            }
            else if(event.data.idNum == "2") {
                this.level = 2;
                this.levelCards = this.cardsArray.slice(0,12);
            }
            else {
                this.level = 3;
                this.levelCards = this.cardsArray.slice(0,18);
            }
            
            this.shuffleCards(this.levelCards);
            this.hideMainMenu();
            this.showTeamMenu();
        },
        
        beginGame: function(event) {
            this.team = event.data.team;
            this.hideTeamMenu();
            this.setup();
            this.$game.fadeIn("slow");
            this.$timer.fadeIn("slow");
            this.startCountdown();
        },
        
        showPauseMenu: function() {
            this.paused = true;
            this.$pauseOverlay.show();
            if(this.version == "English") this.$pauseModalEN.show();
            else this.$pauseModalCH.show();
        },
        
        hidePauseMenu: function() {
            this.paused = false;
            this.$pauseOverlay.hide();
            if(this.version == "English") this.$pauseModalEN.hide();
            else this.$pauseModalCH.hide();
        },

		reset: function() {
            this.$game.hide(); // In case it was from pause menu's quit button
            this.$timer.hide(); 
            this.hideGameoverMenu();
            this.hidePauseMenu();
            clearInterval(this.timeCount);
            this.resetTimer();
            if(this.version == "English") this.showMainMenuEN();
            else this.showMainMenuCH();
		},
        
        resetTimer: function() {
            // Set clock back to 00:00
            $(".active").removeClass("active");
            $(".outgoing").removeClass("outgoing");
            $(".skip").removeClass("skip");
            $(document.getElementById("mins-tens-0")).addClass("active");
            $(document.getElementById("mins-ones-0")).addClass("active");
            $(document.getElementById("secs-tens-0")).addClass("active");
            $(document.getElementById("secs-ones-0")).addClass("active");
        },

		shuffle: function(array){
			var counter = array.length, temp, index;
	   	    while (counter > 0) {
        	   // Pick a random index
        	   index = Math.floor(Math.random() * counter);
        	   counter--;
        	   // Swap the last element with the element at the index
        	   temp = array[counter];
        	   array[counter] = array[index];
        	   array[index] = temp;
	    	}
	    	return array;
		},
        
        startCountdown: function() {
            var timePassed = 0;
            var timeLimit1 = 20, timeLimit2 = 35, timeLimit3 = 50;
            Play.start = true; // This is for the timer, to make 0 the outgoing # in the beginning no matter what the active # is
            this.timeCount = setInterval(function() {
                if(!Play.paused) {
                    var timeLeft = 0;
                    
                    // Get timeLeft based on level
                    if(Play.level == 1) timeLeft = timeLimit1 - timePassed;
                    else if (Play.level == 2) timeLeft = timeLimit2 - timePassed;
                    else timeLeft = timeLimit3 - timePassed;
                    
                    if(timeLeft >= 0) {
                            Play.setClock(timeLeft);
                            if(timeLeft == 0) {
                                Play.paused = true;
                                setTimeout(function() {
                                    Play.paused = false;
                                }, 1);
                            }
                        }
                    else {
                            clearInterval(this.timeCount);
                            Play.over();
                    }
                    ++timePassed;
                }
            }, 1000);
        },

		buildHTML: function(){
			var frag = '';
            this.$cards.each(function(k, v){
	           frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
	           <div class="front"><img src="'+ v.img +'"\
	           alt="'+ v.name +'" /></div>\
	           <div class="back"><img src="Images/icon.jpg"\
	           alt="Icon" /></div></div>\
	           </div>';
	        });
	       return frag;
		},
        
        checkTime: function(t) {
            if(t < 10) {t = "0" + t;}
            return t;
        },
        
        setClock: function(timeLeft) {
            var mins = Math.floor(timeLeft/60);
            var secs = timeLeft % 60;
            mins = String(Play.checkTime(mins)).split('');
            secs = String(Play.checkTime(secs)).split('');            
            
            // Clear old active and outgoing numbers
            $(".active").removeClass("active"); 
            $(".outgoing").removeClass("outgoing");
            $(".skip").removeClass("skip");
            
            // Make sure tens place of mins is 0-5
            var minsTensOutID = parseInt(mins[0]) + 1 == 6 ? 0 : parseInt(mins[0]) + 1;
            // If this is start of game && 0 is not active, set outgoing # as 0. Otherwise set it as the outgoing # based on active # (i.e. active#+1). I have to check that 0 is not active otherwise it'd be both active and outgoing and .outgoing .top will make it rotate down and the top will show the next # when 0 is supposed to be active and showing on top.
            var $minsTensOut = Play.start && parseInt(mins[0]) ? $(document.getElementById("mins-tens-0")) : $(document.getElementById("mins-tens-" + String(minsTensOutID)));
            var $minsTensActive = $(document.getElementById("mins-tens-" + mins[0]));
            // Make sure ones places of mins is 0-9
            var minsOnesOutID = parseInt(mins[1]) + 1 == 10 ? 0 : parseInt(mins[1]) + 1;
            var $minsOnesOut = Play.start && parseInt(mins[1]) ? $(document.getElementById("mins-ones-0")) : $(document.getElementById("mins-ones-" + String(minsOnesOutID)));
            var $minsOnesActive = $(document.getElementById("mins-ones-" + mins[1]));
            
            var secsTensOutID = parseInt(secs[0]) + 1 == 6 ? 0 : parseInt(secs[0]) + 1;
            var $secsTensOut = Play.start && parseInt(secs[0]) ? $(document.getElementById("secs-tens-0")) : $(document.getElementById("secs-tens-" + String(secsTensOutID)));
            var $secsTensActive = $(document.getElementById("secs-tens-" + secs[0]));
            var secsOnesOutID = parseInt(secs[1]) + 1 == 10 ? 0 : parseInt(secs[1]) + 1;
            var $secsOnesOut = Play.start && parseInt(secs[1]) ? $(document.getElementById("secs-ones-0")) : $(document.getElementById("secs-ones-" + String(secsOnesOutID)));
            var $secsOnesActive = $(document.getElementById("secs-ones-" + secs[1]));
            
            $minsTensActive.addClass("active");
            $minsTensOut.addClass("outgoing");
            $minsOnesActive.addClass("active");
            $minsOnesOut.addClass("outgoing");
            $secsTensActive.addClass("active");
            $secsTensOut.addClass("outgoing");
            $secsOnesActive.addClass("active");
            $secsOnesOut.addClass("outgoing");
            
            // We want the clock to start at 00:00 and flip directly to the countdown w/o having the outgoing#=active#+1 flip down 
            if(Play.start) {
                // .skip .top rotates the top of the # to -180deg while it is not showing (ie doesn't have .active or .outgoing) so that when the # is set as outgoing, it is already at -180deg and won't flip down (ex: for active #'s 0->4->4, if you don't do .skip when 0->4, when 4 is set as active # the 2nd time, outgoing # is set to 5 which is at 0deg. Then in btwn 4->4, the top for 5 will flip down. )
                $(document.getElementById("mins-tens-" + String(minsTensOutID))).addClass("skip");
                $(document.getElementById("mins-ones-" + String(minsOnesOutID))).addClass("skip");
                $(document.getElementById("secs-tens-" + String(secsTensOutID))).addClass("skip");
                $(document.getElementById("secs-ones-" + String(secsOnesOutID))).addClass("skip");
                // In case the active # is 0 and the outgoing # was set as 1 (ie. outgoing#=active#+1), remove .outgoing from 1 so that the top for 1 will .skip w/o it showing up.
                $(document.getElementById("mins-tens-" + String(minsTensOutID))).removeClass("outgoing");
                $(document.getElementById("mins-ones-" + String(minsOnesOutID))).removeClass("outgoing");
                $(document.getElementById("secs-tens-" + String(secsTensOutID))).removeClass("outgoing");
                $(document.getElementById("secs-ones-" + String(secsOnesOutID))).removeClass("outgoing");
            }
            
            Play.start = false;         
        }
	};

	var cardsEN = [
        {
			name: "Chris Hemsworth",
			img: "Images/EN/1_0.jpg",
			id: 1,
		},
		{
			name: "Elsa Pataky",
			img: "Images/EN/1_1.jpg",
			id: 1
		},
		{
			name: "Blake Lively",
			img: "Images/EN/2_0.jpg",
			id: 2
		},
		{
			name: "Ryan Reynolds",
			img: "Images/EN/2_1.jpg",
			id: 2
		}, 
		{
			name: "Jada Pinkett",
			img: "Images/EN/3_0.jpg",
			id: 3
		},
		{
			name: "Will Smith",
			img: "Images/EN/3_1.jpg",
			id: 3
		},
		{
			name: "John Legend",
			img: "Images/EN/4_0.jpg",
			id: 4
		},
		{
			name: "Chrissy Teigen",
			img: "Images/EN/4_1.jpg",
			id: 4
		},
		{
			name: "Jessica Biel",
			img: "Images/EN/5_0.jpg",
			id: 5
		},
		{
			name: "Justin Timberlake",
			img: "Images/EN/5_1.jpg",
			id: 5
		},
		{
			name: "Behati Prinsloo",
			img: "Images/EN/6_0.jpg",
			id: 6
		},
		{
			name: "Adam Levine",
			img: "Images/EN/6_1.jpg",
			id: 6
		},
        {
			name: "Victoria Beckham",
			img: "Images/EN/7_0.jpg",
			id: 7
		},
        {
			name: "David Beckham",
			img: "Images/EN/7_1.jpg",
			id: 7
		},
        {
			name: "Ellen Degeneres",
			img: "Images/EN/8_0.jpg",
			id: 8
		},
        {
			name: "Portia De Rossi",
			img: "Images/EN/8_1.jpg",
			id: 8
		},
        {
			name: "Emily Blunt",
			img: "Images/EN/9_0.jpg",
			id: 9
		},
        {
			name: "John Krasinski",
			img: "Images/EN/9_1.jpg",
			id: 9
		},
        {
			name: "Amal Alamuddin",
			img: "Images/EN/10_0.jpg",
			id: 10
		},
        {
			name: "George Clooney",
			img: "Images/EN/10_1.jpg",
			id: 10
		},
        {
			name: "Gisele Bundchen",
			img: "Images/EN/11_0.jpg",
			id: 11
		},
        {
			name: "Tom Brady",
			img: "Images/EN/11_1.jpg",
			id: 11
		},
        {
			name: "Neil Patrick Harris",
			img: "Images/EN/12_0.jpg",
			id: 12
		},
        {
			name: "David Burtka",
			img: "Images/EN/12_1.jpg",
			id: 12
		},
	];
    
    var cardsCH = [
        {
			name: "梁朝偉",
			img: "Images/CH/1_0_name.jpg",
			id: 1,
		},
		{
			name: "劉嘉玲",
			img: "Images/CH/1_1_name.jpg",
			id: 1
		},
		{
			name: "昆凌",
			img: "Images/CH/2_0_name.jpg",
			id: 2
		},
		{
			name: "周杰倫",
			img: "Images/CH/2_1_name.jpg",
			id: 2
		}, 
		{
			name: "藍正龍",
			img: "Images/CH/3_0_name.jpg",
			id: 3
		},
		{
			name: "周幼婷",
			img: "Images/CH/3_1_name.jpg",
			id: 3
		},
		{
			name: "李詠嫻",
			img: "Images/CH/4_0_name.jpg",
			id: 4
		},
		{
			name: "艾力克斯",
			img: "Images/CH/4_1_name.jpg",
			id: 4
		},
		{
			name: "辛龍",
			img: "Images/CH/5_0_name.jpg",
			id: 5
		},
		{
			name: "劉真",
			img: "Images/CH/5_1_name.jpg",
			id: 5
		},
		{
			name: "馮德倫",
			img: "Images/CH/6_0_name.jpg",
			id: 6
		},
		{
			name: "舒淇",
			img: "Images/CH/6_1_name.jpg",
			id: 6
		},
        {
			name: "林心如",
			img: "Images/CH/7_0_name.jpg",
			id: 7
		},
        {
			name: "霍建華",
			img: "Images/CH/7_1_name.jpg",
			id: 7
		},
        {
			name: "侯昌明",
			img: "Images/CH/8_0_name.jpg",
			id: 8
		},
        {
			name: "曾雅蘭",
			img: "Images/CH/8_1_name.jpg",
			id: 8
		},
        {
			name: "黃嘵明",
			img: "Images/CH/9_0_name.jpg",
			id: 9
		},
        {
			name: "Angelababy",
			img: "Images/CH/9_1_name.jpg",
			id: 9
		},
        {
			name: "賈靜雯",
			img: "Images/CH/10_0_name.jpg",
			id: 10
		},
        {
			name: "俢杰楷",
			img: "Images/CH/10_1_name.jpg",
			id: 10
		},
        {
			name: "劉詩詩",
			img: "Images/CH/11_0_name.jpg",
			id: 11
		},
        {
			name: "吳奇隆",
			img: "Images/CH/11_1_name.jpg",
			id: 11
		},
        {
			name: "范瑋琪",
			img: "Images/CH/12_0_name.jpg",
			id: 12
		},
        {
			name: "陳建州",
			img: "Images/CH/12_1_name.jpg",
			id: 12
		},
	];
    
	Play.init(cardsEN, cardsCH);


})();
