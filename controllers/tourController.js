const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    // 1a .Filter 
    const queryObj = {...req.query}
    const excludedFields= ['page','sort','limit','fields'];
    excludedFields.forEach(el=>{
      delete queryObj[el]
    })
    // 1b.Advanced Filter
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`);
    console.log(JSON.parse(queryStr));

    
    let query = Tour.find(JSON.parse(queryStr));
    // 2.Sorting 
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy)
      query = query.sort(sortBy)
    }
    else{
      query = query.sort('-createdAt')
    }

    // 3.limiting Fields
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      console.log(fields)
      query = query.select(fields);
    }else{
      query = query.select('-__v');
    }

    // Pagination

    const page = req.query.page * 1 || 1;     // * 1 To Make Page Into Number
    const limit = req.query.limit * 1 || 100; // to define the no.of data to show  
    const skip = ( page - 1 ) * limit;        // to define the np.of data to skip 


    query = query.skip(skip).limit(limit)      

    if(req.query.page){
      const numTours = await Tour.countDocuments(); 
      if(skip >= numTours) throw new Error('This page does not exist')
    }

    const tours = await query;
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    console.log(err)
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    console.log(req.params.id);
    const tour = await Tour.findById(req.params.id);
    console.log(tour);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator:true 
    });
    res.status(200).json({
      status: "success",
      data: {
        tour
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req,res) => {
  try{ 
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  }catch(err){
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
