app.controller("ProjectsCtrl", [
	"$http",
	"$scope",
	"common",
	function ($http, $scope, common) {
		let ctrl = this;

		ctrl.projects = [];
		ctrl.project = {};
		ctrl.q = "";

		const projectDefaults = {
			name: "",
			owner: "",
		};

		ctrl.edit = function (index) {
			Object.assign(
				ctrl.project,
				index >= 0 ? ctrl.project[index] : projectDefaults
			);
			let options = {
				title: index >= 0 ? "Edytuj dane" : "Nowe dane ",
				ok: true,
				delete: index >= 0,
				cancel: true,
				data: ctrl.project,
			};
			common.dialog(
				"editProject.html",
				"EditProjectCtrl",
				options,
				function (answer) {
					switch (answer) {
						case "ok":
							if (index >= 0) {
								$http.put("/project", ctrl.project).then(
									function (res) {
										ctrl.project = res.data;
										common.alert.show("Dane zmienione");
									},
									function (err) {}
								);
							} else {
								delete ctrl.project._id;
								$http.post("/project", ctrl.project).then(
									function (res) {
										ctrl.project = res.data;
										common.alert.show("Dane dodane");
									},
									function (err) {}
								);
							}
							break;
						case "delete":
							let options = {
								title: "Usunąć obiekt?",
								body: ctrl.projects[index].name,
								ok: true,
								cancel: true,
							};
							common.confirm(options, function (answer) {
								if (answer == "ok") {
									$http
										.delete(
											"/project?_id=" +
												ctrl.projects[index]._id
										)
										.then(
											function (res) {
												ctrl.projects = res.data;
												common.alert.show(
													"Dane usunięte"
												);
											},
											function (err) {}
										);
								}
							});
							break;
					}
				}
			);
		};

		ctrl.refreshData = function () {
			$http.get("/project?q=" + ctrl.q).then(
				function (res) {
					ctrl.projects = res.data;
				},
				function (err) {
					console.log(err)
				}
			);
		};

		ctrl.refreshData();

		$scope.$on("refresh", function (event, parameters) {
			if (parameters.collection == "projects") {
				ctrl.refreshData();
			}
		});
	},
]);
