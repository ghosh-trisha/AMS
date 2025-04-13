const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const Building = require('../../models/Building');

// Create a new building
exports.createBuilding = catchAsync(async (req, res, next) => {
 
    const { name } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Building name is required' });
    }

    // Check if building already exists
    const existingBuilding = await Building.findOne({ name });
    if (existingBuilding) {
      return res.status(409).json({ message: 'Building already exists' });
    }

    const upperCaseName = name.toUpperCase();
    // Create and save building
    const newBuilding = await Building.create({name: upperCaseName });

    return res.status(201).json({
      message: 'Building created successfully',
      data: newBuilding,
    });
  
})


// get all buildings
exports.getAllBuildings = catchAsync(async (req, res, next) => {
    const buildings = await Building.find();
  
    return res.status(200).json({
      message: 'All buildings retrieved successfully',
      total: buildings.length,
      data: buildings,
    });
  });