import { model, Schema } from 'mongoose';

const HmsRoomsSchema = new Schema({
        name: {
          type: String,
          required: true,
      },
      description: {
        type: String,
        required: false,
      },
      appId: {
        type: String,
        required: true,
      },
      roomId: {
        type: String,
      },
      is_soft_deleted: {
        type: String,
        default: false,
      },
      instructor: {
        type: String,
        required: true,
      },
      product: {
        type: String,
        required: true,
      },
      enabled: {
        type: Boolean,
        default: true,
      },
      startDateTime: {
        type: Date,
        default: Date.now,
      },
      endDateTime: {
        type: Date,
        default: Date.now,
      },
      last_updated_by: {
        type: String,
        required: true,
      },
      createdBy: {
        type: String,
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
})

const HmsRoomsModel = model('hmsRooms', HmsRoomsSchema);


export default HmsRoomsModel;
