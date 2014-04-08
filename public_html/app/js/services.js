'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('termite.services', [])
	.factory("TopicModelService", function ($http, $rootScope) {
		var TopicModelService = {};

		TopicModelService.topicModel = null;

		TopicModelService.getTopicModel = function (id, terms) {
			var url = "http://termite.jcchuang.org/" + id + "/vis/GroupInABox?origin=http://127.0.0.1:8000&format=json&termLimit=" + terms;
			console.log("[LOADING]", "URL", url);

			$http.get(url).
				success(function (data, status, headers, config) {
					console.log("[LOADED]", "URL", url, "Results:", status, "Data:", data);
					TopicModelService.topicModel = data;
					$rootScope.$broadcast('topic-model-loaded');
				}).
				error(function (data, status, headers, config) {
					console.log("[LOADED]", "URL", url, "Results:", status, "Data:", data);
				});
		};

		return TopicModelService;

	});
;
