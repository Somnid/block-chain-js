customElements.define("data-hasher",
	class extends HTMLElement {
		static get observedAttributes(){
			return [];
		}
		constructor(){
			super();
			this.bind(this);
		}
		bind(element){
            element.createShadowDom = element.createShadowDom.bind(element);
			element.attachEvents = element.attachEvents.bind(element);
			element.cacheDom = element.cacheDom.bind(element);
            element.onDataChanged = element.onDataChanged.bind(element);
		}
		connectedCallback(){
            this.createShadowDom();
			this.cacheDom();
			this.attachEvents();
		}
        createShadowDom(){
            this.shadow = this.attachShadow({ mode: "closed" });
            this.shadow.innerHTML = `
                <style>
                    :host { display: block; box-sizing: border-box; }
                    textarea { width: 100%; box-sizing: border-box; height: 200px; }
                    .data {
                        margin-bottom: 10px;
                    }
                    .hash-output {
                        border: 1px solid #ccc;
                        background: #efefef;
                        height: 30px;
                        border-radius: 3px;
                        display: flex;
                        align-items: center;
                        padding: 0px 5px;
                    }
                </style>
				<textarea class="data" spellcheck="off"></textarea>
				<div class="hash-output"></div>
            `;
        }
		cacheDom(){
			this.dom = {};
            this.dom.data = this.shadow.querySelector(".data");
            this.dom.output= this.shadow.querySelector(".hash-output");
		}
		attachEvents(){
            this.dom.data.addEventListener("input", this.onDataChanged);
		}
        async onDataChanged(e){
            this.dom.output.textContent = await BlockChainTools.hashSha256(this.dom.data.value);
        }
		attributeChangedCallback(name, oldValue, newValue){
			this[name] = newValue;
		}
	}
);
