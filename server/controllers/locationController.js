import Location from '../models/Location.js';

// @desc    Get all states
// @route   GET /api/locations/states
// @access  Public
export const getStates = async (req, res) => {
  try {
    const states = await Location.distinct('state');
    
    res.status(200).json({
      success: true,
      data: states.sort()
    });
  } catch (error) {
    console.error('Error in getStates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching states',
      error: error.message
    });
  }
};

// @desc    Get districts for a state
// @route   GET /api/locations/states/:state/districts
// @access  Public
export const getDistricts = async (req, res) => {
  try {
    const { state } = req.params;
    
    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'State parameter is required'
      });
    }

    const districts = await Location.distinct('district', { state });
    
    res.status(200).json({
      success: true,
      data: districts.sort()
    });
  } catch (error) {
    console.error('Error in getDistricts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching districts',
      error: error.message
    });
  }
};

// @desc    Get blocks for a district
// @route   GET /api/locations/states/:state/districts/:district/blocks
// @access  Public
export const getBlocks = async (req, res) => {
  try {
    const { state, district } = req.params;
    
    if (!state || !district) {
      return res.status(400).json({
        success: false,
        message: 'State and district parameters are required'
      });
    }

    const location = await Location.findOne({ state, district });
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: `No blocks found for ${district}, ${state}`,
        data: []
      });
    }

    res.status(200).json({
      success: true,
      data: location.blocks.sort()
    });
  } catch (error) {
    console.error('Error in getBlocks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blocks',
      error: error.message
    });
  }
};

// @desc    Get all location data
// @route   GET /api/locations/all
// @access  Public
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({}).select('state district blocks');
    
    res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    console.error('Error in getAllLocations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching location data',
      error: error.message
    });
  }
};
