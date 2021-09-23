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
                .allow(null),   // <-- need to allow null values for links
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
                // › › connect to DB
                // › › query DB (SELECT Book JOIN BookAuthor JOIN Author WHERE bookid)
                // › › restructure DB result into the object structure needed (JOIN --> watch out for duplicates)
                // › › validate objects
                // › › close DB connection

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

    static delete(bookid) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const book = await Book.readById(bookid);

                    const pool = await sql.connect(con);
                    const result = await pool.request()
                    .input('bookid', sql.Int(), bookid)
                    .query(`
                        DELETE liloBookAuthor
                        WHERE FK_bookid = @bookid;

                        DELETE liloLoan
                        WHERE FK_bookid = @bookid;

                        DELETE liloBook
                        WHERE bookid = @bookid
                    `);

                    resolve(book);

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
