const config = require('config');

const sql = require('mssql');
const con = config.get('dbConfig_UCN');

const Joi = require('joi');

const _ = require('lodash');

class Flower {
    constructor(flowerObj) {
        this.flowerId = flowerObj.flowerId;
        this.flowerType = flowerObj.flowerType;
        this.flowerColor = flowerObj.flowerColor;
        this.breedingFlower1 = flowerObj.breedingFlower1;
        this.breedingFlower2 = flowerObj.breedingFlower2;
        this.note = flowerObj.note;
    }

    static validate(flowerWannabeeObj) {
        const schema = Joi.object({
            flowerId: Joi.number()
                .integer()
                .min(1),
            flowerType: Joi.string()
                .min(1)
                .max(50),
            flowerColor: Joi.string()
                .min(1)
                .max(100)
                .allow(null),
            breedingFlower1: Joi.number()
                .integer()
                .min(1)
                .allow(null),   
            breedingFlower2: Joi.number()
                .integer()
                .min(1)
                .allow(null),
            note: Joi.string()
                .max(255)
                .allow(null)    
        });

        return schema.validate(flowerWannabeeObj);
    }

    static readById(flowerId) {
        return new Promise((resolve, reject) => {
            (async () => {

                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('flowerId', sql.Int(), flowerId)
                        .query(`
                            SELECT *
                            FROM flowers f

                            WHERE f.flowerId = @flowerId
                    `)
                    if (result.length == 0) throw { statusCode: 404, errorMessage: `Flower not found with provided flowerId: ${flowerId}` }
                    if (result.length > 1) throw { statusCode: 500, errorMessage: `Multiple hits of unique data. Corrupt database, flowerId: ${flowerId}` }
                    
                    result.recordset.forEach(flower => {
                        const flowerResponse = {
                            flowerId: flower.flowerId,
                            flowerType: flower.flowerType,
                            flowerColor: flower.flowerColor,
                            breedingFlower1: flower.breedingFlower1,
                            breedingFlower2: flower.breedingFlower2,
                            note: flower.note
                        }
                        const { error } = Flower.validate(flowerResponse);
                        if (error) throw { statusCode: 500, errorMessage: `Invalid flower with id: ${flower.flowerId}.` }
                    })
                    resolve(result.recordset[0]);

                } catch (error) {
                    reject(error);
                }

                sql.close();
            })();
        });
    }

    static getAll(){
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .query(`
                        SELECT *
                        FROM flowers
                    `);

                    if (!result.recordset[0]) throw { statusCode: 500, errorMessage: `No response from database.` }
                    result.recordset.forEach(flower => {
                        const flowerResponse = {
                            flowerId: flower.flowerId,
                            flowerType: flower.flowerType,
                            flowerColor: flower.flowerColor,
                            breedingFlower1: flower.breedingFlower1,
                            breedingFlower2: flower.breedingFlower2,
                            note: flower.note
                        }
                        const { error } = Flower.validate(flowerResponse);
                        if (error) throw { statusCode: 500, errorMessage: `Invalid flower with id: ${flower.flowerId}.` }
                    })

                    resolve(result);

                } catch (error) {
                    reject(error);
                }

                sql.close();
            })();
        });
    }

    static findBreedingFlower(breedingFlowerId){
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('breedingFlowerId', sql.Int(), breedingFlowerId)
                    .query(`
                        SELECT *
                        FROM flowers
                        WHERE flowers.flowerId = @breedingFlowerId
                    `);

                    if (!result.recordset[0]) throw { statusCode: 404, errorMessage: `Can't find flower with id ${breedingFlowerId}.` }
                    result.recordset.forEach(flower => {
                        const flowerResponse = {
                            flowerId: flower.flowerId,
                            flowerType: flower.flowerType,
                            flowerColor: flower.flowerColor,
                            breedingFlower1: flower.breedingFlower1,
                            breedingFlower2: flower.breedingFlower2,
                            note: flower.note
                        }
                        const { error } = Flower.validate(flowerResponse);
                        if (error) throw { statusCode: 500, errorMessage: `Invalid flower with id: ${flower.flowerId}.` }
                    })
                    resolve(result.recordset[0]);

                } catch (error) {
                    reject(error);
                }

                sql.close();
            })();
        });
    }
}

module.exports = Flower;
