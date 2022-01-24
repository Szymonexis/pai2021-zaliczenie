app.controller("EditContractCtrl", [
	"$http",
	"$uibModalInstance",
	"options",
	function ($http, $uibModalInstance, options) {
		let ctrl = this;
		ctrl.options = options;
		ctrl.projects = [];
		ctrl.persons = [];

		ctrl.submit = function (answer) {
			$uibModalInstance.close(answer);
		};
		ctrl.cancel = function () {
			$uibModalInstance.dismiss(null);
		};

		$http.get("/project").then(
			function (res) {
				ctrl.projects = res.data;
				ctrl.options.data.project = ctrl.projects[0]._id;
			},
			function (err) {}
		);

		$http.get("/person").then(
			function (res) {
				ctrl.persons = res.data;
				ctrl.options.data.person = ctrl.persons[0]._id;
			},
			function (err) {}
		);
	},
]);
