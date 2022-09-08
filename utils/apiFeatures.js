class APIFeatures{
    constructor(query,queryString){
      this.query=query;
      this.queryString=queryString;
  
    }
    filter(){
      // 1a .Filter 
    const queryObj = {...this.queryString};
    const excludedFields= ['page','sort','limit','fields'];
    excludedFields.forEach(el=>{
      delete queryObj[el]
    });
  
    // 1b.Advanced Filter
    
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`);
    // console.log(JSON.parse(queryStr));
    
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
    }
  
  
    sort(){
      if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join(' ');
        console.log(sortBy)
        this.query = this.query.sort(sortBy)
      }
      else{
        this.query = this.query.sort('-createdAt')
      }
      return this;
    }
  
  
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        console.log(fields)
        this.query = this.query.select(fields);
      }else{
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    paginate(){
      const page = this.queryString.page * 1 || 1;     // * 1 To Make Page Into Number
      const limit = this.queryString.limit * 1 || 100; // to define the no.of data to show  
      const skip = ( page - 1 ) * limit;        // to define the np.of data to skip 
  
  
      this.query = this.query.skip(skip).limit(limit)      
  
      // if(req.query.page){
      //   const numTours = await Tour.countDocuments(); 
      //   if(skip >= numTours) throw new Error('This page does not exist')
      // }
      return this;
    }
  
  }

  module.exports = APIFeatures;