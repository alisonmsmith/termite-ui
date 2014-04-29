'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('termite.services', [])
	.factory("TopicModelService", function ($http, $rootScope) {
		var TopicModelService = {};

		TopicModelService.topicModel = null;
		TopicModelService.topicModelId = null;

		TopicModelService.getTopicModel = function (id, terms) {
			var url = "http://treetm.jcchuang.org/" + id + "/itm/gib?origin=http://127.0.0.1:8000&format=json&termLimit=" + terms;
			console.log("[LOADING]", "URL", url);  // OPTIONAL: This can be either a POST or a GET request. The web server handles the two in the same way. POST might be slightly preferred as we're not technically properly escaping the querystring "http://127.0.0.1:8000" in this GET request.

			$http.get(url).
				success(function (data, status, headers, config) {
					console.log("[LOADED]", "URL", url, "Results:", status, "Data:", data);
					TopicModelService.topicModel = data;
					TopicModelService.topicModelId = id;
					$rootScope.$broadcast('topic-model-loaded');
				}).
				error(function (data, status, headers, config) {
					console.log("[LOADED]", "URL", url, "Results:", status, "Data:", data);
				});
		};

		TopicModelService.continueITM = function (id, data) {
			$http({
				url:"http://treetm.jcchuang.org/" + TopicModelService.topicModelId + "/itm/gib",
				method: "POST",
				dataType: "json",
				data: {
					"iters": 1000,
					"action": "train",
					"mustLinks": data.must,
					"cannotLinks": data.cannot,
					"keepTerms": data.keep,
					"removeTerms": data.remove,
					"origin": "http://127.0.0.1:8000",
					"termLimit": 10  // TODO: insert the number of terms to return, mirroring the getTopcModel URL call above
				}
			}).success(function (data, status, headers, config) {
				console.log("[LOADED]", "URL", url, "Results:", status, "Data:", data);
				TopicModelService.topicModel = data;
				$rootScope.$broadcast('topic-model-loaded');
			}).error(function (data, status, headers, config) {
				console.log("[LOADED]", "URL", url, "Results:", status, "Data:", data);
			});
		};

		return TopicModelService;

	});
;
