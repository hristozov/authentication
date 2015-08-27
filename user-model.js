var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    UserSchema = new Schema({
        username: {type: String},
        password: {type: String}
    });

function UserModel(connection) {
  this.model = connection.model('User', UserSchema, 'users');
}

UserModel.prototype.findByUsername = function(username, callback) {
  this.model
    .findOne({
      username: username
    })
    .lean()
    .exec(callback);
};

module.exports = UserModel;
