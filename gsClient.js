const { Client } = require("@googlemaps/google-maps-services-js");
const lib = require("./lib");

const gsClient = (module.exports = {
	handle: function (env) {
		const client = new Client({});
		let address = env.urlParsed.query.address ? env.urlParsed.query.address : "";

		const args = {
			params: {
				key: "AIzaSyCb_PSkynAF2SQO_0s_ItRD5Hcn3xNIFrg",
				address: address,
			},
		};

		client
			.geocode(args)
			.then((gcResponse) => {
				const response = {
					pos: [
						gcResponse.data.results[0].geometry.location.lat,
						gcResponse.data.results[0].geometry.location.lng,
					],
				};
				return response;
			})
			.then((response) => {
				lib.sendJson(env.res, response);
			});
	},
});
