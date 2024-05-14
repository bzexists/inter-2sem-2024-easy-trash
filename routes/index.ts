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
			await sql.query("INSERT INTO ecoponto (nomelocal, cep, numero, telefone, logradouro, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [ecoponto.nomelocal, ecoponto.cep, ecoponto.numero, ecoponto.telefone, ecoponto.logradouro, ecoponto.bairro, ecoponto.cidade, ecoponto.estado]);

			const id = await sql.scalar("SELECT LAST_INSERT_ID()") as number;

			// Se a foto foi enviada, salva a foto no disco
			if (req.uploadedFiles && req.uploadedFiles.foto) {
				await app.fileSystem.saveUploadedFileToNewFile(`public/img/local/${id}.jpg`, req.uploadedFiles.foto);
			}

			await sql.commit();

		});

		res.json(true);
	}
}

export = IndexRoute;
