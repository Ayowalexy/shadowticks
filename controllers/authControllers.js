const Identity = require('../models/identityModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const shortid = require('shortid');
const { loginSchema } = require('../middlewares/schema');
const jwt = require('jsonwebtoken');

const images = [
    'https://res.cloudinary.com/dquiwka6j/image/upload/v1669126971/mjqwsi2epbnki0flyxqg.png',
    'https://res.cloudinary.com/dquiwka6j/image/upload/v1669126971/ayrjvavwim4isdy5dihc.png',
    'https://res.cloudinary.com/dquiwka6j/image/upload/v1669126971/ofk66c4qyqkghe3tujxz.png',
    'https://res.cloudinary.com/dquiwka6j/image/upload/v1669126970/it1qf83brdun3bsgsyax.png',
    'https://res.cloudinary.com/dquiwka6j/image/upload/v1669126971/sge6jboayjgmj9qymaia.jpg',
    'https://res.cloudinary.com/dquiwka6j/image/upload/v1669126970/yv5jday8germanu4qyko.png',
    'https://res.cloudinary.com/dquiwka6j/image/upload/v1669126971/yz95rfwfbwwemzyhcix3.png',
    'https://res.cloudinary.com/dquiwka6j/image/upload/v1669126970/gqpluidrkowpym3d4fbw.png'
]

const seedDB = asyncHandler(async (req, res) => {

    const arr = [];

    for(img of images){
        const shortName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors],
            length: 2
          });

        const name = shortName.split('_').join(' ');
        const userId = shortid.generate();
        const imageUrl = img;

        const data = { name, userId, imageUrl};
        arr.push(data)
    }

    // await Identity.deleteMany({})
    await Identity.insertMany(arr);
    res.status(201).json({"status": "success", "message": "database seeded"})
});


const getAllIdentity = asyncHandler(async (req, res) => {
    const allIdentity = await Identity.find({isOwnned: false});
    res.status(201).json({"status": "success", "data": allIdentity})
})

const claimIdentity = asyncHandler(async(req, res) => {
    const { id } = req.params;
    
    const identity = await Identity.findById({_id: id});
    if(identity && !identity.isOwnned){
        const user = new User();
        user.identity = identity;
        identity.isOwnned = true;
        user.userId = identity.userId;
        await user.save();
        await identity.save();

        res.status(201).json({"status": "success", "message": "identity claimed", "data": user})
    } else {
        res.status(401).json({"status": "error", "message": "invalid error", "meta": { "error": "identity is already claimed or does not exist" }})

    }
})


const loginUser = asyncHandler(async(req, res) => {

    const { error, value } = loginSchema.validate(req.body);

    if (error) {
        return res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: error.message
                    }
                })
    }

    const user = await User.findOne({userId: value.userId})

    if(user){
        const token = jwt.sign({ email: user.email }, process.env.SECRET)

        res.status(201).json({"status": "success", "data": user, "token": token})
    } else {
        res.status(401).json({"status": "error", "message": "invalid error", "meta": { "error": "user does not exist" }})
    }
})

module.exports = {
    seedDB,
    getAllIdentity,
    claimIdentity,
    loginUser
}