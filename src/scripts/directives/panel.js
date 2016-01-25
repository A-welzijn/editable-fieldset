'use strict';
(function (module) {
  try {
    module = angular.module('awelzijn.editableFieldset');
  } catch (e) {
    module = angular.module('awelzijn.editableFieldset', []);
  }
  module.directive('aWelzijnEditablePanel', ['$timeout',function ($timeout) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        title: '@',
        loading: '=',
        name:'=?',
        status:'=?',
        hideAll:'=?'
      },
      link:function($scope,elem,$attrs){
        var formElement = elem.find('[tink-fieldset]');
        if($attrs.autoSelect !== undefined){
          $timeout(function(){
            var first = $(elem).find('a-welzijn-editable-field:first');
            formElement.isolateScope().setClassActive("mouseFocus",first);
            $timeout(function(){
              if(first.find(':input').length > 0){
                first.find(':input').focus().focusin();
              }else if(first.find('div[contentEditable]:first').length > 0){
                first.find('div[contentEditable]:first').focus().focusin();
              }
            },20);
          },15) 
        }
      },
      templateUrl: 'templates/panel.html'
    };
  }]);
})();
