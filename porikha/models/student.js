const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({  
     name:{
         type:String,
         required:true
     },
     scholarId:{
         type:Number,
         required:true
     },
     date:{
      type:String,
      required:true
     },
    status:{
      type:Boolean,
      required:true,
      default:false
     },
    marks:{
      type:Number,
      required:true,
      default:0
     },
    marksDistribution:[{
        index:{
          type:Number
          //required:true
        },
        mark:{
          type:Number
          //required:true
        }
    }],
    answerPaperType:{
      type:String,
      required:true
    },
    answerPaper:{
      type:Buffer,
      required:true
    },
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'Exam'
    }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);