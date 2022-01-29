app.controller("EditLocationCtrl", [
	"$uibModalInstance",
	"options",
	function ($uibModalInstance, options) {
		let ctrl = this;
		ctrl.options = options;

		ctrl.submit = function (answer) {
			$uibModalInstance.close(answer);
		};
		ctrl.cancel = function () {
			$uibModalInstance.dismiss(null);
		};
	},
]);
