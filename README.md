# ToDoList App

Aplikacja prostej listy rzeczy do zrobienia zbudowana w React.
Aplikacja używa Cypress do automatycznych testów.

## Uruchomienie aplikacji
### Docker
1. Budujemy kontener
```bash
$ docker-compose build 
```
2. Uruchamiamy zbudowany kontener
```bash
$ docker-compose up
```

4. Aplikacja powinna być dostępna domyślnie pod adresem:

```
http://localhost:3000
```

## Uruchomienie testów automatycznych
```
npx cypress open
```