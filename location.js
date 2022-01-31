const db = require("./db");
const lib = require("./lib");

const location = (module.exports = {
	handle: function (env) {
		const validate = function (location) {
			let result = {
				name: location.name,
				pos: location.pos,
				address: location.address,
			};
			return result.name && result.pos && result.address ? result : null;
		};

		let _id, location;
		let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";

		const sendAllLocations = function (q = "") {
			db.locations
				.aggregate([
					{
						$match: {
							$or: [{ name: { $regex: RegExp(q, "i") } }],
						},
					},
				])
				.toArray(function (err, locations) {
					if (!err) {
						lib.sendJson(env.res, locations);
					} else {
						lib.sendError(env.res, 400, "locations.aggregate() failed " + err);
					}
				});
		};

		if (env.req.method == "POST" || env.req.method == "PUT") {
			location = validate(env.payload);
			if (!location) {
				lib.sendError(env.res, 400, "invalid payload");
				return;
			}
		}

		switch (env.req.method) {
			case "GET":
				_id = db.ObjectId(env.urlParsed.query._id);
				if (_id) {
					db.locations.findOne({ _id }, function (err, result) {
						lib.sendJson(env.res, result);
					});
				} else {
					sendAllLocations(q);
				}
				break;
			case "POST":
				db.locations.insertOne(location, function (err, result) {
					if (!err) {
						sendAllLocations(q);
						location.operation = "location";
						lib.broadcast(location, function (client) {
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
						lib.sendError(env.res, 400, "locations.insertOne() failed");
					}
				});
				break;
			case "DELETE":
				_id = db.ObjectId(env.urlParsed.query._id);
				if (_id) {
					db.locations.findOne({ _id }, function (errorMain, locationResult) {
						db.locations.findOneAndDelete({ _id }, function (err, result) {
							if (!err) {
								sendAllLocations(q);
								locationResult.operation = "location";
								lib.broadcast(locationResult, function (client) {
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
								lib.sendError(env.res, 400, "locations.findOneAndDelete() failed");
							}
						});
					});
				} else {
					lib.sendError(env.res, 400, "broken _id for delete " + env.urlParsed.query._id);
				}
				break;
			case "PUT":
				_id = db.ObjectId(env.payload._id);
				if (_id) {
					db.locations.findOneAndUpdate(
						{ _id },
						{ $set: location },
						{ returnOriginal: false },
						function (err, result) {
							if (!err) {
								sendAllLocations(q);
								result.operation = "location";
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
								lib.sendError(env.res, 400, "locations.findOneAndUpdate() failed");
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
