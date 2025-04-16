import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const createApiKey = (apiKeyData) => {
  return new Promise((resolve, reject) => {
    const { user_id } = apiKeyData;
    const api_key = uuidv4();

    db.run(
      'INSERT INTO api_keys (api_key, user_id) VALUES (?, ?)',
      [api_key, user_id],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          api_key,
					user_id
        });
      }
    );
  });
};