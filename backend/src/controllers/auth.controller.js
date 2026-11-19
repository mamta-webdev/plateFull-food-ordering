const userModel = require("../models/user.model")
const { uploadFiles } = require("../services/storage.service");
const foodPartnerModel = require("../models/foodPartner.model")
const bcryptjs =  require("bcryptjs")
const jwt = require("jsonwebtoken")
const storageService = require("../services/storage.service")


async function registerUser(req,res){
    const {name, email, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({email})
    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcryptjs.hash(password,10)
    const user = await userModel.create({
        name:name,
        email: email,
        password : hashedPassword
    })

    const token = jwt.sign({
        _id: user._id,
    },process.env.JWT_SECRET)

    res.cookie("userToken", token,{
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
    })

    res.status(201).json({
        message:"User registered successfully",
        user:{
            _id: user._id,
            name: user.name,
            email: user.email
        }
    })
}

async function loginUser(req,res){
    const { email, password } = req.body
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid Password"
        })
    }

    const token = jwt.sign({
        _id: user._id
    }, process.env.JWT_SECRET)

    res.cookie("userToken",token,{
        httpOnly: true,
        secure:true,
        sameSite: "none",
        path: "/"
    })
    res.status(200).json({
        message: "User Logged in Successfully",
        user:{
            _id: user._id,
            name: user.name,
        }
    })

}

async function getMyProfile(req,res){
    const user = await userModel.findById(req.user._id).select("-password")
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }
    return res.status(200).json({
        message:"User profile retrieved successfully",
        user
    })
}

async function updateMyProfile(req, res) {
    try {
        const { name, phone, address, profilePhoto } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name.trim(),
                phone: typeof phone === "string" ? phone.trim() : "",
                address: typeof address === "string" ? address.trim() : "",
                profilePhoto:
                    typeof profilePhoto === "string" ? profilePhoto.trim() : ""
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            message: "Unable to update profile"
        });
    }
}

async function uploadProfilePhoto(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select a profile photo"
            });
        }

        // Upload photo to ImageKit
        const result = await uploadFiles(
            req.file.buffer.toString("base64"),
            `profile-${req.user._id}-${Date.now()}`
        );

        // Save the photo URL in the user's MongoDB document
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                profilePhoto: result.url
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile photo uploaded successfully",
            profilePhoto: user.profilePhoto,
            user
        });

    } catch (error) {
        console.error("Profile photo upload error:", error);

        return res.status(500).json({
            message: "Unable to upload profile photo"
        });
    }
}

function logoutUser(req,res){
    res.clearCookie("userToken",{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    })
    res.status(200).json({
        message: "User Logged out successfully"
    })
}


async function registerfoodPartner(req,res){
    const { businessName, ownerName, email, password} = req.body

    const isAccountAlreadyExists = await foodPartnerModel.findOne({email})
    if(isAccountAlreadyExists){
        return res.status(400).json({
            message: "Account already exists"
        })
    }
    const hashedPassword = await bcryptjs.hash(password,10)
    const fileUploadResult = await storageService.uploadFiles(
        req.file.buffer,
        "food-partner-profiles"
    )

    const foodPartner = await foodPartnerModel.create({
        businessName: businessName,
        ownerName: ownerName,
        email: email,
        password: hashedPassword,
        profileImage: fileUploadResult.url
    })

    const token = jwt.sign({
        _id: foodPartner._id,
    },process.env.JWT_SECRET)

    res.cookie("foodPartnerToken",token,{
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"

    })
    res.status(201).json({
        message: "Account created successfully",
        foodPartner:{
            _id: foodPartner._id,
            businessName: foodPartner.businessName,
            ownerName: foodPartner.ownerName,
            email: foodPartner.email,
            profileImage: foodPartner.profileImage
        }
    })
}

async function loginfoodPartner(req,res){
    const {email, password, businessName, ownerName } = req.body
    console.log("Login email:", email)
    console.log("FOOD PARTNER DB:", foodPartnerModel.db.name);
console.log("FOOD PARTNER COLLECTION:", foodPartnerModel.collection.name);
    const foodPartner = await foodPartnerModel.findOne({ email })
    console.log("Food partner:", foodPartner)
    if(!foodPartner){
        return res.status(400).json({
            message: "Account not found"
        })
    }

    const isPasswordValid = await bcryptjs.compare(password, foodPartner.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign({
        _id: foodPartner._id
    },process.env.JWT_SECRET)

    res.cookie("foodPartnerToken",token,{
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
    })
    res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner:{
            _id: foodPartner._id,
            businessName: foodPartner.businessName,
            ownerName: foodPartner.ownerName,
            email: foodPartner.email,
        }
    })
}

function logoutfoodPartner(req,res){
    res.clearCookie("foodPartnerToken",{
        httpOnly:true,
        secure: true,
        sameSite: "none",
        path: "/"
    });
        res.status(200).json({
            message: "food partner logged out successfully"
        })
}

module.exports = { registerUser, loginUser, logoutUser, registerfoodPartner, loginfoodPartner, logoutfoodPartner, getMyProfile, updateMyProfile, uploadProfilePhoto}