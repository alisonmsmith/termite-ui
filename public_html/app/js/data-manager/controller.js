termite.controller("DataManager", function($scope, TopicModelService) {
  $scope.topicModels = [
      "nsf1k_mallet",
      "nsf10k_mallet",
      "nsf25k_mallet",
      "nsf146k_mallet",
      "20newsgroups_mallet"
    ];
  $scope.topicModel = $scope.topicModels[0];

  $scope.termLimits = [ 5, 7, 10, 15, 20 ] ;
  $scope.termLimit = $scope.termLmits[2];

  $scope.refresh = function () {
    TopicModelService.getTopicModel($scope.topicModel, $scope.termLimit);
  };

});