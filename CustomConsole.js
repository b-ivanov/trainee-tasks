	if (!document.getElementById("consoleDiv")) {
		var level1 = {"level2": {"level3": {"level4": {"a": 1, "b": 2, "c": 3}, "array": [1, 2, 3, 4, 5], "string": "abcd"}, "array": ["a", "b", "c", "d", "e"], "string": "foo"}};
		
		if (typeof console.log === "function") {		/* code by bivanov */
			/**************************************************
				TODO:
				function visualise window objects!
				function link.png -> image
			**************************************************/
			console = {
				"counter" : 0,
				"font": 2,
				"passes" : 7,
				"suggestions": [],
				"regExp": "",
				"objectString": "",
				"selectedSuggestion": -1,
				"history": [],
				"log" : function (str) {
					try {
						console.typeOutput("", str, "normal");
					} catch(er) {
						console.typeOutput("", er, "error");
					}
				},
				
				"info" : function (str) {
					try {
						console.typeOutput("", str, "special");
					} catch(er) {
						console.typeOutput("", er, "error");
					}
				},
				
				"warn" : function (str) {
					try {
						console.typeOutput("", str, "warning");
					} catch(er) {
						console.typeOutput("", er, "error");
					}
				},
				
				"error" : function (str) {
					try {
						console.typeOutput("", str, "error");
					} catch(er) {
						console.typeOutput("", er, "error");
					}
				},
				
				"debug" : function (str) {
					try {
						console.typeOutput("", str, "normal");
					} catch(er) {
						console.typeOutput("", er, "error");
					}
				},
				
				"clear" : function () {
					console.clear();
					inInput.value = "";
				},
				
				"construct" : function () {
					var consoleDiv = document.createElement("div");
					consoleDiv.setAttribute("id", "consoleDiv");
					consoleDiv.setAttribute("class", "consoleDiv");
					var outDiv = document.createElement("div");
					outDiv.setAttribute("id", "output");
					outDiv.setAttribute("class", "output");
					var inInput = document.createElement("input");
					inInput.setAttribute("id", "input");
					inInput.setAttribute("type", "text");
					inInput.setAttribute("class", "input");
					inInput.setAttribute("onkeydown", "console.typeInput(event)");
					inInput.setAttribute("onmousedown", "console.setSuggestionsContainer(this)");
					inInput.setAttribute("ondrop", "console.imgToBase64(event)");
					var bigConsole = document.createElement("div");
					bigConsole.innerHTML = "[+]";
					bigConsole.setAttribute("class", "plus");
					bigConsole.setAttribute("onclick", "console.maximize()");
					bigConsole.setAttribute("unselectable", "on"); 
					var smallConsole = document.createElement("div");
					smallConsole.innerHTML = "[-]";
					smallConsole.setAttribute("class", "minus");
					smallConsole.setAttribute("onclick", "console.minimize()");
					smallConsole.setAttribute("unselectable", "on");
					consoleDiv.appendChild(outDiv);
					consoleDiv.appendChild(inInput);
					consoleDiv.appendChild(bigConsole);
					consoleDiv.appendChild(smallConsole);
					document.body.appendChild(consoleDiv);					
					// document.body.insertBefore(consoleDiv, body.children[0]);
				},
				
				"setSuggestionsContainer" : function (input) {
					if (!document.getElementById("suggestionsContainer")) {
						var consoleDiv = document.getElementById("consoleDiv");
						var coords = input.getBoundingClientRect();
						var suggestionsContainer = document.createElement("div");
						suggestionsContainer.setAttribute("id", "suggestionsContainer");
						suggestionsContainer.setAttribute("class", "suggestionsContainer");
						suggestionsContainer.setAttribute("style", "top: " + (coords.top + coords.height) + "px; left: " + coords.left + "px; width: " + (coords.width - 10) + "px;");
						document.body.appendChild(suggestionsContainer);
					}
				},
				
				"makeSuggestions" : function () {
					if (console.regExp !== "") {
						var suggestionsContainer = document.getElementById("suggestionsContainer");
						suggestionsContainer.innerHTML = "";
						var sugLen = console.suggestions.length;
						if (!console.regExp.match(/\(/)) {
							var regex = new RegExp("^" + console.regExp, "i");
							for (var a = 0; a < sugLen; a++) {
								if (console.suggestions[a].match(regex)) {
									suggestionsContainer.innerHTML += "<div class='suggestion' onclick='console.setSelection(this)'>" + console.suggestions[a] + "</div>";
								}
							}
						}
					}
				},
				
				"setSelection" : function (element) {
					var input = document.getElementById("input");
					var suggestionsContainer = document.getElementById("suggestionsContainer");
					input.value = element.innerText;
					suggestionsContainer.innerHTML = "";
					console.regExp = "";
				},
				
				"typeInput": function(e) {
					var inInput = document.getElementById("input");
					var suggestionsContainer = document.getElementById("suggestionsContainer");
					var command = "";
					var historyLen = console.history.length;
					var sugConLen = suggestionsContainer.children.length;
					var codeKey = e.keyCode;
					var item = "";
					switch(codeKey) {
						case 13: {
							if (sugConLen !== 0 && suggestionsContainer.querySelector("#chosen")) {
								inInput.value = console.objectString + suggestionsContainer.querySelector("#chosen").innerText;
							} else {
								console.regExp = "";								
								console.counter = 0;
								if (inInput.value !== "") {
									command = inInput.value;
									if (command != console.history[historyLen - 1]) {
										console.history.push(command);
									}
									if (/^var /.test(command)) {
										command = command.replace("var ", "");
										console.suggestions.push(command);
									}
									if (/^console.log\(|^console.info\(|^console.warn\(|^console.error\(|^console.debug\(/.test(command)) {
										console.specialCommand(command);
										inInput.value = "";
										return;
									}
									switch(true) {
										case command === "#destroy": {
											console.destroy();
											inInput.value = "";
											break;
										}
										case command === "#clear": {
											console.clear();
											inInput.value = "";
											break;
										}
										case command === "#bigger": {
											console.maximize();
											inInput.value = "";
											break;
										}
										case command === "#smaller": {
											console.minimize();
											inInput.value = "";
											break;
										}
										case command === "#font++": {
											console.fontSize();
											inInput.value = "";
											break;
										}
										case command === "#help": {
											console.instructions();
											inInput.value = "";
											break;
										}
										case (/^#([0-9a-f]{3}|[0-9a-f]{6})$|^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/gi.test(command)) : {
											console.colorFinder(command);
											inInput.value = "";
											break;
										}
										default: {
											try {
												console.typeVariable(command, eval(command), "normal");
											} catch(er) {
												console.typeVariable(command, er, "error");
											}
											inInput.value = "";
											break;
										}
									}
								}
							}
							console.populateSuggestions(window);
							suggestionsContainer.innerHTML = "";
							console.objectString = "";
							break;
						}
						case 38: {
							if (sugConLen !== 0) {
								if (console.selectedSuggestion < 0 || console.selectedSuggestion > sugConLen - 1) {
									console.selectedSuggestion = sugConLen - 1;
								}
								for (var t = 0; t < sugConLen; t++) {
									if (t === console.selectedSuggestion) {
										suggestionsContainer.children[t].style.color = "#00FF00";
										suggestionsContainer.children[t].id = "chosen";
									} else {
										suggestionsContainer.children[t].style.color = "#FFFFFF";
										suggestionsContainer.children[t].id = "";
									}
								}
								console.selectedSuggestion--;
							} else if (historyLen - console.counter > 0) {
								inInput.value = console.history[(historyLen - 1) - console.counter];
								console.counter++;
							}
							break;
						}
						case 40: {
							if (sugConLen !== 0) {
								if (console.selectedSuggestion < 0 || console.selectedSuggestion > sugConLen - 1) {
									console.selectedSuggestion = 0;
								}
								for (var t = 0; t < sugConLen; t++) {
									if (t === console.selectedSuggestion) {
										suggestionsContainer.children[t].style.color = "#00FF00";
										suggestionsContainer.children[t].id = "chosen";
									} else {
										suggestionsContainer.children[t].style.color = "#FFFFFF";
										suggestionsContainer.children[t].id = "";
									}
								}
								console.selectedSuggestion++;
							} else if (console.counter > 0) {
								inInput.value = console.history[(historyLen - 1) - console.counter];
								console.counter--;
							}
							break;
						}
						case 8: {
							var inputValue = inInput.value.slice(0,-1);
							if (inputValue === "" || inputValue.match(/\.$/)) {
								suggestionsContainer.innerHTML = "";
								console.regExp = "";
							} else {
								console.regExp = inputValue;
								console.makeSuggestions();
							}
							break;
						}
						case 190:
						case 219:
							console.objectString = inInput.value.split(/\.$|\[$/)[0];
							console.populateSuggestions(eval("{" + console.objectString + "}"));
							console.objectString += ".";
							console.regExp = "";
							suggestionsContainer.innerHTML = "";
							break;
						default :
							if ((codeKey > 47 && codeKey < 58) || (codeKey > 64 && codeKey < 91)   || (codeKey > 95 && codeKey < 106)) {
								console.regExp += String.fromCharCode(codeKey).toLowerCase();
								console.makeSuggestions();
							}
							break;
					}
				},
				
				"specialCommand" : function (command) {
					var consoleType = command.split(".")[1].substring(0,3);
					switch (consoleType) {
						case "log":
							command = command.replace(/console.log\(/, "");
							command = command.replace(/\)\;?$/, "");
							console.log(command);
							break;
						case "inf":
							command = command.replace(/console.info\(/, "");
							command = command.replace(/\)\;?$/, "");
							console.info(command);
							break;
						case "war":
							command = command.replace(/console.warn\(/, "");
							command = command.replace(/\)\;?$/, "");
							console.warn(command);
							break;
						case "err":
							command = command.replace(/console.error\(/, "");
							command = command.replace(/\)\;?$/, "");
							console.error(command);
							break;
						case "deb":
							command = command.replace(/console.debug\(/, "");
							command = command.replace(/\)\;?$/, "");
							console.debug(command);
							break;
						default :
							
							break;
					}
				},
				
				"colorFinder" : function (color) {
					var result = "<div style='background-color: " + color + "; height: 1em;'> </div>";
					console.typeOutput("Color finder:", result, "normal");
				},
				
				"typeOutput": function(input, result, typeLog) {
					var outDiv = document.getElementById("output");
					if (input != "") {
						input = "> " + input;
						var inputElement = document.createElement("div");
						inputElement.innerHTML = input;
						inputElement.setAttribute("class", "inputLog");
						outDiv.appendChild(inputElement);
					}
					var resultElement = document.createElement("div");
					resultElement.innerHTML = result;
					resultElement.setAttribute("class", typeLog+"Log");
					outDiv.appendChild(resultElement);
					outDiv.scrollTop = outDiv.scrollHeight;
				},
				
				"typeVariable" : function (command, result, logType) {
					if (/HTML/.test(Object.prototype.toString.call(result))) {
						result = console.htmlElementToConsole(result);
						console.typeOutput(command, result, "normal");
					} else {
						switch (Object.prototype.toString.call(result)) {
							case "[object String]":
								switch (true) {
									case (/^http\:\/\/(.)*?.png$/.test(result)) :
									case (/data:image\//.test(result)) :
										if (/^url\(/.test(result)) {
											result = result.replace("url(", "");
											result = result.replace(")", "");
										}
										result = console.base64ToImg(result);
										if (command.length > 100) {
											var tempInput = command.substring(0,40);
											tempInput += "...";
											tempInput += command.substring(command.length - 40,command.length);
											command = tempInput;
										}
										break;
									default :
										break;
								}
								break;
							case "[object Array]":
								result = console.arrayToConsole(result, command);
								break;
							case "[object Object]":
								result = console.objectToConsole(result, command);
								break;
							// case "[object Function]":
								// alert("Function");
								// break;
							default:
								Object.prototype.toString.call(result)
								break;
						}
						console.typeOutput(command, result, logType);
					}
				},
				
				"arrayToConsole" : function (variable, command) {
					var arr = "<ul class='parentNodeUL' status='noChildren' objectName='" + command + "'>";
					if (variable.length == 0) {
						arr += "<div class='objectClass'>[-] Array</div> [";
					} else {
						arr += "<div class='objectClass' onclick='console.expandObject(" + command + ", this.parentNode)'>[+] Array</div> [";
					}
					arr += variable.length;
					// for (var i = 0; i < variable.length; i++) {
						// arr += i + ": " + variable[i] + ", ";
						// if (i === console.passes) {
							// arr += " ... ";
							// break;
						// }
					// }
					// arr = arr.replace(/, $/, "");
					arr += "]</ul>";
					return arr;					
				},
				
				"objectToConsole" : function (variable, command) {
					var object = "<ul class='parentNodeUL' status='noChildren' objectName='" + command + "'>";
					if (Object.getOwnPropertyNames(variable).length > 0) {
						object += "<div class='objectClass' onclick='console.expandObject(" + command + ", this.parentNode)'>[+] Object</div> { ";
					} else {
						object += "<div class='objectClass'>[-] Object</div> { ";
					}
					var pass = 0;
					for (var prop in variable) {
						if (pass < console.passes) {
							object += prop + ": " + typeof variable[prop] + ", ";
						} else {
							object += " ...";
							break;
						}
						pass++;
					}
					object = object.replace(/, $/, "");
					object += " }</ul>";
					return object;
				},
				
				"htmlElementToConsole" : function(element) {
					var numOfAttributes = element.attributes.length;
					var html = '<ul class="parentNodeUL" status="noChildren">';
					if (element.children.length > 0) {
						html += '<div class="objectClass" onclick="console.expandHTMLElem(' + element.id + ', this.parentNode)">[+] HTMLElement <</div>';
					} else {
						html += '<div class="objectClass">[-] HTMLElement <</div>';
					}
					html += element.tagName;
					for (var i = 0; i < numOfAttributes; i++) {
						html += ' ' + element.attributes[i].name + '="' + element.attributes[i].nodeValue + '"';
					}
					html += '></ul>';
					return html;
				},
				
				"expandObject" : function(object, parentUL) {
					switch (parentUL.getAttribute("status")) {
						case "noChildren" :
							if (parentUL.innerHTML.match(/[+]/)) {
								var lis = parentUL.innerHTML;
								lis = lis.replace("[+]", "[-]");
								for (var prop in object) {
									lis += "<li class='listItemClass'>" + prop + ": ";
									if (typeof object[prop] === "function") {
										lis += "function() { ... }";
									} else {
										switch (Object.prototype.toString.call(object[prop])) {
											case "[object Array]":
												lis += console.arrayToConsole(object[prop], parentUL.getAttribute("objectName") + '["' + prop + '"]');
												break;
											case "[object Object]":
												lis += console.objectToConsole(object[prop], parentUL.getAttribute("objectName") + '["' + prop + '"]');
												break;
											default :
												lis += object[prop];
												break;
										}
									}
									lis += "</li>";
								}
								parentUL.innerHTML = lis;
								parentUL.setAttribute("status", "visibleChildren");
							}
							break;
						case "invisibleChildren" :
							var lisLen = parentUL.children.length;
							if (lisLen > 1) {
								for (var i = 1; i < lisLen; i++) {
									parentUL.children[i].style.display = "block";
								}
								parentUL.innerHTML = parentUL.innerHTML.replace("[+]", "[-]")
								parentUL.setAttribute("status", "visibleChildren");
							}
							break;
						case "visibleChildren" :
							var lisLen = parentUL.children.length;
							for (var i = 1; i < lisLen; i++) {
								parentUL.children[i].style.display = "none";
							}
							parentUL.innerHTML = parentUL.innerHTML.replace("[-]", "[+]")
							parentUL.setAttribute("status", "invisibleChildren");
							break;
						default :
							break;
					}
				},
				
				"expandHTMLElem" : function(element, container) {
					var lisLen = element.children.length;
					if (lisLen > 0) {
						switch (container.getAttribute("status")) {
							case "noChildren" :
								var lis = container.innerHTML;
								lis = lis.replace("[+]", "[-]");
								for (var a = 0; a < lisLen; a ++) {
									lis += "<li class='listItemClass'>" + console.htmlElementToConsole(element.children[a]) + "</li>";
								}
								container.innerHTML = lis;
								container.setAttribute("status", "visibleChildren");
								break;
							case "invisibleChildren" :
								var lisLen = container.children.length;
								if (lisLen > 1) {
									for (var i = 1; i < lisLen; i++) {
										container.children[i].style.display = "block";
									}
									container.innerHTML = container.innerHTML.replace("[+]", "[-]")
									container.setAttribute("status", "visibleChildren");
								}
								break;
							case "visibleChildren" :
								var lisLen = container.children.length;
								for (var i = 1; i < lisLen; i++) {
									container.children[i].style.display = "none";
								}
								container.innerHTML = container.innerHTML.replace("[-]", "[+]")
								container.setAttribute("status", "invisibleChildren");
								break;
							default :
								break;
						}
					}
				},
				
				"base64ToImg" : function(base64) {
					var image = "base64 Image: <img src='" + base64 + "' class = 'base64Img'/>";
					return image;
				},
				
				"imgToBase64" : function(evt) {
					evt.preventDefault();
					var outDiv = document.getElementById("output");
					var files = evt.dataTransfer.files;
					console.log(files);
					if (files.length > 0) {
						var file = files[0];
						if (typeof FileReader !== "undefined" && file.type.indexOf("image") !== -1) {
							var reader = new FileReader();
							reader.readAsDataURL(file); 
							reader.onload = function (evt) {;
								console.typeOutput("Image converted:", "<div onclick='console.selectAll(this)'>" + reader.result + "</div>", "normal");
							};
						} else {
							console.typeOutput("Image converted:", "Error!", "error");
						}
					}
				},
				
				"maximize" : function() {
					var consoleDiv = document.getElementById("consoleDiv");
					var suggestionsContainer = document.getElementById("suggestionsContainer");
					if (suggestionsContainer) {
						document.body.removeChild(suggestionsContainer);
					}
					if (consoleDiv.offsetWidth  >= document.body.offsetWidth - 100 || consoleDiv.offsetHeight >= document.body.offsetHeight - 100) {
						return;
					} else {
						consoleDiv.style.width = (consoleDiv.offsetWidth + 50) + "px";
						consoleDiv.style.height = (consoleDiv.offsetHeight + 50) + "px";
					}
				},
				
				"minimize" : function() {
					var consoleDiv = document.getElementById("consoleDiv");
					var suggestionsContainer = document.getElementById("suggestionsContainer");
					if (suggestionsContainer) {
						document.body.removeChild(suggestionsContainer);
					}
					if (consoleDiv.offsetWidth <= 200 || consoleDiv.offsetHeight <= 200) {
						return;
					} else {
						consoleDiv.style.width = (consoleDiv.offsetWidth - 50) + "px";
						consoleDiv.style.height = (consoleDiv.offsetHeight - 50) + "px";
					}
				},
				
				"destroy" : function() {
					document.body.removeChild(document.getElementById("consoleDiv"));	
					document.body.removeChild(document.getElementById("suggestionsContainer"));	
				},
				
				"clear" : function () {
					setTimeout( function() {
						document.getElementById("output").innerHTML = "";
					}, 1);
				},
				
				"instructions" : function() {
					var outDiv = document.getElementById("output");
					var helpInfo = "<div>*** Console v2.0 by bivanov ***</div>" +
					"<div>This console has the features of a normal console: a place to log diagnostic information using methods provided by the Console API, such as console.log() and a shell prompt where you can enter commands and interact with the document.</div>" +
					"<p> Extra features:</p>" +
					"<div>* Convert base64 string to image (paste the string surrounding it with quotation marks (\"\"));</div>" +
					"<div>* Convert image to base64 string (drag an image to the input field);</div>" +
					"<p>Shortcuts:</p>" +
					"<div>#destroy - removes the console from the page;</div>" +
					"<div>#clear - clears the console;</div>" +
					"<div>#bigger - enlarges the console;</div>" +
					"<div>#smaller - shrinks the console;</div>" +
					"<div>#font++ - bigger font size;</div>" +
					"<div>#help - opens this menu;</div>";
					console.typeOutput("#help", helpInfo, "special");
				},
				
				"fontSize" : function() {
					var outDiv = document.getElementById("output");
					var inDiv = document.getElementById("input");
					var suggestionsContainer = document.getElementById("suggestionsContainer");
					outDiv.style.fontSize = (12 + console.font) + "px";
					inDiv.style.fontSize = (12 + console.font) + "px";
					suggestionsContainer.style.fontSize = (12 + console.font) + "px";
					console.font += 2;
				},
			
				"selectAll" : function(element) {
					if (document.selection) {
						var range = document.body.createTextRange();
						range.moveToElementText(element);
						range.select();
					} else if (window.getSelection()) {
						var range = document.createRange();
						range.selectNode(element);
						window.getSelection().removeAllRanges();
						window.getSelection().addRange(range);
					}
				},
				
				"populateSuggestions" : function(object) {
					console.suggestions = [];
					for(var key in object){
						if (object.hasOwnProperty(key)) {
							console.suggestions.push(key);
						}		
					}
				}
			}
		}
		var css = ".consoleDiv { position: absolute; top: 1em; right: 1em; width: 50%; height: 50%; background-color: #000000; font-family: 'Consolas'; font-size: 12px; z-index: 100000; border-radius: 10px; -webkit-animation: strech 1s; -o-animation: strech 1s; -moz-animation: strech 1s; } " + 
		".consoleDiv ::-webkit-scrollbar { width: 0.5em; } " + 
		".consoleDiv ::-webkit-scrollbar-track { width: 0.5em; background: #363636;  -webkit-border-radius: 10px; border-radius: 10px; } " +
		".consoleDiv ::-webkit-scrollbar-thumb { -webkit-border-radius: 10px; border-radius: 10px; background: #FFFFFF; } " + 
		"@-webkit-keyframes strech { 0%  { width: 0em;	height: 0em; } 100%  { width: 50%; height: 50%; } } @-o-keyframes strech { 0%  { width: 0em; height: 0em; } 100% { width: 50%; height: 50%; } } @-moz-keyframes strech { 0%  { width: 0em; 	height: 0em; } 100%  { 	width: 50%; 	height: 50%; } } " + 
		".output { position: absolute; width: 96%; height: 85%; top: 4%; left: 2%; font-size:12px; z-index: 100001; overflow: auto; overflow-y: auto; overflow-x: hidden; word-wrap: break-word; } " + 
		".input { position: absolute; width: 96%; bottom: 2%; left: 2%; z-index: 100001; background-color: transparent; color: #00B2EE; border-style: solid; border-color: #FFFFFF; border-width: 2px 0px 0px 0px; -webkit-user-select: auto; } " + 
		".inputLog { color: #00B2EE; } " + 
		".normalLog { padding: 0 0 0 15px; color: #00FF00; } " + 
		".errorLog { padding: 0 0 0 15px; color: #FF0000; } " + 
		".warningLog { padding: 0 0 0 15px; color: #FFFF00; } " + 
		".specialLog { padding: 0 0 0 15px; color: #FFFFFF; } " + 
		".parentNodeUL { display: inline; padding: 0; margin: 0; } " + 
		
		".suggestionsContainer { padding: 0 5px 5px 5px; position: absolute; z-index: 100002; background-color: #000000; -webkit-border-bottom-right-radius: 10px; -webkit-border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px; color: #FFFFFF; font-family: 'Consolas'; font-size: 12px; max-height: 25%; overflow-y: auto; } " + 
		".suggestionsContainer::-webkit-scrollbar { width: 0.5em; } " + 
		".suggestionsContainer::-webkit-scrollbar-track { width: 0.5em; background: #363636;  -webkit-border-radius: 10px; border-radius: 10px; } " +
		".suggestionsContainer::-webkit-scrollbar-thumb { -webkit-border-radius: 10px; border-radius: 10px; background: #FFFFFF; } " + 
		".suggestion { cursor: default; } " + 
		".suggestion:hover { color: 00FF00; } " + 
		
		".objectClass { cursor: pointer; display: inline; } " + 
		".listItemClass { list-style: none; padding: 0 0 0 15px; border-left: 1px solid #004400; } " + 
		".plus { position: absolute; top: 0.5em; right: 1.5em; z-index: 100002; color: #FFFFFF; opacity: 0.3; cursor: pointer; -webkit-user-select: none; -o-user-select: none; -moz-user-select: none; } " +
		".plus:hover { opacity: 1; } " +
		".minus { position: absolute; top: 0.5em; right: 2.9em; z-index: 100002; color: #FFFFFF; opacity: 0.3; cursor: pointer; -webkit-user-select: none; -o-user-select: none; -moz-user-select: none; } " +
		".minus:hover { opacity: 1; } " +
		".base64Img { height: 100px; width: auto; z-index: 100001; }";
		var styleTag = document.createElement("style");
		styleTag.type = "text/css";
		styleTag.innerHTML = css;
		document.head.appendChild(styleTag);
		console.populateSuggestions(window);
		console.construct();
		
		window.onerror = function(message, url, linenumber) {
			console.typeOutput("<font color='#FF0000'>ERROR!</font>", message + " (line " + linenumber + ")", "error");
		};
	}

