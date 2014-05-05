'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('termite.services', [])
	.factory("TopicModelService", function ($http, $rootScope) {
		var TopicModelService = {};

		TopicModelService.topicModelId = null;
		TopicModelService.topicModel = null;

		TopicModelService.getTopicModel = function (id, terms) {
			$rootScope.$broadcast("topic-model-loading");
			var data = {
				"origin": "http://127.0.0.1:8000",
				"format": "json",
				"termLimit" : terms
			}
			var url = "http://treetm.jcchuang.org/" + id + "/itm/gib?" + $.param(data);
			console.log("[LOADING]", "URL", url);
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

		TopicModelService.continueITM = function (data) {
			$rootScope.$broadcast("topic-model-loading");
			var data = {
					"origin": "http://127.0.0.1:8000",
					"format": "json",
					"action":"train",
					"termLimit": 10,
					"iters": 1000,
					"mustLinks": data.must,
					"cannotLinks": data.cannot,
					"keepTerms": data.keep,
					"removeTerms": data.remove
				};
// GET Request 
/*
			var url = "http://treetm.jcchuang.org/" + TopicModelService.topicModelId + "/itm/gib?" + $.param(data);
			$http.get(url)
*/
// POST Request 
			var url = "http://treetm.jcchuang.org/" + TopicModelService.topicModelId + "/itm/gib"
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
