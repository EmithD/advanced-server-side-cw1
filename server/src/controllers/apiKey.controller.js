import * as ApiKeyModel from '../models/ApiKey.js';

export const createAPIKeyController = async (req, res) => {

	try {

		const { user_id } = req.body;

		if (!user_id) {
			return res.status(400).json({ error: 'User ID is required' });
		}
		
		const newAPIKey = await ApiKeyModel.createApiKey({ user_id });
		
		res.status(201).json({
			success: true,
			data: newAPIKey
		});

	} catch (error) {
		if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'API key already exists' });
    }
    
    res.status(500).json({
      success: false,
      error: error
    });
	}

};