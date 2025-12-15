import { INDIA_DISTRICTS, INDIA_BLOCKS } from '../data/india-locations.js';

// @desc    Get all states
// @route   GET /api/locations/states
// @access  Public
export const getStates = async (req, res) => {
  try {
    const states = Object.keys(INDIA_DISTRICTS);
    
    res.status(200).json({
      success: true,
      data: states
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching states'
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

    const districts = INDIA_DISTRICTS[state];
    
    if (!districts) {
      return res.status(404).json({
        success: false,
        message: `No districts found for state: ${state}`
      });
    }

    res.status(200).json({
      success: true,
      data: districts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching districts'
    });
  }
};

// @desc    Get blocks for a district
// @route   GET /api/locations/states/:state/districts/:district/blocks
// @access  Public
export const getBlocks = async (req, res) => {
  try {
    console.log('getBlocks called with params:', req.params);
    const { state, district } = req.params;
    
    if (!state || !district) {
      return res.status(400).json({
        success: false,
        message: 'State and district parameters are required'
      });
    }

    console.log('Looking for blocks in state:', state, 'district:', district);
    console.log('INDIA_BLOCKS keys:', Object.keys(INDIA_BLOCKS));
    
    // Check if state exists in blocks data
    const stateBlocks = INDIA_BLOCKS[state];
    console.log('stateBlocks:', stateBlocks ? 'found' : 'not found');
    
    if (!stateBlocks) {
      // Return default blocks if no specific data available
      console.log('No state blocks found, returning defaults');
      return res.status(200).json({
        success: true,
        data: ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5']
      });
    }

    const blocks = stateBlocks[district];
    console.log('blocks for district:', blocks ? `found ${blocks.length} blocks` : 'not found');
    
    if (!blocks) {
      // Return default blocks if no specific data available for this district
      console.log('No district blocks found, returning defaults');
      return res.status(200).json({
        success: true,
        data: ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5']
      });
    }

    console.log('Returning blocks:', blocks);
    res.status(200).json({
      success: true,
      data: blocks
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
    res.status(200).json({
      success: true,
      data: {
        states: INDIA_DISTRICTS,
        blocks: INDIA_BLOCKS
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching location data'
    });
  }
};
