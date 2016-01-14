'use strict';
(function (module) {
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
			link: function ($scope, element, attrs,transclude) {
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

				//This creates the objects we are going to need !
				function addToObject(value,type,object,showField){

					var fake,
					scope;
					if(showField){
						fake = showField;
						scope = $(value).scope();
					}else{
						fake = $('<div contenteditable="true" class="faux-input">{{label || "-"}}</div>');
						scope = $(value).scope();
					}					
					
					if(object[type] && object[type] instanceof Array){
						object[type].push({real:value,fake:fake,scope:scope});
					}else{
						object[type] = [{used:{real:undefined,fake:undefined},real:value,fake:fake,scope:scope}];
					}
					return object;
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
						awelzijnTransclude:'awelzijn-transclude'
					}
					var calculated = {};
					for(var i=0;i<Object.keys(editableFields).length;i++){
						var currentKey = Object.keys(editableFields)[i],
							currentValue = editableFields[currentKey];
							var childs = $(element).children();
								for(var j=0;j<childs.length;j++){
									var child = $(childs[j]);
									if(child.is(currentValue) && editableFields.awelzijnTransclude === currentValue){
										var fake = child.find('transclude-show').clone();
										var real = child.find('transclude-edit').clone();
										element.replaceWith(real);
										calculated = addToObject(real,currentKey,calculated,fake)										
									}else if(child.is(currentValue)){
										calculated = addToObject(child,currentKey,calculated,undefined)
									}
								}
							
					}
					return calculated;
				}

				//Function to replace the fake fields with the right ones
				function setRealInput(){
					for(var i=0;i<Object.keys(edit).length;i++){
						var currentKey = Object.keys(edit)[i],
							currentValue = edit[currentKey];
						for(var j = 0;j<currentValue.length;j++){
							var usedFake = currentValue[j].used.fake,
							usedReal = currentValue[j].used.real,
							scopeField = currentValue[j].scope,
							real = $(currentValue[j].real).clone();
							if(usedFake === undefined && usedReal === undefined){
								usedFake = currentValue[j].fake;
								usedReal = $(currentValue[j].real).clone();
							}
							currentValue[j].used.real = real;
							currentValue[j].used.fake = usedFake;

							$(usedFake).replaceWith(real);
							if(formElement && formElement.isolateScope()){
								formElement.isolateScope().addEvents($(real));
							}						
							$compile(real)(scopeField);
						}
					}

				}

				//Hack to open the selectbox
				var openSelect = function(selector,type){
				     var element = $(selector)[0], worked = false;
				    if (document.createEvent) { // all browsers
				        var e = document.createEvent("MouseEvents");
				        e.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				        worked = element.dispatchEvent(e);
				    } else if (element.fireEvent) { // ie
				        worked = element.fireEvent("onmousedown");
				    }
				}

				function isDisabled(element){
					element = $(element);
					 return element.attr('disabled') || element.attr('is-disabled') || element.attr('data-is-disabled') || element.attr('data-disabled');
				}
				
				function setFakeInput(){
					for(var i=0;i<Object.keys(edit).length;i++){
						var currentKey = Object.keys(edit)[i],
							currentValue = edit[currentKey];
						for(var j = 0;j<currentValue.length;j++){

							var usedFake = currentValue[j].used.fake,
							usedReal = currentValue[j].used.real,
							scopeField = currentValue[j].scope,
							fake = $(currentValue[j].fake).clone();
							if(usedFake === undefined && usedReal === undefined){
								usedReal = currentValue[j].real;
								usedFake = $(currentValue[j].fake).clone();
							}

							formElement.isolateScope().removeEvents($(usedReal));
								
							currentValue[j].used.real = usedReal;
							currentValue[j].used.fake = fake;
							$(usedReal).replaceWith($(fake))

							$compile(fake)($scope);
								fake.bind('mousedown click touchstart',{i: currentKey,j:j},function(evt){
									$timeout(function(values){
										var real = edit[values.i][values.j].used.real;
										if(real === undefined){
											real = edit[values.i][values.j].real;
										}
										if($(real).is('transclude-edit')){
											formElement.isolateScope().setClassActive("mouseFocus",null);
										}else{
											focusin(real);
										}
									},150, true, {i:evt.data.i,j:evt.data.j})								
								})
							formElement.isolateScope().addEvents($(fake));							
						}
					}

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
		};
	}])
})();
