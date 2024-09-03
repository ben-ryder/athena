
(function (self: SharedWorkerGlobalScope) {

	self.onconnect = function (event) {
		const port = event.ports[0];

		port.onmessage = function (e) {
			console.debug(`[worker received] ${JSON.stringify(e.data)}`)
		};
	};

})(self as unknown as SharedWorkerGlobalScope);
