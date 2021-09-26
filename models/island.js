const sql = require('mssql');
const config = require('config');
const Joi = require('joi');

const con = config.get('dbConfig_UCN');

class Island {
    constructor(islandFlowerObj) {
        this.userId = islandFlowerObj.userId;
        this.flowerId = islandFlowerObj.flowerId;
    }

    static validate(islandFlowerObj) {
        const schema = Joi.object({
            userId: Joi.number()
                .min(1)
                .required(),
            flowerId: Joi.number()
                .min(1)
                .required(),
        });

        return schema.validate(islandFlowerObj);
    }

    static validateResponse(flower) {
        const schema = Joi.object({
            flowerId: Joi.number()
                .min(1),
            flowerType: Joi.string()
                .min(1)
                .max(50),
            flowerColor: Joi.string()
                .min(1)
                .max(50)
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
                .min(1)
                .max(255)
                .allow(null),
        });

        return schema.validate(flower);
    }

    static checkFlower(islandFlowerObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userId', sql.Int(), islandFlowerObj.userId)
                        .input('flowerId', sql.Int(), islandFlowerObj.flowerId)
                        .query(`
                            SELECT *
                            FROM islandFlowers i
                            WHERE i.FK_userId = @userId AND i.FK_flowerId = @flowerId
                        `);
                
                    if (result.recordset.length >= 1) throw { statusCode: 409, errorMessage: 'Flower is already on island.' }
                    
                    resolve();

                } catch (error) {
                    console.log(error);
                    reject(error);
                }

                sql.close();
            })();
        });
    }

    static addFlower(islandFlowerObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {

                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userId', sql.Int(), islandFlowerObj.userId)
                        .input('flowerId', sql.Int(), islandFlowerObj.flowerId)
                        .query(`
                            INSERT INTO islandFlowers (FK_userId, FK_flowerId)
                            VALUES (@userId, @flowerId);
                                        
                            SELECT *
                            FROM flowers
                            WHERE @flowerId = flowerId
                        `);

                    if (!result.recordset[0]) throw { statusCode: 404, errorMessage: 'Flower not found with provided ID.' }
                    if (result.recordset.length > 1) throw { statusCode: 500, errorMessage: 'An error occurred.' }

                    const flowerResponse = {
                        flowerId: result.recordset[0].flowerId,
                        flowerType: result.recordset[0].flowerType,
                        flowerColor: result.recordset[0].flowerColor,
                        breedingFlower1: result.recordset[0].breedingFlower1,
                        breedingFlower2: result.recordset[0].breedingFlower2,
                        note: result.recordset[0].note
                    } 

                    const { error } = Island.validateResponse(flowerResponse);
                    if (error) throw { statusCode: 500, errorMessage: `Flower is invalid, flower id: ${flowerResponse.flowerId}.` }

                    resolve(result.recordset);

                } catch (error) {
                    console.log(error);
                    reject(error);
                }

                sql.close();
            })();
        });
    }

    static getFlowerIdOnIsland(userId) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userId', sql.Int(), userId)
                        .query(`     
                            SELECT *
                            FROM islandFlowers f
                            WHERE f.FK_userId = @userId
                        `);

                    if (!result.recordset[0]) throw { statusCode: 404, errorMessage: 'There are no flowers on this island yet.' }

                    let flowers = [];
                    result.recordset.forEach(record => {
                        const response = {
                            userId: record.FK_userId,
                            flowerId: record.FK_flowerId
                        }
                        const { error } = Island.validate(response);
                        if (error) throw { statusCode: 500, errorMessage: `Can't validate user ID: ${response.userId} and flower ID: ${response.flowerId}.` }
                        flowers.push(record.FK_flowerId);
                    })
                    resolve(flowers);

                } catch (error) {
                    console.log(error);
                    reject(error);
                }

                sql.close();
            })();
        });
    }

    static getFlowersOnIsland(flowerIdOnIsland) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    let flowers = [];
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .query(`     
                            SELECT *
                            FROM flowers
                            `);

                    flowerIdOnIsland.forEach(flowerId => {
                        result.recordset.forEach(flower => {
                            if (flowerId == flower.flowerId) {
                                const flowerResponse = {
                                    flowerId: flower.flowerId,
                                    flowerType: flower.flowerType,
                                    flowerColor: flower.flowerColor,
                                    breedingFlower1: flower.breedingFlower1,
                                    breedingFlower2: flower.breedingFlower2,
                                    note: flower.note
                                }
                                const { error } = Island.validateResponse(flowerResponse);
                                if (error) throw { statusCode: 500, errorMessage: `Invalid flower with id: ${flower.flowerId}.` }
                                flowers.push(flower);
                            }
                        })
                    })

                    resolve(flowers);

                } catch (error) {
                    reject(error);
                }
                sql.close();
            })();
        });
    }

    static checkFlowerBeforeDeleting(islandFlowerObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userId', sql.Int(), islandFlowerObj.userId)
                        .input('flowerId', sql.Int(), islandFlowerObj.flowerId)
                        .query(`
                            SELECT *
                            FROM islandFlowers i
                            WHERE i.FK_userId = @userId AND i.FK_flowerId = @flowerId
                        `);
                
                    if (result.recordset.length == 0) throw { statusCode: 409, errorMessage: 'This flower is not on island.' }
                    
                    resolve();

                } catch (error) {
                    console.log(error);
                    reject(error);
                }

                sql.close();
            })();
        });
    }

    static removeFlower(islandFlowerObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {

                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userId', sql.Int(), islandFlowerObj.userId)
                        .input('flowerId', sql.Int(), islandFlowerObj.flowerId)
                        .query(`
                            DELETE islandFlowers
                            WHERE FK_userId = @userId AND FK_flowerId = @flowerId

                            SELECT *
                            FROM flowers f
                            WHERE @flowerId = f.flowerId
                        `);

                    if (!result.recordset[0]) throw { statusCode: 404, errorMessage: 'Flower not found with provided ID.' }
                    if (result.recordset.length > 1) throw { statusCode: 500, errorMessage: 'An error occurred.' }

                    const flowerResponse = {
                        flowerId: result.recordset[0].flowerId,
                        flowerType: result.recordset[0].flowerType,
                        flowerColor: result.recordset[0].flowerColor,
                        breedingFlower1: result.recordset[0].breedingFlower1,
                        breedingFlower2: result.recordset[0].breedingFlower2,
                        note: result.recordset[0].note
                    } 

                    const { error } = Island.validateResponse(flowerResponse);
                    if (error) throw { statusCode: 500, errorMessage: `Flower is invalid, flower id: ${flowerResponse.flowerId}.` }

                    resolve(result.recordset);

                } catch (error) {
                    console.log(error);
                    reject(error);
                }

                sql.close();
            })();
        });
    }

}

module.exports = Island;