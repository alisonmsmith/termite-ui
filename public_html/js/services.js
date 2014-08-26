'use strict';

angular.module('termite.services', [])
	.factory("GlobalService", function() {
		return {
			//ORIGIN : "http://homes.cs.washington.edu",
		    ORIGIN : "http://127.0.0.1:8000",
		    SERVER : "http://localhost:8075",
			//SERVER : "http://treetm.jcchuang.org",
		    ITER_INCREMENT : 5,
		    ITER_COUNT : 1000,
		    TOPIC_MODELS: [
		      "nsf1k_treetm",
		      "nsf10k_treetm",
		      "nsf25k_treetm",
			  //"nsfgrants_treetm",     // Temporarily taken out until we have a MALLET -> ITM pipeline set up.
		      "20newsgroups_treetm"
	    	]
		};
	})
	.factory("TopicModelService", ["$http", "$rootScope", "GlobalService", function ($http, $rootScope, GlobalService) {
		var origin = GlobalService.ORIGIN;
		var server = GlobalService.SERVER;
		var iterIncrement = GlobalService.ITER_INCREMENT;
		var iterCount = GlobalService.ITER_COUNT;
		var TopicModelService = {};

		TopicModelService.topicModelId = null;
		TopicModelService.topicModel = null;

		TopicModelService.getTopicModel = function (id, terms) {
			$rootScope.$broadcast("topic-model-loading");
			var data = {
				"origin": origin,
				"format": "json",
				"termLimit" : terms
			}
			var url = server + "/" + id + "/itm/gib";
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
			iterCount += iterIncrement;
			var data = {
					"origin": origin,
					"format": "json",
					"action":"train",
					"termLimit": 10,
					"iters": iterCount,
					"mustLinks": JSON.stringify(data.must),
					"cannotLinks": JSON.stringify(data.cannot),
					"keepTerms": JSON.stringify(data.keep),
					"removeTerms": JSON.stringify(data.remove)
				};
			var url = server + "/" + TopicModelService.topicModelId + "/itm/gib"
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

	}]);
;
