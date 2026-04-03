import { ApiProperty } from '@nestjs/swagger';

class Tag {
  @ApiProperty({
    description: 'Etiqueta de base de datos extraída (Ej: Malestar)',
    example: 'Malestar',
  })
  id: string;

  @ApiProperty({ description: 'Nombre claro de etiqueta', example: 'Malestar' })
  name: string;
}

export class Product {
  @ApiProperty({
    description: 'Título identificador del producto en Naturist BD',
    example: 'Jarabe Regulador Colon',
  })
  title: string;

  @ApiProperty({
    description: 'Costo público expresado en moneda COP sin comas',
    example: 50000,
  })
  price: number;

  @ApiProperty({
    description: 'Resumen o especificaciones de producto',
    example: 'Es un regulador de colon',
  })
  description: string;

  @ApiProperty({
    description: 'Vínculo directo de imagen subida',
    required: false,
    example: 'https://via.placeholder.com/150',
  })
  image?: string;

  @ApiProperty({
    description: 'Listado de clasificación',
    type: [Tag],
    example: [{ id: '1', name: 'Malestar' }],
  })
  tags: Tag[];
}
