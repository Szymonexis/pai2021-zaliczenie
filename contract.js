const db = require("./db");
const lib = require("./lib");

function toISOLocal(d) {
	var z = (n) => ("0" + n).slice(-2);
	var zz = (n) => ("00" + n).slice(-3);
	var off = d.getTimezoneOffset();
	var sign = off > 0 ? "-" : "+";
	off = Math.abs(off);

	return (
		d.getFullYear() +
		"-" +
		z(d.getMonth() + 1) +
		"-" +
		z(d.getDate()) +
		"T" +
		z(d.getHours()) +
		":" +
		z(d.getMinutes()) +
		":" +
		z(d.getSeconds()) +
		"." +
		zz(d.getMilliseconds()) +
		sign +
		z((off / 60) | 0) +
		":" +
		z(off % 60)
	);
}

const contract = (module.exports = {
	handle: function (env) {
		const validate = function (contract) {
			let result = {
				name: contract.name,
				executor_id:
					typeof contract.executor_id === "string"
						? db.ObjectId(contract.executor_id)
						: contract.executor_id,
				project_id:
					typeof contract.project_id === "string"
						? db.ObjectId(contract.project_id)
						: contract.project_id,
				start_date:
					typeof contract.start_date === "string"
						? toISOLocal(new Date(contract.start_date.toString())).split("T")[0]
						: contract.start_date,
				finnish_date:
					typeof contract.finnish_date === "string"
						? toISOLocal(new Date(contract.finnish_date.toString())).split("T")[0]
						: contract.finnish_date,
				cost: typeof contract.cost === "number" ? contract.cost : Number(contract.cost),
				commited:
					typeof contract.commited === "boolean"
						? contract.commited
						: Boolean(contract.commited),
			};
			return result.name &&
				result.executor_id &&
				result.project_id &&
				result.start_date &&
				result.finnish_date &&
				result.cost
				? result
				: null;
		};

		let _id, contract;
		let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";

		const sendAllContracts = function (q = "") {
			db.contracts
				.aggregate([
					{
						$match: {
							$or: [{ name: { $regex: RegExp(q, "i") } }],
						},
					},
					{
						$lookup: {
							from: "persons",
							localField: "executor_id",
							foreignField: "_id",
							as: "executorName",
						},
					},
					{
						$lookup: {
							from: "projects",
							localField: "project_id",
							foreignField: "_id",
							as: "projectName",
						},
					},
				])
				.toArray(function (err, contracts) {
					if (!err) {
						contracts.forEach((contract) => {
							contract.projectName =
								contract.projectName &&
								Array.isArray(contract.projectName) &&
								contract.projectName[0] &&
								contract.projectName[0].name
									? contract.projectName[0].name
									: undefined;
							contract.executorName =
								contract.executorName &&
								Array.isArray(contract.executorName) &&
								contract.executorName[0] &&
								contract.executorName[0].firstName &&
								contract.executorName[0].lastName
									? contract.executorName[0].firstName +
									  " " +
									  contract.executorName[0].lastName
									: undefined;
						});
						lib.sendJson(env.res, contracts);
					} else {
						lib.sendError(env.res, 400, "contracts.aggregate() failed " + err);
					}
				});
		};

		if (env.req.method == "POST" || env.req.method == "PUT") {
			contract = validate(env.payload);
			if (!contract) {
				lib.sendError(env.res, 400, "invalid payload");
				return;
			}
		}

		switch (env.req.method) {
			case "GET":
				_id = db.ObjectId(env.urlParsed.query._id);
				if (_id) {
					db.contracts.findOne({ _id }, function (err, result) {
						lib.sendJson(env.res, result);
					});
				} else {
					sendAllContracts(q);
				}
				break;
			case "POST":
				db.contracts.insertOne(contract, function (err, result) {
					if (!err) {
						sendAllContracts(q);
						contract.operation = "contract";
						lib.broadcast(contract, function (client) {
							if (client.session == env.session) return false; // nie wysyłaj wiadomości do sprawcy
							let session = lib.sessions[client.session];
							return (
								session &&
								session.roles &&
								Array.isArray(session.roles) &&
								session.roles.includes("admin")
							);
						});
					} else {
						lib.sendError(env.res, 400, "contracts.insertOne() failed");
					}
				});
				break;
			case "DELETE":
				_id = db.ObjectId(env.urlParsed.query._id);
				project_id = db.ObjectId(env.urlParsed.query.project_id);
				if (_id) {
					db.contracts.findOne({ _id }, function (errorMain, contractResult) {
						db.contracts.findOneAndDelete({ _id }, function (err, result) {
							if (!err) {
								sendAllContracts(q);
								contractResult.operation = "contract";
								lib.broadcast(contractResult, function (client) {
									if (client.session == env.session) return false; // nie wysyłaj wiadomości do sprawcy
									let session = lib.sessions[client.session];
									return (
										session &&
										session.roles &&
										Array.isArray(session.roles) &&
										session.roles.includes("admin")
									);
								});
							} else {
								lib.sendError(env.res, 400, "contracts.findOneAndDelete() failed");
							}
						});
					});
				} else if (project_id) {
					db.contracts.deleteMany({ project_id }, function (err, result) {
						if (!err) {
							sendAllContracts(q);
						} else {
							lib.sendError(env.res, 400, "contracts.deleteMany() failed");
						}
					});
				} else {
					lib.sendError(env.res, 400, "broken _id for delete " + env.urlParsed.query._id);
				}
				break;
			case "PUT":
				_id = db.ObjectId(env.payload._id);
				if (_id) {
					db.contracts.findOneAndUpdate(
						{ _id },
						{ $set: contract },
						{ returnOriginal: false },
						function (err, result) {
							if (!err) {
								sendAllContracts(q);
								result.operation = "contract";
								lib.broadcast(result, function (client) {
									if (client.session == env.session) return false; // nie wysyłaj wiadomości do sprawcy
									let session = lib.sessions[client.session];
									return (
										session &&
										session.roles &&
										Array.isArray(session.roles) &&
										session.roles.includes("admin")
									);
								});
							} else {
								lib.sendError(env.res, 400, "contracts.findOneAndUpdate() failed");
							}
						}
					);
				} else {
					lib.sendError(env.res, 400, "broken _id for update " + env.urlParsed.query._id);
				}
				break;
			default:
				lib.sendError(env.res, 405, "method not implemented");
		}
	},
});
