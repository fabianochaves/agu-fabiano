Projeto de Cadastro de Tarefas, utilizando Angular 17 no Front-End e PHP Symfony 6 no Back-End

Informações
- Utilizado os conceitos de NGRX para gerenciamento de estados no Front-End.
- Utilizado os conceitos de DTO eService no Back-End.
- Autenticação via JWT.
- Utilizado o Docker para o Back-End.

Instruções de Instalação:

1) Tenha instalado o Docker em sua máquina
2) Clone o repositório para uma pasta de sua preferência.
3) Na pasta raiz, rode o comando docker-compose up -d, que irá instalar:

    a) Container do Back-End.
    b) NGINX
    c) MySQL
    d) PHP 8.1
    e) Composer
    f) Symfony e Symfony CLI
    g) Banco de Dados (dbtasks) gerado automaticamente pelo docker-compose, buscando o arquivo database/task_app_ddl.sql

    OBS: os arquivos docker-compose.yml e Dockerfile contém as configurações de instalação do back-end.

4) Crie o arquivo .env em /backend conforme o env.example.
5) Gere o APP_SECRET via comando do symfony (symfony console secrets:generate)
6) Gere as chaves JWT pública e privada e guarde-as na pasta backend/config/jwt (private.pem e public.pem)
7) Se tiver alguma intercorrência com dependências do composer, navegue até a pasta backend e rode o comando composer install
8) Na pasta raiz, rode o comando npm install, para instalar as dependências do front-end (Angular, Node e etc).
9) Em localhost:4200 é possível acessar o front-end após instalado as dependências.
10) Com os containers ativos e o front-end acessivel, já é possível utilizar a aplicação, sendo que a base estará limpa, então na tela inicial, deve começar registrando um novo usuário.

Observações:

- No arquivo backend\src\EventListener\CorsListener.php contém a configuração de que as requisições ao backend só são aceitas da origem localhost:4200
