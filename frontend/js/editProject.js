app.controller("EditProjectCtrl", [
	"$http",
	"$uibModalInstance",
	"options",
	function ($http, $uibModalInstance, options) {
		let ctrl = this;
		ctrl.options = options;
		ctrl.persons = [];
		ctrl.options.data.owner = null;

		ctrl.submit = function (answer) {
			$uibModalInstance.close(answer);
		};
		ctrl.cancel = function () {
			$uibModalInstance.dismiss(null);
		};

		$http.get("/person").then(
			function (res) {
				ctrl.persons = res.data;
				ctrl.options.data.owner = ctrl.persons[0]._id;
			},
			function (err) {}
		);
	},
]);
