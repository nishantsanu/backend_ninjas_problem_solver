const response = require("express");
const Doubt = require('../models/doubt');



module.exports.home = async function (req, res) {
   try {
      let doubts = await Doubt.find({})
         .sort('-createdAt')
         .populate({
            path: 'postedBy',
            select: 'email',
         })
         .populate({
            path: 'comments',
            options: { sort: { 'created_at': -1 } }
         });

      return res
         .status(200)
         .json({
            message: "you are at home",
            doubts: doubts,
         });
   }
   catch (err) {
      console.log('Error', err);
      return;
   }
}

