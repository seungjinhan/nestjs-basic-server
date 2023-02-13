import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  Response,
  ParseIntPipe,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileEntity } from './entities/file.entity';
import { uploadImage } from '../config/fileupload/file.upload.config';
import { makeResponse } from 'src/libs/utils/api';

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
  @UseInterceptors(FileInterceptor('file', uploadImage))
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(gif|png|jpg|jpeg)$/ })
        .addMaxSizeValidator({ maxSize: 1000000000 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
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
    return makeResponse(
      true,
      await this.filesService.create(new CreateFileDto().convert(file)),
    );
  }

  /**
   * 파일 다운로드
   * @param id 파일 아이디
   * @param res
   * @returns
   */
  @Get('download/:id')
  async download(
    @Param('id', ParseIntPipe) id: number,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const fileInfo: FileEntity = await this.filesService.findOne(id);
    if (!fileInfo) {
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    }
    const file = createReadStream(fileInfo.path);
    res.set({
      'Content-Disposition': `attachment; filename=${fileInfo.originalname}`,
    });
    return new StreamableFile(file);
  }

  /**
   * 파일 삭제(실제 파일도 삭제)
   * @param id 파일 아이디
   * @returns
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}
