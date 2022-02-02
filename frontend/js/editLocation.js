app.controller("EditLocationCtrl", [
	"$http",
	"$uibModalInstance",
	"options",
	function ($http, $uibModalInstance, options) {
		let ctrl = this;
		ctrl.options = options;

		ctrl.checkMap = function () {
			$http.get("/gsClient?address=" + ctrl.options.data.address.replaceAll(" ", "+")).then(
				function (res) {
					ctrl.options.data.pos = res.data.pos;
				},
				function (err) {
					console.log(err);
				}
			);
		};

		ctrl.submit = function (answer) {
			$uibModalInstance.close(answer);
		};

		ctrl.cancel = function () {
			$uibModalInstance.dismiss(null);
		};
	},
]);
