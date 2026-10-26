// TODO: বাস্তব Auth token যাচাই এবং role-based authorization যোগ করুন।
export function requireAuth(_req,res,next){ return res.status(501).json({error:"Authentication middleware not configured"}); }
export function requireAdmin(_req,res,next){ return res.status(501).json({error:"Admin authorization not configured"}); }
