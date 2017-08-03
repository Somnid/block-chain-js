customElements.define("chain-builder",
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
            element.addNewBlock = element.addNewBlock.bind(element);
			element.validateChain = element.validateChain.bind(element);
		}
		connectedCallback(){
            this.createShadowDom();
			this.cacheDom();
			this.attachEvents();
			this.validateChain();
		}
        createShadowDom(){
            this.shadow = this.attachShadow({ mode: "closed" });
            this.shadow.innerHTML = `
                <style>
					* { box-sizing: border-box; }
                    :host { display: block; box-sizing: border-box; }
					.blocks { display: flex; flex-flow: row nowrap; margin-bottom: 10px; }
					::slotted(block-builder) { border: 1px solid #ccc; padding: 5px; margin-right: 10px; width: 250px; }
					::slotted(.broken) { background-color: var(--negative-background); border-color: var(--negative-color); }
					.chain-validity { color: var(--negative-color); }
					.chain-validity.valid { color: var(--positive-color); }
					.new-block { margin-right: 10px; }
					.chain-controls { display: flex; flex-flow: row-wrap; align-items: center; }
                </style>
				<div class="blocks">
					<slot id="block-slot"></slot>
				</div>
				<div class="chain-controls">
					<button class="new-block">New Block</button>
					<div class="chain-validity">Invalid</div>
				</div>
            `;
        }
		cacheDom(){
			this.dom = {};
			this.dom.newBlock = this.shadow.querySelector(".new-block");
			this.dom.chainValidity = this.shadow.querySelector(".chain-validity");
		}
		attachEvents(){
            this.dom.newBlock.addEventListener("click", this.addNewBlock);
			this.querySelectorAll("block-builder").forEach(b => b.addEventListener("hashchanged", this.validateChain));
		}
        addNewBlock(e){
			const block = document.createElement("block-builder");
			const lastBlock = this.querySelector(":last-child");
			this.blockIndex++;

			block.difficulty = lastBlock ? lastBlock.difficulty : 0;
			block.index = lastBlock ? lastBlock.index + 1 : 0;
			block.parent = lastBlock ? lastBlock.hash : "";
			this.lastBlockListener = block.addEventListener("hashchanged", this.validateChain);
			this.appendChild(block);
			this.validateChain();
        }
		async validateChain(){
			const i = 0;
			const blockValidations = await Promise.all([...this.children].map(b => b.validate()));
			let isValid = blockValidations.every(x => x);
			for(let i = 0; i < this.children.length - 1; i++){
				if(this.children[i].hash !== this.children[i+1].parent){
					isValid = false;
					this.children[i+1].classList.add("broken")
				};
			}
			this.dom.chainValidity.textContent = isValid ? "Valid" : "Invalid";
			this.dom.chainValidity.classList.toggle("valid", isValid);
		}
		attributeChangedCallback(name, oldValue, newValue){
			this[name] = newValue;
		}
	}
);
