const mongodb = require("mongodb");

const db = (module.exports = {
	persons: null,
	transactions: null,
	users: null,
	projects: null,
	contracts: null,
	locations: null,

	ObjectId: function (_idStr) {
		try {
			return _idStr ? mongodb.ObjectId(_idStr) : null;
		} catch (ex) {
			return null;
		}
	},

	init: function (nextTick) {
		mongodb.MongoClient.connect(
			// "mongodb://localhost:27017",
			"mongodb+srv://admin:admin@cluster0.zpudl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useUnifiedTopology: true },
			function (err, connection) {
				if (err) {
					console.error("Connection to database failed");
					process.exit(0);
				}
				let conn = connection.db("pai2021");
				db.persons = conn.collection("persons");
				db.transactions = conn.collection("transactions");
				db.users = conn.collection("users");
				db.projects = conn.collection("projects");
				db.contracts = conn.collection("contracts");
				db.locations = conn.collection("locations");
				nextTick();
			}
		);
	},
});
