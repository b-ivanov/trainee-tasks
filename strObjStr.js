function Open.stringToObject(str_string) {
    if (typeof(str_string) === 'undefined') {
        return;
    }
    var obj_result;
    /*try {
	eval('obj_result = ' + str_string + ';');
	} catch (e) {
	obj_result = null;
	}*/
    try {
        obj_result = (new Function('try { ' +
                '	return ' + str_string + ';' +
                '} catch(e) {' +
                '	return null;' +
                '}'))();
    } catch (e) {
        //			console.log('ERROR:' + str_string);
        return null;
    }
    return obj_result;
}

function Open.objectToString(obj_temp, bool_formattedResult, int_ident, arr_obj_objectPassed) {
    if (typeof(obj_temp) === 'undefined') {
        return;
    }
    var str_result = [];
    var temp;
    var str_leadingTabulators = '';
    temp = typeof(obj_temp);
    temp = temp.toLowerCase();
    if (typeof(int_ident) === 'undefined') {
        var int_ident = 1;
    }
    if (typeof(arr_obj_objectPassed) === 'undefined') {
        var arr_obj_objectPassed = [];
    }
    if (isNaN(parseInt(int_ident))) {
        var int_ident = 1;
    }
    if (bool_formattedResult) {
        str_leadingTabulators = (new Array(int_ident + 1)).join(String.fromCharCode(29))
    }
    switch (temp) {
        case 'number':
        case 'boolean':
            str_result.push(obj_temp.toString());
            break;
        case 'function':
        case 'string':
            str_result.push('"' + obj_temp.replace(/(\"|\\)/gim, '\\$1').replace(/\n/gim, '\\n').replace(/\r/gim, '\\r').replace(/\u2029/gim, '\\u2029').replace(/\u2028/gim, '\\u2028').replace(/\u0000/gim, '\\u0000') + '"');
            break;
        case 'object':
            if (obj_temp == null) {
                str_result.push('null');
            } else {
                for (var counter0 = 0; counter0 < arr_obj_objectPassed.length; counter0++) {
                    if (arr_obj_objectPassed[counter0] === obj_temp) {
                        return 'null';
                    }
                }
                arr_obj_objectPassed.push(obj_temp);
                if (Open.isArray(obj_temp)) {
                    str_result.push('[');
                    for (var counter = 0; counter < obj_temp.length; counter++) {
                        if (counter) {
                            str_result.push(',');
                        }
                        if (bool_formattedResult) {
                            str_result.push('\n' + str_leadingTabulators.slice(0, str_leadingTabulators.length - 1));
                        }
                        str_result.push(Open.objectToString(obj_temp[counter], bool_formattedResult, (int_ident + 1), arr_obj_objectPassed));
                    }
                    if (bool_formattedResult) {
                        str_result.push('\n');
                    }
                    str_result.push(str_leadingTabulators.slice(0, str_leadingTabulators.length - 1) + ']');
                } else {
                    str_result.push(str_leadingTabulators.slice(0, str_leadingTabulators.length - 1) + '{');
                    var counter0 = 0;
                    try {
                        for (temp in obj_temp) {
                            try {
                                typeof(obj_temp[temp]);
                                obj_temp[temp];
                            } catch (e) {
                                continue;
                            }
                            if (counter0++) {
                                str_result.push(',');
                            }
                            if (bool_formattedResult) {
                                str_result.push('\n');
                            }
                            if ((typeof(obj_temp[temp])).toLowerCase() === 'function') {
                                str_result.push(str_leadingTabulators + '"' + temp.replace(/(\"|\\)/gim, '\\$1').replace(/\n/gim, '\\n').replace(/\r/gim, '\\r') + '":' + obj_temp[temp].toString().replace('[native code]', ''));
                            } else {
                                if (str_leadingTabulators !== '') {
                                    str_result.push(str_leadingTabulators + '"' + temp.replace(/(\"|\\)/gim, '\\$1').replace(/\n/gim, '\\n').replace(/\r/gim, '\\r') +
                                        '":' +
                                        Open.objectToString(obj_temp[temp], bool_formattedResult, (int_ident + 1), arr_obj_objectPassed).replace(str_leadingTabulators, ''));
                                } else {
                                    str_result.push(str_leadingTabulators + '"' + temp.replace(/(\"|\\)/gim, '\\$1').replace(/\n/gim, '\\n').replace(/\r/gim, '\\r') +
                                        '":' +
                                        Open.objectToString(obj_temp[temp], bool_formattedResult, (int_ident + 1), arr_obj_objectPassed));
                                }
                            }
                        }
                    } catch (e) {
                        return 'null';
                    }
                    if (bool_formattedResult && counter0) {
                        str_result.push('\n' + str_leadingTabulators.slice(0, str_leadingTabulators.length - 1));
                    }
                    str_result.push('}');
                }
            }
    }
    return str_result.join('');
}

function makeRequest(url, dataObject, callback) {
    var httpRequest = new XMLHttpRequest();
    var params = "data=" + Open.objectToString(dataObject);
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            callback(httpRequest.responseText);
        }
    }
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.send(params);
}