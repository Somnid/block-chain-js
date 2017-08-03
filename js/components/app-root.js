customElements.define("app-root",
	class extends HTMLElement {
		static get observedAttributes(){
			return [];
		}
		constructor(){
			super();
			this.bind(this);
			this.init();
		}
		bind(element){
			element.init = element.init.bind(element);
			element.attachEvents = element.attachEvents.bind(element);
			element.cacheDom = element.cacheDom.bind(element);
		}
		init(){
			this.cacheDom();
			this.attachEvents();
		}
		cacheDom(){
			this.dom = {};
		}
		attachEvents(){

		}
		attributeChangedCallback(name, oldValue, newValue){
			this[name] = newValue;
		}
	}
)
