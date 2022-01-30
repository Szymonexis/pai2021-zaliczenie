app.controller("EditLocationCtrl", [
	"$http",
	"$uibModalInstance",
	"options",
	function ($http, $uibModalInstance, options) {
		let ctrl = this;
		ctrl.options = options;
		ctrl.address = "Polska, Łódź, Rydla 7a, 93-203";
		ctrl.pos = [51.776765, 19.487026];

		ctrl.submit = function (answer) {
			$uibModalInstance.close(answer);
		};

		ctrl.cancel = function () {
			$uibModalInstance.dismiss(null);
		};

		$http.get("/gsClient?address=" + ctrl.address.replaceAll(" ", "+")).then(
			function (res) {
				console.log(res);
			},
			function (err) {
				// console.log(err)
			}
		);
	},
]);
