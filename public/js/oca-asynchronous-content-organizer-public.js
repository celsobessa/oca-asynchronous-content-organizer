// set Event Listeners
// =================================================
'use strict';

var ocaDelayedScripts, ocaQueue;

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
	ocaFetchContent(ocaVars.ajaxUrl, item);
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
		},
		timeout: item.timeout
	});
	
}

function ocaInjectLoader(container, placement, loaderEnable, loaderMessage) {
	jQuery(document).scrollTop();
	console.log('loaderEnable status = ' + loaderEnable);
	if ( true === loaderEnable ){
		console.log('loaderEnable entrou');
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
	console.log('loaderMessage aplicados');
}

function ocaInjectContent(container, placement, loaderEnable, functionName, html) {
	console.log('loaderEnable =' + loaderEnable);
	if ( true === loaderEnable ){
		jQuery('.content-loader').remove();
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
	console.log('html entrou')
	
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