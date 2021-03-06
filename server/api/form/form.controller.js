'use strict';

var _ = require('lodash');
var Form = require('./form.model');
var User = require('../user/user.model');

// Get list of forms
exports.index = function(req, res) {
  Form.find(function (err, forms) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(forms);
  });
};

// Get list of forms for the authenticated user
exports.show_mine = function(req, res) {
  var userId = req.user._id;
  User.findById(userId, function (err, user) {
    Form.find({$or: [{roles: {$in: user.roles}}, {clas: {$in: user.classes}}]}, function (err, forms) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(forms);
    });
  });
};

// Get a single form
exports.show = function(req, res) {
  Form.findById(req.params.id, function (err, form) {
    if(err) { return handleError(res, err); }
    if(!form) { return res.status(404).send('Not Found'); }
    return res.json(form);
  });
};

// Creates a new form in the DB.
exports.create = function(req, res) {
  Form.create(req.body, function(err, form) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(form);
  });
};

// Updates an existing form in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Form.findById(req.params.id, function (err, form) {
    if (err) { return handleError(res, err); }
    if(!form) { return res.status(404).send('Not Found'); }
    var updated = _.extend(form, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(form);
    });
  });
};

// Deletes a form from the DB.
exports.destroy = function(req, res) {
  Form.findById(req.params.id, function (err, form) {
    if(err) { return handleError(res, err); }
    if(!form) { return res.status(404).send('Not Found'); }
    form.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
