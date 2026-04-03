import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { Product } from '../entities/product.entity';

@Injectable()
export class NotionService {
  private notion: Client;
  private databaseId: string;

  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_TOKEN as string,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID as string;
  }

  async getProducts() {
    try {
      if (!this.databaseId) {
        throw new Error(
          'Notion Database ID is not defined in environment variables.',
        );
      }
      const notionResult = await this.notion.databases.query({
        database_id: this.databaseId,
        sorts: [
          {
            property: 'Name',
            direction: 'ascending',
          },
        ],
      });

      return notionResult.results.map((page: any) => {
        const { Name, Description, Price, ImageUrl, Etiquetas } =
          page.properties;

        return {
          id: page.id,
          title: Name?.title?.[0]?.plain_text || 'No Title',
          description: Description?.rich_text?.[0]?.plain_text || '',
          price: Price?.number || 0,
          imageUrl:
            ImageUrl?.files?.[0]?.external?.url ||
            ImageUrl?.files?.[0]?.file?.url ||
            '',
          tags: Etiquetas?.multi_select?.map((tag: any) => tag.name) || [],
        };
      });
    } catch (error) {
      throw new NotFoundException(
        `Error getting products from Notion: ${error}`,
      );
    }
  }

  getNotionPropertiesById(properties: object) {
    const result: any = {};
    for (const property of Object.values(properties)) {
      const { id, ...rest } = property as any;
      result[id] = rest;
    }
    return result;
  }

  async addProduct(product: Product) {
    try {
      if (!this.databaseId) {
        throw new Error(
          'Notion Database ID is not defined in environment variables.',
        );
      }

      const newPage = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: product.title,
                },
              },
            ],
          },
          Price: {
            number: product.price,
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: product.description,
                },
              },
            ],
          },
          Etiquetas: {
            multi_select: product.tags.map((tag) => ({ name: tag.name })),
          },
          DateTime: {
            date: {
              start: new Date().toISOString(),
            },
          },
          ImageUrl: {
            files: [
              {
                name: 'image',
                type: 'external',
                external: {
                  url: product.image || 'https://via.placeholder.com/150',
                },
              },
            ],
          },
        },
      });
      return newPage;
    } catch (error) {
      throw new Error(`Error adding product to Notion: ${error}`);
    }
  }

  async getProduct(pageId: string) {
    try {
      const page = (await this.notion.pages.retrieve({
        page_id: pageId,
      })) as any;
      const { Name, Description, Price, ImageUrl, Etiquetas } = page.properties;

      return {
        id: page.id,
        title: Name?.title?.[0]?.plain_text || 'No Title',
        description: Description?.rich_text?.[0]?.plain_text || '',
        price: Price?.number || 0,
        imageUrl:
          ImageUrl?.files?.[0]?.external?.url ||
          ImageUrl?.files?.[0]?.file?.url ||
          '',
        tags: Etiquetas?.multi_select?.map((tag: any) => tag.name) || [],
      };
    } catch (error) {
      throw new NotFoundException(
        `Error getting product from Notion: ${error}`,
      );
    }
  }

  async updateProduct(pageId: string, product: Partial<Product>) {
    try {
      const properties: any = {};
      if (product.title)
        properties.Name = { title: [{ text: { content: product.title } }] };
      if (product.price !== undefined)
        properties.Price = { number: product.price };
      if (product.description)
        properties.Description = {
          rich_text: [{ text: { content: product.description } }],
        };
      if (product.tags)
        properties.Etiquetas = {
          multi_select: product.tags.map((t: any) => ({ name: t.name })),
        };
      if (product.image)
        properties.ImageUrl = {
          files: [
            {
              name: 'image',
              type: 'external',
              external: { url: product.image },
            },
          ],
        };

      const updatedPage = await this.notion.pages.update({
        page_id: pageId,
        properties,
      });
      return updatedPage;
    } catch (error) {
      throw new Error(`Error updating product in Notion: ${error}`);
    }
  }

  async deleteProduct(pageId: string) {
    try {
      return await this.notion.pages.update({
        page_id: pageId,
        archived: true,
      });
    } catch (error) {
      throw new Error(`Error deleting product from Notion: ${error}`);
    }
  }

  async getTags() {
    try {
      if (!this.databaseId) {
        throw new Error('Notion Database ID is not defined.');
      }
      const database = (await this.notion.databases.retrieve({
        database_id: this.databaseId,
      })) as any;

      const etiquetasProperty = database.properties['Etiquetas'];

      if (
        etiquetasProperty &&
        etiquetasProperty.type === 'multi_select' &&
        etiquetasProperty.multi_select
      ) {
        return etiquetasProperty.multi_select.options.map((option: any) => ({
          id: option.id,
          name: option.name,
          color: option.color,
        }));
      }

      return [];
    } catch (error) {
      throw new Error(`Error getting tags from Notion: ${error}`);
    }
  }
}
