var numberOfPlayer;
var playingGames = [];
var waitingGames = [];
var userX ='';
var userO ='';
var isProcessed = false;
function Game(x,y) {
    this.gameNo = x;
	this.userX = y;
	this.userO = '';
	this.isStarted = false;
}


var io = require('socket.io').listen(3000); 
io.sockets.on('connection', function(socket){ 
       
	 socket.on('login', function(user){ 
         
		  
		socket.username = user.uid;
		isProcessed = false;
		if (waitingGames.length == 0) {
		   console.log("No waiting Games new Player created with WaitingGame");
		   var key = makeid();
		   var game = new Game(key,user.uid);
		   waitingGames[0] = game;
		   socket.join(key); 
		   socket.emit('waitingOtherPlayer', game);
		   isProcessed = true;
		 }
		 
	     console.log("Length-1:"+waitingGames.length);
		 if (waitingGames.length > 0 && !(isProcessed)) {
		   console.log("You have been directed to waiting game..");
    	   var game = waitingGames[0];
		   game.userO = user.uid;
		   socket.join(game.gameNo);  
		   userX = game.userX;
		   socket.to(game.gameNo).emit('readyForGame', game);
		   delete waitingGames[0];
		   delete game;
		   waitingGames.length--;
		   console.log("Length-2:"+waitingGames.length);
		 }
		
    });
	
	socket.on('startGame',function(game) {
	
	socket.to(game.gameNo).emit('startGame', game,'X');
	userO = game.userO;
	
	});

	socket.on('moveAndChangeTurn',function(move,turn,game) {
	console.log("Game No:"+game.gameNo);
	
	socket.to(game.gameNo).emit('moveAndChangeTurn', move,turn,game);
	
	});
	
	
     socket.on('disconnect', function() {
       // delete usernames[socket.username];
    //    io.sockets.emit('updateusers', usernames);
	//	console.log("Disconnected:"+socket.username);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);
    });
	
	
});


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

