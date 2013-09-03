/*
 * $Id$
 *  -*-  indent-tabs-mode:nil -*-
 * Copyright 2013, Juniper Network Inc.
 * All rights reserved.
 * This SOFTWARE is licensed under the LICENSE provided in the
 * ../../../Copyright file. By downloading, installing, copying, or otherwise
 * using the SOFTWARE, you agree to be bound by the terms of that
 * LICENSE.
 */

jQuery(function($) {
    jQuery.clira.commandFile({
        name: "history",
        templatesFile: '/clira/templates/history.hbs',
        commands: [
            {
                command: "show command history",
                help: "Display list of all the commands executed along with "
                    + "timestamp",
                templateName: "show-history",
                execute: function ($output, cmd, parse, poss) {
                    var output = {
                        history: Clira.CommandHistoryController.create({
                            content: Clira.CommandHistory.find()
                        })
                    };
                    return output;
                }
            },
            {
                command: "clear command history",
                help: "Clears history of executed commands",
                templateName: "clear-history",
                execute: function ($output, cmd, parse, poss) {
                    var output = {};
                    Clira.CommandHistory.deleteAll().then($.proxy(function() {
                        output.message = "Successfully cleared history";
                        output.type = "success";
                    }, this), function(err) {
                        output.message = "Failed to clear history";
                        output.type = "error";
                    });
                    return output;
                }
            }
        ]
    });
});
