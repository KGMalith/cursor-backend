//Import .env package
require('dotenv').config();
//Initialize express
let express = require('express');
let app = express(), server = require('http').createServer(app), io = require('socket.io')(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
});
//import bodyparser
let bodyParser = require('body-parser');
//Import mongoose
let mongoose = require('mongoose');
//Import CORS
let cors = require('cors');
//Import auth Routes
let authRoutes = require('./src/routes/auth/auth_routes');
//Import Port Number
const PORT = process.env.APP_PORT;

//Create mongoose connection
mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

//use json
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Keep track of connected users and their cursor positions
const users = [];

io.on('connection', (socket) => {
	console.log('A user connected');

	//cursor move
	socket.on('cursorMove', ({ position, user }) => {
		index = users.findIndex((item)=>item.socketId == socket.id);
		if(index != -1){
			users[index].position = position;
			users[index].first_name = user.first_name;
			users[index].last_name = user.last_name;
			users[index].image = user.image;
		}else{
			let obj = {...user, position: {  x: position.x, y: position.y},socketId:socket.id};
			users.push(obj);
		}
		
		io.emit('usersUpdate', users);
	});

	//new user
	socket.on('newUser', (user) => {
		index = users.findIndex((item)=>item.socketId == socket.id);
		if(index != -1){
			users[index] = { ...user, position: { x: 0, y: 0 },socketId:socket.id };
		}else{
			let obj = {...user, position: { x: 0, y: 0 },socketId:socket.id};
			users.push(obj);
		}
		
		io.emit('usersUpdate', users);
	});

	//disconnect
	socket.on('disconnect', () => {
		console.log('A user disconnected');
		let index = users.findIndex((item)=>item.socketId == socket.id);
		if(index != -1){
			users.splice(index, 1);
		}
		io.emit('usersUpdate', users);
	});
});

//import whitelist origins
const whitelist = process.env.WHITE_LISTED_DOMAINS;

//check cors requests
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(null, true);
		}
	},
	credentials: true
};

app.use(cors(corsOptions));

var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', "http://localhost:3000");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
}

app.use(allowCrossDomain);

// ===================== main routes ==================================
app.use('/api', authRoutes);

server.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});