import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

// import * as fs from 'fs';
// import path, { extname } from 'path';
// import { HttpException, HttpStatus } from '@nestjs/common';

// const validMimes: string[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const uploadImage = {
  storage: diskStorage({
    destination: './files',
    filename: (req, file, cb) => {
      const filename: string = uuid();
      cb(null, filename);
    },
  }),
  // fileFilter: (req, file, cb) => {
  //   console.log('1');
  //   const allowType: string[] = validMimes;
  //   allowType.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  // },
};

// FileInterceptor('file', {
//   storage: diskStorage({
//     destination: './files',
//     filename: (req, file, callback) => {

//       const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       const ext = extname(file.originalname);
//       const filename = `${suffix}${ext}`;
//       callback(null, filename);
//     },
//   }),
// }),
