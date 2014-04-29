'use strict';

/* Controllers */

angular.module('termite.controllers', [])
  /**
  * Controller for Loading Data Sets
  */
  .controller('DatasetController', ['$scope', 'TopicModelService', function($scope, TopicModelService) {
	  $scope.topicModels = [
	      "nsf1k_mallet",
	      "nsf10k_mallet",
	      "nsf25k_mallet",
	      "nsf146k_mallet",
	      "20newsgroups_mallet"
	    ];
	  $scope.topicModel = $scope.topicModels[0];

	  $scope.termLimits = [ 5, 7, 10, 15, 20 ];
	  $scope.termLimit = $scope.termLimits[2];

	  $scope.$on("topic-model-loaded", function () {
    	$("#loader").hide();
	  });

	  $scope.refresh = function () {
	  	// show the loader
    	$("#loader").show();

	    TopicModelService.getTopicModel($scope.topicModel, $scope.termLimit);
	  };

	  $scope.refresh();
  }])
  /**
  *	Controller for the Main Topic Model View
  */
  .controller('TopicModelViewController', ['$rootScope', '$scope', 'TopicModelService', function($rootScope, $scope, TopicModelService) {
	  $scope.topics = [];

	  // data structure for storing changes to the model
	  // for each topic we store (existing, added, and removed words)
	  $scope.model = {};

	//  $scope.layout = twentytopiclayout;
	  $scope.topicModel = null;

	  $scope.modes = {}; 

	  $scope.$on("topic-model-loaded", function () {
	    $scope.topicModel = TopicModelService.topicModel;

	    // resest the topic list
	    $scope.topics = [];

	    processData();
	  });

	  $scope.$on("node-selected", function (event, topic) {
	  	//$scope.setTopicMode("remove", topic, true);
	  });

	  function constructITMParams () {
	  	// list of lists of words
	  	var mustLinks=[],
	  		// list of lists (likely tuples) of words
	  		cannotLinks=[],
	  		// dictionary of topic to list of words
	  		keepTerms = {},
	  		// list of words
	  		removeTerms = [];

	  	angular.forEach($scope.model, function (id, topic) {
	  		// any trash words add to 'remove terms'
	  		removeTerms = _.union(removeTerms, topic.trashed);

	  		// for now we will assume that added + existing words have a must link relationship
	  		mustLinks.push(_.union(topic.existing, topic.added));

	  		// for now we will also assume that a removed word has a cannot link with any existing words
	  		angular.forEach(topic.removed, function (i, r) {
	  			angular.forEach(topic.existing, function (i, e) {
	  				cannotLinks.push([r,e]);
	  			});
	  		});

	  		// for now we will assume that any added words and existing words should be kept with the topic
	  		keepTerms[id] = _.union(topic.existing, topic.added);
	  	});

	  	return {"must":mustLinks, "cannot":cannotLinks, "keep":keepTerms, "remove":removeTerms};
	  }

	  $scope.continue = function () {
	  	console.log("continue processing");
	  	// prepare the data required to continue
	  	var data = constructITMParams();

	  	// continue on to the next iteration
	  	TopicModelService.continueITM(data);
	  };

	  $scope.addToStopWords = function (t) {
	  	if (t.selectedWords.length === 0) {
	  		console.log('no selected words to add to stop words list');
	  	}
	  	var toRemove = [];
	  	angular.forEach(t.selectedWords, function (selected) {
	  		// remove the word from the  nodes list and therefore the visualization
	  		angular.forEach(t.nodes, function (node, index) {
	  			if (node.name === selected.name) {
	  				//node.class = "trash";
	  				toRemove.push(node);

	  				// add the word to the trashed list
	  				$scope.model[t.id].trashed.push(node.name);

	  				// remove the word from the existing list
	  				var index = $scope.model[t.id].existing.indexOf(node.name);
	  				if (index !== -1) {
	  					$scope.model[t.id].existing.splice(index, 1);
	  				}
	  			}
	  		});
	  	});
	  	angular.forEach(toRemove, function (node) {
	  		var index = t.nodes.indexOf(node);
	  		if (index !== -1) {
	  			t.nodes.splice(index, 1);
	  		}
	  	});
	  	t.selectedWords = [];
	  	//$rootScope.$broadcast("trashWord", {"word":node.name, "topic":t.id} );
	  	$scope.$broadcast(t.id + ":update");
	  };

	  $scope.removeWords = function (t) {
	  	if (t.selectedWords.length === 0) {
	  		console.log('no selected words to remove');
	  	}

	  	var toRemove = [];
	  	angular.forEach(t.selectedWords, function (selected) {
	  		// remove the word from the  nodes list or color the word 'to be removed'
	  		angular.forEach(t.nodes, function (node) {
	  			if (node.name === selected.name) {
	  				//node.class = "remove";
	  				toRemove.push(node);
	  				$scope.model[t.id].removed.push(node.name);

	  				var index = $scope.model[t.id].existing.indexOf(node.name);
	  				if (index !== -1) {
	  					$scope.model[t.id].existing.splice(index, 1);
	  				}
	  				
	  			}
	  		});
	  	});
	  	angular.forEach(toRemove, function (node) {
	  		var index = t.nodes.indexOf(node);
	  		// technically the viz should probably be in charge of removing the nodes and the links
	  		if (index !== -1) {
	  			t.nodes.splice(index, 1);
	  		}
	  		t.edges.filter(function(edge) {
	  			return edge.source
	  		});
	  	});
	  	t.selectedWords = [];
	  	
	  	//$rootScope.$broadcast("removeWord", {"word":node.name, "topic":t.id} );
	  	$scope.$broadcast(t.id + ":update");
	  };

	 $scope.addWord = function (t) {
	 	console.log("added " + t.addedWord + " to topic " + t.id);
	  	t.nodes.push({"name":t.addedWord, "value":100, "class":"new"}); 
	  	$scope.model[t.id].added.push(t.addedWord);
	  //	$rootScope.$broadcast("addWord", {"word":t.addedWord, "topic":t.id} );
	  	$scope.$broadcast(t.id + ":update");

	  	// clear the input
	  	t.addedWord = "";
	  };

	  $scope.setTopicMode = function (type, topic, bool) {
	  	if (type === "remove") {
	  		topic.mode.removeWord = bool;
	  		topic.mode.trashWord = bool;
	  	}
	  }

		/**
		* Swap between the default and edit mode for the topic
		*/
	  $scope.swapTopicMode = function (type, topic) {

	  	if (type === "edit") {
	  		topic.mode.edit = !topic.mode.edit;
	  		if (!topic.mode.edit) {
	  			topic.mode.addWord = false;
	  		}
	  	} else if (type === "add") {
	  		topic.mode.addWord = !topic.mode.addWord;
	  	}

	  }

	  function getTopicId(id) {
	    return "topic" + id;
	  }

	  function processData() {
	    var counter = 0;
	    for (var topic = 0; topic < $scope.topicModel.TopicCount; topic++) {
	    	$scope.model[getTopicId(topic)] = {"existing":[], "removed":[], "added":[], "trashed":[]};
	      var nodes = [];
	      var edges = [];
	      var connections = [];

	      // Determine the graph connections (topic co-occurrence)
	      $.each($scope.topicModel.TopicCovariance[topic], function (id, value) {
	        if (value >= 2.0) {
	          // add as a connection
	          if (topic !== id) {
	            connections.push({"id": getTopicId(id), "value": value});
	          }
	        }
	      });

	      // Determine the nodes (words of the topic)
		  nodes = $scope.topicModel.TopTermsPerTopic;
		  $.each(nodes, function(topTerms) {
			$.each(topTerms, function(d) {
			  d.class = "existing";
			});
		  });
		  /*
	        $.each($scope.topicModel.TopTermsPerTopic[topic], function (index, term) {
	          // TODO: I really don't like how this is being stored in the JSON... 
	          for (var k in term) {
	          	$scope.model[getTopicId(topic)].existing.push(k);
	            nodes.push({"name":k, "value":term[k], "class":"existing"});
	          }
	        });
	      */
	      // Determine the edges for each node
	      edges = $scope.topicModel.TermPMI;
	      /*
	        // TODO: a better data structure may make this more efficient
	        $.each(nodes, function (source, node) {
	          if ($scope.topicModel.TermCoFreqs.hasOwnProperty(node.name)) {
	            $.each($scope.topicModel.TermCoFreqs[node.name], function (term, value) {
	              if (value > 500 && term !== node.name) {
	                $.each(nodes, function (target, node2) {
	                  if (term === node2.name) {
	                    edges.push({"source":node, "target":node2, "value":value});
	                  }
	                });
	              }
	            });
	          }
	        });
	      */
	      var m = {"edit":false, "addWord":false, "removeWord":true, "trashWord":true};
	      $scope.topics.push({"nodes":nodes, "edges":edges, "id": getTopicId(topic), 
	      	"mode":m, "name":"TOPIC " + topic, "connections":connections, "selectedWords":[]});
	    	
	      // initialize the mode for each topic view to default
	    
	    }

	    //renderTopicModel();
	  }

	 
  }]);
