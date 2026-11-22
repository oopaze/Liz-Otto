# Confirmação de presença · Chá Revelação Liz ou Otto

O site é um arquivo só (`index.html`), com as imagens embutidas. As respostas vão para uma planilha do Google, por meio de um pequeno script do Google (Apps Script).

## 1. Criar a planilha e o script

1. Crie uma planilha nova no Google Sheets, por exemplo "Confirmações Chá Revelação".
2. Na planilha, vá em **Extensões › Apps Script**.
3. Apague o que estiver lá, cole todo o conteúdo de `apps-script.gs` e salve.
4. Clique em **Implantar › Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Autorize o acesso quando o Google pedir. Pode aparecer o aviso "app não verificado": clique em **Avançado › Acessar**.
6. Copie a **URL do app da Web**, que termina em `/exec`.

Para testar, abra essa URL no navegador. Deve aparecer só `ok`.

## 2. Colocar a URL no site

Abra `index.html` e procure por:

```js
const SCRIPT_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
```

Troque o texto entre aspas pela URL copiada e salve o arquivo.

## 3. Publicar no GitHub Pages

1. Crie um repositório público no GitHub, por exemplo `cha-revelacao`.
2. Envie o `index.html` para a raiz do repositório (botão **Add file › Upload files**).
3. Vá em **Settings › Pages**. Em **Source**, escolha **Deploy from a branch**, depois a branch `main` e a pasta `/ (root)`. Salve.
4. Em um ou dois minutos o site fica no ar em `https://SEU-USUARIO.github.io/cha-revelacao/`.

Envie esse link para os convidados.

## Na planilha

O cabeçalho continua o mesmo: Data/hora, Nome, Vem?, Adultos, Crianças, Palpite e Recadinho.

Cada pessoa ocupa uma linha:

- a primeira linha é quem preencheu o formulário;
- cada companhia vira uma linha própria, com o nome no formato `Fulano (Junto a Beltrano)`;
- cada companhia recebe o mesmo palpite de quem confirmou, então também entra na contagem de votos;
- criança não ganha linha própria: a coluna **Crianças** fica na linha de quem confirmou, para você preencher a quantidade (o formulário não pergunta idade).

Para ver os totais, use em qualquer célula:

- Total de pessoas: `=SOMA(Confirmações!D:D)`
- Total de crianças: `=SOMA(Confirmações!E:E)`
- Palpites Liz: `=CONT.SE(Confirmações!F:F;"Liz*")`
- Palpites Otto: `=CONT.SE(Confirmações!F:F;"Otto*")`

## Se mudar o script depois

Depois de editar o código, vá em **Implantar › Gerenciar implantações**, edite a implantação e escolha **Nova versão**. Assim a URL continua a mesma.
