## API DE USUÁRIOS

### Tecnologias utilizadas no projeto:

- `NodeJS`
- `Express Framework`
- `PrismaORM`
- `MongoDB`
- `Jest Framework`

O projeto foi todo desenvolvido utilizando **TDD - Test Driven Development** por se tratar do meu primeiro projeto usando essa metodologia.

### Modo de uso:

O projeto só irá funcionar se você configurar um banco de dados MongoDB corretamente. Irei explicar como fazer esse processo:

**1º - Criar uma conta no MongoDB (gratuito) em:**
`https://account.mongodb.com/account/`

**OBSERVAÇÃO, EM DEPLO CLUSTER SELECIONAR A OPÇÃO FREE**

**2º - Selecionar Região**
*São Paulo (sa-east-1)*

**3º - Nomeio o banco de dados para `Customer`**

**4º -  Dentro do Atlas (Cloud MongoDb) -> Security -> Quickstart**

*Preencher `username` e `password`*

**SALVEM ESSAS INFORMAÇÕES**

**5º -  Dentro do Atlas (Cloud MongoDb) -> Security -> Network Access**

Em seu IP, clique em Edit, e após, clique em `ALLOW ACCESS FROM ANYWHERE` e após confirme.

**6º -  Dentro do Atlas (Cloud MongoDb) -> Security -> Database Access**

Em seu usuário, clique em Edit, e após clique em `Built In Role` e selecione a opção `Atlas Admin` e após clique em Update User.

**7º - Dentro do Atlas (Cloud MongoDb) -> Deployment -> Database**

Clique em `Connect`, em seguida clie em `Drivers`, em Driver, selecione a opção Node.JS e após copie o código que está na opção `3. Add your connection string into your application code`

**8º - Clone o projeto do Github caso ainda não tenha feito**

**9º - Atualize as dependências do projeto**

Após clonar o projeto, será necessário rodar o comando para instalar todas as depêndencias do mesmo, para isto, use o comando `npm install`.

**10º - Crie um arquivo .env na raiz do seu projeto**

Pegue o código do que salvamos no **ITEM 7** e ajuste igual mostra no **.env.example** e após, cole no seu **.env**

---

Após essa série de configurações, o projeto já deverá funcionar normalmente.

Para rodar a API basta usar o comando `npm start`.

Para rodar os testes será necessário derrubar o servidor da API, caso o mesmo esteja rodando, e após isto rodar o comando `npm start`.

# Documentação do Projeto

`Base URL`: **http://localhost:3000**

`Content-Type`: **Requisições e Retornos em formato JSON**

### ENDPOINTS

### Criar Usuário:

`POST /users`

`Descrição`: **Cria um novo usuário na base de dados**

`Corpo da requisição`:

```
{
  "email": "string",
  "name": "string",
  "age": "integer"
}
```

`Validações`:

- **Email**: OBRIGATÓRIO, formato email, 10-50 caracteres
- **Name**: OBRIGATÓRIO, entre 4 e 50 caracteres
- **Age**: OBRIGATÓRIO, INTEGER

`Respostas`:

- 201 Created
- 400 Bad Request

### Listar Usuários:

`GET /users`

`Descrição`: **Lista todos os usuários ou usuários filtrados por name, email, age**

`Query Params (OPCIONAL)`

- email
- name
- age

`Respostas`:

- 201 Created
- 400 Bad Request

### Atualizar Usuário:

`PUT /users/:id`

`Descrição`: **Atualiza um usuário definido pelo ID**

`Path Parametro`: **ID único de cada usuário, utilizado para atualizar o usuário**

`Corpo da requisição`:

```
{
  "email": "string",
  "name": "string",
  "age": "integer"
}
```

`Validações`:

- **Email**: OBRIGATÓRIO
- **Name**: OBRIGATÓRIO
- **Age**: OBRIGATÓRIO

`Respostas`:

- 201 Created
- 400 Bad Request
- 404 Not Found

### Excluir Usuário:

`DELETE /users/:id`

`Descrição`: **Deleta um usuário definido pelo ID**

`Path Parametro`: **ID único de cada usuário, utilizado para atualizar o usuário**

`Corpo da requisição`:

```
{
  "email": "string",
  "name": "string",
  "age": "integer"
}
```

`Respostas`:

- 200 OK
- 404 Not Found

## DEMAIS ERROS:

- 500 Internal Server Error
- P2002 Erro de CONSTRAINT UNIQUE
- P2025 Erro ao deletar usuário inválido