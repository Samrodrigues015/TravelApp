TravelApp

TravelApp é uma aplicação web desenvolvida com Next.js que permite aos usuários gerenciar seu perfil, visualizar histórico de reservas de carros e alterar sua senha. A interface é responsiva e utiliza o Tailwind CSS para estilização.

Funcionalidades

Gerenciamento de Perfil: Os usuários podem visualizar e editar seu nome de usuário.

Histórico de Reservas: Visualização de reservas passadas com informações sobre o carro, data e preço.

Alteração de Senha: Opção para alterar a senha com validação de segurança.

Autenticação Local: Utiliza o localStorage para armazenar informações do usuário e verificar o login.

Tecnologias Utilizadas

Next.js

React

Tailwind CSS

TypeScript

Instalação

Clone o repositório:

git clone https://github.com/Samrodrigues015/TravelApp.git


Instale as dependências:

cd TravelApp
npm install


Inicie o servidor de desenvolvimento:

npm run dev


Abra o navegador e acesse:

http://localhost:3000

Estrutura do Projeto

app/: Contém os componentes principais da aplicação.

components/: Componentes reutilizáveis como Navbar.

hooks/: Hooks personalizados, se houver.

lib/: Funções auxiliares e utilitárias.

public/: Arquivos estáticos como imagens.

styles/: Arquivos de estilo, incluindo Tailwind CSS.

pages/: Páginas da aplicação, como perfil e login.

Contribuindo

Faça um fork deste repositório.

Crie uma branch para sua feature ou correção:

git checkout -b minha-feature


Faça suas alterações e commit:

git commit -am 'Adiciona nova feature'


Envie para o repositório remoto:

git push origin minha-feature


Abra um pull request para revisão.

Licença

Este projeto é livre e foi desenvolvido exclusivamente para fins educacionais.
