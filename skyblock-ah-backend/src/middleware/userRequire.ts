const userRequireMiddleware = async (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.ip;

    console.log('User Connected', clientIp);
    console.log('user connected', req.path);

    
    next();
    
};

export default userRequireMiddleware;
