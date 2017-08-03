"use strict";

const AppView = (function(){

	function create(){
		let appView = {};
		bind(appView);
		appView.init();
		return appView;
	}

	function bind(appView){
		appView.installServiceWorker = installServiceWorker.bind(appView);
		appView.serviceWorkerInstalled = serviceWorkerInstalled.bind(appView);
		appView.serviceWorkerInstallFailed = serviceWorkerInstallFailed.bind(appView);
		appView.cacheDom = cacheDom.bind(appView);
		appView.attachEvents = attachEvents.bind(appView);
		appView.init = init.bind(appView);

		appView.updateBlockDifficulty = updateBlockDifficulty.bind(appView);
	}

	function installServiceWorker(){
		if("serviceWorker" in navigator){
			navigator.serviceWorker.register("service-worker.js", {scope: "./"})
				.then(this.serviceWorkerInstalled)
				.catch(this.serviceWorkerInstallFailed);
		}
	}

	function serviceWorkerInstalled(registration){
		console.log("App Service registration successful with scope:", registration.scope);
	}

	function serviceWorkerInstallFailed(error){
		console.error("App Service failed to install", error);
	}

	function cacheDom(){
		this.dom = {};
		this.dom.blockDifficulty = this.dom.querySelector(".difficulty");
		this.dom.blockBuilder = this.dom.querySelector("block-builder");
	}

	function attachEvents(){
		this.dom.blockDifficulty.addEventListener("input", this.updateBlockDifficulty);
	}

	function updateBlockDifficulty(){
		this.dom.blockBuilder.difficulty = this.dom.blockDifficulty.value;
	}

	function getQueryData(){
		let searchParams = new URLSearchParams(window.location.search.substr(1));
	}

	function init(){
		this.installServiceWorker();
		this.cacheDom();
		this.attachEvents();
	}

	return {
		create : create
	};

})();
