const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must be less than or equal 40 characters'],
      minlength: [10, 'Tour name must be more than or equal 10 characters'],
      // validate: [validator.isAlpha, 'name must be only charactres'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'the difficulty must either:easy,difficult,medium',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
    ratingsAvarage: {
      type: Number,
      default: 4.5,
      min: [1, 'the rating must be above 1.0'],
      max: [5, 'the ratng must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.6666666..... 46....47...4.7
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //(this) is available for only created new documents becouse this.price not allowed when update
          return val < this.price;
        },
        message: 'the priceDiscount ({VALUE}) must be below the regular price',
      },
    },
    description: {
      type: String,
      trim: true,
      summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description'],
      },
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image cover'],
    },
    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Document Middleware before ('save')or .create only
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
// tourSchema.pre('save', function (next) {
//   console.log('the document will save.....');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Query Middleware

//Embbed UserId in tour

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

tourSchema.index({ price: 1, ratingsAvarage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`the query took ${Date.now() - this.start} milliseconds`);
  next();
});

//Aggregition Middleware
// i commented it so the ($geoNear) must be first satge in pipline
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
