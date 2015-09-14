var app = {
    initialize: function() {
        this.bindEvents();
    },
   
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        ons.setDefaultDeviceBackButtonListener(function() {
            if (navigator.notification.confirm("Are you sure to close the app?", 
                function(index) {
                    if (index == 1) { // OK button
                        navigator.app.exitApp(); // Close the app
                    }
                }
            ));
        });

        // Open any external link with InAppBrowser Plugin
        $(document).on('click', 'a[href^=http], a[href^=https]', function(e){

            e.preventDefault();
            var $this = $(this); 
            var target = $this.data('inAppBrowser') || '_blank';

            window.open($this.attr('href'), target);

        });

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
  
};


(function() {
    var app = angular.module('sensationApp', ['onsen.directives', 'ngTouch', 'ngSanitize']);

    app.config(['$httpProvider', function($httpProvider) {

        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.cache = false;

    }]);
    
    // Home Controller
    app.controller('HomeController', function($scope, $rootScope, Data) {
	 
        $scope.items = Data.items;

        $scope.showDetail = function(index){
            var selectedItem = $scope.items[index];
            Data.selectedItem = selectedItem;
            $scope.MeuNavigator.pushPage(selectedItem.page, {title: selectedItem.title, animation: 'slide'});
        }
        
    });
    
    // Menu Controller
    app.controller('MenuController', function($scope, MenuData) {
        
        $scope.items = MenuData.items;

        $scope.showDetail = function(index){
            var selectedItem = $scope.items[index];
            MenuData.selectedItem = selectedItem;

            $scope.menu.setMainPage(selectedItem.page, {closeMenu: true})
        }
    });

	  // Login: Login Controller
	app.controller('loginController', function($scope, $rootScope) {

		$scope.fazerLogin = function(token) {
			$rootScope.tokenGlobal = token;
			if(checkLogin(token)) {
				openProtectedPage(token);
			}
		}

		function openProtectedPage(token) {
			var secaoPai = {};
			if (token == '55555')
				secaoPai = 	{"codigo": "18","descricao": "NR 18 SEG NAS CONSTRUCOES","pai": "" };
			if (token == '66666')
				secaoPai = 	{"codigo": "32","descricao": "NR 32 SEG NOS HOSPITAIS","pai": "" };
			
			$scope.MeuNavigator.pushPage('secoes.html', {secaoPai: secaoPai, animation: 'slide'});

			
		}

		function checkLogin(token) {
			//temporariry return true;
			// please write your own logic to detect user login;
			if (token == '55555' || token == '66666')
				return true;
			else
				return false;
			// por enquanto retorna true se o token for 55555, depois tem que mudar para uma logica apropriada
		}    
	});

	
app.factory('SecoesData', function()
{ 
    var data = {
	"codigo": "18",
	"descricao": "NR 18 SEG NAS CONSTRUCOES",
	"pai": "" };

    return data;
});
	
app.factory('AboutData', function()
{ 
    var data = []
    return data;
});

	

    app.controller('TrocaFotoController', function($interval, $scope, $rootScope, $http, AboutData) {
	$scope.token = $rootScope.tokenGlobal
	var page = MeuNavigator.getCurrentPage();
	$scope.foto_garcom = page.options.foto_garcom;
	$scope.nome_garcom = page.options.nome_garcom;
	});

	
    // SECOES Controller ****************************************
	// **********************************************************
    app.controller('SecoesController', function($interval, $scope, $rootScope, $http, SecoesData) {
	$scope.token = $rootScope.tokenGlobal
	var page = MeuNavigator.getCurrentPage();
	$scope.secaoPai = page.options.secaoPai;
	
	if ($scope.secaoPai == undefined)
		$scope.secaoPai =  {"codigo": "18", "descricao": "NR 18 - Segurança na Construção"};

	$scope.classelista = function(tipo) {
		if (tipo == "secao")
			return 'item lista_amarela ng-scope list__item ons-list-item-inner list__item--chevron';
		else
			return 'item item ng-scope list__item ons-list-item-inner list__item--chevron';
	}
		
	$scope.tem_foto = function(codigo) {
		nomefoto1 = codigo + "_foto_1.jpg";
		nomefoto2 = codigo + "_foto_2.jpg";
		nomefoto3 = codigo + "_foto_3.jpg";
		if (((localStorage.getItem(nomefoto1)) != undefined) || ((localStorage.getItem(nomefoto2)) != undefined) || ((localStorage.getItem(nomefoto3)) != undefined))
			return true;
		else
			return false;
	}	

	$scope.tem_obs = function(codigo) {
		var chave_observacao = codigo + "_obs";
		if (localStorage.getItem(chave_observacao) != undefined)
			return true;
		else
			return false;
	}
	
	$scope.tem_gps = function(codigo) {
		var chave_gps = codigo + "_latitude";
		if (localStorage.getItem(chave_gps) != undefined)
			return true;
		else
			return false;
	}
	
	
	
    $scope.items = [];

	$scope.teste = function(codigo) {
		return localStorage.getItem(codigo)
	}
	
	$scope.coricone = function(codigo) {
		if ((localStorage.getItem(codigo)) == undefined)
			return 'black';
		if ((localStorage.getItem(codigo)) == 'sim')
			return 'green';
		if ((localStorage.getItem(codigo)) == 'nao')
			return 'red';
		if ((localStorage.getItem(codigo)) == 'nao se aplica')
			return 'blue';		
	}
	
	$scope.icone = function(codigo) {
		if ((localStorage.getItem(codigo)) == undefined)
			return 'fa-question';
		else
			return 'fa-check-square-o';
	}

		function atualiza() {
			var urljson = 'http://chamagar.com/dashboard/juridico/secoes.asp?pai=' + $scope.secaoPai.codigo + '&hora=' + Date.now();
			$http({method: 'GET', url: urljson}).
			success(function(data, status, headers, config) {
				$scope.secoes = data.secoes;
			}).
			error(function(data, status, headers, config) {
				alert('erro no json ' +  data);
			});	
		};

		atualiza();
		
        $scope.showDetail = function(index) {
			var secaoPai = $scope.secoes[index];
			if (secaoPai.tipo == 'secao')
				$scope.MeuNavigator.pushPage('secoes.html', {secaoPai: secaoPai, animation: 'slide'});
			else
				$scope.MeuNavigator.pushPage('itens.html', {secaoPai: secaoPai, animation: 'slide'});

	
        }
		 
		$scope.VoltaTopo = function(index) {
			if ($rootScope.tokenGlobal == '55555')
				secaoPai = 	{"codigo": "18","descricao": "NR 18 SEG NAS CONSTRUCOES","pai": "" };
			if ($rootScope.tokenGlobal == '66666')
				secaoPai = 	{"codigo": "32","descricao": "NR 32 SEG NOS HOSPITAIS","pai": "" };

			$scope.MeuNavigator.pushPage('secoes.html',{secaoPai: secaoPai, animation: 'slide'})
		}
    });
    
	
	// ITENS Controller *********************************
	// **************************************************
    app.controller('ItensController', function($interval, $scope, $rootScope, $http) {
		$scope.token = $rootScope.tokenGlobal;
		var page = MeuNavigator.getCurrentPage();
		$scope.secaoPai = page.options.secaoPai;
		$scope.txtobservacao = "";
		$scope.obtendo_gps = false;
		
		var chave_observacao = $scope.secaoPai.codigo + "_obs";
		var chave_obs_foto1 = $scope.secaoPai.codigo + "_obs_foto_1";
		var chave_obs_foto2 = $scope.secaoPai.codigo + "_obs_foto_2";
		var chave_obs_foto3 = $scope.secaoPai.codigo + "_obs_foto_3";
		
		
		var chave_latitude = $scope.secaoPai.codigo + "_latitude";
		var chave_longitude = $scope.secaoPai.codigo + "_longitude";
		var	nomefoto1 = $scope.secaoPai.codigo + "_foto_1.jpg";
		var	nomefoto2 = $scope.secaoPai.codigo + "_foto_2.jpg";
		var	nomefoto3 = $scope.secaoPai.codigo + "_foto_3.jpg";		
			
		
		// VERIFICA VALOR CONFORMIDADE
		$scope.verificavalor = function() {
			localStorage.setItem($scope.secaoPai.codigo, $scope.conformidade);	
		}
		
		
		//ACAO
		$scope.acao = function(acao, param_url) { 
			if (acao == 'observacao') {
				if (param_url != '') {
					var url = param_url;
				}
				$scope.MeuNavigator.pushPage('observacao.html', {secaoPai: $scope.secaoPai, url_foto: url, animation: 'slide'});	
			}
			else if (acao == 'fotos') {
				$scope.tirafoto(0);
			}
			else if (acao == 'gps') {
				$scope.registragps();
			}
			else if (acao == 'trocarfoto') {
				$scope.tirafoto(param_url);
			}
			else if (acao == 'apagarfoto') {
				$scope.apagafoto(param_url);
			}
			else
				alert(acao);
		}

		
		// NAVEGA PARA SECOES?
        $scope.showDetail = function(index) {
			var secaoPai = $scope.secoes[index];
			$scope.MeuNavigator.pushPage('secoes.html', {secaoPai: $scope.secaoPai, animation: 'slide'});
	
        }
		 
		 
		$scope.VoltaTopo = function(index) {
			
			if ($rootScope.tokenGlobal == '55555')
				secaoPai = 	{"codigo": "18","descricao": "NR 18 SEG NAS CONSTRUCOES","pai": "" };
			if ($rootScope.tokenGlobal == '66666')
				secaoPai = 	{"codigo": "32","descricao": "NR 32 SEG NOS HOSPITAIS","pai": "" };

			$scope.MeuNavigator.pushPage('secoes.html',{secaoPai: secaoPai, animation: 'slide'})
		}		

        // OBSERVACAO		
		if (localStorage.getItem(chave_observacao) != undefined) {
			$scope.txtobservacao = localStorage.getItem(chave_observacao);
			$scope.$apply();
		}
	
		// COR ICONE OBSERVACAO
		$scope.cor_icone_obs = function() {
			if (localStorage.getItem(chave_observacao) != undefined)
				$scope.cor_obs = "#1284ff";
			else
				$scope.cor_obs = "#000000";
			return $scope.cor_obs;
		};

		
		// COR ICONE GPS
		$scope.cor_icone_gps = function() {
			if (localStorage.getItem(chave_latitude) != undefined)
				return "#1284ff";
			else
				return "#000000";
		};
		

		
		// COR ICONE FOTO
		$scope.cor_icone_foto = function() {
			if (temfoto())
				return "#1284ff";
			else
				return "#000000";
		};	
		
		// CONFORMIDADE
		if (localStorage.getItem($scope.secaoPai.codigo) != undefined)
			$scope.conformidade = localStorage.getItem($scope.secaoPai.codigo);

		if ($scope.secaoPai == undefined)
			$scope.secaoPai =  {"codigo": "18", "descricao": "NR 18 - Segurança na Construção"};

		
		// REGISTRA GPS
		$scope.registragps = function() {
			var leugps = function(position) {
				alert('Latitude: '          + position.coords.latitude          + '\n' +
					  'Longitude: '         + position.coords.longitude         + '\n' +
					  'Altitude: '          + position.coords.altitude          + '\n' +
					  'Accuracy: '          + position.coords.accuracy          + '\n' +
					  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
					  'Heading: '           + position.coords.heading           + '\n' +
					  'Speed: '             + position.coords.speed             + '\n' +
					  'Timestamp: '         + position.timestamp                + '\n');
				var chave_latitude = $scope.secaoPai.codigo + "_latitude";
				var chave_longitude = $scope.secaoPai.codigo + "_longitude";
				window.localStorage.setItem(chave_latitude, position.coords.latitude  );
				window.localStorage.setItem(chave_longitude, position.coords.longitude  );
				$scope.legps();
			}	
			$scope.obtendo_gps = true;
			$scope.$apply();	
			navigator.geolocation.getCurrentPosition(leugps, deuerro);
		};
	
		// LE GPS
		$scope.legps = function() {
			$scope.latitude = window.localStorage.getItem(chave_latitude);
			$scope.longitude = window.localStorage.getItem(chave_longitude);	
			$scope.obtendo_gps = false;
			$scope.$apply();			
		};	
		
		$scope.legps();

		// TIRA FOTO
		var imageURI;
		var fs;
		var URL_foto;
		$scope.tirafoto =  function(url) {
			URL_foto = url;
			navigator.camera.getPicture(tiroufoto, deuerro,
			  {
				quality: 50,
				destinationType: Camera.DestinationType.FILE_URI,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 1024,
				correctOrientation: true

			});
		} 
		
		var tiroufoto = function( imgURI ) {
			imageURI = imgURI;
			// resolve file system for image
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, pegueiFileSystem, deuerro);
		}
			
		function pegueiFileSystem(fileSystem) {
			fs = fileSystem;
			window.resolveLocalFileSystemURL(imageURI, gotFileEntry, deuerro);
		}
			
		function  temfoto() {

			if (((localStorage.getItem(nomefoto1)) != undefined) || ((localStorage.getItem(nomefoto2)) != undefined) || ((localStorage.getItem(nomefoto3)) != undefined))
				return true;
			else
				return false;
		}
			
		function pegaNomeProximaFoto() {
			// tenta a foto1.jpg, se tiver tenta a foto2 e se tiver retorna a foto3.jpg
			var nomefoto = "";
			if ((localStorage.getItem(nomefoto1)) == undefined)
				return nomefoto1;
			if ((localStorage.getItem(nomefoto2)) == undefined)
				return nomefoto2;
			else {
				return nomefoto3;
			}
		}
		

		// MOVE A FOTO PARA O DIRETORIO PERMANENTE		
		function gotFileEntry(fileEntry) {
			var nomearquivo;
			if (URL_foto == 0)
				nomearquivo = pegaNomeProximaFoto();
			else {
				if (URL_foto.indexOf("foto_1.jpg") > -1)
					nomearquivo = nomefoto1;
				if (URL_foto.indexOf("foto_2.jpg") > -1)
					nomearquivo = nomefoto2;
				if (URL_foto.indexOf("foto_3.jpg") > -1)
					nomearquivo = nomefoto3;
				
				$scope.fotos = [];
				window.cache.clear(cachesuccess, deuerro);
				// limpa o cache para evitar de mostrar a foto antiga
			}
			
			
			// ++++++++
			//fileEntry.copyTo(fs.root, nomearquivo , fsSuccess, deuerro);
			//localStorage.setItem(nomearquivo, fileEntry.name);
			
			
			fileEntry.moveTo(fs.root, nomearquivo , fsSuccess, deuerro);

			
		}

		var fsSuccess = function(arquivo) {
			localStorage.setItem(arquivo.name, 'true');
			alert("gravou " + arquivo.name + " - " + arquivo.fullPath);
			lefotos(arquivo.name);
		}
		
		var deuerro = function(error) {
			alert("Erro código: " + error.code);
			$scope.obtendo_gps = false;
			$scope.$apply();	
		};	

		
	
		// APAGA FOTO
		$scope.apagafoto = function(numfoto) {
			
		var	nomefoto1 = $scope.secaoPai.codigo + "_foto_1.jpg";
		var	nomefoto2 = $scope.secaoPai.codigo + "_foto_2.jpg";
		var	nomefoto3 = $scope.secaoPai.codigo + "_foto_3.jpg";		
		
			
			window.requestFileSystem(LocalFileSystem.PERSISTENT,0, function(fileSystem) {
				var root = fileSystem.root;
				var nomearquivo;
				if (numfoto == 1) 
					nomearquivo = nomefoto1;
				if (numfoto == 2) 
					nomearquivo = nomefoto2;
				if (numfoto == 3) 
					nomearquivo = nomefoto3;
				root.getFile(nomearquivo, {create: false}, apagafoto_acao, null); 
			}, deuerro);
		}
		
		// APAGA FOTO_ACAO
		function apagafoto_acao(fileEntry) {
			fileEntry.remove(success, deuerro);
			function success(entry) {			
				if (fileEntry.name.indexOf("foto_1.jpg") > -1) {
					localStorage.removeItem(chave_obs_foto1);
					localStorage.removeItem(nomefoto1);
					indice = 0;
				}
				if (fileEntry.name.indexOf("foto_2.jpg") > -1) {
					localStorage.removeItem(chave_obs_foto2);
					localStorage.removeItem(nomefoto2);
					indice = 1;
				}
				if (fileEntry.name.indexOf("foto_3.jpg") > -1) {
					localStorage.removeItem(chave_obs_foto3);
					localStorage.removeItem(nomefoto3);
					indice = 2;
				}
				window.cache.clear(cachesuccess, deuerro);
				$scope.fotos = [];
				console.log("Removal succeeded");
				$scope.fotos.splice(indice,1);
				$scope.$apply();
			}

		}
		
		 var cachesuccess = function(status) {
            console.log('Cache clear sucesso - Message: ' + status);
        }
		
		// LE FOTOS
		function lefotos(nomefoto) {
			window.requestFileSystem(LocalFileSystem.PERSISTENT,0, function(fileSystem) {
				var root = fileSystem.root;
				var nomearquivo;
				nomearquivo = nomefoto;
				root.getFile(nomearquivo, {create: false}, leufoto, null); 
			}, deuerro);
		}

		$scope.fotos = [];
		
		var leufoto = function(fileEntry) {
			var observacao_foto;
			var indice;
			if (fileEntry.name.indexOf("foto_1.jpg") > -1) {
				observacao_foto = localStorage.getItem(chave_obs_foto1);
				indice = 0;
			}
			if (fileEntry.name.indexOf("foto_2.jpg") > -1) {
				observacao_foto = localStorage.getItem(chave_obs_foto2);
				indice = 1;
			}
			if (fileEntry.name.indexOf("foto_3.jpg") > -1) {
				observacao_foto = localStorage.getItem(chave_obs_foto3);
				indice = 2;
			}


			var fotoURL = fileEntry.nativeURL;
			var foto = {url: fotoURL ,observacao: observacao_foto};
			$scope.fotos.push(foto);
			$scope.$apply();
		}

		lefotos(nomefoto1);
		lefotos(nomefoto2);
		lefotos(nomefoto3);
    });
	
	
	// OBSERVACAO Controller *********************************************************
	// *******************************************************************************
    app.controller('ObservacaoController', function($interval, $scope, $rootScope, $http) {
	$scope.token = $rootScope.tokenGlobal
	var page = MeuNavigator.getCurrentPage();
	$scope.secaoPai = page.options.secaoPai;
	$scope.url_foto = page.options.url_foto;
	var chave_observacao = '';
	if ($scope.url_foto == undefined) 
		chave_observacao = $scope.secaoPai.codigo + "_obs";
	else {
			if ($scope.url_foto.indexOf("foto_1.jpg") > -1)
				chave_observacao = $scope.secaoPai.codigo + "_obs_foto_1";
			if ($scope.url_foto.indexOf("foto_2.jpg") > -1)
				chave_observacao = $scope.secaoPai.codigo + "_obs_foto_2";
			if ($scope.url_foto.indexOf("foto_3.jpg") > -1)
				chave_observacao = $scope.secaoPai.codigo + "_obs_foto_3";
	}

	if (localStorage.getItem(chave_observacao) != undefined)
		$scope.observacao = localStorage.getItem(chave_observacao);
	
	
	if ($scope.secaoPai == undefined)
		$scope.secaoPai =  {"codigo": "18", "descricao": "NR 18 - Segurança na Construção"};

	$scope.gravaobservacao = function() {
		localStorage.setItem(chave_observacao, $scope.observacao);
		$scope.MeuNavigator.popPage({onTransitionEnd : function() {
			$scope.MeuNavigator.replacePage('itens.html', {secaoPai: $scope.secaoPai, animation : 'none' } );
		}});
	}

		
	$scope.showDetail = function(index) {
		var secaoPai = $scope.secoes[index];
		$scope.MeuNavigator.pushPage('secoes.html', {secaoPai: secaoPai, animation: 'slide'});

	}
	 
	$scope.VoltaTopo = function(index) {
			if ($rootScope.tokenGlobal == '55555')
				secaoPai = 	{"codigo": "18","descricao": "NR 18 SEG NAS CONSTRUCOES","pai": "" };
			if ($rootScope.tokenGlobal == '66666')
				secaoPai = 	{"codigo": "32","descricao": "NR 32 SEG NOS HOSPITAIS","pai": "" };

			$scope.MeuNavigator.pushPage('secoes.html',{secaoPai: secaoPai, animation: 'slide'})
	}
    });

	
	
	// About: Detalhe Controller
	//***********************************************************
	//***********************************************************
	//* NAO PRECISA DESTA PARTE, NAO FOI APAGADA AINDA PARA PEGAR EXEMPLOS
    app.controller('DetalheController', function($scope, $rootScope, $http, AboutData) {

        $scope.item = AboutData.selectedItem;
		$scope.chktodosemandamento = [];
		$scope.chktodosenviados = [];
		$scope.chamando = false;

		
		$scope.ativarchamado = function($event) {
			$scope.chamando = true;
			$scope.corchamando = 'red';
			processaacao(3,$scope.item.token);
		}
		
		$scope.desativarchamado = function($event) {
			$scope.chamando = true;
			$scope.corchamando = 'lightgrey';
			processaacao(4,$scope.item.token);
		}	
		
		
		
		$scope.updateSelection = function($event) {
		  var checkbox = $event.target;
		  var action = (checkbox.checked ? 'add' : 'remove');
		  if (action == 'add') {
			$scope.chamando = true;
			$scope.corchamando = 'red';
			processaacao(3,$scope.item.token);
		  }
		  else {
			$scope.chamando = false;
			$scope.corchamando = 'lightgrey';
			processaacao(4,$scope.item.token);
		  }
		};

		$scope.marca = function(tipo, codigo) {
			if (tipo == 1) {
				var pedidos = $scope.pedidosativos;
			}
			else {
				var pedidos = $scope.pedidosemandamento;
			}
			angular.forEach(pedidos, function (item) {
				if (item.codigopedido == codigo) {
					if (item.Selected) {
						item.Selected = false;
					}
					else {
						item.Selected = true;
					}
				}
			});
		};
		
		$scope.MarcarTodosEnviados = function() {
			angular.forEach($scope.pedidosativos, function (item) {
				item.Selected = $scope.chktodosenviados.Selected;
			});
		};	
		
		$scope.MarcarTodosEmAndamento = function() {
			angular.forEach($scope.pedidosemandamento, function (item) {
				item.Selected = $scope.chktodosemandamento.Selected;
			});
		};
		
		$scope.MarcarTodosEA = function() {
			$scope.chktodosemandamento.Selected = !$scope.chktodosemandamento.Selected;
			$scope.MarcarTodosEmAndamento();
		}
		

		$scope.MarcarTodosEnv = function() {
			$scope.chktodosenviados.Selected = !$scope.chktodosenviados.Selected;
			$scope.MarcarTodosEnviados();
		}
		
		function processaacao(codigoacao,tripa) {
			var acao = "";
			if (codigoacao == 1) { acao = "ColocarEmAndamentoMulti"; }
			if (codigoacao == 2) { acao = "ColocarEntregueMulti"; }
			if (codigoacao == 3) { acao = "AtivaChamado"; }
			if (codigoacao == 4) { acao = "DesativaChamado"; }

			var segundos = new Date().getTime() / 1000;

			var urljson = 'http://chamagar.com/dashboard/painel/processaacaojson.asp?acao='+ acao + '&tripa='+tripa + '&segundos='+ segundos;
			$http({method: 'GET', url: urljson}).
			success(function(data, status, headers, config) {
				atualiza();
			}).
			error(function(data, status, headers, config) {
				alert('erro no json ' +  data);
			});	
		}


		$scope.ColocarEmAndamento = function () {
			var a=1;
			var tripa = PegaSelecionados('enviado');
			//alert('tripa: ' + tripa + ' pronto para colocar em andamento');
			processaacao(1,tripa);
		}
		
		$scope.Cancelar = function () {
			var a=2;
			var tripa = PegaSelecionados('enviado');
			alert('tripa: ' +   tripa + ' pronto para cancelar');
		}
		
		$scope.ColocarEntregue = function () {
			var a=3;
			var tripa = PegaSelecionados('em andamento');
			//alert('tripa: ' + tripa + '  pronto para colocar entregue');
			processaacao(2,tripa);
		}

		
		var PegaSelecionados = function(tipo) {
			var tripa = '';
			var pedidos = [];
			
			if (tipo == 'enviado') {
				pedidos = $scope.pedidosativos;
			}
			if (tipo == 'em andamento') {
				pedidos = $scope.pedidosemandamento;
			}
			angular.forEach(pedidos, function(item) {
				if (item.Selected) {
					if (tripa == '') {
						tripa = item.codigopedido;
					}
					else
					{
						tripa += '-' + item.codigopedido
					}
				}
				
			});
			return tripa;
		};


		function atualiza() {
			var urljson = 'http://chamagar.com/dashboard/painel/gtdetalhejson.asp?mesa=' + $scope.item.token + '&token=' + $rootScope.tokenGlobal + '&hora=' + Date.now();
			$http({method: 'GET', url: urljson}).
			success(function(data, status, headers, config) {
				$scope.pedidosativos = data.pedidosativos;
				$scope.pedidosemandamento = data.pedidosemandamento;
				$scope.chamando = data.mesa[0].chamando;
				if (data.mesa[0].chamando == 1) {
					$scope.corchamando = 'red';
					$scope.chamando = true;
				}
				else {
					$scope.corchamando = 'lightgrey';
					$scope.chamando = false;
				}
			}).
			error(function(data, status, headers, config) {
				alert('erro no json ' +  data);
			});	
		};
		
		atualiza();

     });
	

    // PLUGINS: Notifications Controller
    app.controller('NotificationsController', function($scope) {
        
        $scope.alertNotify = function() {
        navigator.notification.alert("Sample Alert",function() {console.log("Alert success")},"My Alert","Close");
        };

        $scope.beepNotify = function() {
        navigator.notification.beep(1);
        };

        $scope.vibrateNotify = function() {
        navigator.notification.vibrate(3000);
        };

        $scope.confirmNotify = function() {
        navigator.notification.confirm("My Confirmation",function(){console.log("Confirm Success")},"Are you sure?",["Ok","Cancel"]);
        };
        
    });

    // Filter
    app.filter('partition', function($cacheFactory) {
          var arrayCache = $cacheFactory('partition');
          var filter = function(arr, size) {
            if (!arr) { return; }
            var newArr = [];
            for (var i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));        
            }
            var cachedParts;
            var arrString = JSON.stringify(arr);
            cachedParts = arrayCache.get(arrString+size); 
            if (JSON.stringify(cachedParts) === JSON.stringify(newArr)) {
              return cachedParts;
            }
            arrayCache.put(arrString+size, newArr);
            return newArr;
          };
          return filter;
        });

})();