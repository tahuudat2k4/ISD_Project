import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

// Create time for token expiration
const ACCESS_TOKEN_EXPIRES_IN = '30m';
const REFRESH_TOKEN_EXPIRES_IN = 14 * 24 * 60 * 60 * 1000; // 14 days in seconds

// User LogIn Controller
export const signIn = async (req, res) => {

    try {
        // Extract username and password from request body
        const {username, password} = req.body; 
        console.log("Login attempt for username:", username);
        
        // Validate input
        if(!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Cannot submit empty fields"
            });
        }
        // Find user by username
        const existingUser = await User.findOne({username});
        console.log("User found:", existingUser);
        
        if(!existingUser) {
            return res.status(401).json({
                success: false,
                message: "Không tìm thấy tài khoản "
            });
        }

        // If user exists, compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if(!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Tài khoản hoặc mật khẩu không đúng"
            });
        }
        // Create access token with JWT (JSON Web Token)
        const accessToken = jwt.sign({userId: existingUser._id, role: existingUser.role}, process.env.JWT_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
        
        // Respond with access token and user info to the client 
        return res.status(200).json({
            success: true,
            message: `Đăng nhập thành công. Xin chào ${existingUser.username}!`,
            token: accessToken,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                role: existingUser.role
            }
        })
    } catch (error) {
        console.log("Error during user signin:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};
// User SignOut Controller
export const signOut = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công"
        });
    } catch (error) {
        console.log("Error during user signout:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

// Refresh access token
export const refreshToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access Denied: No Token Provided'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true }, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Access Denied: Invalid Token'
                });
            }

            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User Not Found'
                });
            }

            const newAccessToken = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
            );

            return res.status(200).json({
                success: true,
                message: 'Làm mới phiên đăng nhập thành công',
                token: newAccessToken,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                }
            });
        });
    } catch (error) {
        console.log('Error during token refresh:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
