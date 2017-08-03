const BlockChainTools = (function(){

    async function hashSha256(text){
        const hash = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(text));
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
    }

    return {
        hashSha256
    };

})();
