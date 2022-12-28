import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  Response,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { FileEntity } from './entities/file.entity';

@Controller('files')
@ApiTags('File')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * 파일 업로드
   * @param file
   * @returns 업로드 파일 정보
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${suffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    /*
        {
        fieldname: 'file',
        originalname: 'padlock.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: './files',
        filename: '1672235962820-3654071.png',
        path: 'files/1672235962820-3654071.png',
        size: 9811
        }
    */
    return await this.filesService.create(new CreateFileDto().convert(file));
  }

  /**
   * 파일 다운로드
   * @param id 파일 아이디
   * @param res
   * @returns
   */
  @Get('download')
  async download(
    @Query('id', ParseIntPipe) id: number,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const fileInfo: FileEntity = await this.filesService.findOne(id);
    const file = createReadStream(fileInfo.path);
    res.set({
      'Content-Disposition': `attachment; filename=${fileInfo.originalname}`,
    });
    return new StreamableFile(file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}
