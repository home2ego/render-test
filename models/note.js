const config = require('../utils/config');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false); // true — unknown fields while filtering will be neglected — Note.find({ hobby: "GYM" })) => Note.find({})

mongoose
  .connect(config.MONGODB_URL, { family: 4 })
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message));

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: [5, '{VALUE} is shorter than the minimum required length (5)'],
  },
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Note', noteSchema);
