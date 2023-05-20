//Import .env package
require('dotenv').config();
//Initialize express
let express = require('express');
let app = express(), server = require('http').createServer(app),io = require('socket.io')(server);
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

// Register socket.io event handlers
io.on('connection', (socket) => {
	console.log('A user connected');

	socket.on('disconnect', () => {
		console.log('A user disconnected');
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

// ===================== main routes ==================================
app.use('/api', authRoutes);

server.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});