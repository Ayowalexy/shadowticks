const Joi = require('joi');

const loginSchema = Joi.object({
    userId: Joi.string()
        .required()
})

const sendCoinSchema = Joi.object({
    walletAddress: Joi
        .string()
        .required(),
    amount: Joi
        .number()
        .required(),
    coin: Joi   
        .string()
        .valid("BUSD", "DAI", "USDC", "USDT")
        .required(),
    id: Joi
        .string()
        .required(),
    userId: Joi
        .string()
        .required()

})

module.exports = {
    loginSchema,
    sendCoinSchema
}