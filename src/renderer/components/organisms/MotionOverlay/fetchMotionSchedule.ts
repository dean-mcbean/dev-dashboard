import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const fetchMotionSchedule = async (): Promise<any> => {
  const motionApiKey = process.env.MOTION_API_KEY;

  try {
    const response = await axios.get('https://api.usemotion.com/v1/tasks?assigneeId=WUOWaGIv4icmntHuk92SWz0qQvP2', {
      headers: {
        "X-Api-Key": motionApiKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching motion schedule:', error);
    throw error;
  }
};
