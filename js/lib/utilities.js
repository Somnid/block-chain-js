"use strict";
const Util = (function() {

    function copy(element) {
        if(!document.queryCommandEnabled('copy')){
            console.log('copy not enabled');
			return;
        }

        element.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.log('execCommand Error', err);
        }
    }

	return {
		copy
	};

})();
