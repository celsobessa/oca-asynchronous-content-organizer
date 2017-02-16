// set Event Listeners
// =================================================
'use strict';

var ocaDelayedScripts, ocaQueue, ocaDebug = false;

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
	if ( storageAvailable('localStorage') && false === ocaDebug ) {
		var cachedHtml = localStorage.getItem('oca-' + item.jobHash);
		if( cachedHtml ){
			var html = JSON.parse(cachedHtml);
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
			var jobStorage = JSON.stringify(html);
			localStorage.setItem('oca-' + item.jobHash, jobStorage);
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