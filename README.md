# Politico

Politico enables citizens give their mandate to politicians running for different government offices while building trust in the process through transparency

[![Maintainability](https://api.codeclimate.com/v1/badges/13e2339cd2954b9cc63b/maintainability)](https://codeclimate.com/github/emmsdan/politico/maintainability) [![Build Status](https://travis-ci.org/emmsdan/politico.svg?branch=develop)](https://travis-ci.org/emmsdan/politico) [![Coverage Status](https://coveralls.io/repos/github/emmsdan/politico/badge.svg?branch=development)](https://coveralls.io/github/emmsdan/politico?branch=development)

![commit activities](https://img.shields.io/github/commit-activity/y/emmsdan/politico.svg?colorB=green) ![last commit](https://img.shields.io/github/last-commit/emmsdan/politico/develop.svg?colorB=green)
![repo size ](https://img.shields.io/github/repo-size/emmsdan/politico.svg?colorB=blue&logo=red)

## Technologies
  * Nodejs(ES6)
  * Git
  * NPM
  * Express
  * PostgreSQL

## Linting Library
  * Eslint (AirBnB)

## Installation

Clone the [repo politico](https://github.com/emmsdan/politico).

```bash
git clone https://github.com/emmsdan/politico.git
```
You can Use the package manager [npm](https://nodejs.org/en/) to Install dependencies.

```bash
npm install
```

## Usage

### run server
```bash
npm start
```
## Test
  Mocha is the testing framework together with chai assertion library

### run test
```bash
npm run test
```
### Application Endpoints

| HTTP Request | End Point | Functionality |
| -------------| -----------| ----------- |
| **POST** | /auth/signup | Create a user account. |
| **POST** | /auth/login| Login a user. |
| **POST** | /auth/reset| Reset user password. |
| **POST** | /office/<user-id>/register | Register a user as a candidate running for a political office. |
| **POST** | /votes/ | Vote for a candidate. |
| **POST** | /office/<office-id>/result | Collate and fetch the result of specific office following a concluded election. |
| **POST** | /petitions/ | Create petitions challenging the outcome of a concluded election. |
| **POST** | /votes/ | Vote for a candidate. |
| **POST** | /parties/ | Create a political party. |
| **GET** | /parties/|  Fetch all political party |
| **GET** | /parties/<party-id>|  Fetch specific political party |
| **PATCH** | /parties/<party-id>/name | Edit the name of a specific political party. |
| **DELETE** | /parties/<party-id>|  Delete a specific political party. |
| **POST** | /offices/|  Create a political office. |
| **GET** | /offices/|  Fetch all political office records |
| **GET** | /offices/<office-id> |  Fetch all specific political office |
| - | -|  -|



## Acknowledgement
- [Felix Amande - ]()
- [Chidiebere Ogujeiofor - prof](https://github.com/chidioguejiofor)


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Author
### Emmanuel Daniel
You can follow me on [![follow me on twitter](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/emmsdan)
