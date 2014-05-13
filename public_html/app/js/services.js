'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('termite.services', [])
	.factory("TopicModelService", function ($http, $rootScope) {
		var ORIGIN = "http://homes.cs.washington.edu";
//		var ORIGIN = "http://127.0.0.1:8000";
//		var SERVER = "http://localhost:8075";
		var SERVER = "http://treetm.jcchuang.org";
		var ITER_INCREMENT = 5;
		var TopicModelService = {};
		var iterCount = 1000;

		TopicModelService.topicModelId = null;
		TopicModelService.topicModel = null;

		TopicModelService.getTopicModel = function (id, terms) {
			$rootScope.$broadcast("topic-model-loading");
			var data = {
				"origin": ORIGIN,
				"format": "json",
				"termLimit" : terms
			}
			var url = SERVER + "/" + id + "/itm/gib";
			console.log("[LOADING]", "URL", url, "DATA", data);
			$http({
				url : url,
				data : $.param(data),
				method : 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).
			success(function (data, status, headers, config) {
				console.log("[LOADED]", "URL", url, "Results:", status, "Data:", data);
				TopicModelService.topicModel = data;
				TopicModelService.topicModelId = id;
				iterCount = data.IterCount;
				$rootScope.$broadcast('topic-model-loaded');
			}).
			error(function (data, status, headers, config) {
				console.log("[LOADED]", "URL", url, "Results:", status, "Data:", data);
			});
		};



		TopicModelService.continueITM = function (data) {
			$rootScope.$broadcast("topic-model-loading");
			iterCount += ITER_INCREMENT;
			var data = {
					"origin": ORIGIN,
					"format": "json",
					"action":"train",
					"termLimit": 10,
					"iters": iterCount,
					"mustLinks": JSON.stringify(data.must),
					"cannotLinks": JSON.stringify(data.cannot),
					"keepTerms": JSON.stringify(data.keep),
					"removeTerms": JSON.stringify(data.remove)
				};
			var url = SERVER + "/" + TopicModelService.topicModelId + "/itm/gib"
			console.log("[LOADING]", "URL", url, "DATA", data);
			$http({
				url : url,
				data : $.param(data),
				method : 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function (data, status, headers, config) {
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
