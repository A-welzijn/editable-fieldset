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
;(function (module) {
	try {
		module = angular.module('awelzijn.editableFieldset');
	} catch (e) {
		module = angular.module('awelzijn.editableFieldset',['tink.fieldset']);
	}
	module.directive('aWelzijnEditableField', ['$compile','$timeout','safeApply',function ($compile,$timeout,safeApply) {
		return {
			restrict: 'E',
			replace: false,
			transclude: true,
			scope: {
				title: '@', 
				label: '@',
				email: '@',
				colspan: '=',
				editMode: '=',
				ngClick: '&'
			},
			templateUrl: 'templates/panelfield.html',
			compile:function(){
				return {
					post: function ($scope, element, attrs,transclude) {
						var _addedObjs = [];
						//$scope.editMode = false;
						var originalElement = $(element).clone();
						if ($scope.colspan) {
							$scope.colspanClass = ("col-lg-@ col-md-@").replace(/@/g, $scope.colspan);
						} else {
							$scope.colspanClass = ("col-lg-@ col-md-@").replace(/@/g, '6');
						}


						var formElement = element.closest('[tink-fieldset]');
						var edit = findEditableFields(element.find('[ng-transclude]'));				

						$scope.$watch(function(){return formElement.isolateScope().tinkFormStatus},function(value,old){
							if(old === 'mouseFocus'){
								setFakeInput();
							}else if(value === 'mouseFocus'){
								setRealInput();					
							}
						});
						
						function addToObject(value,type,object,showField,isolateScope){
							if(showField){
								fake = showField;
							}else{
								var fake = $('<div contenteditable="true" class="faux-input">{{label || "-"}}</div>');
								fake = $compile(fake)($scope);
								$(fake).insertAfter($(value));
							}
							$(value).css('display','none');
							_addedObjs.push({fake:$(fake),real:$(value)});

							fake.bind('mousedown click touchstart',function(e){
								if(!$(e.target).is('[editable-focus]')){
									formElement.isolateScope().setClassActive("mouseFocus",null);
									$timeout(function(values){
										if($(value).is('transclude-edit')){
											if($(value).find(':input').length >0){
												focusin($(value).find(':input')[0]);
											}
										}else{
											focusin(value);
										}
									},10);
								}
							});

							if(formElement && formElement.isolateScope()){
								formElement.isolateScope().addEvents($(value));
							}
						}

						function setRealInput(){
							for(var i=0;i<_addedObjs.length;i++){
								var elem = _addedObjs[i];
								if(elem.fake){
									elem.fake.css('display','none');
								}
								if(elem.real){
									elem.real.css('display','block');
								}
							}
						}

						function setFakeInput(){
							for(var i=0;i<_addedObjs.length;i++){
								var elem = _addedObjs[i];
								if(elem.fake){
									elem.fake.css('display','block');
								}
								if(elem.real){
									elem.real.css('display','none');
								}
								formElement.isolateScope().addEvents($(elem.fake));
							}	
						}

						//this finds the fields we want to adjust
						function findEditableFields(element){
							var editableFields = {
								input:'input',
								select:'select',
								datepicker:'data-tink-datepicker',
								timepicker:'tink-timepicker',
								national:'tink-national-number',
								datepickerRange:'tink-datepicker-range',
								tinkIdentity:'tink-identity-number',
								textarea:'textarea',
								awelzijnTransclude:'awelzijn-transclude',
								digipolisCodetabelDropdown:'digipolis-codetabel-dropdown'
							}
							var calculated = {};
							for(var i=0;i<Object.keys(editableFields).length;i++){
								var currentKey = Object.keys(editableFields)[i],
									currentValue = editableFields[currentKey];
									var childs = $(element).children();
										for(var j=0;j<childs.length;j++){
											var child = $(childs[j]);
											if(child.is(currentValue) && editableFields.awelzijnTransclude === currentValue){
												var fake = child.find('transclude-show');
												var real = child.find('transclude-edit');
												var isolateScope = child.find('transclude-edit').isolateScope()
												calculated = addToObject(real,currentKey,calculated,fake,isolateScope);
											}else if(child.is(currentValue)){
												calculated = addToObject(child,currentKey,calculated,undefined)
											}
										}
								
							}
							return calculated;
						}

						//Hack to open the selectbox
						var openSelect = function(selector,type){
						     var element = $(selector).find('select')[0], worked = false;
						     if(!element){
						     	if($(selector)[0]){
						     		element = (selector)[0];
						     	}
						     }
						    if (element && document.createEvent) { // all browsers
						        var e = document.createEvent("MouseEvents");
						        e.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
						        worked = element.dispatchEvent(e);
						    } else if (element && element.fireEvent) { // ie
						        worked = element.fireEvent("onmousedown");
						    }
						}

						function isDisabled(element){
							element = $(element);
							 return element.attr('disabled') || element.attr('is-disabled') || element.attr('data-is-disabled') || element.attr('data-disabled');
						}
						
						function focusin(real){
							$(real).focusin();
							$(real).focus();
							openSelect($(real),'focus');
							openSelect($(real),'mousedown');
						}

						$scope.hasClickCallback = function () {
							return angular.isDefined(attrs.ngClick);
						}
						setFakeInput();
					}
						}
			}
			
		};
	}])
})();;angular.module('awelzijn.editableFieldset').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/panel.html',
    "<section class=card> <header class=card-heading> <i class=\"fa fa-th-large\"></i> <h1 class=card-title>{{title}}\n" +
    "<a class=anchorPijl anchor-smooth-scroll=top></a> </h1> </header> <div class=\"card-body has-no-padding\" loading=loading> <form novalidate name=name class=\"fieldset-editable form-horizontal\" tink-form-status=status tink-form-editable=true tink-fieldset> <div ng-show=\"!loading && !hideAll\" ng-transclude></div> <div ng-show=\"loading && !hideAll\" style=\"text-align: center\"> <div class=loader>De gegevens worden opgevraagd.</div> </div> </form> </div> </section>"
  );


  $templateCache.put('templates/panelfield.html',
    "<div class=form-group ng-class=colspanClass> <div ng-if=title class=\"col-xs-12 labelTitle\"> <label for=tink-username-example>{{title}}</label> </div> <div class=\"col-xs-12 col-sm-12\"> <div class=validation> <div ng-show=editMode class=panel-field-input ng-transclude> </div> <div ng-show=!editMode contenteditable=false disabled class=faux-input>{{label || '-'}}</div> </div> <span class=help-block></span> </div> <div class=\"col-xs-12 col-sm-6 ng-hide\"> </div> </div>"
  );

}]);
