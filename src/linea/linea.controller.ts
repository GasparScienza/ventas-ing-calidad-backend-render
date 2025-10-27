import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { LineaService } from './linea.service';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { Request } from 'express';

@Controller('linea')
export class LineaController {
  constructor(private readonly lineaService: LineaService) {}

  @Post()
  create(@Body() createLineaDto: CreateLineaDto, @Req() req: Request) {
    return this.lineaService.create(createLineaDto, req);
  }

  @Get()
  findAll() {
    return this.lineaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lineaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLineaDto: UpdateLineaDto,
    @Req() req: Request,
  ) {
    return this.lineaService.update(id, updateLineaDto, req);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.lineaService.remove(id, req);
  }
}
