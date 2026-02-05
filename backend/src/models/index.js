// src/models/index.js
let User, Event, Favorite, Comment;

try {
  User = require('./user.model');
  console.log('✅ user.model.js loaded successfully');
} catch (err) {
  console.error('❌ Error in user.model.js:', err.message);
}

try {
  Event = require('./event.model');
  console.log('✅ event.model.js loaded successfully');
} catch (err) {
  console.error('❌ Error in event.model.js:', err.message);
}

try {
  Favorite = require('./favorites.model');
  console.log('✅ favorites.model.js loaded successfully');
} catch (err) {
  console.error('❌ Error in favorites.model.js:', err.message);
}

try {
  Comment = require('./comments.model');
  console.log('✅ comments.model.js loaded successfully');
} catch (err) {
  console.error('❌ Error in comments.model.js:', err.message);
}

module.exports = { User, Event, Favorite, Comment };
