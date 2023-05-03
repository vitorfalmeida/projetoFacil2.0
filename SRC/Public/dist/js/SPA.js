    //Importa o json com as rotas das views
    fetch('./app/view/telas.json')
      .then(response => response.json())
      .then(data => {
        telas = data;
        console.log(telas);
        //Caso a URL não possua nenhum hash, será clicado no primeiro link do menu
        if (window.location.hash === '') {
          window.location.hash = telas[0].link;
        }
        //Constroi o menu
        construirMenu();
      })
      .catch(error => console.error(error));



    function construirMenu() {
      // encontra o elemento ul do HTML onde os links serão adicionados
      var sidebar = document.querySelector('.nav-sidebar');

      // percorre o array telas e adiciona os links na barra lateral
      telas.forEach(function (tela) {
        var li = document.createElement('li');
        li.className = 'nav-item';

        //Verifica se o hash da URL é o mesmo da opção do menu
        if (window.location.hash === tela.link) {
          hashInicial = true;
        } else {
          hashInicial = false;
        }

        // se a tela tiver subitens
        if (tela.subitems) {
          //adiciona uma seta para mostrar/ocultar os subitens
          li.innerHTML = '<a href="#" class="nav-link"><i class="' + tela.icon + ' nav-icon"></i><p>' + tela.title + '<i class="right fas fa-angle-left"></i></p></a>';

          // cria um novo elemento ul para os subitens e adiciona-os dentro dele
          var subul = document.createElement('ul');
          subul.className = 'nav nav-treeview';
          tela.subitems.forEach(function (subitem) {
            //Verifica se o hash da URL é o mesmo da opção do menu
            if (window.location.hash == subitem.link) {
              hashInicial = true;
              li.classList.add('menu-open'); // abre o menu pai
              li.classList.add('menu-is-opening');
              li.querySelector('a').classList.add('active'); // marca o pai como ativo
            } else {
              hashInicial = false;
            }
            var subli = document.createElement('li');
            subli.className = 'nav-item';
            subli.innerHTML = '<a href="' + subitem.link + '" class="nav-link ' + (hashInicial ? 'active' : '') + '"><i class="far fa-circle nav-icon"></i><p>' + subitem.title + '</p></a>';
            subul.appendChild(subli);
            construirTela(subitem.link);
          });
          li.appendChild(subul);
        }
        else {
          li.innerHTML = '<a href="' + tela.link + '" class="nav-link ' + (hashInicial ? 'active' : '') + '"><i class="' + tela.icon + ' nav-icon"></i><p>' + tela.title + (tela.msg ? '<span class="right badge badge-danger">' + tela.msg + '</span>' : '') + '</p></a>';
          construirTela(tela.link);
        }

        sidebar.appendChild(li);
      });
    }


    function construirTela(rota) {
      // Cria uma div com o ID especificado
      var div = $('<div/>', { id: rota.replace('#', '') });
      div.addClass('d-none');
      div.addClass('div-conteudo');
      if (rota == window.location.hash) {
        div.removeClass('d-none');
      }


      // Faz uma requisição AJAX para o arquivo HTML correspondente
      $.get('./app/view/' + rota.replace('#', '') + '.html', function (data) {
        // Insere o conteúdo HTML na div
        div.html(data);

        // Adiciona a div à página
        $('#conteudo').append(div);
      });
    }

    
    // adicionar um ouvinte de eventos que é acionado toda vez que a URL é alterada
    window.addEventListener('hashchange', () => {
      // obter o hash da URL
      hash = window.location.hash;

      // Captura todos os links da navegação lateral
      const navLinks = document.querySelectorAll('.nav-sidebar .nav-link');

      // Remove a classe 'active' de todos os links
      navLinks.forEach(link => {
        link.classList.remove('active');
      });

      //Identifica qual foi o link clicado pelo valor da hash
      const linkClicado = document.querySelector('a[href="' + hash + '"]');


      // Adiciona a classe 'active' ao link clicado
      linkClicado.classList.add('active');
      // Verifica se o link clicado é uma sub-opção
      const parentLink = linkClicado.closest('.nav-item.menu-is-opening');
      if (parentLink) {
        const subLink = parentLink.querySelector('a.nav-link');
        // Se for, adiciona a classe 'active' à opção pai e à sub-opção
        subLink.classList.add('active');
      }


      // ocultar todas as divs que têm a classe "div-conteudo"
      const divsConteudo = document.querySelectorAll('#conteudo .div-conteudo');
      divsConteudo.forEach(div => {
        div.classList.add('d-none');
      });


      // mostrar a div correspondente ao hash da URL
      $(hash).removeClass('d-none');

    });