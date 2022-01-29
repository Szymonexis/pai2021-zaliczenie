app.controller("EditContractCtrl", [
	"$http",
	"$uibModalInstance",
	"options",
	"NgMap",
	function ($http, $uibModalInstance, options, NgMap) {
		let ctrl = this;
		ctrl.options = options;
		ctrl.projects = [];
		ctrl.persons = [];
		ctrl.locations = [];
		ctrl.map = null;
		ctrl.selected = null;

		ctrl.toISOLocal = function (d) {
			d = new Date(d);
			var z = (n) => ("0" + n).slice(-2);
			var zz = (n) => ("00" + n).slice(-3);
			var off = d.getTimezoneOffset();
			off = Math.abs(off);

			return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
		};

		NgMap.getMap().then(function (map) {
			ctrl.map = map;
			var n = Object.keys(map.markers).length;
			console.log("Map has been read with", n, "markers");

			for (var m in ctrl.map.markers) {
				ctrl.map.markers[m].id = m;
			}

			if (n > 0) {
				var n = ctrl.options.data.location.id ? ctrl.options.data.location.id : 0;
				ctrl.selected = Object.values(ctrl.map.markers)[n];
				ctrl.select(n);
			}
		});

		var previousMarker = null;

		ctrl.click = function () {
			ctrl.selected = this;
			ctrl.goTo(this);
			ctrl.options.data.location = { title: ctrl.selected.title, id: ctrl.selected.id };
		};

		ctrl.select = function (index) {
			ctrl.goTo(ctrl.map.markers[index]);
			ctrl.options.data.location = {
				title: ctrl.map.markers[index].title,
				id: ctrl.map.markers[index].id,
			};
		};

		ctrl.goTo = function (marker) {
			if (previousMarker) previousMarker.setAnimation(null);
			previousMarker = marker;
			marker.setAnimation(google.maps.Animation.BOUNCE);
		};

		ctrl.submit = function (answer) {
			$uibModalInstance.close(answer);
		};
		ctrl.cancel = function () {
			$uibModalInstance.dismiss(null);
		};

		$http.get("/location").then(
			function (res) {
				ctrl.locations = res.data;
				ctrl.options.data.location = ctrl.locations[0]._id;
			},
			function (err) {}
		);

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

		console.log(typeof ctrl.options.data.finnish_date);
	},
]);
