'use strict';
(function (module) {
  try {
    module = angular.module('awelzijn.editableFieldset');
  } catch (e) {
    module = angular.module('awelzijn.editableFieldset', []);
  }
  module.directive('aWelzijnEditablePanel', [function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        title: '@',
        loading: '=',
        name:'=?',
        status:'=?'
      },
      templateUrl: 'templates/panel.html'
    };
  }]);
})();
