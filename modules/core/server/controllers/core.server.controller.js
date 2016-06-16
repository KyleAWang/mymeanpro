/**
 * Created by Kyle on 6/13/2016.
 */
(function () {
    'use strict';

    var validator = require('validator');


    /**
     * Render the main application page
     */
    exports.renderIndex = function (req, res) {
        var safeUserObject = null;
        if (req.user) {
            safeUserObject = {
                displayName: validator.escape(req.user.displayName),
                provider: validator.escape(req.user.provider),
                username: validator.escape(req.user.username),
                created: req.user.created.toString(),
                roles: req.user.roles,
                profileImageURL: req.user.profileImageURL,
                email: validator.escape(req.user.email),
                lastName: validator.escape(req.user.lastName),
                firstName: validator.escape(req.user.firstName),
                additionalProvidersData: req.user.additionalProvidersData
            };
        }


        res.render('modules/core/server/views/index', {
            user: safeUserObject
        });
    };

}());
 
