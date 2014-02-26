/*
 * $Id$
 *  -*-  indent-tabs-mode:nil -*-
 * Copyright 2013, Juniper Network Inc.
 * All rights reserved.
 * This SOFTWARE is licensed under the LICENSE provided in the
 * Copyright file. By downloading, installing, copying, or otherwise
 * using the SOFTWARE, you agree to be bound by the terms of that
 * LICENSE.
 */

// Create Clira as Ember application instance
window.Clira = Em.Application.create();

// Put jQuery UI in its own namespace.
JQ = Em.Namespace.create();

/*
 * Create a new mixin for jQuery UI widgets using the Ember 
 * mixin syntax.
 */
JQ.Widget = Em.Mixin.create({
    didInsertElement: function() {
        /*
         * Make jQuery UI options available as Ember properties and delegate
         * UI events to this ember view
         */
        var options = this._gatherOptions();
        this._gatherEvents(options);

        /*
         * Create an instance of jQuery UI widget and save as property on Ember
         * View
         */
        var ui = jQuery.ui[this.get('uiType')](options, this.get('element'));
        this.set('ui', ui);
    },

    willDestroyElement: function() {
        var ui = this.get('ui');

        if (ui) {
            /*
             * Tear down any observers that were created to make jQuery UI 
             * options available as Ember properties.
             */
            var observers = this._observers;
            for (var prop in observers) {
                if (observers.hasOwnProperty(prop)) {
                    this.removeObserver(prop, observers[prop]);
                }
            }
            ui._destroy();
        }
    },

    /*
     * Each jQuery UI widget has a series of options that can be configured. 
     * For instance, to disable a button, you call 
     * `button.options('disabled', true)` in jQuery UI. To make this compatible 
     * with Ember bindings, any time the Ember property for a given jQuery UI 
     * option changes, we update the jQuery UI widget.
     */
    _gatherOptions: function() {
        var uiOptions = this.get('uiOptions'), options = {};

        /*
         * The view can specify a list of jQuery UI options that should be 
         * treated as Ember properties.
         */
        uiOptions.forEach(function(key) {
            options[key] = this.get(key);

            /*
             * Set up an observer on the Ember property. When it changes, 
             * call jQuery UI's `option` method to reflect the property onto 
             * the jQuery UI widget.
             */
            var observer = function() {
                var value = this.get(key);
                this.get('ui').option(key, value);
            };

            this.addObserver(key, observer);

            // Insert the observer in a Hash so we can remove it later.
            this._observers = this._observers || {};
            this._observers[key] = observer;
        }, this);

        return options;
    },

    /*
     * Each jQuery UI widget has a number of custom events that they can 
     * trigger. For instance, the progressbar widget triggers a `complete` 
     * event when the progress bar finishes. Make these events behave like 
     * normal Ember events. For instance, a subclass of JQ.ProgressBarView 
     * could implement the `complete` method to be notified when the jQuery 
     * UI widget triggered the event.
     */
    _gatherEvents: function(options) {
        var uiEvents = this.get('uiEvents') || [], self = this;

        uiEvents.forEach(function(event) {
            var callback = self[event];

            if (callback) {
                /*
                 * You can register a handler for a jQuery UI event by passing 
                 * it in along with the creation options. Update the options 
                 * hash to include any event callbacks.
                 */
                options[event] = function(event, ui) { 
                    callback.call(self, event, ui);
                };
            }
        });
    }
});

jQuery(function ($) {
    // Load command files and display welcome screen when done
    $.clira.loadCommandFiles().done(function() {
        var content = {
            command: 'Welcome',
            completed: false,
            commandNumber: 0,
            context: this,
        };
        $.clira.executeCommand('show welcome screen', content);
    });

    $.clira.prefsInit();
});
