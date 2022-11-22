const Joi = require('joi');

const loginSchema = Joi.object({
    userId: Joi.string()
            .required()
})

module.exports = {
    loginSchema
}