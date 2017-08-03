customElements.define("network-builder",
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
            element.addPeerChain = element.addPeerChain.bind(element);
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
					.peers { }
                </style>
				<div class="peers">
					<slot id="chains"></slot>
				</div>
				<div class="distribution-controls">
					<button class="new-peer">New Peer</button>
					<div class="distribution-validity">Invalid</div>
				</div>
            `;
        }
		cacheDom(){
			this.dom = {};
            this.dom.data = this.shadow.querySelector(".peers");
			this.dom.newPeer = this.shadow.querySelector(".new-peer");
			this.dom.distributionValidity = this.shadow.querySelector(".distribution-validity");
		}
		attachEvents(){
            this.dom.newPeer.addEventListener("click", this.addPeerChain);
		}
        addPeerChain(e){

        }
		attributeChangedCallback(name, oldValue, newValue){
			this[name] = newValue;
		}
	}
);
