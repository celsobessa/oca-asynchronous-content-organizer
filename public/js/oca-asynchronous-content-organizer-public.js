77// set Event Listeners
// =================================================
'use strict';

var ls, lsContent, ocaDelayedScripts, ocaQueue, privileges, ocaDebug = false, cachePrefix = '', removeCachePrefix = '', setCache = false;

function testLocalStorageSet(){
	if (LocalStorage){
		console.log('LocalStorage encontrado pelo testLocalStorageSet');
		ls = LocalStorage;
		console.log(ls);
		ls.setItem('devices', 'testLocalStorageSet data', 3600);
	}
	else{
		console.error('LocalStorage não encontrado pelo testLocalStorageSet');
	}
}

function testLocalStorageGet(){
	if (LocalStorage){
		console.log('LocalStorage encontrado pelo testLocalStorageGet');
		console.log(ls);
		lsContent = ls.getItem('devices');
		console.log(lsContent);
	}
	else{
		console.error('LocalStorage não encontrado pelo testLocalStorageGet');
	}
}

function testLocalStorageCallback(string){
	string = string || 'default string';
	console.log(string);
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

function isUserLogged( callback , item ){
	console.info('isUserLogged');
	console.info('ocaVars.ajaxUrl', ocaVars.ajaxUrl);
	jQuery.ajax({
		url: ocaVars.ajaxUrl,
		data: {
			action: 'is_user_logged_in',
		},
		success: function( response ) {
			console.info('isUserLogged response', response);
			privileges = response;
			console.info('privileges no sucess de ajax', privileges);
			callback(item);
		},
		error: function() {
			return false;
		}
	});
}
function ocaInit(){
	console.info('OcaInit');
	console.info('privileges ocaInit', privileges);
	if ( !ocaVars ){
		return;
	}
	ocaQueue = ocaVars.queue;
	console.info('ocaQueue', ocaQueue);
	if ( 'no queue' === ocaQueue ){
		return;
	}
	ocaProcessQueue(ocaQueue);
}

function ocaProcessQueue(queue) {
	//TODO declare all needed variables
	var ocaItem;
	//TODO iterate over items (over JSON/object or transform into an array before?)
	ocaQueue.forEach(ocaProcessItem);

}

ocaManageCache = function ( item ){
	console.info('ocaManageCache init');
	const frontend_cache = item.frontend_cache;
	let cacheRule = frontend_cache.split('|');
	console.info('cacheRule ', cacheRule );
	console.info('privileges', privileges);
	/*
	 * 													- both: a cache for priv and other nopriv. DON'T purge on change
	 * 													- both|purge: a cache for priv and other nopriv. Purge on change
	 * 													- priv: a cache for priv only. DON'T purge on change
	 * 													- priv|purge: a cache for priv only. Purge on change
	 * 													- nopriv: a cache for nopriv only. DON'T purge on change
	 * 													- nopriv|purge: a cache nofor priv only. Purge on change
	*/
	if ( frontend_cache === 'same' ) {
		cachePrefix = frontend_cache;
		removeCachePrefix = '';
	} else if ( 'priv' === privileges ){
		cachePrefix = frontend_cache + 'priv';
		removeCachePrefix = frontend_cache + 'nopriv';
	} else {
		cachePrefix = frontend_cache + 'nopriv';
		removeCachePrefix = frontend_cache + 'priv';
	}
	if ( frontend_cache !== 'same' && frontend_cache.includes('purge') ) {
		LocalStorage.removeItem('oca-' + removeCachePrefix + '-' + item.jobHash);
		console.info('LocalStorage.removeItem');
		console.info('LocalStorage.getItem após removeItem oca-' + removeCachePrefix + '-' + item.jobHash, LocalStorage.getItem('oca-' + removeCachePrefix + '-' + item.jobHash));
	}
	if ( frontend_cache === 'both' || frontend_cache === 'same' || cacheRule[0] === privileges ){
		var cachedHtml = LocalStorage.getItem('oca-' + cachePrefix + '-' + item.jobHash);
		console.info('cachedHtml', cachedHtml);
		setCache = true;
	} else {
		var cachedHtml = null;
		console.info('cachedHtml null ', cachedHtml);
	}

	if( null !== cachedHtml ){
		var html = cachedHtml;
		ocaInjectContent(item.container, item.placement, item.loaderEnable, item.functionName, html);
		ocaRunCallback(item.callback);

	} else {
		ocaFetchContent(ocaVars.ajaxUrl, item);
	}
}

function ocaProcessItem(item, index, array) {
	console.info('ocaProcessItem init');
	ocaInjectLoader(item.container, item.placement, item.loaderEnable, item.loaderMessage);
	if ( 'none' !== item.frontend_cache && true === LocalStorage.supportsLocalStorage() && false === ocaDebug ) {
		console.log('ocaProcessItem item.frontend_cache !== none');
		isUserLogged( ocaManageCache, item);
	} else {
		console.error('ocaProcessItem item.frontend_cache equals none or localStorage not supported');
		ocaFetchContent(ocaVars.ajaxUrl, item);
	}
}

function ocaFetchContent(ajaxUrl, item ) {
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
			console.info('response', response);
			ocaInjectContent(item.container, item.placement, item.loaderEnable, item.functionName, response);

			//Create JSON string for storage
			var jobStorage = response;
			if( true === setCache ){
				LocalStorage.setItem('oca-' + cachePrefix + '-' + item.jobHash, jobStorage, 3600);
			}
			console.info('localStorage maybe set for ' + 'oca-' + cachePrefix + '-' + item.jobHash, LocalStorage.getItem('oca-' + cachePrefix + '-' + item.jobHash, jobStorage, 3600));
			ocaRunCallback(item.callback);
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
function ocaRunCallback( callback ){
	if ( false === callback ){
		return;
	}
	if (typeof window[callback] === "function"){
		window[callback]();
	}
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