import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { NotionService } from '../services/notion.service';
import { Product } from '../entities/product.entity';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly notionService: NotionService) {}

  @ApiOperation({
    summary: 'Obtener Catálogo',
    description:
      'Lista todos los productos activos. Permite filtrar por búsqueda de texto en Nombre o Descripción.',
  })
  @ApiResponse({ status: 200, description: 'Catálogo de productos cargado.' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Palabra clave para filtrar por Nombre o Descripción',
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    description: 'Nombre de la etiqueta/categoría (ej: Regulador)',
  })
  @Get('products')
  getProducts(@Query('search') search?: string, @Query('tag') tag?: string) {
    return this.notionService.getProducts(search, tag);
  }

  @ApiOperation({
    summary: 'Obtener Etiquetas',
    description:
      'Recupera todas las opciones de etiquetas configuradas en la columna Etiquetas de Notion.',
  })
  @ApiResponse({ status: 200, description: 'Lista de etiquetas recuperada.' })
  @Get('tags')
  getTags() {
    return this.notionService.getTags();
  }

  @ApiSecurity('x-api-key')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Crear Producto',
    description:
      'Inserta un nuevo producto usando la estructura mapeada. (Requiere header x-api-key)',
  })
  @ApiResponse({
    status: 201,
    description: 'Producto creado en Notion exitosamente.',
  })
  @Post('products')
  addProduct(@Body() product: Product) {
    return this.notionService.addProduct(product);
  }

  @ApiOperation({
    summary: 'Obtener Producto por ID',
    description: 'Trae exactamente un producto usando el page ID de Notion.',
  })
  @ApiResponse({
    status: 200,
    description: 'Data del producto solicitada.',
  })
  @Get('product/:id')
  getProduct(@Param('id') id: string) {
    return this.notionService.getProduct(id);
  }

  @ApiSecurity('x-api-key')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Actualizar Producto',
    description:
      'Modifica el contenido de un producto. (Requiere header x-api-key)',
  })
  @ApiResponse({
    status: 200,
    description: 'El producto ha sido actualizado.',
  })
  @Put('product/:id')
  updateProduct(@Param('id') id: string, @Body() product: Partial<Product>) {
    return this.notionService.updateProduct(id, product);
  }

  @ApiSecurity('x-api-key')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Archivar/Borrar Producto',
    description:
      'Elimina lógicamente un producto archivándolo en Notion. (Requiere header x-api-key)',
  })
  @ApiResponse({
    status: 200,
    description: 'El producto ha sido eliminado.',
  })
  @Delete('product/:id')
  deleteProduct(@Param('id') id: string) {
    return this.notionService.deleteProduct(id);
  }
}
