const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// in arrow function when you don't write the {} the code will asign return to function auto
//in other hand when write {} must you write return
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with the same ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
