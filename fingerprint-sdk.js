// fingerprint-sdk.js

(function (global) {
    /**
     * Loads the FingerprintJS library asynchronously.
     *
     * @returns {Promise<object>} The loaded FingerprintJS library instance.
     */
    function loadFingerprintJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js'; // CDN for FingerprintJS
            script.async = true;
            script.crossOrigin = 'anonymous'; // Ensure cross-domain compatibility
            script.onload = () => {
                if (window.FingerprintJS) {
                    resolve(window.FingerprintJS);
                } else {
                    reject(new Error('Failed to load FingerprintJS'));
                }
            };
            script.onerror = () => reject(new Error('Error loading FingerprintJS script'));
            document.head.appendChild(script);
        });
    }

    /**
     * Initializes the FingerprintJS library and retrieves the fingerprint.
     *
     * @returns {Promise<{ visitorId: string, components: object, userAgent: string }>} The fingerprint data, including visitorId, components, and userAgent.
     */
    function getFingerprint() {
        return loadFingerprintJS().then(FingerprintJS => {
            return FingerprintJS.load().then(fp => fp.get()).then(result => {
                return {
                    visitorId: result.visitorId,
                    components: result.components,
                    userAgent: navigator.userAgent,
                };
            });
        });
    }

    /**
     * The FP object for initializing and retrieving fingerprint data.
     */
    global.FP = {
        /**
         * Initializes the SDK and prints the fingerprint to the console.
         */
        init: function () {
            getFingerprint()
                .then(fingerprint => {
                    console.log('Visitor ID:', fingerprint.visitorId);
                    console.log('Components:', fingerprint.components);
                })
                .catch(error => {
                    console.error('Error initializing FingerprintJS:', error);
                });
        },

        /**
         * Retrieves the fingerprint data programmatically.
         * @returns {Promise<{ visitorId: string, components: object }>}
         */
        getFingerprint: getFingerprint,
    };
})(window);
