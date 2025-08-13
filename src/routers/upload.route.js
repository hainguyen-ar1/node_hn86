import { Router } from "express";
import * as uploadController from "../controllers/upload_controller.js";
const routerUpload = Router();
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload hình ảnh
 *     description: Upload hình ảnh lên server
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: string
 *                 format: binary
 *                 description: File hình ảnh cần upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Upload Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     fieldname:
 *                       type: string
 *                       example: files
 *                     originalname:
 *                       type: string
 *                       example: image.jpg
 *                     encoding:
 *                       type: string
 *                       example: 7bit
 *                     mimetype:
 *                       type: string
 *                       example: image/jpeg
 *                     destination:
 *                       type: string
 *                       example: /path/to/uploads
 *                     filename:
 *                       type: string
 *                       example: image.jpg
 *                     path:
 *                       type: string
 *                       example: /path/to/uploads/image.jpg
 *                     size:
 *                       type: number
 *                       example: 12345
 *       500:
 *         description: Upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload failed
 */
routerUpload.post('/image', upload.single('files'), uploadController.uploadImage);

export default routerUpload;