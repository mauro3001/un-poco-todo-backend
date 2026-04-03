<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Backend de Integración "Naturist API" 🚀

Esta es la aplicación de servidor (**NextJS / NestJS API**) oficial de Un Poco De Todo, diseñada para integrarse directamente con **Notion** para funcionar primariamente como un headless CMS. Todo fue planificado para ser escalable, veloz (vía `pnpm`) y transparente para desplegar como micro-funciones en Vercel.

## 🎯 Caso de Uso Próximo

Próximamente, toda esta integración sentará las bases para nuestro futuro **Frontend Marketplace**. Este backend expondrá consistentemente todo el inventario activo de Notion a través de servicios REST, permitiendo a interfaces dinámicas realizar listados (_catalog_) de productos sin preocuparse de enrutamientos externos en el frontend.

## 📝 Documentación de la API Interactiva (Swagger)

Todo el sistema está dotado con una documentación dinámica bajo el estándar OpenAPI (Swagger) para facilitar la visualización a los programadores del Front-end.

Para acceder y jugar con los endpoints de manera remota a través del navegador:
**Ruta Principal URL**: `http://localhost:3000/api/docs`

> Puedes probar realizar tanto `GET /marketplace/products` como `POST` en dicha interfaz.

## 🏁 Instalación del entorno

En este repositorio se usó `pnpm` por velocidad y compatibilidad en la sincronía de módulos.
Si no cuentas con él actívalo mundialmente instalándolo (`npm install -g pnpm`).

```bash
$ pnpm install
```

## 🔐 Configuración de Variables

Tu API requiere estrictamente las variables autorizadoras. Asegúrate de replicar (NO enviar por Git) este archivo en la raíz llamado `.env`:

```bash
NOTION_API_TOKEN=ingresa_tu_internal_integration_secret
NOTION_DATABASE_ID=aqui_el_id_url_32_chars_de_tu_database
```

## 🚀 Correr la API Exitosamente

```bash
# Desarrollo local con recarga (Watch mode)
$ pnpm run start:dev

# Producción build bundle (Despliegue Node Standard)
$ pnpm run start:prod
```

## ☁️ Despliegue Configurado

El proyecto incluye archivo de rutas de distribución `vercel.json` además de `api/index.ts`. Este enrutamiento adapta a la app NestJS en Express para correr libremente bajo `@vercel/node`.
Solo debes enlazar tu cuenta de Github a Vercel, y automáticamente subirá y compilará la red. Recuerda inyectar allí tus Variables de Entorno manuales.
