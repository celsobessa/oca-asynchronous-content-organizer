77// set Event Listeners
// =================================================
'use strict';

var ls, lsContent, ocaDelayedScripts, ocaQueue, ocaDebug = false, privileges;

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

function ocaInit(){
	console.info('OcaInit');
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

function ocaManageCache( frontend_cache, item ){
	console.info('ocaManageCache init');
	// same (the same fache for priv and no priv)
	// both (different caches for priv and nopriv. DONT Purge on change);
	// bothpurge (different caches for priv and nopriv. Purge on change);
	// priv (cache only for priv. Dont purge on change);
	// privpurge (cache only for priv. Purge on change);
	// nonpriv (cache only for non-priv. Dont purge on change);
	// nonprivpurge (cache only for non-priv. Purge on change);

	LocalStorage.removeItem('oca-' + frontend_cache + '-' + item.jobHash);
	console.info('LocalStorage.removeItem');

	var cachedHtml = LocalStorage.getItem('oca-' + frontend_cache + '-' + item.jobHash);
	console.info('cachedHtml', cachedHtml);

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
	if ( 'none' !== item.frontend_cache && true === LocalStorage.supportsLocalStorage() && false === ocaDebug ) {
		console.log('ocaProcessItem item.frontend_cache !== none');
		ocaManageCache( item.frontend_cache, item );
	} else {
		console.error('ocaProcessItem item.frontend_cache different from none');
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
		beforeSend: ocaInjectLoader(item.container, item.placement, item.loaderEnable, item.loaderMessage),
		success: function( response ) {
			console.info('response', response);
			console.info('typeof response', typeof response);
			ocaInjectContent(item.container, item.placement, item.loaderEnable, item.functionName, response);

			//Create JSON string for storage
			var jobStorage = response.payload;
			LocalStorage.setItem('oca-' + item.frontend_cache + '-' + item.jobHash, jobStorage, 3600);
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