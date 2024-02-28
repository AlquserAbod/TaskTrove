const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../Models/user');
const { validationResult } = require('express-validator');
const { signJWTToken } = require('../utils/jwtToken');
const { hashPassword,comparePassword } = require('../utils/hash_password.js');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");
const { RandomAvatarFileName } = require('../utils/random.js');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, googleId  } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false,errors: errors.array() });
    }

    let userData = {
      username: username,
      email: email,
      password: await hashPassword(password),
    };
    //upload image 

    if (req.file) {
      // Upload image to Firebase Storage
      const storage = getStorage();
      const randomFileName = RandomAvatarFileName(req.file);

      const storageRef = ref(storage, `images/avatars/${randomFileName}`);

      await uploadBytes(storageRef, req.file.buffer);
      const downloadURL = await getDownloadURL(storageRef);

      userData.imagePath = downloadURL; // Set download URL in userData
    }
    
    if(googleId != null){
      userData.isVerified = true
      userData.googleId = googleId
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    //create auth token
    const token = signJWTToken(savedUser._id);
    
    if (savedUser.isVerified === false) {

      await axios.post(`${process.env.API_URL}/auth/verify/send`, {user: savedUser,})
      .then((response) => {
        console.log("email sented");
        return res.status(200).json({
          success: true,
          message: `Verification email sent to '${savedUser.email}'. Please check your inbox to verify your email address.`,
        });
      }).catch((err) => {
        console.log(err);
        return res.status(500).json({
          success: false,
          error: "Something went wrong, please try again later"
        });
      });

    } else {
      return res.status(200).json({ success:true,token: token });
    }

  } catch (err) {
    console.error("error in register controller :", err);
    return res.status(500).json({
      success: false,
      error: "Something went wrong, please try again later"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);

    // if has fields error return this errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false,errors: errors.array() });
    }

    let existsUser = await User.findOne({ email: email });
    if (!existsUser) return res.status(401).json({ success: false, error: "Invalid credentials" });
    
    const passwordCorrect = await comparePassword(password,existsUser.password);
    if (!passwordCorrect) return res.status(401).json({ error: "Invalid credentials" });

    if(existsUser.isVerified === false) {

      await axios.post(`${process.env.API_URL}/auth/verify/send`, {user: existsUser,})
      .then((response) => {
        return res.status(200).json({
          success: false,
          message: `Verification email sent to '${existsUser.email}'. Please check your inbox to verify your email address.`,
        });
      }).catch((err) => {
        return res.status(500).json({
          success: false,
          error: "Something went wrong, please try again later"
        });
      });

    }else {
      const token = signJWTToken(existsUser._id);
      return res.status(200).json({ success:true, token:token });
    }



  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};


const getUser = (req,res) => {
  const user = req.user;

  if (!user) {
    return res.json(null);
  }

  // Return the user details
  return res.json(user);
}

const updateUser = async (req, res) => {
  try {
    const { username, email, imagePath } = req.body;
    console.log(email,username);
    const errors = validationResult(req);

    // if has fields error return this errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false,errors: errors.array() });
    }

    // Check if user is using Google services
    if (req.body.googleId === null) {
      return res.status(400).json({ success: false, error: "Updates not allowed for users using Google services" });
    }

    const user = req.user; // Assuming user details are available in req.user


      // Check if the username is being updated
      if (username && username !== user.username) {
        user.username = username;
      }

      // Check if the email is being updated
      if (email && email !== user.email) {
        user.email = email;
        user.isVerified = false; 

        

      }

      if (req.file) {
        const storage = getStorage();
        const randomFileName = RandomAvatarFileName(req.file);

        // Delete previous user image from Firebase Storage
        if (user.imagePath) {
          const imageRef = ref(storage, user.imagePath);
  
          await deleteObject(imageRef);
        }
  
        // Upload new image to Firebase Storage
        const storageRef = ref(storage, `images/avatars/${randomFileName}`);
  
        await uploadBytes(storageRef, req.file.buffer);
        const downloadURL = await getDownloadURL(storageRef);
  
        user.imagePath = downloadURL; // Set download URL in userData
      }

    // Save the updated user
    const updatedUser = await user.save();
    
    if(!updatedUser.isVerified){
      await axios.post(`${process.env.API_URL}/auth/verify/send`, {user: updatedUser,})
      .then(async (response) => {

          return res.status(200).json({
            success: false,
            VerifyEmail: true,
            message: `Verification email sent to '${updatedUser.email}'. Please check your inbox to verify your email address.`,
          });

      }).catch((err) => {
        return res.status(500).json({
          success: false,
          error: "Something went wrong, please try again later"
        });
      });
    }else {
      return res.status(200).json({ success: true, message: "profile updated successfuly", user: updatedUser });

    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Something went wrong, please try again later" });
  }
};

const UpdatePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;

    user = req.user;
    
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;

    await user.save();

    return res.status(200).json({success: true, message: "password changed successfuly"});
      
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          success: false,
          error: "Something went wrong, please try again later"
        });
  }
};

const deleteAcoount = async (req, res) => {
    try {
      const userId = req.user._id; 
      console.log('user id:',userId);
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
          throw new Error('Object not found'); // Object with given ID not found
      }
      return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error("Error deleting account:", error);
        return res.status(500).json({ error: "An error occurred while deleting the account" });
    }
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteAcoount,
  UpdatePassword
};
