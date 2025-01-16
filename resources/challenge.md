# RChallenge

Bienvenido al proceso de selección de RipleyTech, en este documento encontrarás las definiciones del desafío técnico a realizar. A continuación se detallará la problemática a resolver y los criterios de aceptación.

## Problema

El equipo de desarrollo de promesa logística debe realizar una api que permita obtener las agendas de despacho que tengan cobertura hacía la comuna que el usuario consulte. La api debe cumplir las siguientes características:
### Requisitos técnicos
- Debe estar desarrollada en Typescript con el framework [Express](https://expressjs.com/) 
- Se simulará una base de datos en base a archivos JSON que estarán en la carpeta resources.
- Debe contener al menos un test unitario que cubra la lógica de alguna función que sea propia del problema
- Extras: Agregar documentación OAS a la api, incluir archivo dockerfile

### Requisitos funcionales

- Se debe exponer un endpoint `/api/schedule/coverage` con el método POST que reciba el siguiente request body donde se puede consultar un máximo de 10 productos:
```json
{
	"products": ["2000378936145"],
	"commune": "San Bernardo"
}
```
- La respuesta de este endpoint es un array que contenga todas las agendas que satisfacen los requisitos del negocio con la siguiente estructura
```json
{
	"products": [{
		"product": "2000378936145",
		"schedules": [{
			"id": "AZSR-1080-DP",
			"courier": "1080",
			"serviceType": "S",
			"deliveryMethod": "DP",
			"cutTime": []
		}]
	}],
	"errors": [{
		"product": "123",
		"error": "El producto no existe"
	}]
}
```

### Requisitos de negocio
- Se debe obtener las rutas que cumplan con el criterio de búsqueda de: comuna, estado y tamaño del producto (`sizeMin` y `sizeMax` determinan el rango de tamaños que van de S, M, L, XL. Ej: un tamaño M esta contenido en una ruta con min S y max L)
- Se debe considerar la hora y el día de la semana en la ejecución del código para determinar si la agenda cumple con el horario de corte `cutTime` que es un arreglo donde están definidos los horarios de corte por cada día de la semana, partiendo por el día Lunes. Si el horario de ejecución es posterior al horario de corte, esa agenda no debe ser considerada, en caso de que `cutTime` tenga un array vacío, este criterio se debe ignorar.
- Si el producto consultado no existe, se debe enviar un error descriptivo del problema (producto no existe, no hay agendas para el producto, etc)

## Plazos y entrega

El tiempo para resolver este desafío es de 72 horas, se debe crear una rama en el repositorio con su nombre y subir los cambios