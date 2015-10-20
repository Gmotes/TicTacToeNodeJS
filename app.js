var numberOfPlayer;
var playingGames = [];
var waitingGames = [];
var userX ='';
var userO ='';
function Game(x,y) {
    this.gameNo = x;
	this.userX = y;
	this.userO = '';
	this.isStarted = false;
}


var io = require('socket.io').listen(3000); //3000 portunu dinlemeye baþladýk.
io.sockets.on('connection', function(socket){ // tüm node iþlemlerini kapsayan ana fonksiyonumuz
       
	 socket.on('login', function(user){ //clientte'ki mesajý aldýk
         
		 // usernames[user.uid] = user.uid;
		  socket.username = user.uid;
		
		  //  socket.emit('mesajgitti', data) //server mesajý client'e geri gönderdi emit ile
          //  socket.broadcast.emit('mesajgitti', data) //
		
		 if (waitingGames.length > 0) {
		   console.log("You have been directed to waiting game..");
    	   var game = waitingGames[0];
		   game.userO = user.uid;
		   waitingGames[0] = game;
		   socket.join(game.userX);  
		   userX = game.userX;
		   socket.to(game.userX).emit('readyForGame', game);
		 }


		if (waitingGames.length == 0) {
		   console.log("No waiting Games new Player created with WaitingGame");
		   var game = new Game(1,user.uid);
		   waitingGames[0] = game;
		   socket.join(user.uid); 
		   console.log('UserUid:'+user.uid);
		   socket.emit('waitingOtherPlayer', 1);
		   
		  
		 }
		
    });
	
	socket.on('startGame',function(game) {
	
	socket.to(game.userX).emit('startGame', game,'X');
	userO = game.userO;
	
	});

	socket.on('moveAndChangeTurn',function(move,turn) {
	
	socket.to(userX).emit('moveAndChangeTurn', move,turn);
	
	});
	
	
     socket.on('disconnect', function() {
       // delete usernames[socket.username];
    //    io.sockets.emit('updateusers', usernames);
	//	console.log("Disconnected:"+socket.username);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);
    });
	
	
});

