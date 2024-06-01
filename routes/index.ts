import app = require("teem");

//**********************************************************************************
// Se por acaso ocorrer algum problema de conexão, autenticação com o MySQL,
// por favor, execute este código abaixo no MySQL e tente novamente!
//
// ALTER USER 'USUÁRIO'@'localhost' IDENTIFIED WITH mysql_native_password BY 'SENHA';
//
// * Assumindo que o usuário seja root e a senha root, o comando ficaria assim:
//
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
//
//**********************************************************************************

class IndexRoute {
	public async index(req: app.Request, res: app.Response) {
		res.render("index/index");
	}

	public async sobre(req: app.Request, res: app.Response) {
		res.render("index/sobre");
	}

	public async cadastro(req: app.Request, res: app.Response) {
		res.render("index/cadastro");
	}

	public async localize(req: app.Request, res: app.Response) {
		let ecoponto: any[];

		await app.sql.connect(async (sql) => {

			// Todas os comandos SQL devem ser executados aqui dentro do app.sql.connect().

			ecoponto = await sql.query("select id, nomelocal, logradouro, numero, bairro, cidade, estado, cep, telefone, lat, lng from ecoponto;");

		});

		let opcoes = {
			ecoponto: ecoponto
		};
		res.render("index/localize", opcoes);
	}

	public async alterar(req: app.Request, res: app.Response) {
		// Independentemente do conteúdo, todos os valores das query strings são recebidos como strings.
		let idtexto = req.query["id"] as string;

		let id = parseInt(idtexto);

		if (isNaN(id)) {
			// O id fornecido não era numérico.
			res.render("index/nao-encontrado");
			return;
		}

		let ecoponto: any[];

		await app.sql.connect(async (sql) => {

			// Todas os comandos SQL devem ser executados aqui dentro do app.sql.connect().

			ecoponto = await sql.query("select id, nomelocal, logradouro, numero, bairro, cidade, estado, cep, telefone, lat, lng from ecoponto WHERE id = ?", [id]);

		});

		if (ecoponto.length === 0) {
			// O id fornecido não foi encontrado no banco de dados.
			res.render("index/nao-encontrado");
			return;
		}

		let opcoes = {
			ecoponto: ecoponto[0]
		};

		res.render("index/alterar", opcoes);
	}

	@app.http.post()
	@app.route.formData()
	public async alterarLocal(req: app.Request, res: app.Response) {
		// Os dados enviados via POST ficam dentro de req.body
		let ecoponto = req.body;

		// É sempre muito importante validar os dados do lado do servidor,
		// mesmo que eles tenham sido validados do lado do cliente!!!
		if (!ecoponto) {
			res.status(400);
			res.json("Dados inválidos");
			return;
		}

		if (!ecoponto.id) {
			res.status(400);
			res.json("Id inválido");
			return;
		}

		if (!ecoponto.nomelocal) {
			res.status(400);
			res.json("Nome inválido");
			return;
		}

		if (!ecoponto.cep) {
			res.status(400);
			res.json("CEP inválido");
			return;
		}
		if (!ecoponto.numero) {
			res.status(400);
			res.json("Número inválido");
			return;
		}
		if (!ecoponto.telefone) {
			res.status(400);
			res.json("Telefone inválido");
			return;
		}
		if (!ecoponto.logradouro) {
			res.status(400);
			res.json("Logradouro inválido");
			return;
		}
		if (!ecoponto.bairro) {
			res.status(400);
			res.json("Bairro inválido");
			return;
		}
		if (!ecoponto.cidade) {
			res.status(400);
			res.json("Cidade inválido");
			return;
		}
		if (!ecoponto.estado) {
			res.status(400);
			res.json("Estado inválido");
			return;
		}
		ecoponto.lat = parseFloat((ecoponto.lat || "").toString().replace(",", "."));
		if (!ecoponto.lat) {
			res.status(400);
			res.json("Latitude inválida");
			return;
		}
		ecoponto.lng = parseFloat((ecoponto.lng || "").toString().replace(",", "."));
		if (!ecoponto.lng) {
			res.status(400);
			res.json("Longitude inválida");
			return;
		}

		let linhasAfetadas = 0;

		await app.sql.connect(async (sql) => {

			// Todas os comandos SQL devem ser executados aqui dentro do app.sql.connect().

			// As interrogações serão substituídas pelos valores passados ao final, na ordem passada.
			await sql.query("UPDATE ecoponto SET nomelocal = ?, cep = ?, numero = ?, telefone = ?, logradouro = ?, bairro = ?, cidade = ?, estado = ?, lat = ?, lng = ? WHERE id = ?", [ecoponto.nomelocal, ecoponto.cep, ecoponto.numero, ecoponto.telefone, ecoponto.logradouro, ecoponto.bairro, ecoponto.cidade, ecoponto.estado, ecoponto.lat, ecoponto.lng, ecoponto.id]);
			linhasAfetadas = sql.affectedRows;

			// Se a foto foi enviada, salva a foto no disco
			if (linhasAfetadas && req.uploadedFiles && req.uploadedFiles.foto) {
				await app.fileSystem.saveUploadedFile(`public/img/local/${ecoponto.id}.jpg`, req.uploadedFiles.foto);
			}


		});

		if (!linhasAfetadas) {
			// Se o UPDATE não afetou nenhuma linha, significa que o id não existia no banco.
			res.status(400);
			res.json("Ecoponto não encontrado");
			return;
		}

		res.json(true);
	}

	@app.http.post()
	// Configuração adicional para poder receber FormData e/ou arquivos.
	@app.route.formData()
	public async criarLocal(req: app.Request, res: app.Response) {
		// Os dados enviados via POST ficam dentro de req.body
		let ecoponto = req.body;

		// É sempre muito importante validar os dados do lado do servidor,
		// mesmo que eles tenham sido validados do lado do cliente!!!
		if (!ecoponto) {
			res.status(400);
			res.json("Dados inválidos");
			return;
		}

		if (!ecoponto.nomelocal) {
			res.status(400);
			res.json("Nome inválido");
			return;
		}

		if (!ecoponto.cep) {
			res.status(400);
			res.json("CEP inválido");
			return;
		}
		if (!ecoponto.numero) {
			res.status(400);
			res.json("Número inválido");
			return;
		}
		if (!ecoponto.telefone) {
			res.status(400);
			res.json("Telefone inválido");
			return;
		}
		if (!ecoponto.logradouro) {
			res.status(400);
			res.json("Logradouro inválido");
			return;
		}
		if (!ecoponto.bairro) {
			res.status(400);
			res.json("Bairro inválido");
			return;
		}
		if (!ecoponto.cidade) {
			res.status(400);
			res.json("Cidade inválido");
			return;
		}
		if (!ecoponto.estado) {
			res.status(400);
			res.json("Estado inválido");
			return;
		}
		ecoponto.lat = parseFloat((ecoponto.lat || "").toString().replace(",", "."));
		if (!ecoponto.lat) {
			res.status(400);
			res.json("Latitude inválida");
			return;
		}
		ecoponto.lng = parseFloat((ecoponto.lng || "").toString().replace(",", "."));
		if (!ecoponto.lng) {
			res.status(400);
			res.json("Longitude inválida");
			return;
		}

		// Verifica se a foto foi enviada
		if (!req.uploadedFiles || !req.uploadedFiles.foto) {
			res.status(400);
			res.json("Foto inválida");
			return;
		}

		await app.sql.connect(async (sql) => {

			await sql.beginTransaction();

			// Todas os comandos SQL devem ser executados aqui dentro do app.sql.connect().

			// As interrogações serão substituídas pelos valores passados ao final, na ordem passada.
			await sql.query("INSERT INTO ecoponto (nomelocal, cep, numero, telefone, logradouro, bairro, cidade, estado, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [ecoponto.nomelocal, ecoponto.cep, ecoponto.numero, ecoponto.telefone, ecoponto.logradouro, ecoponto.bairro, ecoponto.cidade, ecoponto.estado, ecoponto.lat, ecoponto.lng]);

			const id = await sql.scalar("SELECT LAST_INSERT_ID()") as number;

			// Se a foto foi enviada, salva a foto no disco
			if (req.uploadedFiles && req.uploadedFiles.foto) {
				await app.fileSystem.saveUploadedFileToNewFile(`public/img/local/${id}.jpg`, req.uploadedFiles.foto);
			}

			await sql.commit();

		});

		res.json(true);
	}

	@app.http.delete()
	public async excluirLocal(req: app.Request, res: app.Response) {
		// Independentemente do conteúdo, todos os valores das query strings são recebidos como strings.
		let idtexto = req.query["id"] as string;

		let id = parseInt(idtexto);

		if (isNaN(id)) {
			// O id fornecido não era numérico.
			res.status(400);
			res.json("Id inválido");
			return;
		}

		let linhasAfetadas = 0;

		await app.sql.connect(async (sql) => {

			// Todas os comandos SQL devem ser executados aqui dentro do app.sql.connect().

			// As interrogações serão substituídas pelos valores passados ao final, na ordem passada.
			await sql.query("DELETE FROM ecoponto WHERE id = ?", [id]);

			linhasAfetadas = sql.affectedRows;

		});

		if (!linhasAfetadas) {
			// Se o UPDATE não afetou nenhuma linha, significa que o id não existia no banco.
			res.status(400);
			res.json("Local não encontrado");
			return;
		}

		res.json(true);
	}
}

export = IndexRoute;
