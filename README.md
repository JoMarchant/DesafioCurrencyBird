# Desafío CurrencyBird

## Comentarios

- Del enunciado no me quedó claro si tenía que dejar envíado el pago en producción, de todas formas lo dejé realizado. Sin querer hice un pago con transferCode: "<jose_marchant1@uc.cl>". Pero en lo hablado respecto al enunciado por correo, lo importante es solo para el transferCode: "<jose_marchant@uc.cl>".
- La autenticación solo se hace con un API_KEY ya que no se comentaba nada al respecto.
- El código está estructurado de forma que se puedan agregar más APIs externas para realizar pagos. Solo es agregar un modulo en ```./src/apis/nueva_api.ts``` y un nuevo módulo de middleware en ```./src/middlewares/nueva_api.ts```.

## Deploy

La API está montada con Docker en una instancia EC2 de AWS. Se pueden realizar requests a la API en <http://ec2-3-144-147-184.us-east-2.compute.amazonaws.com/>, no pude conseguir un dominio.

La base de datos PostgreSQL está montada en una instancia EC2 de AWS. La dirección es <http://ec2-18-220-166-203.us-east-2.compute.amazonaws.com>, el puerto es el 5432. La url de conexión está en el correo de entrega.

## Stack

- Node.js + Typescript
- Express en Typescript
- Postgres
- Docker
- Nginx

## Como levantar el proyecto localmente

### Requisitos

- Docker y docker-compose

### Pasos para ejecutar

- Clonar el repositorio
- Llenar el archivo .env:
  - PORT = 5000 (dejar así para que funcione con nginx y Docker)
  - NODE_ENV = development
  - DATABASE_URL = url de la base de datos (postgres) formato : ```postgres://user:password@host:port/database``` Cambiar 'database' segun corresponda (desarrollo)
  - API_KEY = api key que usarás en header['x-api-key'] para acceder a los endpoints.
- Ejecutar `docker-compose build`
- Ejecutar `docker-compose up`

**Al estar configurado nginx, estando en local se puede acceder a la api en <http://localhost> o también en <http://localhost:5000> (puerto de express)**

## Modelos

### User

```json
{
  "id": "uuid",
  "email": "string",
}
```

### Payment

```json
{
  "id": "uuid",
  "userId": "uuid",
  "transferCode": "string",
  "amount": "number",
  "paymentAPI": "string"
}
```

## Endpoints

 **El API Key que se debe utilizar para hacer las request está en el correo de entrega. Se debe colocar en el header `x-api-key`.**

### POST /payment/generalPayment

Endpoint para realizar un pago en GeneralPayment

Request Body:

```json
{
  "email": "ejemplo@ejemplo.com",
  "transferCode": "ejemplo@ejemplo.com",
  "amount": 100
}
```

Response Body:

- 201: OK

```json
{
  "amount": "100",
  "email": "ejemplo@ejemplo.com",
  "retries": 0,
  "transferCode": "ejemplo@ejemplo.com",
}
```

- 400: Bad Request

```json
"Falta alguno de los campos requeridos"
```

```json
"Ya existe el transferCode"
```

- 500: Internal Server Error

```json
"Falla interna"
```

```json
"Falla del servicio externo"
```

### GET /payment/generalPayment

Endpoint para revisar el estado de un pago en GeneralPayment

Request Body (**Solo para mandar el email de autenticación**):

```json
{
  "email": "ejemplo@ejemplo.com",
}
```

`No tuve el tiempo para pensar una mejor solución`

Request Query Params:

- email: string
- transferCode: string

Response Body:

- 200: OK

```json
{
  "amount": "100",
  "email": "ejemplo@ejemplo.com",
  "retries": 0,
  "transferCode": "ejemplo@ejemplo.com",
}
```

- 500: Internal Server Error

```json
"Falla interna o externa"
```
