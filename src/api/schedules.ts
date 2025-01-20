import { Request, response } from "express";

const {getSchedule} = require('../resources/functions/getSchedule');

const getScheduleCoverage = async ( req: Request, res = response ) => {
    try {
        const { products, commune } = req.body
        const resp = getSchedule({products, commune})

        res.status(200).json(resp) 
    } catch (error) {
        console.error(error);
        res.json(error)    
    }
};

module.exports = {
    getScheduleCoverage
}   