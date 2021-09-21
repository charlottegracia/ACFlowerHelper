const sql = require('mssql');
const config = require('config');
const Joi = require('joi');

const con = config.get('dbConfig_UCN');

class Island {
    constructor(islandFlowerObj) {
        this.userId = islandFlowerObj.userId;
        this.flowerId = islandFlowerObj.flowerId;
    }

    // static validate(accountObj)
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

    /* static validateResponse(flower) {
        const schema = Joi.object({
            flowerId: Joi.number()
                .min(1),
            flowerType: Joi.string()
                .alphanum()
                .min(1)
                .max(50),
            flowerColor: Joi.string()
                .alphanum()
                .min(1)
                .max(50),
            breedingFlower1: Joi.string()
                .alphanum()
                .min(1)
                .max(50),
            breedingFlower2: Joi.string()
                .alphanum()
                .min(1)
                .max(50),
            note: Joi.string()
                .alphanum()
                .min(1)
                .max(255),
        });

        return schema.validate(flower); 
    } */

    static checkFlower(islandFlowerObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userId', sql.Int(), islandFlowerObj.userId)
                        .input('flowerId', sql.Int(), islandFlowerObj.flowerId)
                        .query(`
                            SELECT i.FK_userId, i.FK_flowerId
                            FROM islandFlowers i
                            WHERE i.FK_userId = @userId AND i.FK_flowerId = @flowerId
                        `);

                    // error contains statusCode: 404 if not found! --> important in create(), see below
                    /* if (result.recordset.length >= 1) 
                    if (!result.recordset[0]) {
                        const flower = addFlower(islandFlowerObj);
                    }
 */
                    if (result.recordset.length >= 1) throw { statusCode: 409, errorMessage: 'Flower is already on island.' }

                    //const flower = await addFlower(islandFlowerObj);
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
                    console.log(result);

                    if (!result.recordset[0]) throw { statusCode: 404, errorMessage: 'Flower not found with provided ID.' }
                    if (result.recordset.length > 1) throw { statusCode: 500, errorMessage: 'An error occurred.' }

                    /* const flowerResponse = {
                        flowerId: result.recordset[0].flowerId,
                        flowerType: result.recordset[0].flowerType,
                        flowerColor: result.recordset[0].flowerColor,
                        breedingFlower1: result.recordset[0].breedingFlower1,
                        breedingFlower2: result.recordset[0].breedingFlower2,
                        note: result.recordset[0].note
                    } */
                    // check if the format is correct!
                    // will need a proper validate method for that

                    // *** static validateResponse(accountResponse)
                    //const { error } = Profile.validateResponse(flowerResponse);
                    //if (error) throw { statusCode: 500, errorMessage: 'Flower not found.' }

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
                            SELECT f.FK_flowerId
                            FROM islandFlowers f
                            WHERE f.FK_userId = @userId
                        `);
                    console.log(result);

                    if (!result.recordset[0]) throw { statusCode: 404, errorMessage: 'Theres no flowers on this island.' }

                    let flowers = [];
                    result.recordset.forEach(record => {
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

}

module.exports = Island;