// set Event Listeners
// =================================================
'use strict';

var ocaDelayedScripts, ocaQueue, ocaDebug = false, ls, lsContent;

function testLocalStorageSet(){
	if (LocalStorage){
		console.log('LocalStorage encontrado pelo testLocalStorageSet');
		ls = LocalStorage;
		console.log(ls);
		ls.setItem('devices', 'testLocalStorageSet data', 3600);
	}
	else{
		console.log('LocalStorage não encontrado pelo testLocalStorageSet');
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
		console.log('LocalStorage não encontrado pelo testLocalStorageGet');
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
	if ( !ocaVars ){
		return;
	}
	ocaQueue = ocaVars.queue;
	if ( 'no queue' === ocaQueue ){
		return;
	}
	ocaProcessQueue(ocaQueue);
}

function ocaProcessQueue(queue) {
	//TODO declare all needed variables
	var ocaItem
	//TODO iterate over items (over JSON/object or transform into an array before?)
	ocaQueue.forEach(ocaProcessItem);
	
}

function ocaProcessItem(item, index, array) {
	if (LocalStorage) {
		//console.log('LocalStorage achado');
		//console.log('LocalStorage.supportsLocalStorage igual a ' + LocalStorage.supportsLocalStorage());
		//console.log('ocaDebug ' + ocaDebug);
	}
	if ( LocalStorage && true === LocalStorage.supportsLocalStorage() && false === ocaDebug ) {
		var cachedHtml = LocalStorage.getItem('ocax-' + item.jobHash);
		if( null !== cachedHtml ){
			var html = cachedHtml;
			ocaInjectContent(item.container, item.placement, item.loaderEnable, item.functionName, html);
			ocaRunCallback(item.callback);
		}
		else {
			ocaFetchContent(ocaVars.ajaxUrl, item);
		}
	}
	else {
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
		success: function( html ) {
			ocaInjectContent(item.container, item.placement, item.loaderEnable, item.functionName, html);

			//Create JSON string for storage
			var jobStorage = html;
			LocalStorage.setItem('ocax-' + item.jobHash, jobStorage, 3600)
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