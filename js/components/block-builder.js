customElements.define("block-builder",
	class extends HTMLElement {
		static get observedAttributes(){
			return ["hash", "index", "nonce", "previous", "data"];
		}
		constructor(){
			super();
			this.state = {};
			this.bind(this);
		}
		bind(element){
            element.createShadowDom = element.createShadowDom.bind(element);
			element.attachEvents = element.attachEvents.bind(element);
			element.cacheDom = element.cacheDom.bind(element);
            element.onBlockChanged = element.onBlockChanged.bind(element);
			element.mine = element.mine.bind(element);
			element.validate = element.validate.bind(element);
		}
		connectedCallback(){
            this.createShadowDom();
			this.cacheDom();
			this.attachEvents();
			this.onBlockChanged();
		}
        createShadowDom(){
            this.shadow = this.attachShadow({ mode: "closed" });
            this.shadow.innerHTML = `
                <style>
					* { box-sizing: border-box; }
                    :host { display: block; box-sizing: border-box; }
                    textarea { width: 100%; height: 200px; }
					input { display: block; width: 100%;  }
                    .data { margin-bottom: 10px; }
                    .hash-output { border: 1px solid var(--negative-color); background: var(--negative-background);
                        height: 30px; border-radius: 3px; display: flex; align-items: center; padding: 0px 5px;
						margin-bottom: 10px; overflow: hidden;
                    }
					.hash-output.valid { border-color: var(--positive-color); background: var(--positive-background);}
                </style>
				<label>Index</label>
				<input type="text" class="index" placeholder="index" value="${this.index}" />
				<label>Nonce</label>
				<input type="text" class="nonce" placeholder="nonce" value="${this.nonce}" />
				<label>Parent</label>
				<input type="text" class="parent" placeholder="parent" value="${this.parent}" />
				<label>Difficulty</label>
				<input type="text" class="difficulty" placeholder="difficulty" value="${this.difficulty}" />
				<label>Data</label>
				<textarea class="data" spellcheck="off" placeholder="data" value="${this.data}"></textarea>
				<div class="hash-output">${this.hash}<button class="copy">C</button></div>
				<button class="mine">Mine</button>
            `;
        }
		cacheDom(){
			this.dom = {};
			this.dom.index = this.shadow.querySelector(".index");
			this.dom.nonce = this.shadow.querySelector(".nonce");
			this.dom.parent = this.shadow.querySelector(".parent");
			this.dom.difficulty = this.shadow.querySelector(".difficulty");
            this.dom.data = this.shadow.querySelector(".data");
            this.dom.output= this.shadow.querySelector(".hash-output");
			this.dom.mine = this.shadow.querySelector(".mine");
			this.dom.copy = this.shadow.querySelector(".copy");
		}
		attachEvents(){
            this.dom.data.addEventListener("input", e => {
				this.data = e.target.value;
			});
			this.dom.index.addEventListener("input", e => {
				this.index = e.target.value;
			});
			this.dom.parent.addEventListener("input", e => {
				this.parent = e.target.value;
			});
			this.dom.nonce.addEventListener("input", e => {
				this.nonce = e.target.value;
			});
			this.dom.difficulty.addEventListener("input", e => {
				this.difficulty = e.target.value;
			});
			this.dom.mine.addEventListener("click", this.mine);
			this.dom.copy.addEventListener("click", Util.copy.bind(this));
		}
        async onBlockChanged(){
			const block = {
				index : this.index,
				nonce : this.nonce,
				parent : this.parent,
				data : this.data,
				difficulty: this.difficulty,
			};
			this.hash = await BlockChainTools.hashSha256(JSON.stringify(block));
        }
		async mine(){
			let hash;
			let nonce = -1;
			let block = {
				index : this.index,
				nonce,
				parent : this.parent,
				data : this.data,
				difficulty: this.difficulty
			};
			do {
				nonce++;
				block.nonce = nonce;
				hash = await BlockChainTools.hashSha256(JSON.stringify(block));
			} while(!hash.startsWith("0".repeat(this.difficulty)));

			this.hash = hash;
			this.nonce = nonce;
		}
		raiseEvent(eventName, payload){
			const event = document.createEvent("HTMLEvents");
			event.initEvent(eventName, true, true);
			event.data = payload;
			this.dispatchEvent(event);
		}
		attributeChangedCallback(name, oldValue, newValue){
			this[name] = newValue;
		}
		async validate(){
			const block = {
				index : this.index,
				nonce : this.nonce,
				parent : this.parent,
				data : this.data,
				difficulty: this.difficulty,
			};
			const hash = await BlockChainTools.hashSha256(JSON.stringify(block));
			return hash.startsWith("0".repeat(this.difficulty));
		}
		set hash(value){
			this.state.hash = value;
			if(this.dom){
				this.dom.output.textContent = value;
				this.dom.output.classList.toggle("valid", value.startsWith("0".repeat(this.difficulty)));
			}
			this.raiseEvent("hashchanged", value);
		}
		get hash(){
			return this.state.hash || "";
		}
		set nonce(value){
			this.state.nonce = value;
			if(this.dom){
				this.dom.nonce.value = value;
			}
			this.onBlockChanged();
		}
		get nonce(){
			return this.state.nonce || "";
		}
		set difficulty(value){
			this.state.difficulty = parseInt(value);
			if(this.dom){
				this.dom.difficulty.value = value;
			}
			this.onBlockChanged();
		}
		get difficulty(){
			return this.state.difficulty || 0;
		}
		set index(value){
			this.state.index = value;
			if(this.dom){
				this.dom.index.value = value;
			}
			this.onBlockChanged();
		}
		get index(){
			return this.state.index || 0;
		}
		set data(value){
			this.state.data = value;
			if(this.dom){
				this.dom.data.value = value;
			}
			this.onBlockChanged();
		}
		get data(){
			return this.state.data || "";
		}
		set parent(value){
			this.state.parent = value;
			if(this.dom){
				this.dom.parent.value = value;
			}
			this.onBlockChanged();
		}
		get parent(){
			return this.state.parent || "";
		}
	}
);
