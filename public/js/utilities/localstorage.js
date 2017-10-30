/**
 * LocalStorage Helper
 *
 * Helper library that allows you to use the localStorage API with more power and flexibility.
 *
 * @class function LocalStorage
 * @module LocalStorage
 *
 * @author Dan Barrett <danb@humaan.com.au>
 * @copyright Humaan 2016
 *
 * @license
 * Copyright (c) 2016 Humaan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var LocalStorage = {
    /**
     * Fetches the value associated with key from localStorage.  If the key/value aren't in localStorage, you can optional provide a callback to run as a fallback getter.
     * The callback will also be run if the localStorage cache has expired.  You can use {@link LocalStorage#setItem} in the callback to save the results from the callback back to localStorage.
     *
     * @example <caption>Fetch from localStorage with no callback and get the response returned.</caption>
     * var response = LocalStorage.getItem('key');
     *
     * @example <caption>Fetch from localStorage and handle response in a callback.</caption>
     * LocalStorage.getItem('key', function(response) {
     *   if (response === null) {
     *     // Nothing in localStorage.
     *   } else {
     *     // Got data back from localStorage.
     *   }
     * });
     *
     * @kind function
     * @function LocalStorage#getItem
     * @author Dan Barrett <danb@humaan.com.au>
     * @copyright Humaan 2016
     * @see http://humaan.com/localstorage-is-for-fun/
     *
     * @param {!string} key - Name of the key in localStorage.
     * @param {?function} [optionalCallback=null] - If you want to handle the response in a callback, provide a callback and check the response.
     * @returns {*} Returns null if localStorage isn't supported, or the key/value isn't in localStorage, returns anything if it was in localStorage, or returns a callback if key/value was empty in localStorage and callback was provided.
     */
    getItem: function (key, optionalCallback) {
        if (!this.supportsLocalStorage()) {
            return null;
        }

        var callback = function (data) {
            data = typeof data !== 'undefined' ? data : null;

            return typeof optionalCallback === 'function' ? optionalCallback(data) : data;
        };

        var value = localStorage.getItem(key);

        if (value !== null) {
            value = JSON.parse(value);

            if (value.hasOwnProperty('__expiry')) {
                var expiry = value.__expiry;
                var now = Date.now();

                if (now >= expiry) {
                    this.removeItem(key);

                    return callback();
                } else {
                    // Return the data object only.
                    return callback(value.__data);
                }
            } else {
                // Value doesn't have expiry data, just send it wholesale.
                return callback(value);
            }
        } else {
            return callback();
        }
    },

    /**
     * Saves an item in localStorage so it can be retrieved later.  This method automatically encodes the value as JSON, so you don't have to.  If you don't supply a value, this method will return false immediately.
     *
     * @example <caption>set localStorage that persists until it is manually removed</caption>
     * LocalStorage.setItem('key', 'value');
     *
     * @example <caption>set localStorage that persists for the next 30 seconds before being busted</caption>
     * LocalStorage.setItem('key', 'value', 30);
     *
     * @kind function
     * @function LocalStorage#setItem
     * @author Dan Barrett <danb@humaan.com.au>
     * @copyright Humaan 2016
     * @see http://humaan.com/localstorage-is-for-fun/
     *
     * @param {!string} key - Name of the key in localStorage.
     * @param {!*} value - Value that should be stored in localStorage.  Must be able to be encoded/decoded as JSON.  Please ensure your object doesn't have the key __expiry as this will accidentally conflict with the expiry handler.
     * @param {?int} [expiry=null] - Time in seconds that the localStorage cache should be considered valid.
     * @returns {boolean} Returns true if it was stored in localStorage, false otherwise.
     */
    setItem: function (key, value, expiry) {
        if (!this.supportsLocalStorage() || typeof value === 'undefined' || key === null || value === null) {
            return false;
        }

        if (typeof expiry === 'number') {
            value = {
                __data: value,
                __expiry: Date.now() + (parseInt(expiry) * 1000)
            };
        }

        try {
            localStorage.setItem(key, JSON.stringify(value));

            return true;
        } catch (e) {
            console.log('Unable to store ' + key + ' in localStorage due to ' + e.name);

            return false;
        }
    },

    /**
     * Removes an item from localStorage.  No need to pay attention to the return value as localStorage doesn't offer a return status on completion.
     *
     * @kind function
     * @function LocalStorage#removeItem
     * @author Dan Barrett <danb@humaan.com.au>
     * @copyright Humaan 2016
     * @see http://humaan.com/localstorage-is-for-fun/
     *
     * @param {!string} key - Name of the key in localStorage.
     * @returns {void} Remove the key/value combo from the localStorage storage container.
     */
    removeItem: function (key) {
        if (this.supportsLocalStorage()) {
            localStorage.removeItem(key);
        }
    },

    /**
     * Remove all items from localStorage.  Takes no parameters and returns nothing.
     *
     * @kind function
     * @function LocalStorage#clear
     * @author Dan Barrett <danb@humaan.com.au>
     * @copyright Humaan 2016
     * @see http://humaan.com/localstorage-is-for-fun/
     *
     * @returns {void} Remove all keys from localStorage
     */
    clear: function () {
        if (this.supportsLocalStorage()) {
            localStorage.clear();
        }
    },

    /**
     * Determines whether the browser supports localStorage or not.
     *
     * This method is required due to iOS Safari in Private Browsing mode incorrectly says it supports localStorage, when it in fact does not.
     *
     * @kind function
     * @function LocalStorage#supportsLocalStorage
     * @author Dan Barrett <danb@humaan.com.au>
     * @copyright Humaan 2016
     * @see http://humaan.com/localstorage-is-for-fun/
     *
     * @returns {boolean} Returns true if setting and removing a localStorage item is successful, or false if it's not.
     */
    supportsLocalStorage: function () {
        try {
            localStorage.setItem('_', '_');
            localStorage.removeItem('_');

            return true;
        } catch (e) {
            return false;
        }
    }
};

// CommonJS module support!
if (typeof module !== 'undefined') {
    module.exports = LocalStorage;
}