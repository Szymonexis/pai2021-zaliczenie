const db = require("./db");

const example = (module.exports = {
	persons: [
		{
			_id: db.ObjectId("618be4ba6b0df02e94319c15"),
			firstName: "Johnny",
			lastName: "Walker",
			year: 1969,
		},
		{
			_id: db.ObjectId("618beab56b0df02e94319c18"),
			firstName: "Jim",
			lastName: "Beam",
			year: 1684,
		},
		{
			_id: db.ObjectId("618bed4bdad4eb43c178c7b4"),
			firstName: "Jack",
			lastName: "Daniels",
			year: 1886,
		},
	],

	users: [
		{
			_id: db.ObjectId("61af980faabcf8eda55e491c"),
			login: "admin",
			password: "admin1",
			roles: ["admin"],
		},
        {
            _id: db.ObjectId("61af980fafedf8eda55e491c"),
			login: "owner",
			password: "owner1",
			roles: ["owner"],
        },
		{
			_id: db.ObjectId("61af9854aabcf8eda55e491e"),
			login: "user",
			password: "user1",
			roles: ["user"],
		},
	],

	projects: [
		{
			_id: db.ObjectId("61af9890aaacf8eda5af491f"),
			name: "Project 1",
			owner: db.ObjectId("618bed4bdad4eb43c178c7b4"),
		},
		{
			_id: db.ObjectId("61af9890aabcf8eda5af491e"),
			name: "Project 2",
			owner: db.ObjectId("618beab56b0df02e94319c18"),
		},
	],

	contracts: [
		{
			_id: db.ObjectId("61ec0f6d052a352aec9bacba"),
			executor_id: db.ObjectId("618be4ba6b0df02e94319c15"),
			project_id: db.ObjectId("61af9890aaacf8eda5af491f"),
			name: "Contract 1.1",
			start_date: new Date("<2022-01-05>").toISOString().split("T")[0],
			finnish_date: new Date("<2022-01-10>").toISOString().split("T")[0],
			cost: 199.99,
			commited: false,
		},
		{
			_id: db.ObjectId("61ec0f787ce49a0dc5352454"),
			executor_id: db.ObjectId("618beab56b0df02e94319c18"),
			project_id: db.ObjectId("61af9890aaacf8eda5af491f"),
			name: "Contract 1.2",
			start_date: new Date("<2022-01-30>").toISOString().split("T")[0],
			finnish_date: new Date("<2022-02-05>").toISOString().split("T")[0],
			cost: 450,
			commited: false,
		},
		{
			_id: db.ObjectId("61ec0f80241a7130ebf4d8c0"),
			executor_id: db.ObjectId("618be4ba6b0df02e94319c15"),
			project_id: db.ObjectId("61af9890aabcf8eda5af491e"),
			name: "Contract 2.1",
			start_date: new Date("<2021-06-05>").toISOString().split("T")[0],
			finnish_date: new Date("<2021-07-05>").toISOString().split("T")[0],
			cost: 30000,
			commited: false,
		},
	],

	initialize: function () {
		db.persons.count(function (err, n) {
			if (n == 0) {
				console.log("No persons, example data will be used");
				example.persons.forEach(function (person) {
					db.persons.insertOne(person, function (err, result) {});
					console.log(
						"db.persons.insertOne(" + JSON.stringify(person) + ")"
					);
				});
			}
		});
		db.users.count(function (err, n) {
			if (n == 0) {
				console.log("No users, example data will be used");
				example.users.forEach(function (user) {
					db.users.insertOne(user, function (err, result) {});
					console.log(
						"db.users.insertOne(" + JSON.stringify(user) + ")"
					);
				});
			}
		});
		db.projects.count(function (err, n) {
			if (n == 0) {
				console.log("No projects, example data will be used");
				example.projects.forEach(function (project) {
					db.projects.insertOne(project, function (err, result) {});
					console.log(
						"db.projects.insertOne(" + JSON.stringify(project) + ")"
					);
				});
			}
		});
        db.contracts.count(function (err, n) {
			if (n == 0) {
				console.log("No contracts, example data will be used");
				example.contracts.forEach(function (contract) {
					db.contracts.insertOne(contract, function (err, result) {});
					console.log(
						"db.projects.insertOne(" + JSON.stringify(contract) + ")"
					);
				});
			}
		});
	},
});
