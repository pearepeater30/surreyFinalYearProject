const Business = require('../models/business')

exports.getBusinesses = async (req,res,next) => {
  try {
    const businesses = await Business.find();

    return res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  }
  catch (err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.postBusinesses = async (req,res,next) => {
  try {
    const business = await Business.create({ businessName: req.body.businessName, businessOwner: req.body.businessOwner /**req.user.ObjectId */, address: req.body.address});
    
    return res.status(200).json({
      success: true,
      data: business
    })
  }
  catch (err){
    console.log(err);
  }
}