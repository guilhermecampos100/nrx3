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

	
    // Secoes Controller
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
	
	

	
	$scope.tem_obs = function(codigo) {
		var chave_observacao = codigo + "_obs";
		if (localStorage.getItem(chave_observacao) != undefined)
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
    
	
	// Itens Controller
    app.controller('ItensController', function($interval, $scope, $rootScope, $http) {
	$scope.token = $rootScope.tokenGlobal
	var page = MeuNavigator.getCurrentPage();
	$scope.secaoPai = page.options.secaoPai;
	
	if (localStorage.getItem($scope.secaoPai.codigo) != undefined)
		$scope.conformidade = localStorage.getItem($scope.secaoPai.codigo);

	if ($scope.secaoPai == undefined)
		$scope.secaoPai =  {"codigo": "18", "descricao": "NR 18 - Segurança na Construção"};

	var chave_observacao = $scope.secaoPai.codigo + "_obs";
	
	if (localStorage.getItem(chave_observacao) != undefined)
		$scope.cor_icone_obs = "#1284ff";
	else
		$scope.cor_icone_obs = "black";
	

		$scope.verificavalor = function() {
			localStorage.setItem($scope.secaoPai.codigo, $scope.conformidade);	
		}
		
		$scope.acao = function(acao) { 
			if (acao == 'observacao') {
				$scope.MeuNavigator.pushPage('observacao.html', {secaoPai: $scope.secaoPai, animation: 'slide'});	
			}
			else if (acao == 'fotos') {
				$scope.tirafoto();
			}
			else
				alert(acao);
		}

		
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
		
		var imageURI;
		var fs;
		$scope.tirafoto =  function() {
			navigator.camera.getPicture(tiroufoto, deuerro,
			  {
				quality: 50,
				destinationType: Camera.DestinationType.FILE_URI,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 800,
				targetHeight: 600
				
			});
		} 
		
		var tiroufoto = function( imgURI ) {
			imageURI = imgURI;
			alert( imageURI );
			// resolve file system for image
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, pegueiFileSystem, deuerro);
		}
			
		function pegueiFileSystem(fileSystem) {
			fs = fileSystem;
			window.resolveLocalFileSystemURL(imageURI, gotFileEntry, deuerro);
		}
				
		function gotFileEntry(fileEntry) {
			var nomearquivo = "foto_1.jpg";
			fileEntry.copyTo(fs.root, nomearquivo , fsSuccess, deuerro);
		}

		// file system fail
		var fsSuccess = function(arquivo) {
			alert("parece que gravou " + arquivo.name + " - " + arquivo.fullPath);
		}
		
		var deuerro = function(error) {
			alert("failed with error code: " + error.code);
		};			

    });
	
	// Observacao Controller
    app.controller('ObservacaoController', function($interval, $scope, $rootScope, $http) {
	$scope.token = $rootScope.tokenGlobal
	var page = MeuNavigator.getCurrentPage();
	$scope.secaoPai = page.options.secaoPai;
	
	var chave_observacao = $scope.secaoPai.codigo + "_obs";
	
	if (localStorage.getItem(chave_observacao) != undefined)
		$scope.observacao = localStorage.getItem(chave_observacao);
	
	
	if ($scope.secaoPai == undefined)
		$scope.secaoPai =  {"codigo": "18", "descricao": "NR 18 - Segurança na Construção"};

	$scope.gravaobservacao = function() {
		localStorage.setItem(chave_observacao, $scope.observacao);
		//$scope.MeuNavigator.popPage();
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