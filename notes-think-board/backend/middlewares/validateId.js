import mongoose from "mongoose";

export const validateObjectId = (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Product Identification String Format"
        });
    }

    next();
};

export const dynamicvalidateObjectId = (req, res, next) => {
    const paramKeys = Object.keys(req.params);

    for (const key of paramKeys) {
        const valueToTest = req.params[key];

        if (!mongoose.Types.ObjectId.isValid(valueToTest)) {
            return res.status(400).json({
                success: false,
                message: `Invalid configuration format string for parameter key: ${key}`
            });
        }
    }

    next();
};