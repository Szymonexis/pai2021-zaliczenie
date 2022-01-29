app.controller("LocationsCtrl", [
	"$http",
	"$scope",
	"common",
	function ($http, $scope, common) {
		let ctrl = this;

		ctrl.locations = [];
		ctrl.location = {};
		ctrl.q = "";

		const locationDefaults = {
			name: "",
			pos: "",
		};

		ctrl.edit = function (index) {
			Object.assign(ctrl.location, index >= 0 ? ctrl.locations[index] : locationDefaults);
			let options = {
				title: index >= 0 ? "Edytuj dane" : "Nowe dane ",
				ok: true,
				delete: index >= 0,
				cancel: true,
				data: ctrl.location,
			};
			common.dialog("editLocation.html", "EditLocationCtrl", options, function (answer) {
				switch (answer) {
					case "ok":
						if (index >= 0) {
							$http.put("/location", ctrl.location).then(
								function (res) {
									ctrl.locations = res.data;
									common.alert.show("Dane zmienione");
								},
								function (err) {}
							);
						} else {
							delete ctrl.location._id;
							$http.post("/location", ctrl.location).then(
								function (res) {
									ctrl.locations = res.data;
									common.alert.show("Dane dodane");
								},
								function (err) {}
							);
						}
						break;
					case "delete":
						let options = {
							title: "Usunąć obiekt?",
							body: ctrl.locations.name,
							ok: true,
							cancel: true,
						};
						common.confirm(options, function (answer) {
							if (answer == "ok") {
								$http.delete("/location?_id=" + ctrl.locations[index]._id).then(
									function (res) {
										ctrl.locations = res.data;
										common.alert.show("Dane usunięte");
									},
									function (err) {}
								);
							}
						});
						break;
				}
			});
		};

		ctrl.refreshData = function () {
			$http.get("/location?q=" + ctrl.q).then(
				function (res) {
					ctrl.locations = res.data;
				},
				function (err) {
					console.log(err);
				}
			);
		};

		ctrl.refreshData();

		$scope.$on("refresh", function (event, parameters) {
			if (
				Array.isArray(parameters.collection) &&
				(parameters.collection.includes("locations"))
			) {
				ctrl.refreshData();
			}
		});
	},
]);
