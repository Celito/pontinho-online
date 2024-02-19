# PONTINHO-ONLINE

This project is a training exercise where I intend to recreate a web browser online game of "Pontinho", a popular card game from the south of Brazil and prevalent throughout my childhood.

# SERVER SIDE (/pontinho-back-end)

## PRE-REQUISITES

This server uses MongoDB Community Server, before running the server please install it through the following link:

https://www.mongodb.com/try/download/community

or install it using brew:

```
brew tap mongodb/brew
brew install mongodb-community
```

## INSTALLING

To install all node modules required to run the server, you need to run:

```
npm install
```

## STARTING THE SERVER

Before starting your server, make sure you start the MongoDB by running it, or if you have installed it using brew you can enter:

```
brew services start mongodb-community
```

After MongoDB is running you can start the server by running:

```
npm start
```

# GAME CLIENT (/pontinho-app)

## INSTALLING

To install all node modules required to run the client, you need to run:

```
npm install
```

## STARTING THE SERVER

You can start running the game client by running:

```
npm start
```

You won't be able to start matches if the server-side project is not running. You can access the game client on a browser once it is running at:

https://localhost:4200
