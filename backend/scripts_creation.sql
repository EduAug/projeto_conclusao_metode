create table if not exists Usuario(
	Id SERIAL primary key,
	Email VARCHAR(255) not null,
	NomeExibicao VARCHAR(255) not null,
	SenhaHash VARCHAR(255) not null,
	Salt VARCHAR(255) not null
);

create table if not exists Codigo(
	Id SERIAL primary key,
	IdUsuario INT not null,
	Titulo VARCHAR(255) not null,
	Variaveis TEXT[] DEFAULT '{}',
	Codigo TEXT[] DEFAULT '{}',
	constraint codigo_fk_usuario
		foreign key (IdUsuario)
		references Usuario (Id)
		on delete CASCADE
);
select * from Usuario;
select * from Codigo;
