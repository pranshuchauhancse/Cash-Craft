const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    createdByIp: {
      type: String
    },
    revokedAt: {
      type: Date
    },
    revokedByIp: {
      type: String
    },
    replacedByToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
);


refreshTokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expiresAt;
});


refreshTokenSchema.virtual('isActive').get(function () {
  return !this.revokedAt && !this.isExpired;
});

refreshTokenSchema.set('toJSON', { virtuals: true });
refreshTokenSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
