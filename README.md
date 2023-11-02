# Desafío CurrencyBird

## Como levantar el proyecto

### Requisitos

- Docker y docker-compose

### Pasos

- Clonar el repositorio
- Llenar el archivo .env:
  - NODE_ENV=development (o production)
  - DATABASE_URL= (url de la base de datos en el correo de entrega), usar /development o /production al final
  - API_KEY= (api key en el correo de entrega)
- Ejecutar `docker-compose build`
- Ejecutar `docker-compose up`

**Al estar configurado nginx, estando en local se puede acceder a la api en <http://localhost> o también en <http://localhost:5000> (puerto de express)**

# Endpoints

## POST /payment/generalPayment

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

## GET /payment/generalPayment

Endpoint para revisar el estado de un pago en GeneralPayment

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
