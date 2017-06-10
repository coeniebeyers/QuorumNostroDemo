[![Stories in Ready](https://badge.waffle.io/coeniebeyers/QuorumNostroDemo.png?label=ready&title=Ready)](https://waffle.io/coeniebeyers/QuorumNostroDemo)
[![Build Status](https://travis-ci.org/coeniebeyers/QuorumNostroDemo.svg?branch=master)](https://travis-ci.org/coeniebeyers/QuorumNostroDemo)

# QuorumNostroDemo

This project is undergoing major restructuring!

NOTE: The terminal client is broken at the moment and will only get fixed if there is a need for it. All functionality should be accessable via the web client.  
NOTE: The web client is still being fleshed out

# Getting started

## Dependencies

1. NodeJS (tested on v7.10.0)
```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs 
```

2. forever 
```
sudo npm install -g forever
```

3. solc
```
sudo apt-get install solc
```

## Installation

1. clone this repo
2. npm install

## Setup

## Running

### Starting the API

1. `cd api`
2. `NODE_IDENTITY=<node name> node api.js`

### Starting the Website

1. cd to the root of the project folder
2. `REACT_APP_API_URL='http://<ip address>:4000' npm start`




