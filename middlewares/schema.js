import Joi from "joi";

const loginSchema = Joi.object({
    userId: Joi.string()
        .required()
})

const messageSchema = Joi.object({
    reaction: Joi.string()
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

export {
    loginSchema,
    sendCoinSchema,
    messageSchema
}