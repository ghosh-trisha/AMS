const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const Building = require('../../models/Building');
const Room = require('../../models/Room');
const Schedule = require('../../models/Schedule');
const mongoose = require('mongoose');


// Create a new room under an existing building
exports.createRoom = catchAsync(async (req, res, next) => {
    const { buildingId, name } = req.body;

    // Validate input
    if (!buildingId || !name) {
        return res.status(400).json({ message: 'Building id and room name are required' });
    }

    const upperCaseRoomName = name.toUpperCase();

    // Check if the building exists
    const building = await Building.findById(buildingId);
    if (!building) {
        return res.status(404).json({ message: 'Building not found' });
    }

    // Check if the room already exists in that building
    const existingRoom = await Room.findOne({ name: upperCaseRoomName, buildingId });
    if (existingRoom) {
        return res.status(409).json({ message: 'Room already exists in this building' });
    }

    // Create and save the new room
    const newRoom = await Room.create({
        name: upperCaseRoomName,
        buildingId,
        buildingName: building.name,
    });

    return res.status(201).json({
        message: 'Room created successfully',
        data: newRoom,
    });
});

// Get all rooms under a specific building by buildingId
exports.getAllRoomsByBuilding = catchAsync(async (req, res, next) => {

    const { buildingId } = req.params;

    // Check if buildingId is provided
    if (!buildingId) {
        return res.status(400).json({ message: 'Building ID is required in params' });
    }

    // Check if the building exists
    const building = await Building.findById(buildingId);
    if (!building) {
        return res.status(404).json({ message: 'Building not found' });
    }

    // Fetch rooms under the specified building
    const rooms = await Room.find({ buildingId }).select('-__v -createdAt -updatedAt');

    return res.status(200).json({
        message: `Rooms under building: ${building.name}`,
        total: rooms.length,
        data: rooms,
    });
});


// Get all available rooms in a building for a specific day and time range
exports.getAvailableRooms = catchAsync(async (req, res, next) => {

    const { buildingId, day, start_time, end_time } = req.body;

    // Validate required query params
    if (!buildingId || !day || !start_time || !end_time) {
        return res.status(400).json({
            message: 'buildingId, day, start_time, and end_time query parameters are required'
        });
    }

    // Check if the buildingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
        return res.status(400).json({
            message: 'Invalid buildingId format'
        });
    }

    // Find all schedules that conflict with the requested time and day
    const conflictingSchedules = await Schedule.find({
        day,
        $or: [
            {
                start_time: { $lt: end_time },
                end_time: { $gt: start_time }
            }
        ]
    }).select('roomId');

    const occupiedRoomIds = conflictingSchedules.map(schedule => schedule.roomId);

    // Find rooms in the specified building that are not in the list of occupied room IDs
    const availableRooms = await Room.find({
        buildingId,
        _id: { $nin: occupiedRoomIds }
    }).select('-__v -createdAt -updatedAt');

    return res.status(200).json({
        message: `Available rooms in building ${buildingId} for ${day} between ${start_time} and ${end_time}`,
        total: availableRooms.length,
        data: availableRooms
    });
});
