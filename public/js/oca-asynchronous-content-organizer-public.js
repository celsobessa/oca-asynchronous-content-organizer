// set Event Listeners
// =================================================
'use strict';

var ls, lsContent, ocaDelayedScripts, ocaQueue, userData, privileges = false, ocaDebug = false, manageCache = true, cachePrefix = '', removeCachePrefix = '', setCache = false, cacheExpiration = 3600;
//consolelog('privileges after declaration', privileges);
function testLocalStorageSet(){
	if (LocalStorage){
		//consolelog('LocalStorage found by testLocalStorageSet');
		ls = LocalStorage;
		//consolelog(ls);
		ls.setItem('devices', 'testLocalStorageSet data', 3600);
	}
	else{
		//consoleerror('LocalStorage not found by testLocalStorageSet');
	}
}

function testLocalStorageGet(){
	if (LocalStorage){
		//consolelog('LocalStorage not found by testLocalStorageGet');
		//consolelog(ls);
		lsContent = ls.getItem('devices');
		//consolelog(lsContent);
	}
	else{
		//consoleerror('LocalStorage not found by testLocalStorageGet');
	}
}

function testLocalStorageCallback(string){
	string = string || 'default string';
	//consolelog(string);
}

function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}

/* deprecate
function isUserLoggedBak( callback , item ){
	//consoleinfo('isUserLogged');
	//consoleinfo('ocaVars.ajaxUrl', ocaVars.ajaxUrl);
	jQuery.ajax({
		url: ocaVars.ajaxUrl,
		data: {
			action: 'is_user_logged_in',
		},
		success: function( response ) {
			//consoleinfo('isUserLogged response', response);
			privileges = response;
			//consoleinfo('privileges after isUserLogged ajax success', privileges);
			callback(item);
		},
		error: function() {
			return false;
		}
	});
}*/

function ocaInit() {
	//consoleinfo('OcaInit');
	if ( !ocaVars || 'no queue' === ocaVars.queue){
		return;
	}
	ocaQueue = ocaVars.queue;
	//consoleinfo('ocaQueue', ocaQueue);
	jQuery.ajax({
		url: ocaVars.ajaxUrl,
		data: {
			action: 'is_user_logged_in',
		},
		success: function (response) {
			//consoleinfo('OCA checked user status', response);
			userData = response.data.userData;
			privileges = response.data.userStatus;
			//consoleinfo('OCA checked user status and privileges equal response.data.status', privileges);
			if ( false === privileges || 'string' !== typeof privileges) {
				//consoleinfo('OCA privileges false or not string');
				return;
			}
			ocaProcessQueue(ocaQueue);
		},
		error: function () {
			//consoleinfo('OCA could not check user status');
			return false;
		},
		timeout: 20000,
	});
}

function ocaProcessQueue(queue) {
	//TODO declare all needed variables
	var ocaItem;
	//TODO iterate over items (over JSON/object or transform into an array before?)
	ocaQueue.forEach(ocaProcessItem);

}

var ocaManageCache = function ( item ){
	//consoleinfo('ocaManageCache init for job = ', item.jobHash);
	//consoleinfo('item.frontendCachePriv ', item.frontendCachePriv);
	//consoleinfo('item.frontendCacheNopriv ', item.frontendCacheNopriv);
	const cacheRulePriv = item.frontendCachePriv;
	const cacheRuleNopriv = item.frontendCacheNopriv;
	//consoleinfo('cacheRulePriv ', cacheRulePriv);
	//consoleinfo('cacheRuleNopriv', cacheRuleNopriv);
	//consoleinfo('privileges', privileges);
	if ( 'priv' === privileges ){
		cachePrefix = 'priv';
		removeCachePrefix = 'nopriv';
	} else {
		cachePrefix = 'nopriv';
		removeCachePrefix = 'priv';
	}
	//consolelog('cachePrefix for job ' + item.jobHash + ' = ', cachePrefix);
	if ( ( 'priv' === privileges && 'purgeonchange' === cacheRuleNopriv ) || ( 'nopriv' === privileges && 'purgeonchange' === cacheRulePriv ) )  {
		LocalStorage.removeItem('oca-' + removeCachePrefix + '-' + item.jobHash);
		//consoleinfo('LocalStorage.removeItem');
		//consoleinfo('LocalStorage.getItem after removeItem oca-' + removeCachePrefix + '-' + item.jobHash, LocalStorage.getItem('oca-' + removeCachePrefix + '-' + item.jobHash));
	}
	if ( true === cacheRulePriv || true === cacheRuleNopriv || 'purgeonchange' === cacheRulePriv || 'purgeonchange' === cacheRuleNopriv ){
		var cachedHtml = LocalStorage.getItem('oca-' + cachePrefix + '-' + item.jobHash);
		//consoleinfo('cachedHtml = ', cachedHtml);
		setCache = true;
		//consoleinfo('setCache = ', setCache);
	} else {
		var cachedHtml = null;
		setCache = false;
		//consoleinfo('cachedHtml null ', cachedHtml);
	}

	if( null !== cachedHtml ){
		var html = cachedHtml;
		ocaInjectContent(item.container, item.placement, item.loaderEnable, item.functionName, html);
		ocaItemIsProcessed(item, 'success');
		ocaRunCallback(item.callback);

	} else {
		ocaFetchContent(ocaVars.ajaxUrl, item, setCache, cachePrefix);
	}
}

var ocaManageCacheBak = function ( item ){
	//consoleinfo('ocaManageCache init for job = ', item.jobHash);
	//consoleinfo('item.frontend_cache ', item.frontend_cache );
	const cacheRule = item.frontend_cache.split('|');
	//consoleinfo('cacheRule ', cacheRule );
	//consoleinfo('privileges', privileges);
	if ( cacheRule[0] === 'same' ) {
		cachePrefix = cacheRule[0];
		removeCachePrefix = '';
	} else if ( 'priv' === privileges ){
		cachePrefix = 'priv';
		removeCachePrefix = 'nopriv';
	} else {
		cachePrefix = 'nopriv';
		removeCachePrefix = 'priv';
	}
	//consolelog('cachePrefix for job ' + item.jobHash + ' = ', cachePrefix);
	if ( cacheRule[0] !== 'same' && 'purge' === cacheRule[1] ) {
		LocalStorage.removeItem('oca-' + removeCachePrefix + '-' + item.jobHash);
		//consoleinfo('LocalStorage.removeItem');
		//consoleinfo('LocalStorage.getItem after removeItem oca-' + removeCachePrefix + '-' + item.jobHash, LocalStorage.getItem('oca-' + removeCachePrefix + '-' + item.jobHash));
	}
	if ( cacheRule[0] === 'both' || cacheRule[0] === 'same' || cacheRule[0] === privileges ){
		var cachedHtml = LocalStorage.getItem('oca-' + cachePrefix + '-' + item.jobHash);
		//consoleinfo('cachedHtml = ', cachedHtml);
		setCache = true;
		//consoleinfo('setCache = ', setCache);
	} else {
		var cachedHtml = null;
		setCache = false;
		//consoleinfo('cachedHtml null ', cachedHtml);
	}

	if( null !== cachedHtml ){
		var html = cachedHtml;
		ocaInjectContent(item.container, item.placement, item.loaderEnable, item.functionName, html);
		ocaItemIsProcessed(item, 'success');
		ocaRunCallback(item.callback);

	} else {
		ocaFetchContent(ocaVars.ajaxUrl, item, setCache, cachePrefix);
	}
}

function ocaProcessItem(item, index, array) {
	//consoleinfo('ocaProcessItem init');
	//consoleinfo('ocaProcessItem item.frontendCachePriv ', item.frontendCachePriv);
	//consoleinfo('ocaProcessItem item.frontendCacheNopriv ', item.frontendCacheNopriv);
	//consoleinfo('ocaProcessItem LocalStorage.supportsLocalStorage ', LocalStorage.supportsLocalStorage() );
	//consoleinfo('ocaProcessItem ocaDebug ', ocaDebug);

	// bail if  the user has privileges and function_name is bypass
	if ( 'priv' === privileges && 'bypass' === item.function_name ){
		ocaItemIsProcessed(item, 'bypass');
		return '';
	}

	// bail if the user has no privileges and nopriv_function_name is bypass;
	if ( 'nopriv' === privileges && 'bypass' === item.nopriv_function_name ) {
		ocaItemIsProcessed(item, 'bypass');
		return '';
	}

	// bail if the user has no privileges, nopriv_function_name empty and function_name is bypass
	if ( 'nopriv' === privileges && '' === item.nopriv_function_name && 'bypass' === item.function_name ) {
		ocaItemIsProcessed(item, 'bypass');
		return '';
	}

	if ( item.cacheExpiration && item.cacheExpiration === parseInt(item.cacheExpiration, 10) ){
		cacheExpiration = item.cacheExpiration;
	}
	jQuery(item.container).addClass('oca-waiting');
	if ( ocaQueue < 3 && '' !== item.loaderMessageWhile ){
		item.loaderMessage = item.loaderMessageWhile;
	}
	ocaInjectLoader(item.container, item.placement, item.loaderEnable, item.loaderMessage);

	// check if item.frontendCacheNopriv or item.frontendCachePriv is not false
	// check if debug mode is off
	// check if local storage is supported
	if ( true === ocaDebug || true !== LocalStorage.supportsLocalStorage() ){
		manageCache = false;
	}
	if ( false === item.frontendCacheNopriv && 'nopriv' === privileges ) {
		manageCache = false;
	}
	if ( false === item.frontendCachePriv && 'priv' === privileges) {
		manageCache = false;
	}
	if ( manageCache === true ){
		//consoleinfo('manageCache === true');
		ocaManageCache(item);
	} else {
		//consoleinfo('manageCache !== true');
		ocaFetchContent(ocaVars.ajaxUrl, item, false);
	}
}

function ocaFetchContent(ajaxUrl, item, setCache, cachePrefix) {
	//consoleinfo('ocaFetchContent of jobHash', item.jobHash);
	//consoleinfo('setCache in ocaFetchContent', setCache);
	//consoleinfo('cachePrefix in ocaFetchContent', cachePrefix);
	setCache = setCache || false;
	cachePrefix = cachePrefix || '';
	jQuery.ajax({
		url: ajaxUrl,
		type: 'post',
		data: {
			action: 'oca_fetcher',
			function_name: item.functionName,
			function_args: item.functionArgs,
			function_output: item.functionOutput,
			nopriv_function_name: item.noprivFunctionName,
			nopriv_function_args: item.noprivFunctionArgs,
			nopriv_function_output: item.noprivFunctionOutput,
		},
		success: function( response ) {
			//consoleinfo('ajax success for item.jobHash ' + item.jobHash);
			//consoleinfo('cachePrefix in ajax success', cachePrefix);
			//consoleinfo('setCache in ajax success', setCache);
			//consoleinfo('response', response);
			ocaInjectContent(item.container, item.placement, item.loaderEnable, item.functionName, response);

			//Create JSON string for storage
			var jobStorage = response;
			//consolelog('setCache status for ajax success' + setCache);
			if( true === setCache ){
				//consolelog('setCache true');
				LocalStorage.setItem('oca-' + cachePrefix + '-' + item.jobHash, jobStorage, cacheExpiration);
				//consoleinfo('localStorage maybe set for ' + 'oca-' + cachePrefix + '-' + item.jobHash, LocalStorage.getItem('oca-' + cachePrefix + '-' + item.jobHash));
			} else {
				//consoleinfo('localStorage NOT set for ' + 'oca-' + cachePrefix + '-' + item.jobHash, LocalStorage.getItem('oca-' + cachePrefix + '-' + item.jobHash));
			}
			ocaRunCallback(item.callback);
			ocaItemIsProcessed(item, 'success');
		},
		timeout: item.timeout
	});

}

function ocaInjectLoader(container, placement, loaderEnable, loaderMessage) {
	if ( true === loaderEnable){
		loaderMessage = '<div class="content-loader">' + loaderMessage + '</div>'
		if ( 'prepend' === placement ){
			jQuery(container).prepend( loaderMessage );
		}
		else if ( 'replace' === placement ){
			jQuery(container).html( loaderMessage );
		}
		else {
			jQuery(container).append( loaderMessage );
		}

	}
}

function ocaInjectContent(container, placement, loaderEnable, functionName, html) {
	if ( true === loaderEnable ){
		jQuery('.content-loader').remove();
	}
	if( 'bypass' === html){
		return;
	}
	if ( 'prepend' === placement ){
		jQuery(container).prepend( html );
	}
	else if ( 'replace' === placement ){
		jQuery(container).html( html );
	}
	else {
		jQuery(container).append( html );
	}

}
function ocaItemIsProcessed(item, itemStatus) {
	var itemStatus = itemStatus || '';
	jQuery( item.container ).removeClass( 'oca-waiting' );
	if ('error' === itemStatus) {
		//consolelog('oca-error for item = ' + item.jobHash);
		jQuery( item.container ).addClass( 'oca-error' );
	} else if ( 'success' === itemStatus) {
		//consolelog('oca-success for item = ' + item.jobHash);
		jQuery( item.container ).addClass( 'oca-loaded') ;
	} else if ( 'bypass' === itemStatus) {
		//consolelog('oca-success for item = ' + item.jobHash);
		jQuery( item.container ).addClass( 'oca-bypassed') ;
	} else {
		//consolelog('oca-unknown for item = ' + item.jobHash);
		jQuery( item.container ).addClass( 'oca-unknown-status') ;
	}
}
function ocaRunCallback( callback ){
	//consolelog('ocaRunCallback init');
	//consolelog('ocaRunCallback callback =', callback);
	//consolelog('ocaRunCallback userData =', userData);
	if ( false === callback ){
		return;
	}
	if (typeof window[callback] === "function"){
		window[callback](userData);
	}
	return;
}
if ( window.addEventListener ) {
	window.addEventListener('load', ocaDelayedScripts, false);
}
else if (window.attachEvent) {
	window.attachEvent("onload", ocaDelayedScripts);
}
else {
	window.onload = ocaDelayedScripts();
};
function ocaDelayedScripts(){
	ocaInit();
};