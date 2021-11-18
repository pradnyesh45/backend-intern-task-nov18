const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");

// module.exports = (mongoose, mongoosePaginate) => {
//   var schema = mongoose.Schema(
//     {
//       title: {
//         type: String,
//       },
//       description: {
//         type: String,
//       },
//       publishedAt: {
//         type: String,
//       },
//       thumbnailUrls: {
//         type: String,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

//   schema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
//   });

//   schema.plugin(mongoosePaginate);

//   const Video = mongoose.model("Video", schema);
//   return Video;
// };

// const mongoose = require("mongoose");

// const schema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//     },
//     description: {
//       type: String,
//     },
//     publishedAt: {
//       type: String,
//     },
//     thumbnailUrls: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// schema.method("toJSON", function () {
//   const { __v, _id, ...object } = this.toObject();
//   object.id = _id;
//   return object;
// });

// schema.plugin(mongoosePaginate);

// // const Video = mongoose.model("Video", schema);
// // return Video;

// const Video = mongoose.model("Video", schema);

// module.exports = Video;

// original
const schema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    publishedAt: {
      type: Date,
    },
    thumbnailUrls: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", schema);

module.exports = Video;
