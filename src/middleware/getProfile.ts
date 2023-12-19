import { Response, NextFunction } from 'express';
import RequestWithProfile from "../interfaces/requestWithProfile";

export const getProfile = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void | Response> => {
    const { Profile } = req.app.get('models');
    const profile = await Profile.findOne({ where: { id: req.get('profile_id') || 0 } });
    if (!profile) return res.status(401).end();
    req.profile = profile;
    next();
};
