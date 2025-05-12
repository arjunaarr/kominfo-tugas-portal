
# Models Directory

This directory is prepared for future database models.

When adding database connectivity, you can define your models here.
For example:

```js
// Example User model using Mongoose (for MongoDB)
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
```

Or, if using SQL databases with Sequelize:

```js
// Example User model using Sequelize (for SQL databases)
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });
  
  return User;
};
```
