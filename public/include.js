var app = angular.module("mainModule", [])

app.factory('toFolders', function() {
	var lastSearch;			//probably don't need
	var searchResults = [];
	var responded = 0;
 	var folderUpdate = 0;
 	var localUpdate = 0;
	var feedUrl = '';
	var currentFolderIndex;
	var currentSubIndex;
	var folders = [];
 	var length;
 	var subscriptionMenu;
 	var allowLocalStorage = localStorage.allowLocalStorage;

 	function initFolders(){
		// var loop = 0;
		// var items = doc.querySelectorAll('.folder');

		// console.log('items')
		// console.log(items)

		// if(items.length != 0){
		// 	for(var i=0; i < items.length; i++ ){
		// 		var el;
		// 		el = items[loop]; //terrible
		// 		$(el).removeClass('noOffset');
		// 	}
		// } else {
		// 	var myVar = setInterval(function(){ recenterFolders() }, 200, loop);
		// }

		// function recenterFolders() { 
		// 	if(loop >= length){
		//     	clearInterval(myVar);
		// 	} else {
		// 		slideFolder(loop, false);
		// 	}
		// 	loop = loop + 1;
		// }
 	}

 	function slideFolder(index, delay){
		folders[index]

 		function slide(){
			var el;
			el = $('.folder')[index]; //terrible
			$(el).addClass('noOffset');
		}

		setTimeout(function () {
			slide();
		}, 1);
 	}

	return {
		updateSaveOption: function(value){
		 	allowLocalStorage = value;
		 	localStorage.allowLocalStorage = allowLocalStorage;
		},
		updateFromStorage: function(){
			if(allowLocalStorage){
				this.setFolders(angular.fromJson(localStorage.rssNESTFolders))
			}
		},
		saveToStorage: function(){
			if(allowLocalStorage){
				localStorage.rssNESTFolders = angular.toJson(this.getFolders());
			}
		},
		deleteStorage: function(loggedIn){
			if(!loggedIn){
				folders.length = 0;
			}
			delete localStorage.rssNESTFolders;
		},
		setFolders: function(newFolders){
			folders.length = 0;
			for(folder in newFolders){
				this.addFolder(newFolders[folder]);
			}
			length = folders.length;

			folderUpdate = folderUpdate +1;
			// initFolders();
		},
		getFolders: function(){return folders}, 

		getSelectedFolder: function(){
			return folders[currentFolderIndex];
		},
		setSelectedFolder: function(item, subscriptionSelected){
			if(subscriptionSelected){
				subscriptionMenu = true;
			} else {
				subscriptionMenu = false;
			}
			currentFolderIndex = folders.indexOf(item);
		},
		setSelectedSub: function(item){
			currentSubIndex = folders[currentFolderIndex].subscriptions.indexOf(item);
		},
		addFolder: function(folder){
			folders.push(folder);
			length = folders.length;

			this.saveToStorage();
		},
		getContextType: function(){
			return subscriptionMenu;
		},
		renameFolder: function(){
			folders[currentFolderIndex].renaming = true;
			this.saveToStorage();
		},
		renameSub: function(){
			folders[currentFolderIndex].subscriptions[currentSubIndex].renaming = true;
			this.saveToStorage();
		},
		clearRenamingAll: function(){
			for(folder in folders){
				folders[folder].renaming = false;
				var subs = folders[folder].subscriptions;
				for(sub in subs){
					subs[sub].renaming = false;
				}
			}
		},
		deleteFolder: function(){
			folders.splice(currentFolderIndex, 1);
			length = folders.length;
			this.saveToStorage();
		},

		deleteSub: function(){
			folders[currentFolderIndex].subscriptions.splice(currentSubIndex, 1);
			this.saveToStorage();
		}, 
		setResults: function(list){
			searchResults = list; 
		},
		getResults: function(){return searchResults},

		setSavedFeed : function(url) { feedUrl = url },
		getSavedFeed : function() { return feedUrl},
 
		getAccountUpdate: function(){return folderUpdate},
		getFolderLength: function(){return length},

		setSaveResponse: function(){responded = responded +1},
		getSaveResponse: function(){return responded}
	} 
})

app.controller("tutorialController", function($scope){
	var skipBar = document.querySelector('#tutorial .button')

	var tutorial = (function(){
		var instructions = []
		var current = 0;
		var tutorialArea = document.getElementById('tutorial');
		var peripheralAreaMask = document.getElementById('peripheralAreaMask');
		var tutMask = document.getElementById('tutMask');
		var leftAreaMask = document.getElementById('leftAreaMask');
		var rightAreaMask = document.getElementById('rightAreaMask');
		var centerContainer = document.getElementById('main')
		var centerHidden = false;
		var fading = false;
		var allowClicks = false;
		var clickDelay = 3000;

		class Instruction {
			constructor(text, action) {
				var text = text
				if(action){
					this.action = action
				} else {
					this.action = function(){};
				}
				this.runInstruction = function(){
					// async function doAction(){
						// function waitForAction(){
							// return new Promise( resolve => {
								action()
							// })
						// }
						// var res = await waitForAction();
					// }

					this.getText();
					// doAction()
				}
				this.getText = function(){
					$scope.tutorialText = text;
				}
			}
		}


		instructions.push(new Instruction("This is RSSNest",
							function(){
							}));
		instructions.push(new Instruction("It is a useful tool for combining RSS feeds from across the web",
							function(){
								delayClicks(clickDelay)
							}));
		instructions.push(new Instruction("In the center, any feed you select will be presented here",
							function(){
								fadeDiv(tutMask, 500, 0, function(){})
								peripheralAreaMask.style.display = 'block'
								fadeDiv(peripheralAreaMask, 500, 1, function(){
								})
								delayClicks(clickDelay)
							}));
		instructions.push(new Instruction("You can filter these out if they are too long by entering text at the top of the page in the [Filter Feed] section",
							function(){
								delayClicks(clickDelay)
							}));
		instructions.push(new Instruction("On the left hand side, you have the option to create folders, where the app will store different feeds",
							function(){
								hideCenter();
								fadeDiv(peripheralAreaMask, 500, 0, function(){peripheralAreaMask.style.display = "none"})
								leftAreaMask.style.display = 'block'
								fadeDiv(leftAreaMask, 250, 1, function(){})
								delayClicks(clickDelay)
							}));
		instructions.push(new Instruction("You can also rename folders and feeds by right clicking if you're on desktop, or clicking if you're on mobile",
							function(){
								delayClicks(clickDelay)
							}));
		instructions.push(new Instruction("On the right, you have the option to register for an account if you don't have one, or log in",
							function(){
								fadeDiv(leftAreaMask, 500, 0, function(){leftAreaMask.style.display = "none"})
								rightAreaMask.style.display = 'block'
								fadeDiv(rightAreaMask, 250, 1, function(){})
								delayClicks(clickDelay)
							}));
		instructions.push(new Instruction("Your feeds will be saved automatically to your cache if your browser allows tracking",
							function(){
								revealCenter();
								fadeDiv(tutMask, 500, .5, function(){})
								fadeDiv(rightAreaMask, 500, 0, function(){rightAreaMask.style.display = "none"})
								delayClicks(clickDelay)
							}));
		instructions.push(new Instruction("Creating an acount makes it possible to save your feeds, even after your cache has been cleared",
							function(){
								delayClicks(clickDelay)
								resetPosition();
							}));

		function resetPosition(){
			current = -1;			
		}

		function fadeDiv(div, ms, frac, callback ){
			if(!frac){frac = 0}
			$(div).animate({opacity: frac}, { duration: ms, queue: false, complete: function(){if(callback){callback()}}});	
		}

		function hideCenter(){
			centerHidden = true;
			fadeDiv(centerContainer, 100, 0, function(){peripheralAreaMask.style.display = "none"})
		}
		function revealCenter(){
			centerHidden = false;
			fadeDiv(centerContainer, 100, 1)
		}

		function delayAction(action, delay){
			setTimeout(function(){
				action();
			}, delay);
		}

		function fadeInTut(div){
			div.style.display = 'block';
			delayAction(enableClicks, 1500)
			fadeDiv(div, 500, 1);
		}

		function fadeOutTut(div){
			if(!fading){
				fading = true;
				delayAction(function(){
					fadeDiv(div, 1000, 0, function(){
						div.style.display = 'none';
						document.querySelector('#newFeedField').focus()
						fading = false;
					});
				}, 1000);
			}
		}

		function markTutCompleted(){
			localStorage.tutorialWatched = true;
		}

		function checkTutCompleted(){
			return localStorage.tutorialWatched
		}

		function delayClicks(delay){
			console.log('delayClicks')
			allowClicks = false;
			delayAction(enableClicks, 1000)
		}

		function enableClicks(){
			allowClicks = true;
		}
		
		function nextInstruction(){
				current++;
			if(current>= instructions.length){
				current =  instructions.length-1;
				fadeOutTut(tutorialArea);
				markTutCompleted();
			}


			return currentInstruction();
		}
		
		function currentInstruction(){
			instruction = instructions[current];
			if (instruction.action){
				instruction.runInstruction();
			}
		}
		
		function prevInstruction(){
			current--; 
			if(current<=0){
				current = 0;
			}
			return currentInstruction();
		}

		return {
			init(force){
				if(!checkTutCompleted() || force){
					fadeInTut(tutorialArea);
				}
			},
			destroy(){
				tutorialArea.style.display = 'none';
				centerContainer.style.opacity = 1;
				centerContainer.style.display = 'block';

				function clearTutMasks(){
					peripheralAreaMask.style.display = 'none';
					leftAreaMask.style.display = 'none';
					rightAreaMask.style.display = 'none';
					tutMask.style.opacity = .5
					resetPosition();
				}

				clearTutMasks();
				setTimeout(function(){
					clearTutMasks();
				}, 550)
			},
			getCurrentInstruction(){
				currentInstruction();
			},
			getNextInstruction(){
				if(allowClicks){
					nextInstruction();
				}
			},
			getPrevInstruction(){
				if(allowClicks){
					prevInstruction();
				}
			}
		}
	})();

	getCurrentInstruction();

	$scope.$on('startTutorial', function(){
		tutorial.init(true); 
	})


	function getCurrentInstruction(){
		tutorial.getCurrentInstruction();
	}
	
	function getNextInstruction(){
		tutorial.getNextInstruction();
	}
	
	function getPrevInstruction(){
		tutorial.getPrevInstruction();
	}

	$scope.skipTutorial = function(){
		tutorial.destroy();
	}

	$scope.getNextTutItem = function(){
		getNextInstruction();
	}
	$scope.getPrevTutItem = function(){
		getPrevInstruction();
	}

	$scope.loaded = function(){
			tutorial.init(); 
	}
	$scope.clearModal = function(){
		deactivateTutorial();
	}
 
	$scope.retractSkip = function(){	
          skipBar.classList.remove('expandedSkip')
	}

	$scope.expandSkip = function(){	
          skipBar.classList.add('expandedSkip')
	}
})


app.controller("menuController", function($scope, toMenu){
	$scope.$watch(function(){return toMenu.getTimesUsed()}, function(newVal) {
		function activateContextMenu(){
			// console.log(toMenu.getMenuTitle())
			$scope.selectionContext = {};
			$scope.selectionContext.title;
			$scope.selectionContext.actions;

			$scope.selectionContext.title = toMenu.getMenuTitle(); 
			$scope.selectionContext.actions = toMenu.getOptions();

			$(rClickMenu).css('left', window.x);
			$(rClickMenu).css('top', window.y);

			$(rClickMenu).animate({opacity: '1'}, { duration: 250, queue: false });
			rClickMenu.style.display = 'block';

			$(clickMask).animate({opacity: '.5'}, { duration: 500, queue: false });
			clickMask.style.display = 'block';

			rClickMenuOpen = true;
		}

		if(toMenu.getMenuStatus()){ activateContextMenu() }
	})

	$scope.performAction = function(action){
		toMenu.setResponse();
		toMenu.setRequestedAction(action);
		$scope.hideMenus();
	}

	$scope.hideMenus = function(){			
		$(rClickMenu).animate({opacity: '0'}, { duration: 200, queue: false, complete: function(){ rClickMenu.style.display = 'none'}}   );
		$(clickMask).animate({opacity: '0'}, { duration: 200, queue: false, complete: function(){ clickMask.style.display = 'none'}}   );
	}
})

app.factory('toMenu', function() {
	var menu = [];
	var menuActive = false;
	var timesUsed = 0;
	var menuTitle;
	var requestedAction;
	var responded = 0;

	var fromFolder = {
	 	disableMenu: function(){menuActive = false},
	 	activateMenu: function(options, title){menu = options; menuActive = true; timesUsed += 1; menuTitle = title},
	 	
	 	setRequestedAction: function(action){ requestedAction = action},
	 	getRequestedAction: function(){ return requestedAction;},
	 	getMenuStatus: function(){return menuActive;},
	 	getTimesUsed: function(){return timesUsed;},
	 	getOptions: function(){return menu;},
	 	getMenuTitle: function(){return menuTitle;},

		setResponse: function(){responded = responded +1},
		getResponse: function(){return responded}
	}
	return fromFolder;
})

app.factory('toFeed', function() {
	var selection = [];
	var currentFolderName = '';
	var feedUpdated = 0;
	var rawUrls = [];

 	function slideFeed(){
		var loop = 0;
		var myVar;
		var items = $('.feedItem');
		myVar = setInterval(function(){ recenterFeed() }, 100, loop);
 		
 		if(items.length != 0){ //this part is just here to make it look like a new item was slid in
			for(var i=0; i < items.length; i++ ){
				var el;
				el = items[loop]; //terrible
				$(el).removeClass('noOffset');
			}
 		}


		function recenterFeed() {
			if(loop >= selection.length){
		    	clearInterval(myVar);
			} else {
				var el;
				el = $('.feedItem')[loop]; //terrible
				$(el).addClass('noOffset');
			}
			loop = loop + 1;
		}
 	}

	var fromFolders = {
	  finishFeedUpdate: function(){slideFeed()},
	  getRawUrls: function(){return rawUrls},
	  getSelection: function(){return selection},
	  setSelection: function(list, urls){selection = list; rawUrls = urls},
	  updateFeed: function(list, urls){  this.setSelection(list, urls); feedUpdated = feedUpdated + 1},
	  getTimesUsed: function(){return feedUpdated},
	  getCurrentFolder: function(){return currentFolderName},
	  setCurrentFolder: function(name){currentFolderName = name}
	};

	return fromFolders;
});

app.factory("toSave", function() {
	var dialogueText = '';
	var menuActive = false;
	var timesUsed = 0;
	var response;
	var responded = 0;

	var fromFeed = {
	  disableMenu: function(){menuActive = false},
	  setText: function(text){dialogueText = text; menuActive = true; timesUsed += 1;},

	  getMenuStatus: function(){return menuActive},
	  getMenuStatus: function(){return menuActive},
	  getTimesUsed: function(){return timesUsed},
	  getText: function(){return dialogueText},
	  setSaveResponse: function(bool){response = bool; responded = responded+1},
	  getSaveResponse: function(){return {response: response, responded: responded}}
	}
	return fromFeed;
})

app.controller("saveController", function($scope, toSave){
	var dialogueMask = document.getElementById('dialogueMask');			

	var rClickMenu = document.getElementById('rClickMenu');		
	var rClickMenuOpen = false;										
	var clickPos = {X:0, Y:0};										
	var bufferFolder;	

	// $scope.fromFeed = toFolders
	// $scope.controllerData = 0;

	$scope.$watch(function(){return toSave.getTimesUsed()}, function(newVal, oldVal) {
		// $scope.controllerData = newVal;

		function activateSaveMenu(){
			$(saveDialogue).animate({opacity: '1'}, { duration: 500, queue: false });
			saveDialogue.style.display = 'block';
			$(saveMask).animate({opacity: '.5'}, { duration: 500, queue: false });
			saveMask.style.display = 'block';

			$scope.saveConfirmationText = toSave.getText();
		}

		if( toSave.getMenuStatus()){ activateSaveMenu(); }
	});

 
	$scope.hideMenus = function(){							
		$scope.saveConfirmationText = '';

		$(saveMask).animate({opacity: '0'}, { duration: 200, queue: false, complete: function(){ saveMask.style.display = 'none';}}   )
		$(saveDialogue).animate({opacity: '0'}, { duration: 200, queue: false, complete: function(){ saveDialogue.style.display = 'none';}})
		toSave.disableMenu();
	}

	$scope.confirmSave = function(newFeed){					
		//FIX/REMOVE .pos/folder
		toSave.setSaveResponse(true);
		$scope.hideMenus();
	}

	$scope.denySave = function(){							
		$scope.hideMenus();
	}
})

app.factory('toAccounts', function() {
	var infoRequested = 0;
	var responded = 0;
	var saved = 0;
	var incomingFolders = [];
	var outgoingFolders = [];
	var controllerUpdate = 0;
	var newData = {};
	var target = '';
	var loginCheck = 0;
	var loginSet = 0;
	var isLoggedIn = null;
	var autoLoginOpt = localStorage.autoLogin;

	var fromFolders = { 
		updateAutoLoginOpt: function(bool){
			autoLoginOpt = bool;
			localStorage.autoLogin = bool;
		},
		allowAutoLogin: function(){
			return autoLoginOpt;
		},
		retrieveUserInfo: function(newFolders){
			responded = responded + 1; 
			//do the restoreallactions thing here
			// for(var i =0; i < folders.length; i++){
			// 	setDefaultActions(folders[i])
			// }
			incomingFolders = newFolders; 
		},  

		setLoginStatus: function(bool){ 
			loginSet++;
			isLoggedIn = bool;
		},  

		checkLoginStatus: function(){
			loginCheck++;
			return isLoggedIn
		}, 

		saveUserInfo: function(savedFolders){
			// console.log(savedFolders)
			saved = saved + 1; 
			outgoingFolders = savedFolders;
		},

		setTarget: function(value){
			target = value;
		},
		getTarget: function(){
			return target;
		},

		getRequestedFolders: function(){
			return incomingFolders;
		},
		
		getOutgoingFolders: function(){
			return outgoingFolders;
		},

		setControllerUpdate: function(data){
			newData = data;
		},
		finishControllerUpdate: function(){
			controllerUpdate = controllerUpdate +1;
		},
		getControllerUpdate: function(){
			return controllerUpdate;
		},
		getIncomingData: function(){
			return newData;
		},
		
	 	monitorSaveRequest: function(){return saved;},
	 	getResponse: function(){return responded;}
	};

	return fromFolders;
});


app.controller("global", function($scope, $document){
	$scope.clickedDiv;
	$document.bind('click', function(event) {
		$scope.clickedDiv = event.target;
		$scope.$broadcast('clicked');
    })
})

app.controller("maskController", function($scope, $rootScope){
	$scope.clearAllOptions = function(){
		$rootScope.$broadcast('clearOptions');
	}
})

app.controller("leftBar", function($scope, $timeout, $document, toFolders, toAccounts, toFeed, toMenu){
		var lBar = document.getElementById('leftBar');											//left
		var leftOptions = document.getElementById('leftOptions')
		var leftOptsMask = document.getElementById('leftOptsMask')
		var centerClickMask = document.getElementById('centerClickMask')
		var leftOptionsActivated = false;
		var folders = [];

		$scope.$on('rightClick', function(){ 
			console.log("rightClick")
		})				

		$scope.$on('clicked', function(){ 
			div = $scope.clickedDiv
			if(!div.classList.contains('renameButton') && !div.classList.contains('rClickButton') ){
				finishRenamingAll();
			}
		})

		setTimeout(function(){
			document.getElementById('leftOptions').classList.remove('hideOpts');
		}, 50)

		$scope.$on('clearOptions', function(){ 
			$scope.retractOptions(true);
		})

		$scope.retractOptions = function(forceClear){
			if(!leftOptionsActivated || forceClear){
				centerClickMask.style.display = "none";
          		leftOptions.classList.remove('expandedOptions')
				leftOptsMask.classList.remove('optMaskVisible')
			}
		}

		$scope.pinOptions = function(){
			leftOptionsActivated = true;
		}

		$scope.expandOptions = function(){
			centerClickMask.style.display = "block";
			leftOptsMask.classList.add('optMaskVisible')
	        leftOptions.classList.add('expandedOptions')
		}
		
		var isTrue = (localStorage.allowLocalStorage == 'true');
		if(isTrue){
			$scope.saveFoldersOpt = isTrue;
		}

		$scope.updateSaveOption = function(){
			toFolders.updateSaveOption($scope.saveFoldersOpt);
		}

		$scope.deleteLocalFolders = function(){
			$timeout(function(){
				$scope.$apply(function(){ 
					toFolders.deleteStorage(toAccounts.checkLoginStatus());
				});
			})
		}

		$scope.$on('startLocalUpdate', function(){
			$scope.$apply(function() {
				toFolders.updateFromStorage()
			})
		});

			
		$scope.selectionContext = {title:undefined, actions:undefined};				//click
		$scope.folders = folders;

		// $scope.$watch(function(){return toFolders.getAccountUpdate()}, function(newVal, oldVal) {
		// 	if(newVal){
		// 		console.log('Updating frontend Folders:');
		// 	}
		// })		

		$scope.$watch(function(){return toFolders.getSaveResponse()}, function(newVal, oldVal) {
			if(newVal){
				$scope.addSub( toFolders.getSavedFeed(), toFolders.getResults());
				submitUpdate();
			}
		})

		$scope.$watch(function(){return toMenu.getResponse()}, function(newVal, oldVal) {
			if(newVal){ 
				var action = toMenu.getRequestedAction();
				var isSubContext = toFolders.getContextType();
				// console.log(isSubContext)
				switch(action) {
				    case 'Rename':
				   		if(isSubContext){
				        	toFolders.renameSub();
					    } else {
				        	toFolders.renameFolder();
						}				    	
				        break;
				    case 'Delete':
				   		if(isSubContext){
				        	toFolders.deleteSub();
					    } else {
				        	toFolders.deleteFolder();
						}	
				        break;
				    case 'Search':
				   		if(isSubContext){
				        	$scope.selectSub();
					    } else {
				        	$scope.selectFolder();
						}	
				        break;
				    default:
				    	console.log("Invalid Action");
				}
				submitUpdate();
			}
		}) 

		function finishRenamingAll(){
			$scope.$apply(function(){ 
				toFolders.clearRenamingAll();
			})
			submitUpdate();
		}

		$scope.finishFolderRename = function(item){	
		console.log(item)				//left
			item.renaming = false;
			submitUpdate();
		}

		$scope.finishSubRename = function(item){					//left
			item.renaming = false;
			submitUpdate();
		}

	 	function submitUpdate(){
            // console.log("update folders")

		 	// function checkLoginStatus(){
		 	// 	var status = true;
		 	// 	// console.log("CheckLoginStatus " + status)
		 	// 	return status;
		 	// } 

			if (toAccounts.checkLoginStatus()){
				toAccounts.saveUserInfo(toFolders.getFolders());
				var membershipArea = document.getElementById("membershipStatus");
				// console.log(membershipArea)
			} else {
			}
		}

		$scope.selectSub = function(sub){
			if(sub.results.slice().length){
 	      		toFeed.updateFeed( sub.results.slice() );
 	      	} else {
 	      		var url = []
 	      		url.push(sub.url);
 	      		toFeed.updateFeed( sub.results.slice(), url );
 	      	}
		} 

		function setMenuItem(desc, func){
			return {name: desc, perform: func, active: true};
		}

		$scope.fromFeed = toFolders;
		$scope.controllerData = 0;
		
		$scope.addSub = function(sub, newList){
			var folder =  toFolders.getSelectedFolder()
			var subList = folder.subscriptions;
			subList.push({ pos: subList.length, 
										name: "sub " + subList.length, 
										url: sub, 
										results: newList,
										renaming: false,
            							actions: { 
											Search: setMenuItem("RSS Search",function(num){
											}),
											Rename: setMenuItem("Rename",function(num){
												// folders[num].renaming = true;
											}),
											Delete: setMenuItem("Delete",function(num){
												// removeFolder(num)
											})
            								}
            							})


   //         	folders[newFolder].actions = {
			// 	Search: setMenuItem("RSS Search",function(num){
			// 		$scope.hideMenus()
			// 	}),
			// 	Rename: setMenuItem("Rename",function(num){
			// 		folders[num].renaming = true;
			// 		$scope.hideMenus()
			// 	}),
			// 	Delete: setMenuItem("Delete",function(num){
			// 		removeFolder(num)
			// 		$scope.hideMenus()
			// 	}),
			// 	Cut: setMenuItem("Cut",function(num){
			// 		// bufferFolder = folders.slice(num, num+1)
			// 		bufferFolder = angular.copy(folders[num])
			// 		removeFolder(num)
			// 		$scope.hideMenus()
			// 	}),
			// 	Copy: setMenuItem("Copy",function(num){
			// 		bufferFolder = angular.copy(folders[num])
			// 		$scope.hideMenus()
			// 	}),
			// 	PasteB: setMenuItem("Paste",function(num){
			// 		if(bufferFolder!=undefined){
			// 			folders.splice(folders.length, 0, bufferFolder)
			// 		}
			// 		$scope.hideMenus()
			// 	})
			// }

			//FIX/REMOVE .pos/folder
			submitUpdate()
		}

		$scope.addFolder = function(){											//left
			toFolders.addFolder(
            	{ name: "Folder " + (toFolders.getFolders().length + 1),
            							description: "Folder", 
            							dateAdded: new Date, 
            							totalSubs: 0, 
            							subscriptions: [], 
            							renaming: false,
            							actions: {
											Search: setMenuItem("RSS Search",function(num){
											}),
											Rename: setMenuItem("Rename",function(num){
												// folders[num].renaming = true;
											}),
											Delete: setMenuItem("Delete",function(num){
												// removeFolder(num)
											})/*,
											Cut: setMenuItem("Cut",function(num){
												// // bufferFolder = folders.slice(num, num+1)
												// bufferFolder = angular.copy(folders[num])
												// removeFolder(num)
												// $scope.hideMenus()
											}),
											Copy: setMenuItem("Copy",function(num){
												// bufferFolder = angular.copy(folders[num])
												// $scope.hideMenus()
											}),
											PasteB: setMenuItem("Paste",function(num){
												// console.log(num)
												// if(bufferFolder!=undefined){
												// 	folders.splice(folders.length, 0, bufferFolder)
												// }
												// $scope.hideMenus()
											}),
											PasteA: setMenuItem("Paste After",function(num){
												// if(bufferFolder!=undefined){
												// 	folders.splice(num+1, 0, bufferFolder)
												// }
												// // setFolderPos()
												// $scope.hideMenus()
											}) 
*/
											//http://stackoverflow.com/questions/18826320/what-is-the-hashkey-added-to-my-json-stringify-result
											//you can track by unique variables
										} 
            						})

            // setDefaultActions(folders[newFolder])

			submitUpdate();
		}
 
		// $scope.addFolder()	//if authorization fails add folder
														//left
		$scope.folders = toFolders.getFolders();

		$scope.selectFolder = function(selectedItem){
			var subs = selectedItem.subscriptions;
            var temp;
            var final = [];
            var urls = [];

            console.log(selectedItem.name)

            if(subs!= undefined){
				if (subs.length!=0){
					for(var i =0; i < subs.length; i++){
						temp = subs[i].results;
						if(temp.length == 0){
							urls.push(subs[i].url);
						}
						final = final.concat(temp);

					}
				}

				if(final.slice().length){
 	      			toFeed.updateFeed(final.slice(), urls);
 	      		} else if (urls.length) {
 	      			toFeed.updateFeed(final.slice(), urls);
 	      		}

 	      		toFeed.setCurrentFolder(selectedItem.name);
			}

			toFolders.setSelectedFolder(selectedItem);
		}

		$scope.launchFolderContext = function(folder, sub){
			var selectedItem;
			var actions;
			var actionNames = [];

			if(sub){
				selectedItem = sub;
				toFolders.setSelectedFolder(folder, true);
				toFolders.setSelectedSub(selectedItem);
			} else {
				selectedItem = folder;
				toFolders.setSelectedFolder(selectedItem);
			}

			actions = selectedItem.actions;
			
			for (var action in actions) {
				actionNames.push(action);
			}
			toMenu.activateMenu(actionNames, selectedItem.name );
		}
	});

app.controller("rightBar", function($scope, $rootScope, toFolders, toAccounts){
	var accountFolders;
	var rBar = document.getElementById('rightBar');
	var rightOptionsActivated = false;
	var rightOptions = document.getElementById('rightOptions')
	var centerClickMask = document.getElementById('centerClickMask')

	$scope.$on('clearOptions', function(){
		// console.log("clear all options")
		$scope.retractOptions(true)
	});

	$scope.clickRightBar = function(){

	}

		
	var isTrue = (localStorage.autoLogin == 'true');
	if(isTrue){
		$scope.autoLoginOpt = isTrue;
	}

	$scope.updateLoginOpt = function(){
		toAccounts.updateAutoLoginOpt($scope.autoLoginOpt);
	}

	$scope.retractOptions = function(forceClear){
		//do not retract if the area was clicked.
		//force to retract if elswhere is clicked
		if(!rightOptionsActivated || forceClear){
			centerClickMask.style.display = "none";
      		rightOptions.classList.remove('expandedOptions')
			rightOptsMask.classList.remove('optMaskVisible')
		}
	}

	$scope.pinOptions = function(){
		rightOptionsActivated = true;
	}

	$scope.check = function(){	
	}

	$scope.expandOptions = function(){
		centerClickMask.style.display = "block";
		rightOptsMask.style.visibility = "visibile";
        rightOptsMask.classList.add('optMaskVisible')
        rightOptions.classList.add('expandedOptions')
	}

	$scope.$watch(function(){return toAccounts.monitorSaveRequest()}, function(newVal, oldVal) {
		if(newVal){ 
			var membershipArea = document.getElementById("membershipStatus");
			// l('Updating Backend ' + membershipArea.firstChild.id + " " + newVal)
			// l(membershipArea.firstChild)  

			// console.log(toAccounts.getOutgoingFolders())
			if(toAccounts.getOutgoingFolders() === undefined){
	 			// console.log('Account Folders Invalid')
	 		} else {
			    $.ajax({
		    		url: 'users/update/' + toAccounts.getTarget(),
		    		type: "POST",
		    		contentType: "application/json ;charset=UTF-8", 
	                data: angular.toJson({"folders": toAccounts.getOutgoingFolders(), "token": localStorage.rssNEST}),
	            	// headers: {"Authorization": localStorage.rssNEST}
			    }).done(function(result){
			    }).fail(function(err){
			    	console.log('Update Error');
			    	// console.log(err);
			    })
			}
		}
	})

	$scope.$watch(function(){return toAccounts.getControllerUpdate()}, function(newVal, oldVal) {
		if(newVal){
			data = toAccounts.getIncomingData();
	    	toAccounts.setTarget(data.target);
	    	toFolders.setFolders(data.incomingFolders);
			localStorage.rssNEST= data.token; 
		}
	})

	function getMemberShip(){
		var el = document.getElementById("membershipStatus");
		return el;
	}

	function setMemberShipArea(el, text){
		while (el.firstChild){el.removeChild(el.firstChild);}
		el.insertAdjacentHTML('beforeend', text)
	}

 	function setSubmitForm(){
    	var form = $('#submitForm');
    	var targetUrl = form.attr('action');
        form.submit(function (ev) {
            $.ajax({
                url: targetUrl,
                type: form.attr('method'),
                data: form.serialize(),
            }).done( function(result){
				if(targetUrl == 'users/login'){ 
	        		setMemberShipArea(getMemberShip(), result);
					startInjection(true);
				} else if (targetUrl = 'users/register'){
	        		setMemberShipArea(getMemberShip(), result);
					$rootScope.$broadcast('startLocalUpdate');
					setActionSelect();
					setSubmitForm();
				}
		    }).fail(function(err){
		    	console.log('SetSubmitForm fail.');
				if(targetUrl == 'users/login'){
					console.log(err);
				} else if (targetUrl == 'users/register'){
					console.log(err);
				}
		    })

            ev.preventDefault();
		    ev.stopPropagation();
        });

        toAccounts.setLoginStatus(false);
    } 

 	function setActionSelect(newUrl){
		var actionSelect = $('#actionSelect');
		var targetUrl;
		if(!newUrl){
			targetUrl =  $(actionSelect).data().target;
		} else {
			targetUrl = newUrl;
		}

		$(actionSelect).click( function(ev){
		    $.ajax({
	    		url: targetUrl,
	    		type: "POST",
	    		contentType: "application/json",
		    }).done(function(result){
	        	setMemberShipArea(getMemberShip(), result);
				setActionSelect();
			 	setSubmitForm();
		    }).fail(function(err){
		    	console.log('SetActionSelect fail.');
		    })
            ev.preventDefault();
		    ev.stopPropagation();
		})
	}

 	$scope.logout = function(){
	    $.ajax({
    		url: 'users/logout/' + toAccounts.getTarget(),
    		type: "POST",
    		contentType: "application/json",
	        data: angular.toJson({"token": localStorage.rssNEST}),
	    }).done(function(result){
        	setMemberShipArea(getMemberShip(), result);
			setActionSelect();
			setSubmitForm();
        	toAccounts.setLoginStatus(false);
	    }).fail(function(err){
	    	setActionSelect('users/login');
			setSubmitForm();
	    	console.log('SetActionSelect fail.');
	    })
 	}

	$(document).ready(function() {
		console.log("Document Ready");
		var membershipArea = document.getElementById("membershipStatus");
		if(membershipArea.firstChild.id == 'noAuth'){
			var isTrue = (toAccounts.allowAutoLogin() == 'true');
			// isTrue = true;
			if(isTrue){
				// console.log(membershipArea.firstChild.id + ", attempting Authorization")
				// console.log("noAuth localStorage.rssNEST" + localStorage.rssNEST)
					// console.log("This definitely shouldn't run")

		        $.ajax({
		            url: 'users/preauth',
		            type: 'POST',
		            data: angular.toJson({"token": localStorage.rssNEST}),
				    // headers: {
				    //     'Authorization': localStorage.rssNEST,
				    //     'Content-Type':'application/json'
				    // },
		    		// dataType: "json",
		    		contentType: "application/json ;charset=UTF-8",
		            // headers: {"Authorization": localStorage.rssNEST},
		        }).done( function(result){
		        	setMemberShipArea(getMemberShip(), result);
					if( $(accountFolders) != undefined ){
						startInjection(true);
					}

	        		toAccounts.setLoginStatus(true);
				}).fail(function(err){
		        	setMemberShipArea(getMemberShip(), err.responseText);
					setActionSelect();
				 	setSubmitForm();
	       			toAccounts.setLoginStatus(false);

					$rootScope.$broadcast('startLocalUpdate');
			    })
			} else {
	            $.ajax({
	                url: 'users/loginPage',
	    			type: "POST",
	    			contentType: "application/json"
	            }).done( function(result){
					$rootScope.$broadcast('startLocalUpdate');
		        	setMemberShipArea(getMemberShip(), result);
					setActionSelect('users/registerPage');
					setSubmitForm();
					startInjection(false);
			    }).fail(function(err){
			    })
	            // ev.preventDefault();
			    // ev.stopPropagation();
			}
		} else {
			// setSubmitForm();
		}

	})

	$scope.destroyController = 0;

	function startInjection(update){
		var div = getMemberShip().id;

		if(update){
			accountFolders = document.getElementById('accountFolders');

			toAccounts.setControllerUpdate({
				incomingFolders: angular.fromJson(accountFolders.dataset.incomingfolders),
				target: accountFolders.dataset.targ,
				token: accountFolders.dataset.token,
			})
		} else {

		}

		setTimeout(function () {
			var options = document.getElementById('rightOptions');
			if($scope != null){
				$scope.destroyController = $scope.destroyController++;
				$scope.$destroy();
			}

			var $div = angular.element(document.querySelector('#' + div));
			var $appElement = angular.element(document.querySelector('#mainModule'));

			if(options){
				options.classList.remove('hideOpts');
			}

			angular.element(document).injector().invoke(function($compile) {
			  $scope = $rootScope.$new(false, $rootScope);
			  $compile($div)($scope);
			  if(update){
			  	toAccounts.finishControllerUpdate();
			  }
			});

		}, 50, div, update);
	}
})

app.controller("centerController", function($scope, toFolders, toFeed, toSave, toAccounts, $rootScope){
		var centerContainer = document.getElementById('main');

		var helpBar = document.getElementById('helpBar');
		var lBar = document.getElementById('leftBar');
		var rBar = document.getElementById('rightBar');
		var filterFeed = document.getElementById('filterFeed');	
		var lbOpen = document.getElementById('leftBarOpen');
		var rbOpen = document.getElementById('rightBarOpen')					
		var filterHeight = window.getComputedStyle(filterFeed)['height']	
		var tabMarginTop = window.getComputedStyle(lbOpen)['marginTop']	
		var tabHeight = window.getComputedStyle(lbOpen)['height']			
			
	 	var lVisible = false											
	 	var rVisible  = false											
	 	var recenter = false;											
	 	var animating  = false											
	 	var startAnimating  = false										
	 	var lerpingToCenter  = false									

	 	var centerLerpMargin  = 0

	 	var barWidth = 300																	

	 	var sizes = []         																               
	 	var resizing = false; 

	 	var optionsActive = false;	

	 	$scope.newFeed = 'https://stackoverflow.com/feeds/tag?tagnames=javascript&sort=newest'

		$scope.$on('clearOptions', function(){
			// $scope.retractOptions(true);
		});

		$scope.$watch(function(){return toSave.getSaveResponse().responded}, function(newVal, oldVal) {
			if(newVal){
				if(toSave.getSaveResponse().response){
					toFolders.setSaveResponse()
				}
			}
		})

		$scope.$watch(function(){return toFeed.getTimesUsed()}, function(newVal, oldVal) {
			if(newVal){ 
				var urls = toFeed.getRawUrls()
				if(urls != undefined && urls.length){
					loopFeedUpdate(urls[0], urls, 0);
				} else {
					$scope.outPut = toFeed.getSelection()
					toFeed.finishFeedUpdate();
				}
			}
		})

		$scope.startTutorial = function(){
			$rootScope.$broadcast('startTutorial');
		}


		function loopFeedUpdate(newUrl, urls, position, feed){
			$scope.createNewFeed(newUrl, urls, position, feed);
		}

		$scope.createNewFeed = function(newUrl, urlList, position, completeList){
			var newList = []
			var targetUrl;
			var token;
			lastSearch = newUrl

			function newEntry(arr, entry, pos){
	            arr[pos] = {	feed: entry.link,
	            				date: entry.date, 
	            				dateMs: entry.date_ms, 
	            				link: entry.link, 
	            				summary: entry.summary, 
	            				title: entry.title};
			}

			targetUrl = 'users/getfeed'
			if(!toAccounts.checkLoginStatus()){
				targetUrl = '/getFreeFeed'
				token = "No Token";
			} else {
				token = localStorage.rssNEST;
			}

		    $.ajax({
	    		url: targetUrl,
	    		type: "POST",
		    	contentType: "application/json ;charset=UTF-8", 
	            data: angular.toJson({"url": newUrl, "token": token}),
            	// headers: {"Authorization": localStorage.rssNEST}
		    }).done(function(result){
		    	console.log('Feed Search Success: ')
		    	console.log(result.feed.title)
				for(var i = 0; i < result.feed.entries.length; i++){
		    		// console.log('Title: ' + result.feed.entries[i].title)
					newEntry(newList, result.feed.entries[i], i)
				}

				if(completeList){
					completeList = completeList.concat(newList)
				} else {
					completeList = []
					completeList = newList;
				}

				function applyToFeed(){
					$scope.$apply(function() {
						toFolders.setResults(completeList)
						toFolders.setSavedFeed(newUrl)
						$scope.outPut = toFolders.getResults().slice()
						toFeed.setSelection(toFolders.getResults().slice());
						toFeed.finishFeedUpdate();
					});	
				}

				if(urlList && urlList.length){
					if(position < urlList.length - 1){
						loopFeedUpdate(urlList[position+1], urlList, position+1, completeList);
					} else {
						applyToFeed()
					}
				} else {
					applyToFeed()
				}
				


		    }).fail(function(err){
		    	console.log('Feed Search Error')
		    	console.log(err)
		    }) 
		} 

		function finishSave(arr, subNum, folder){						//left
			//FIX/REMOVE .pos/folder
			//THE PROBLEM SHOULD BE HERE. OR WITH ARR SUBMUM, FOLDER, OR NEWLIST
			folders[folder].subscriptions[subNum].results = arr.slice(); 
		}

		$scope.retractHelp = function(){	
	          helpBar.classList.remove('expandedHelp')
		}

		$scope.expandHelp = function(){	
	          helpBar.classList.add('expandedHelp')
		}
							//left
		$scope.saveToFolder = function(saveUrl){						//left
			$scope.newFeed = saveUrl
			toFolders.setSavedFeed(saveUrl)

			var saveConfirmationText
			var validState
			var targetFolder = toFeed.getCurrentFolder()

			if( targetFolder == undefined || targetFolder == ''){
				targetFolder = 0
			}else{
				// targetFolder = toFeed.getSelection();
			}
			
			if(saveUrl === undefined || saveUrl == ''){
				window.alert("Enter An RSS URL");
			} else if( targetFolder === undefined ||  targetFolder == '' ) {
				window.alert("Select A Folder");
			} else {
				saveConfirmationText = "Save '" + saveUrl + "' to: " + targetFolder;
				toSave.setText(saveConfirmationText, true)
				// console.log(targetFolder)
			}
		}
 
	 	//sizes and their respective values and view setting functions
	 	sizes['smallSize'] 		= {}  														//main
	 	sizes['midSmallSize']	= {}  														//main
	 	sizes['midSize']		= {}  														//main
	 	sizes['midLargeSize']	= {}  														//main
	 	sizes['largeMinus']		= {}  														//main
	 	sizes['largeSize']		= {}  														//main
			
	 	//values			
	 	sizes['smallSize'].val = 479														//main
	 	sizes['midSmallSize'].val = 720														//main
	 	sizes['midSize'].val = 800															//main
	 	sizes['midLargeSize'].val = 944														//main
	 	sizes['largeMinus'].val = 1244														//main
	 	sizes['largeSize'].val = 1544														//main
	 	
	 	sizes['smallSize'].release = function(){											//main
			rBar.style.width = barWidth + 'px'			
			lBar.style.width = barWidth + 'px'			
	 	}			
			
	 	sizes['midSmallSize'].release = function(){}										//main
	 	sizes['midSize'].release = function(){}												//main
	 	sizes['midLargeSize'].release = function(){}										//main
	 	sizes['largeMinus'].release = function(){}											//main
	 	sizes['largeSize'].release = function(){}		

	 	function adjustLeft(){										//main
			lBar.style.marginLeft = 0 + 'px'
			lBar.style.visibility = 'visible'
			rbOpen.style.visibility = "hidden"

			// console.log(getCenter() + 'px')
			// $(centerContainer).css( 'marginLeft', getCenter() + 'px')
			// $(centerContainer).addClass('mainleft')

			$(centerContainer).css( 'marginLeft', '0vw' )
			$(centerContainer).css( 'transform', 'translateX(0%)' )
			$(centerContainer).css( 'left', '300px' )
			
			lbOpen.style.float = 'left'
			lbOpen.style.position = 'fixed'
			lbOpen.style.opacity = .5
			lbOpen.style.top = "0"
			lbOpen.style.height = 100 + 'vh'

			$('.leftarrow').css( 'transform', 'rotate(-45deg)' )
			$('.leftarrow').css( 'left', '-5px' )

	 		if(!resizing){
		 		rbOpen.style.opacity = 0
		 		lbOpen.style.opacity = 0

				$(lbOpen).animate({opacity: '.5'}, { duration: 200, queue: false })
				$(rbOpen).animate({opacity: '.5'}, { duration: 200, queue: false })
			}
	 	}

	 	function fadeRightBar(div){									//main
			div.style.float = 'left'
			div.style.position = 'fixed'

			$(div).animate({opacity: '.5'}, 200)
	 	}

	 	// function finishRightAdjust(div){
	 	// 	fadeRightBar(div)
			// animating = false
	 	// }

	 	function adjustRight(){											//main
			rBar.style.marginRight = 0 + 'px'
			rBar.style.visibility = 'visible'
			lbOpen.style.visibility = "hidden"
			rbOpen.style.top = "0"
			rbOpen.style.height = 100 + 'vh'
			
			$(centerContainer).css( 'marginLeft', '100vw' )
			$(centerContainer).css( 'transform', 'translateX(-100%)' )
			$(centerContainer).css( 'left', '-300px' )

			rbOpen.style.float = 'right'
			rbOpen.style.position = 'fixed'

			$('.rightarrow').css( 'transform', 'rotate(135deg)' )
			$('.rightarrow').css( 'right', '-5px' )

	 		if(!resizing){
	 			rbOpen.style.opacity = 0
	 			lbOpen.style.opacity = 0

				$(lbOpen).animate({opacity: '.5'}, { duration: 200, queue: false })
				$(rbOpen).animate({opacity: '.5'}, { duration: 200, queue: false })
			}
	 	} 

	 	function genericView(){										//main
	    	if(lVisible){ 
	    		if(recenter){
	    			recenterContainer()
	    		} else {
	    			adjustLeft()
	    		}
			} else if(rVisible){
	    		if(recenter){
	    			recenterContainer()
	    		} else {
	    			adjustRight()
	    		}
			} else {
			}
	 	}

	 	function maskSides(){										//main
	 		if(lVisible)
				rBar.style.visibility = 'hidden'

			if(rVisible)
				lBar.style.visibility = 'hidden'
	 	}

	 	function revealSides(){										//main
	 		if(lVisible)
				rBar.style.visibility = 'visible'

			if(rVisible)
				lBar.style.visibility = 'visible'	
	 	}

	 	//functions
	 	sizes['smallSize'].view = function(){										//main
	 		maskSides()
	 		genericView()
	 	}

	 	sizes['midSmallSize'].view = function(){										//main
	 		maskSides()
	 		genericView()
	 	}

	 	sizes['midSize'].view = function(){										//main
			rBar.style.visibility = 'visible'
			lBar.style.visibility = 'visible'	
 			genericView()
	 	}

	 	sizes['largeMinus'].view = function(){										//main
			revealSides()
	 		genericView() 
	 	}

	 	sizes['largeSize'].view = function(){										//main
			revealSides()
			recenterContainer()
			// $(centerContainer).stop();
			// $(centerContainer).css("left", '0px' )
			// $(centerContainer).css("right", '0px')
			// $(centerContainer).css("margin", 'auto')

	    	if(lVisible){
			} else if(rVisible){
			} else {
			}
	 	}


		function getContainerWidth(){										//main
			var w = (parseInt(window.getComputedStyle(centerContainer)['width']))
			return w
		} 

		$(window).on('resize', function(){
			resizing = true;
			checkSize()
		});

		function getCenter(){
	 		conWidth = getContainerWidth()
	 		winWidth = $(window).width()

	 		if(rVisible && (winWidth <= 944)){
	 			conWidth /= 2
	 		}
			return centerLerpMargin = (winWidth - (conWidth))/2
		}

	 	function recenterContainer(){										//main
	 		var int
	 		var newPosition
	 		var newPosition2
	 		var conWidth
	 		var winWidth

			// if(lVisible){
			// 	centerContainer.style.marginLeft = newPosition  + 'px';
			// } else {
			// 	centerContainer.style.marginRight = newPosition  + 'px';
			// 	centerContainer.style.left = 0  + 'px';
			// }
			$(centerContainer).css( 'marginLeft', '50vw' )
			$(centerContainer).css( 'transform', 'translateX(-50%)' )
			$(centerContainer).css( 'left', '0px' )
			// console.log("RECENTER")

			lVisible = false;
			rVisible = false;


			$('.leftarrow').css( 'transform', 'rotate(135deg)' )
			$('.leftarrow').css( 'left', '15px' )


			$('.rightarrow').css( 'transform', 'rotate(-45deg)' )
			$('.rightarrow').css( 'right', '15px' )


			lbOpen.style.visibility = 'visible'
			lbOpen.style.position = 'absolute'
			lbOpen.style.float = 'left'
			lbOpen.style.height = 100 + '%'

			rbOpen.style.visibility = 'visible'
			rbOpen.style.position = 'absolute'
			rbOpen.style.float = 'right'
			rbOpen.style.height = 100 + '%'

	 		rbOpen.style.opacity = 0
	 		lbOpen.style.opacity = 0

			$(lbOpen).animate({opacity: '.5'}, { duration: 200, queue: false })
			$(rbOpen).animate({opacity: '.5'}, { duration: 200, queue: false })

			// centerContainer.style.marginLeft = 'auto';
			// centerContainer.style.marginRight = 'auto';

			recenter = false;

			getCenter();
	 	}

	 	var curSize
	 	checkSize()
		function checkSize(){														//main
			var oldSize = curSize

			function canSet(size){
		    	if(curSize != size || startAnimating == true){
		    		curSize = size
		    		return true
		    	} else {
					return false	    		
		    	}
			}

		    if (window.innerWidth <= sizes['smallSize'].val){
		    	if(canSet(sizes['smallSize'].val)){
			    	sizes['smallSize'].view()
		    	}
		    } else if (window.innerWidth < sizes['midSmallSize'].val ){
		    	if(canSet(sizes['midSmallSize'].val)){
			    	sizes['midSmallSize'].view()
		    	}
		    } else if (window.innerWidth >= sizes['midSmallSize'].val && window.innerWidth < sizes['largeMinus'].val) { 
			    if(canSet(sizes['midSize'].val)){
			   		sizes['midSize'].view()
			    }
		    } else if (window.innerWidth >= sizes['largeMinus'].val && window.innerWidth < sizes['largeSize'].val) { // main container + 1 sidebar
			    if(canSet(sizes['largeMinus'].val)){
			    	sizes['largeMinus'].view()
			    }
		    } else if (window.innerWidth >= sizes['largeSize'].val) { // main container + 2 sidebars
			    if(canSet(sizes['largeSize'].val)){
			    	sizes['largeSize'].view()
			    }
		    }

	    	if(oldSize != curSize){//just if a style was set for a particular size and for no other ones. Saves repetition
	    		if(oldSize != undefined){
		    		if(typeof sizes['smallSize'].release == 'function'){
						if(oldSize == sizes['smallSize'].val){
					    	sizes['smallSize'].release()
			    		}
		    		}
		    	} 
			}

			resizing = false;
		}

		$scope.checkLeft = function(){						//main
			if(lVisible){
				recenter = true
				startAnimating = true
				checkSize();
			} else {
				lVisible = true
				startAnimating = true
				checkSize();
			}
		}

		$scope.checkRight = function(){						//main
			if(rVisible){
				recenter = true
				startAnimating = true
				checkSize()
			} else {
				rVisible = true
				startAnimating = true
				checkSize()
			}
		}

		$scope.filterUpdate = function(){
			// console.log($scope.searchText)
			toFeed.finishFeedUpdate();
		}

		$scope.filterSearch = function(item){								//left
			if($scope.searchText == undefined){
				return true;
			} else {
				if(item.title.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1){
					return true;
				}
			}
			return false;
		}
		//centerContainer
	}) 


app.directive('ngRightClick', function($parse, $rootScope) {
    return function(scope, element, attrs) {
    		var fn = $parse(attrs.ngRightClick);

        	element.bind('contextmenu', function(event) {



        	$rootScope.$broadcast('rightClick')

        	window.x = event.pageX //bad. needs fix
        	window.y = event.pageY

            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});

app.directive('ngStartUp', function() {
    return {
     //    scope: true,
	    restrict: 'A', 
        // template: "<button ng-click='removeDirective()'>Remove directive good</button>",
        link: function(scope, element, attrs) {

		    element.on('$destroy', function() {
		    });

			scope.$watch(attrs.ngStartUp, function() {
				// console.log("***Destroy successful***")
			});

            function removeDirective() { 
            };
        }
    };
}) 
