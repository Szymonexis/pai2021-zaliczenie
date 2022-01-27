app.controller("ContractsCtrl", [
	"$http",
	"$scope",
	"common",
	function ($http, $scope, common) {
		let ctrl = this;

		ctrl.contracts = [];
		ctrl.contract = {};
		ctrl.q = "";

		const contractDefaults = {
			name: "",
			executor_id: "",
			project_id: "",
			start_date: Date.now(),
			finnish_date: Date.now(),
			cost: 0,
		};

		ctrl.edit = function (index) {
			Object.assign(ctrl.contract, index >= 0 ? ctrl.contracts[index] : contractDefaults);
			let options = {
				title: index >= 0 ? "Edytuj dane" : "Nowe dane ",
				ok: true,
				delete: index >= 0,
				cancel: true,
				data: ctrl.contract,
			};
			common.dialog("editContract.html", "EditContractCtrl", options, function (answer) {
				switch (answer) {
					case "ok":
						if (index >= 0) {
							$http.put("/contract", ctrl.contract).then(
								function (res) {
									ctrl.contracts = res.data;
									common.alert.show("Dane zmienione");
								},
								function (err) {}
							);
						} else {
							delete ctrl.contract._id;
							$http.post("/contract", ctrl.contract).then(
								function (res) {
									ctrl.contracts = res.data;
									common.alert.show("Dane dodane");
								},
								function (err) {}
							);
						}
						break;
					case "delete":
						let options = {
							title: "Usunąć obiekt?",
							body: ctrl.contracts[index].name,
							ok: true,
							cancel: true,
						};
						common.confirm(options, function (answer) {
							if (answer == "ok") {
								$http.delete("/contract?_id=" + ctrl.contracts[index]._id).then(
									function (res) {
										ctrl.contracts = res.data;
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
			$http.get("/contract?q=" + ctrl.q).then(
				function (res) {
					ctrl.contracts = res.data;
				},
				function (err) {
					console.log(err);
				}
			);
		};

		ctrl.refreshData();

		$scope.$on("refresh", function (event, parameters) {
			if (Array.isArray(parameters.collection) && parameters.collection.includes("contracts")) {
				ctrl.refreshData();
			}
		});
	},
]);
