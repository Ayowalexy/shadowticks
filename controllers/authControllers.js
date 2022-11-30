// const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

import Identity from '../models/identityModel.js';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import shortid from 'shortid';
import jwt from 'jsonwebtoken';
import { identicon } from 'minidenticons';
import { Buffer } from 'node:buffer';
import { svg2png } from 'svg-png-converter'
import { loginSchema } from '../middlewares/schema.js';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const { sign, verify } = jwt;

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

const seedDB = expressAsyncHandler(async (req, res) => {

    const arr = [];



    for (let i = 0; i < 10; i++) {
        const shortName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors],
            length: 2
        });

        const name = shortName.split('_').join(' ');
        const svg = identicon(name, 50, 50)
        const userId = shortid.generate();
        const imageSvg = svg;

        const data = { name, userId, imageSvg };
        arr.push(data)
    }


    // await Identity.deleteMany({})
    await Identity.insertMany(arr);
    res.status(201).json({ "status": "success", "message": "database seeded" })

});



const generateAvatar = async (nam) => {

    const svg = identicon("james", 1, 1)

    const buf = Buffer.from(svg, 'utf8');

    // const base64 =  buf.toString('base64')

    let base64 = await svg2png({
        input: `
        data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABGAEYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDz+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==
        `.trim(),
        encoding: 'dataURL',
        format: 'jpeg',
        width: 100,
        height: 100,
        multiplier: .7,
        quality: .5
    })

    console.log(base64)

    let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/code-idea/upload';
    let base64Img = `data:image/jpg;base64,${base64}`;

    let data = {
        "file": base64,
        "upload_preset": "parcelboy",
    }
    await fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
    }).then(async r => {
        let data = await r.json()
        console.log('Url', data.url)
    })
}

// generateAvatar()


const getAllIdentity = expressAsyncHandler(async (req, res) => {
    const allIdentity = await Identity.find({ isOwnned: false });
    res.status(201).json({ "status": "success", "data": allIdentity })
})

const claimIdentity = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const identity = await Identity.findById({ _id: id });
    if (identity && !identity.isOwnned) {
        const user = new User();
        user.identity = identity;
        identity.isOwnned = true;
        user.userId = identity.userId;
        await user.save();
        await identity.save();

        res.status(201).json({ "status": "success", "message": "identity claimed", "data": user })
    } else {
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "identity is already claimed or does not exist" } })

    }
})


const loginUser = expressAsyncHandler(async (req, res) => {

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

    const user = await User.findOne({ userId: value.userId })

    if (user) {
        const token = sign({ userId: user.userId }, process.env.SECRET)

        res.status(201).json({ "status": "success", "data": user, "token": token })
    } else {
        res.status(401).json({ "status": "error", "message": "invalid error", "meta": { "error": "user does not exist" } })
    }
})
export {
    seedDB,
    getAllIdentity,
    claimIdentity,
    loginUser
}