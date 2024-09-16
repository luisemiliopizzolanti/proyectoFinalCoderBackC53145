import mongoose from "mongoose";

export const checkDbConnection = (req, res, next) => {
    // 1 significa conectado
    if (mongoose.connection.readyState !== 1) { 
      return res.status(500).json(
        { 
            status:"error",
            msg: 'DB no conectada'
        }
    );
    }
    next();
  };